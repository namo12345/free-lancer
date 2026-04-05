import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const PASSWORD = process.env.E2E_TEST_PASSWORD || "Test123!234";
const FREELANCER_EMAIL =
  process.env.E2E_FREELANCER_EMAIL || "freelancer.e2e@baseedwork.local";
const EMPLOYER_EMAIL =
  process.env.E2E_EMPLOYER_EMAIL || "employer.e2e@baseedwork.local";
const OPEN_GIG_TITLE = "E2E Website Build";
const INVOICE_NUMBER = "BW-E2E-0001";

async function login(page: Page, email: string) {
  await page.goto("/en/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(PASSWORD);
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page).toHaveURL(/\/en\/onboarding/);
}

test.describe.serial("e2e bootstrap smoke", () => {
  test("landing page renders", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.getByRole("heading", {
        name: "Find the Perfect Freelancer for Your Project",
      })
    ).toBeVisible();
  });

  test("freelancer can log in and submit a bid on the seeded gig", async ({
    page,
  }) => {
    await login(page, FREELANCER_EMAIL);

    await page.getByRole("button", { name: "I'm a Freelancer" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/freelancer\/profile/);

    await page.goto("/en/gigs");
    await page.getByRole("link", { name: OPEN_GIG_TITLE }).click();
    await expect(page).toHaveURL(/\/en\/gigs\/.+/);

    await page.getByRole("button", { name: "Place a Bid" }).click();
    await page.getByPlaceholder("e.g. 20000").fill("22000");
    await page.getByPlaceholder("e.g. 14").fill("10");
    await page
      .getByPlaceholder(
        "Why are you the best fit for this gig? Mention relevant experience and your approach."
      )
      .fill(
        "I have shipped similar projects with React, Next.js, TypeScript, and Node.js. I can deliver quickly and keep communication tight."
      );
    await page.getByRole("button", { name: "Submit Bid" }).click();
    await expect(
      page.getByText("Your bid has been submitted successfully!")
    ).toBeVisible();
  });

  test("employer can log in and see the seeded invoice", async ({ page }) => {
    await login(page, EMPLOYER_EMAIL);

    await page.getByRole("button", { name: "I'm an Employer" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/employer\/profile/);

    await page.goto("/en/employer/invoices");
    await expect(page.getByText(INVOICE_NUMBER)).toBeVisible();
  });
});
