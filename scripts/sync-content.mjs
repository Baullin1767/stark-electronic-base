import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readSheet } from "read-excel-file/node";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = path.join(rootDir, "content", "site-content.xlsx");
const generatedDir = path.join(rootDir, "src", "generated");
const generatedTsPath = path.join(generatedDir, "site-content.ts");
const generatedCssPath = path.join(generatedDir, "site-content.css");

const expectedHeaders = [
  "key",
  "section",
  "context",
  "text",
  "fontSize",
  "fontSizeMobile",
  "color",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textTransform",
  "textAlign",
];

const cssValidators = {
  fontSize: isCssLength,
  fontSizeMobile: isCssLength,
  color: isCssColor,
  fontWeight: (value) =>
    /^(normal|bold|(?:[1-9][0-9]{0,2}|1000))$/.test(value),
  lineHeight: (value) =>
    /^(normal|[0-9]+(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?(?:px|rem|em|%))$/.test(
      value,
    ),
  letterSpacing: (value) =>
    /^(normal|-?[0-9]+(?:\.[0-9]+)?(?:px|rem|em))$/.test(value),
  textTransform: (value) =>
    /^(none|capitalize|uppercase|lowercase)$/.test(value),
  textAlign: (value) =>
    /^(start|end|left|right|center|justify)$/.test(value),
};

function isCssLength(value) {
  return (
    /^(?:0|-?[0-9]+(?:\.[0-9]+)?(?:px|rem|em|vw|vh|svh|%))$/.test(value) ||
    /^(?:clamp|min|max|calc)\([0-9a-zA-Z.%+\-*/,\s()]+\)$/.test(value)
  );
}

function isCssColor(value) {
  return (
    /^#[0-9a-fA-F]{3,8}$/.test(value) ||
    /^(?:rgb|rgba|hsl|hsla)\([0-9a-zA-Z.%+\-,\s/]+\)$/.test(value) ||
    /^var\(--[a-zA-Z0-9-_]+\)$/.test(value) ||
    /^(?:transparent|currentColor|black|white)$/.test(value)
  );
}

function cellText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  throw new Error(`Неподдерживаемое значение ячейки: ${String(value)}`);
}

function validateKey(key, rowNumber) {
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(key)) {
    throw new Error(
      `Строка ${rowNumber}: key «${key}» должен состоять из латинских букв в нижнем регистре, цифр, точек, дефисов или подчёркиваний.`,
    );
  }
}

function escapeCssAttribute(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function toCssProperty(column) {
  return column.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

async function main() {
  try {
    await fs.access(workbookPath);
  } catch {
    throw new Error(
      `Не найден файл ${path.relative(rootDir, workbookPath)}. Верните таблицу на место перед запуском проекта.`,
    );
  }

  const rows = await readSheet(workbookPath, "Тексты");
  if (rows.length < 2) {
    throw new Error("Лист «Тексты» пуст.");
  }

  const headers = rows[0].map(cellText);
  const missingHeaders = expectedHeaders.filter(
    (header) => !headers.includes(header),
  );
  if (missingHeaders.length) {
    throw new Error(
      `На листе «Тексты» отсутствуют колонки: ${missingHeaders.join(", ")}.`,
    );
  }

  const indexes = Object.fromEntries(
    expectedHeaders.map((header) => [header, headers.indexOf(header)]),
  );
  const content = {};
  const styles = {};

  for (let index = 1; index < rows.length; index += 1) {
    const rowNumber = index + 1;
    const row = rows[index];
    const key = cellText(row[indexes.key]).trim();
    const value = cellText(row[indexes.text]);

    if (!key && !value.trim()) continue;
    if (!key) throw new Error(`Строка ${rowNumber}: заполните key.`);
    validateKey(key, rowNumber);
    if (Object.hasOwn(content, key)) {
      throw new Error(`Строка ${rowNumber}: key «${key}» повторяется.`);
    }
    content[key] = value;
    const style = {};
    for (const [column, validator] of Object.entries(cssValidators)) {
      const styleValue = cellText(row[indexes[column]]).trim();
      if (!styleValue) continue;
      if (!validator(styleValue)) {
        throw new Error(
          `Строка ${rowNumber}: недопустимое значение ${column} «${styleValue}».`,
        );
      }
      style[column] = styleValue;
    }
    if (Object.keys(style).length) styles[key] = style;
  }

  const generatedHeader =
    "/* Сгенерировано scripts/sync-content.mjs из content/site-content.xlsx. Не редактируйте вручную. */";
  const ts = `${generatedHeader}
export const SITE_CONTENT = ${JSON.stringify(content, null, 2)} as const;

export type ContentKey = keyof typeof SITE_CONTENT;
`;

  const desktopRules = [];
  const mobileRules = [];
  for (const [key, style] of Object.entries(styles)) {
    const selector = `[data-content-key="${escapeCssAttribute(key)}"]`;
    const declarations = Object.entries(style)
      .filter(([column]) => column !== "fontSizeMobile")
      .map(
        ([column, value]) =>
          `  ${toCssProperty(column)}: ${value} !important;`,
      );
    if (declarations.length) {
      desktopRules.push(`${selector} {\n${declarations.join("\n")}\n}`);
    }
    if (style.fontSizeMobile) {
      mobileRules.push(
        `${selector} {\n  font-size: ${style.fontSizeMobile} !important;\n}`,
      );
    }
  }

  const css = `${generatedHeader}
${desktopRules.join("\n\n")}
${
  mobileRules.length
    ? `\n@media (max-width: 720px) {\n${mobileRules
        .map((rule) => `  ${rule.replaceAll("\n", "\n  ")}`)
        .join("\n\n")}\n}\n`
    : ""
}`;

  await fs.mkdir(generatedDir, { recursive: true });
  await Promise.all([
    fs.writeFile(generatedTsPath, ts, "utf8"),
    fs.writeFile(generatedCssPath, css, "utf8"),
  ]);

  console.log(
    `Контент синхронизирован: ${Object.keys(content).length} текстов, ${Object.keys(styles).length} стилевых настроек.`,
  );
}

main().catch((error) => {
  console.error(`Ошибка синхронизации контента: ${error.message}`);
  process.exitCode = 1;
});
