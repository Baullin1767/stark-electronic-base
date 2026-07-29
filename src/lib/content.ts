import { SITE_CONTENT, type ContentKey } from "@/generated/site-content";

export type { ContentKey } from "@/generated/site-content";

export function text(key: ContentKey) {
  return SITE_CONTENT[key];
}

export function formatText(
  key: ContentKey,
  replacements: Record<string, string | number>,
) {
  return SITE_CONTENT[key].replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (placeholder, name) =>
      Object.hasOwn(replacements, name)
        ? String(replacements[name])
        : placeholder,
  );
}

export function contentProps(key: ContentKey) {
  return { "data-content-key": key } as const;
}
