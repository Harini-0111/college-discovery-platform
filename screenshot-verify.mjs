import { chromium, devices } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';

const OUT = path.join(process.cwd(), 'verification-screenshots');
const COLLEGE_ID = 'cmpzqrcwd0000r21h6xoyc4wr';
const BASE = 'http://localhost:3000';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function shot(name, url, viewport, fullPage = false) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage });
  await context.close();
}

// Homepage - hero
await shot('01-homepage-hero-desktop', `${BASE}/`, { width: 1440, height: 900 });

// Homepage - full scroll for featured + popular
await shot('02-homepage-full-desktop', `${BASE}/`, { width: 1440, height: 900 }, true);

// Colleges listing - cards
await shot('03-colleges-cards-desktop', `${BASE}/colleges`, { width: 1440, height: 900 });

// College detail hero
await shot('04-college-detail-hero-desktop', `${BASE}/colleges/${COLLEGE_ID}`, { width: 1440, height: 900 });

// Compare desktop
await shot('05-compare-desktop', `${BASE}/compare`, { width: 1440, height: 900 });

// Compare with selections
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/compare`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.selectOption('#col1', { index: 1 });
  await page.selectOption('#col2', { index: 2 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT, '06-compare-with-data-desktop.png'), fullPage: true });
  await context.close();
}

// Mobile homepage
const iphone = devices['iPhone 13'];
{
  const context = await browser.newContext({ ...iphone });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, '07-homepage-mobile.png'), fullPage: true });
  await context.close();
}

// Mobile compare with data
{
  const context = await browser.newContext({ ...iphone });
  const page = await context.newPage();
  await page.goto(`${BASE}/compare`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.selectOption('#col1', { index: 1 });
  await page.selectOption('#col2', { index: 2 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT, '08-compare-with-data-mobile.png'), fullPage: true });
  await context.close();
}

await browser.close();
console.log('Screenshots saved to', OUT);
