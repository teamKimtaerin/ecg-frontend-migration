import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')

  // 페이지 제목 확인
  await expect(page).toHaveTitle(/ECG Frontend/i)

  // 기본 헤딩 요소가 있는지 확인
  const heading = page.locator('h1').first()
  await expect(heading).toBeVisible()
})

test('health check API works', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBeTruthy()

  const data = await response.json()
  expect(data).toHaveProperty('status', 'ok')
})
