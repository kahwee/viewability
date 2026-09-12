import { expect, type Page, test } from '@playwright/test'

interface BrowserMeasurement {
  value: number
  visible: boolean
  fullyVisible: boolean
  vertical: { value: number; state: string }
  horizontal: { value: number; state: string }
}

async function measureStyle(page: Page, style: Record<string, string>) {
  return page.evaluate((elementStyle) => {
    const element = document.createElement('div')
    Object.assign(
      element.style,
      { position: 'fixed', width: '100px', height: '100px' },
      elementStyle,
    )
    document.body.append(element)
    const api = (
      window as typeof window & { viewability: { measure(element: Element): BrowserMeasurement } }
    ).viewability
    const result = api.measure(element)
    element.remove()
    return result
  }, style)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('measures fully visible and offscreen elements', async ({ page }) => {
  const visible = await measureStyle(page, { left: '20px', top: '20px' })
  expect(visible).toMatchObject({ value: 1, visible: true, fullyVisible: true })

  const hidden = await measureStyle(page, { left: '-200px', top: '20px' })
  expect(hidden).toMatchObject({ value: 0, visible: false, fullyVisible: false })
  expect(hidden.horizontal.state).toBe('EL_IS_TOO_LEFT')
})

test('measures every truncated viewport edge', async ({ page }) => {
  const top = await measureStyle(page, { left: '20px', top: '-25px' })
  expect(top.vertical).toEqual({ value: 0.75, state: 'EL_TOP_TRUNCATED' })

  const left = await measureStyle(page, { left: '-25px', top: '20px' })
  expect(left.horizontal).toEqual({ value: 0.75, state: 'EL_LEFT_TRUNCATED' })

  const viewport = page.viewportSize()
  if (!viewport) throw new Error('Expected a configured viewport')

  const bottom = await measureStyle(page, { left: '20px', top: `${viewport.height - 25}px` })
  expect(bottom.vertical).toEqual({ value: 0.25, state: 'EL_BOTTOM_TRUNCATED' })

  const right = await measureStyle(page, { left: `${viewport.width - 25}px`, top: '20px' })
  expect(right.horizontal).toEqual({ value: 0.25, state: 'EL_RIGHT_TRUNCATED' })
})

test('supports oversized, transformed, and fractional rectangles', async ({ page }) => {
  const viewport = page.viewportSize()
  if (!viewport) throw new Error('Expected a configured viewport')
  const oversized = await measureStyle(page, {
    left: '-100px',
    top: '20px',
    width: `${viewport.width + 200}px`,
  })
  expect(oversized.horizontal.value).toBeCloseTo(viewport.width / (viewport.width + 200), 8)
  expect(oversized.horizontal.state).toBe('EL_LEFT_AND_RIGHT_TRUNCATED')

  const transformed = await measureStyle(page, {
    left: '0',
    top: '20px',
    transform: 'translateX(-25px)',
  })
  expect(transformed.horizontal.value).toBeCloseTo(0.75, 8)

  const fractional = await measureStyle(page, { left: '-12.5px', top: '20px', width: '50px' })
  expect(fractional.horizontal.value).toBeCloseTo(0.75, 8)
})

test('responds to viewport resizing', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 })
  expect((await measureStyle(page, { left: '750px', top: '550px' })).value).toBe(0.25)

  await page.setViewportSize({ width: 1000, height: 800 })
  expect((await measureStyle(page, { left: '750px', top: '550px' })).value).toBe(1)
})

test('returns zero for display-none elements', async ({ page }) => {
  const result = await measureStyle(page, { display: 'none' })
  expect(result.value).toBe(0)
  expect(result.vertical.state).toBe('EL_IS_ABOVE_VIEW')
})

test('keeps the interactive example in sync at viewport boundaries', async ({ page }) => {
  const x = page.locator('#x')
  const y = page.locator('#y')

  await x.evaluate((element: HTMLInputElement) => {
    element.value = '0'
    element.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await y.evaluate((element: HTMLInputElement) => {
    element.value = '100'
    element.dispatchEvent(new Event('input', { bubbles: true }))
  })

  await expect(page.locator('#area')).toHaveText('0%')
  await expect(page.locator('#horizontal-state')).toHaveText('EL_IS_TOO_LEFT')
  await expect(page.locator('#vertical-state')).toHaveText('EL_BOTTOM_TRUNCATED')

  for (const slider of [x, y]) {
    await slider.evaluate((element: HTMLInputElement) => {
      element.value = '50'
      element.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  await expect(page.locator('#area')).toHaveText('100%')
})
