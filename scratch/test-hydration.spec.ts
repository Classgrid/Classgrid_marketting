import { test, expect } from '@playwright/test';

test('capture console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  console.log('--- CONSOLE ERRORS ---');
  errors.forEach(err => console.log(err));
  console.log('----------------------');
});
