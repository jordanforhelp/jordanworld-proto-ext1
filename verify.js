import { chromium } from 'playwright';

(async () => {
  console.log("Starting verification browser automation for JordanLinks...");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage();
  
  // Set viewport to mobile size to capture dynamic mobile reveals and parallax
  await page.setViewportSize({ width: 375, height: 812 });

  // 1. Visit Home and clear storage for clean test slate
  console.log("Visiting Home page...");
  await page.goto('http://localhost:5173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'home.png' });

  // 2. Visit Register
  console.log("Visiting Register page...");
  await page.goto('http://localhost:5173/register');
  await page.waitForTimeout(1000);

  // Fill in Registration for username "alex" (which is free)
  console.log("Filling in registration details for alex...");
  await page.fill('input[placeholder="username"]', 'alex');
  await page.waitForTimeout(2000); // Wait for debounced availability check
  await page.fill('input[placeholder="you@domain.com"]', 'alex@creators.com');
  await page.fill('input[placeholder="••••••••"]', 'password123');
  await page.screenshot({ path: 'register_filled.png' });
  
  console.log("Submitting registration...");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  // Should be on dashboard
  console.log("On dashboard, filling custom profile data...");
  await page.fill('input[placeholder="e.g. John Doe"]', 'Alex Rivera');
  await page.fill('textarea[placeholder="Share a short intro bio..."]', 'Digital artist & director 🎬 | Designing minimal interactive interfaces.');
  await page.fill('input[placeholder="public-email@domain.com"]', 'alex.rivera@creators.com');
  
  // Add socials
  console.log("Setting socials...");
  const inputs = await page.$$('input[placeholder="Username only"]');
  if (inputs.length >= 1) {
    await inputs[0].fill('alex_rivera');
  }
  
  // Add custom link
  console.log("Adding custom links...");
  await page.fill('input[placeholder="e.g. My New Course"]', 'Check Out My Summer Travel Vlog');
  await page.fill('input[placeholder="e.g. website.com/link"]', 'youtube.com');
  await page.click('button:has-text("Add")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'dashboard.png' });
  // Click Save
  console.log("Saving changes...");
  await page.click('button:has-text("Save Changes")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'dashboard_saved.png' });

  // 3. Visit Public Profile
  console.log("Visiting public profile at /links/alex...");
  await page.goto('http://localhost:5173/links/alex');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public_profile_top.png' });

  // Scroll down to trigger Framer Motion staggered reveals
  console.log("Scrolling page to trigger animations...");
  await page.evaluate(() => window.scrollBy(0, 150));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'public_profile_scroll.png' });

  // Click custom link to trigger click tracking
  console.log("Clicking custom link to trigger metrics tracking...");
  await page.click('button:has-text("Check Out My Summer Travel Vlog")');
  await page.waitForTimeout(1000);

  // Navigate back to dashboard to verify analytics panel update
  console.log("Navigating back to dashboard to check analytics...");
  await page.goto('http://localhost:5173/dashboard');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'dashboard_analytics.png' });

  console.log("Verification completed successfully!");
  await browser.close();
})();
