import { expect, test } from "@playwright/test";

test("landing page, navigation and privacy route are available", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Клиентская база, которую не нужно заполнять/,
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
  await expect(pricing).toContainText("4 000 ₽");
  await expect(pricing).toContainText("Подключать её каждый месяц не нужно");
  await expect(pricing).toContainText("Обязательной ежемесячной платы за базу нет");
  await expect(pricing).toContainText("Резервная копия базы");
  await expect(pricing).toContainText("Удалённая поддержка");
  await expect(pricing).not.toContainText(
    /RSD|€|динар|евро|поддержка с выездом|обсудить выезд/i,
  );
});

test("contact form validates required fields", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Показать, как это работает" }).click();
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
  await expect(animatedDemo.locator(".demo-copy > small")).toHaveText("01 / 03");

  const stageBox = await stage.boundingBox();
  expect(stageBox?.height).toBeLessThanOrEqual(845);

  await page.evaluate(() => {
    const demo = document.querySelector<HTMLElement>("#demo");
    window.scrollTo({
      top: (demo?.offsetTop ?? window.scrollY) + 550,
      behavior: "instant",
    });
  });
  await expect(animatedDemo.locator(".demo-copy > small")).not.toHaveText(
    "01 / 03",
  );

  await page.evaluate(() => {
    const demo = document.querySelector<HTMLElement>("#demo");
    window.scrollTo({
      top: (demo?.offsetTop ?? window.scrollY) + 650,
      behavior: "instant",
    });
  });
  await expect(animatedDemo.locator(".demo-copy > small")).toHaveText(
    "02 / 03",
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

test("one mobile swipe advances the demo by only one step", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#demo");
  await page.locator(".pin-spacer").waitFor();

  const counter = page.locator(".desktop-demo .demo-copy > small");
  await page.evaluate(() => {
    const demo = document.querySelector<HTMLElement>("#demo");
    window.scrollTo({ top: demo?.offsetTop ?? 0, behavior: "instant" });
  });
  await expect(counter).toHaveText("01 / 03");

  const dispatchTouch = async (
    type: "touchstart" | "touchmove" | "touchend",
    clientY: number,
  ) => {
    await page.evaluate(
      ({ eventType, y }) => {
        const target = document.querySelector<HTMLElement>(".demo-stage");
        if (!target) return;

        const touch = new Touch({
          identifier: 1,
          target,
          clientX: 195,
          clientY: y,
          pageX: 195,
          pageY: y + window.scrollY,
        });
        target.dispatchEvent(
          new TouchEvent(eventType, {
            bubbles: true,
            cancelable: true,
            touches: eventType === "touchend" ? [] : [touch],
            targetTouches: eventType === "touchend" ? [] : [touch],
            changedTouches: [touch],
          }),
        );
      },
      { eventType: type, y: clientY },
    );
  };

  await dispatchTouch("touchstart", 700);
  await dispatchTouch("touchmove", 500);
  await expect(counter).toHaveText("02 / 03");
  await expect(page.locator(".desktop-demo .demo-frame")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(".desktop-demo .demo-copy h3")).toHaveCSS(
    "opacity",
    "1",
  );

  await dispatchTouch("touchmove", 100);
  await expect(counter).toHaveText("02 / 03");
  await dispatchTouch("touchend", 100);

  await dispatchTouch("touchstart", 700);
  await dispatchTouch("touchmove", 400);
  await expect(counter).toHaveText("03 / 03");
  await dispatchTouch("touchend", 400);
});

test("reduced motion keeps the demonstration readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#demo");
  await expect(page.locator(".mobile-demo-step")).toHaveCount(3);
  await expect(page.locator(".mobile-demo-step").last()).toBeVisible();
});

test("the demo keeps the same client throughout the scenario", async ({
  page,
}) => {
  await page.goto("/#demo");
  const steps = page.locator(".mobile-demo-step");

  for (let index = 0; index < 3; index += 1) {
    await expect(steps.nth(index)).toContainText("Анна");
    await expect(steps.nth(index)).toContainText("4821");
  }
});

test("the landing follows the new section order", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main > section")).toHaveCount(11);
  expect(await page.locator("main > section").evaluateAll((sections) => sections.map((section) => section.id))).toEqual([
    "top", "problem", "solution", "demo", "benefits", "changes", "example", "story", "reviews", "pricing", "contact",
  ]);
  await expect(page.locator("#top .testimonial-item")).toHaveCount(0);
  await expect(page.locator("#reviews .testimonial-item")).toHaveCount(4);
});

test("the short form submits only the chosen contact method", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    const data = route.request().postDataJSON();
    expect(data.firstName).toBe("Анна");
    expect(data.profession).toBe("Подолог");
    expect(data.telegram).toBe("");
    expect(data.phone).toBe("+7 (999) 123-45-67");
    expect(data.lastName).toBe("");
    expect(data.message).toBe("");
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/#contact");
  await page.getByLabel("Имя *", { exact: true }).fill("Анна");
  await page.getByTestId("profession-select").selectOption("Подолог");
  await page.getByLabel("Telegram", { exact: true }).fill("@annatest");
  await page.getByRole("combobox", { name: "Способ связи", exact: true }).selectOption("phone");
  await page.getByLabel("Телефон", { exact: true }).fill("+7 (999) 123-45-67");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Показать, как это работает" }).click();
  await expect(page.locator(".form-status")).toContainText("Заявка отправлена");
});
