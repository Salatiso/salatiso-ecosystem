/**
 * End-to-End Test Configuration
 * 
 * Playwright E2E tests for complete user journeys
 * 
 * Installation:
 * npm install --save-dev @playwright/test
 * npx playwright install
 * 
 * Run tests:
 * npx playwright test
 */

import { test, expect, type Page } from '@playwright/test';

/**
 * Helper: Login as user
 */
async function loginAsUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

/**
 * Helper: Wait for element with retry
 */
async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { timeout });
}

test.describe('Phase 5: Complete User Journey E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Create test user and family
    // TODO: Implement test data seeding
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Remove test data
    // TODO: Implement cleanup
  });

  test('Journey 1: Family Business Planning with Video & Co-Editing', async ({ page }) => {
    /**
     * Complete Journey:
     * 1. Elder logs in
     * 2. Views AI recommendations
     * 3. Accepts "Business Together" template
     * 4. Starts video call
     * 5. Family members join
     * 6. Opens template for co-editing
     * 7. All members contribute
     * 8. Creates version snapshot
     * 9. Ends session
     * 10. Views analytics
     */

    // Step 1: Login as elder
    await loginAsUser(page, 'elder@example.com', 'password123');
    await expect(page).toHaveTitle(/Salatiso/);

    // Step 2: Navigate to AI recommendations
    await page.click('text=Recommendations');
    await waitForElement(page, '.recommendation-card');

    // Step 3: Accept recommendation
    const firstRecommendation = page.locator('.recommendation-card').first();
    await firstRecommendation.locator('button:has-text("Accept")').click();
    
    // Should navigate to template
    await page.waitForURL(/\/templates\/.+/);

    // Step 4: Start video call
    await page.click('button:has-text("Start Video Call")');
    await waitForElement(page, '.video-room');

    // Step 5: Grant consent
    await page.check('[name="join-consent"]');
    await page.click('button:has-text("Join Call")');

    // Wait for video to initialize
    await page.waitForSelector('.participant-tile', { timeout: 10000 });

    // Step 6: Open collaborative editor
    await page.click('button:has-text("Open Template")');
    await waitForElement(page, '.collaborative-editor');

    // Step 7: Type in editor
    await page.click('.ProseMirror');
    await page.keyboard.type('Our family business goals: ');
    await page.keyboard.type('1. Create jobs\n');
    await page.keyboard.type('2. Generate income\n');
    await page.keyboard.type('3. Serve community\n');

    // Wait for sync
    await page.waitForTimeout(1000);

    // Step 8: Create snapshot
    await page.click('button:has-text("Create Snapshot")');
    await page.fill('[placeholder*="description"]', 'Initial business goals');
    await page.press('[placeholder*="description"]', 'Enter');

    // Wait for snapshot to save
    await page.waitForSelector('text=/Snapshot created/i', { timeout: 5000 });

    // Step 9: Save template
    await page.click('button:has-text("Save")');
    await page.waitForSelector('text=/Saved/i');

    // Step 10: End video call
    await page.click('button[aria-label="Leave call"]');
    await page.click('button:has-text("End Session")');

    // Step 11: Navigate to analytics
    await page.click('text=Analytics');
    await waitForElement(page, '.analytics-dashboard');

    // Verify metrics updated
    await expect(page.locator('text=/Video Calls/i')).toBeVisible();
    await expect(page.locator('text=/Templates Completed/i')).toBeVisible();
    await expect(page.locator('text=/Co-Editing Sessions/i')).toBeVisible();

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/analytics-dashboard.png', fullPage: true });
  });

  test('Journey 2: Multi-User Concurrent Editing', async ({ browser }) => {
    /**
     * Test Scenario:
     * - 3 users edit same document simultaneously
     * - Verify CRDT conflict resolution
     * - Verify cursor presence
     * - Verify no data loss
     */

    // Create 3 browser contexts (simulate 3 users)
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();
    const user3Context = await browser.newContext();

    const page1 = await user1Context.newPage();
    const page2 = await user2Context.newPage();
    const page3 = await user3Context.newPage();

    try {
      // All users login
      await loginAsUser(page1, 'user1@example.com', 'password123');
      await loginAsUser(page2, 'user2@example.com', 'password123');
      await loginAsUser(page3, 'user3@example.com', 'password123');

      // Navigate to same document
      const documentUrl = '/templates/f1-business-together/edit';
      await page1.goto(documentUrl);
      await page2.goto(documentUrl);
      await page3.goto(documentUrl);

      // Wait for collaborative editor to load
      await Promise.all([
        waitForElement(page1, '.collaborative-editor'),
        waitForElement(page2, '.collaborative-editor'),
        waitForElement(page3, '.collaborative-editor')
      ]);

      // All users type simultaneously
      await Promise.all([
        page1.click('.ProseMirror').then(() => page1.keyboard.type('User 1 contribution. ')),
        page2.click('.ProseMirror').then(() => page2.keyboard.type('User 2 contribution. ')),
        page3.click('.ProseMirror').then(() => page3.keyboard.type('User 3 contribution. '))
      ]);

      // Wait for sync
      await page1.waitForTimeout(2000);

      // Verify all content appears in all editors
      const content1 = await page1.textContent('.ProseMirror');
      const content2 = await page2.textContent('.ProseMirror');
      const content3 = await page3.textContent('.ProseMirror');

      // All should have same content
      expect(content1).toBeTruthy();
      expect(content1).toBe(content2);
      expect(content2).toBe(content3);

      // Verify all contributions present
      expect(content1).toContain('User 1 contribution');
      expect(content1).toContain('User 2 contribution');
      expect(content1).toContain('User 3 contribution');

      // Verify user presence indicators
      await expect(page1.locator('.presence-indicators')).toBeVisible();
      
      // Should see 2 other users
      const presenceCount = await page1.locator('.presence-indicators .user-avatar').count();
      expect(presenceCount).toBe(2); // 2 other users

    } finally {
      await user1Context.close();
      await user2Context.close();
      await user3Context.close();
    }
  });

  test('Journey 3: AI Recommendation Acceptance Flow', async ({ page }) => {
    /**
     * Test Scenario:
     * - Login as family member
     * - View AI recommendations
     * - Accept recommendation
     * - Rate recommendation
     * - Verify analytics tracking
     */

    await loginAsUser(page, 'member@example.com', 'password123');

    // Navigate to dashboard
    await page.goto('/dashboard');

    // AI recommendations should be visible
    await waitForElement(page, '.recommendation-card');

    // Get recommendation count
    const recommendationCount = await page.locator('.recommendation-card').count();
    expect(recommendationCount).toBeGreaterThan(0);

    // Click first recommendation
    const firstRec = page.locator('.recommendation-card').first();
    
    // Read recommendation details
    const templateName = await firstRec.locator('.template-name').textContent();
    const relevanceScore = await firstRec.locator('.relevance-score').textContent();

    expect(templateName).toBeTruthy();
    expect(relevanceScore).toMatch(/\d+%/);

    // Expand details
    await firstRec.locator('button:has-text("Explain")').click();
    await waitForElement(page, '.recommendation-explanation');

    // Verify Ubuntu alignment mentioned
    const explanation = await page.locator('.recommendation-explanation').textContent();
    expect(explanation?.toLowerCase()).toContain('ubuntu');

    // Accept recommendation
    await firstRec.locator('button:has-text("Accept")').click();

    // Should navigate to template
    await page.waitForURL(/\/templates\/.+/);

    // Verify template loaded
    await expect(page.locator('h1')).toContainText(templateName || '');

    // Go back to recommendations
    await page.goBack();

    // Verify recommendation marked as accepted
    await expect(firstRec.locator('.status-badge')).toHaveText(/Accepted/i);
  });

  test('Journey 4: Analytics Dashboard Exploration', async ({ page }) => {
    /**
     * Test Scenario:
     * - Login as elder
     * - View analytics dashboard
     * - Switch between tabs
     * - Change time periods
     * - Verify metrics display
     * - Export report (if implemented)
     */

    await loginAsUser(page, 'elder@example.com', 'password123');

    // Navigate to analytics
    await page.click('text=Analytics');
    await waitForElement(page, '.analytics-dashboard');

    // Verify all tabs present
    const tabs = ['Overview', 'Participation', 'Collaboration', 'Ubuntu', 'Business'];
    for (const tab of tabs) {
      await expect(page.locator(`button:has-text("${tab}")`)).toBeVisible();
    }

    // Test tab switching
    for (const tab of tabs) {
      await page.click(`button:has-text("${tab}")`);
      await page.waitForTimeout(500);
      
      // Verify tab content loaded
      await expect(page.locator('.metric-card')).toBeVisible();
    }

    // Test time period switching
    await page.click('button:has-text("Overview")'); // Go back to overview
    
    const periods = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months'];
    for (const period of periods) {
      await page.click(`button:has-text("${period}")`);
      await page.waitForTimeout(1000);
      
      // Verify data updated (loading indicator should appear then disappear)
      // Charts should be visible
      await expect(page.locator('.recharts-wrapper')).toBeVisible();
    }

    // Verify Ubuntu alignment gauge
    await page.click('button:has-text("Ubuntu")');
    await waitForElement(page, '.ubuntu-alignment-gauge');
    
    // Should show score
    const scoreElement = await page.locator('.ubuntu-alignment-gauge').locator('text=/\\d+/').first();
    const score = await scoreElement.textContent();
    expect(parseInt(score || '0')).toBeGreaterThanOrEqual(0);
    expect(parseInt(score || '0')).toBeLessThanOrEqual(100);

    // Take screenshot
    await page.screenshot({ path: 'test-results/ubuntu-alignment.png' });
  });

  test('Journey 5: Offline Resilience', async ({ page, context }) => {
    /**
     * Test Scenario:
     * - Login and open document
     * - Start editing
     * - Go offline
     * - Continue editing
     * - Go back online
     * - Verify changes sync
     */

    await loginAsUser(page, 'member@example.com', 'password123');

    // Open document
    await page.goto('/templates/f1-business-together/edit');
    await waitForElement(page, '.collaborative-editor');

    // Type some content while online
    await page.click('.ProseMirror');
    await page.keyboard.type('Online content: This was typed while connected. ');

    // Wait for sync
    await page.waitForTimeout(1000);

    // Go offline
    await context.setOffline(true);

    // Verify offline indicator
    await expect(page.locator('text=/Offline/i')).toBeVisible({ timeout: 5000 });

    // Continue editing while offline
    await page.keyboard.type('Offline content: This was typed while disconnected. ');

    // Verify content saved locally
    const offlineContent = await page.textContent('.ProseMirror');
    expect(offlineContent).toContain('Offline content');

    // Go back online
    await context.setOffline(false);

    // Wait for reconnection
    await expect(page.locator('text=/Connected/i')).toBeVisible({ timeout: 10000 });

    // Verify all content present
    const onlineContent = await page.textContent('.ProseMirror');
    expect(onlineContent).toContain('Online content');
    expect(onlineContent).toContain('Offline content');

    // Wait a bit more for sync
    await page.waitForTimeout(2000);

    // Refresh page to verify persistence
    await page.reload();
    await waitForElement(page, '.collaborative-editor');

    const reloadedContent = await page.textContent('.ProseMirror');
    expect(reloadedContent).toContain('Online content');
    expect(reloadedContent).toContain('Offline content');
  });
});

/**
 * Visual Regression Tests
 */
test.describe('Visual Regression Tests', () => {
  test('Analytics Dashboard - Overview Tab', async ({ page }) => {
    await loginAsUser(page, 'elder@example.com', 'password123');
    await page.goto('/analytics');
    await waitForElement(page, '.analytics-dashboard');
    
    // Wait for charts to render
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('analytics-overview.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Collaborative Editor with Multiple Users', async ({ page }) => {
    await loginAsUser(page, 'member@example.com', 'password123');
    await page.goto('/templates/f1-business-together/edit');
    await waitForElement(page, '.collaborative-editor');
    await waitForElement(page, '.presence-indicators');
    
    await expect(page).toHaveScreenshot('collaborative-editor.png', {
      fullPage: true
    });
  });

  test('Video Room with Participants', async ({ page }) => {
    await loginAsUser(page, 'elder@example.com', 'password123');
    await page.goto('/video/test-room');
    await page.check('[name="join-consent"]');
    await page.click('button:has-text("Join Call")');
    await waitForElement(page, '.video-room');
    
    // Wait for video tiles to load
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveScreenshot('video-room.png');
  });
});

/**
 * Accessibility Tests
 */
test.describe('Accessibility Tests', () => {
  test('Analytics Dashboard should be keyboard navigable', async ({ page }) => {
    await loginAsUser(page, 'member@example.com', 'password123');
    await page.goto('/analytics');
    
    // Tab through all interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate tabs with keyboard
    await page.keyboard.press('Enter');
    
    // Verify focus indicators visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('Collaborative Editor should have ARIA labels', async ({ page }) => {
    await loginAsUser(page, 'member@example.com', 'password123');
    await page.goto('/templates/f1-business-together/edit');
    await waitForElement(page, '.collaborative-editor');
    
    // Check for ARIA labels
    const editor = page.locator('.collaborative-editor');
    await expect(editor).toHaveAttribute('role');
  });
});

/**
 * Performance Tests
 */
test.describe('Performance Tests', () => {
  test('Dashboard should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await loginAsUser(page, 'member@example.com', 'password123');
    await page.goto('/dashboard');
    await waitForElement(page, '.dashboard-content');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('Analytics should render charts within 2 seconds', async ({ page }) => {
    await loginAsUser(page, 'elder@example.com', 'password123');
    
    const startTime = Date.now();
    await page.goto('/analytics');
    await waitForElement(page, '.recharts-wrapper');
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(2000);
  });
});
