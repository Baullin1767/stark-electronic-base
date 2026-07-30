import { expect, test } from "@playwright/test";

test("landing page, navigation and privacy route are available", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Клиентская база, которую можно вести/,
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Посмотреть, как это работает" }).click();
  await expect(page.locator("#demo")).toBeInViewport();

  await page.goto("/privacy");
  await expect(
    page.getByRole("heading", { name: /Ваши контактные данные/ }),
  ).toBeVisible();
});

test("pricing selection reaches the contact form", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Заказать подключение" });
  await cta.click();
  await expect(page.locator("#contact")).toBeInViewport();
  await expect(page.locator(".selected-plan")).toContainText(
    "Базовая интеграция",
  );
});

test("contact form validates required fields", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByText("Укажите имя")).toBeVisible();
  await expect(page.getByText("Необходимо согласие")).toBeVisible();
});

test("profession supports suggestions and a custom value", async ({ page }) => {
  await page.goto("/#contact");
  const profession = page.getByLabel("Род деятельности");

  await expect(profession).toHaveAttribute("list", "profession-options");
  await expect(page.locator("#profession-options option")).toHaveCount(7);

  await profession.fill("Под");
  await expect(profession).toHaveValue("Под");

  await profession.fill("Фотограф");
  await expect(profession).toHaveValue("Фотограф");
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("reduced motion keeps the demonstration readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#demo");
  await expect(page.locator(".mobile-demo-step")).toHaveCount(11);
});

test("the demo keeps the same client throughout the scenario", async ({
  page,
}) => {
  await page.goto("/#demo");
  const steps = page.locator(".mobile-demo-step");

  for (let index = 2; index <= 8; index += 1) {
    await expect(steps.nth(index)).toContainText("Анна");
    await expect(steps.nth(index)).toContainText("4821");
  }
});
