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

test("pricing uses rubles and offers remote support only", async ({ page }) => {
  await page.goto("/#pricing");
  const pricing = page.locator("#pricing");

  await expect(pricing.locator(".price-card")).toHaveCount(3);
  await expect(pricing).toContainText("10 000 ₽");
  await expect(pricing).toContainText("15 000 ₽");
  await expect(pricing).toContainText("4 000 ₽ / месяц");
  await expect(pricing).toContainText("Удалённая поддержка");
  await expect(pricing).not.toContainText(
    /RSD|€|динар|евро|поддержка с выездом|обсудить выезд/i,
  );
});

test("contact form validates required fields", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByText("Укажите имя")).toBeVisible();
  await expect(page.getByText("Необходимо согласие")).toBeVisible();
});

test("profession supports dropdown options and a custom value", async ({ page }) => {
  await page.goto("/#contact");
  const profession = page.getByTestId("profession-select");

  await expect(profession.locator("option")).toHaveCount(9);

  await profession.selectOption({ label: "Подолог" });
  await expect(profession).toHaveValue("Подолог");

  await profession.selectOption({ label: "Другое — указать свой вариант" });
  const customProfession = page.getByTestId("custom-profession");
  await customProfession.fill("Фотограф");
  await expect(customProfession).toHaveValue("Фотограф");
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("mobile demo stays pinned and advances through one animated frame", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#demo");

  const stage = page.locator(".demo-stage");
  const animatedDemo = page.locator(".desktop-demo");
  await page.locator(".pin-spacer").waitFor();
  await expect(animatedDemo).toBeVisible();
  await expect(animatedDemo.locator(".demo-frame")).toHaveCount(1);
  await expect(animatedDemo.locator(".demo-copy > small")).toHaveText("01 / 09");

  const stageBox = await stage.boundingBox();
  expect(stageBox?.height).toBeLessThanOrEqual(845);

  await page.evaluate(() => {
    const demo = document.querySelector<HTMLElement>("#demo");
    window.scrollTo({
      top: (demo?.offsetTop ?? window.scrollY) + 900,
      behavior: "instant",
    });
  });
  await expect(animatedDemo.locator(".demo-copy > small")).not.toHaveText(
    "01 / 09",
  );

  await page.evaluate(() => {
    const demo = document.querySelector<HTMLElement>("#demo");
    window.scrollTo({
      top: (demo?.offsetTop ?? window.scrollY) + 2400,
      behavior: "instant",
    });
  });
  await expect(animatedDemo.locator(".demo-copy > small")).toHaveText(
    "05 / 09",
  );

  const reviewChat = animatedDemo.locator(".review-chat-scroll");
  const composer = animatedDemo.locator(".chat-input");
  await expect(composer).toBeInViewport();
  await expect
    .poll(() =>
      reviewChat.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      reviewChat.evaluate(
        (element) => getComputedStyle(element).overscrollBehaviorY,
      ),
    )
    .toBe("auto");
});

test("reduced motion keeps the demonstration readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#demo");
  await expect(page.locator(".mobile-demo-step")).toHaveCount(9);
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
