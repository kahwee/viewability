# CLAUDE.md - Technical Documentation for AI Assistants

This document provides technical details about the `viewability` package for AI assistants like Claude to better understand and work with this codebase.

## Package Overview

**viewability** is a lightweight browser library for measuring DOM element visibility within the viewport. It provides precise percentage-based measurements of how much of an element is visible, along with descriptive state information.

### Core Purpose

- Measure vertical and horizontal visibility of DOM elements
- Return precise visibility percentages (0-1 scale)
- Provide descriptive state strings explaining element position
- Enable use cases like ad viewability tracking, lazy loading, and scroll animations

### Key Characteristics

- **Zero dependencies**: Completely standalone, no external libraries
- **Small footprint**: Minimal code, fast execution
- **Browser-based**: Uses standard DOM APIs (`getBoundingClientRect`, `window.innerWidth/Height`)
- **CommonJS modules**: Standard Node.js module structure
- **UMD build available**: Can be used in browsers via CDN

## Architecture

### File Structure

```
viewability/
├── viewability.js          # Main entry point, exports all functions
├── vertical.js             # Vertical viewability calculation
├── horizontal.js           # Horizontal viewability calculation
├── isElementOnScreen.js    # Convenience boolean checker
├── webpack.config.js       # Build configuration for UMD bundle
├── karma.conf.js          # Test runner configuration
└── tests/                 # Test suite
    ├── vertical-spec.js
    ├── horizontal-spec.js
    └── isElementOnScreen-spec.js
```

### Module Design

Each function is in its own file for modularity. Users can import just what they need:

```js
// Import only vertical checking
const vertical = require('viewability/vertical');

// Or import the main package with all functions
const viewability = require('viewability');
```

## Implementation Details

### vertical.js

**Purpose**: Calculates vertical visibility of an element within the viewport.

**Algorithm**:
1. Get viewport height: `window.innerHeight`
2. Get element position using `getBoundingClientRect()`:
   - `top`: Distance from top of viewport to top of element
   - `bottom`: Distance from top of viewport to bottom of element
3. Calculate element height: `bottom - top`
4. Determine visibility state and percentage:

**States**:
- `EL_IS_BELOW_VIEW`: Element is completely below viewport (top > windowHeight)
- `EL_IS_ABOVE_VIEW`: Element is completely above viewport (bottom <= 0)
- `EL_IS_WITHIN_VERTICAL_VIEW`: Element is fully visible (top >= 0 && bottom <= windowHeight)
- `EL_BOTTOM_AND_TOP_TRUNCATED`: Element is taller than viewport, both ends cut off
- `EL_TOP_TRUNCATED`: Top portion is above viewport, bottom is visible
- `EL_BOTTOM_TRUNCATED`: Bottom portion is below viewport, top is visible
- `EL_IS_NOT_WITHIN_VIEW`: Generic error state

**Return Value**:
```typescript
{
  value: number,  // 0 to 1, representing visible percentage
  state: string   // One of the states above
}
```

### horizontal.js

**Purpose**: Calculates horizontal visibility of an element within the viewport.

**Algorithm**: Same as vertical but uses:
- `window.innerWidth` instead of `window.innerHeight`
- `left` and `right` from `getBoundingClientRect()`
- Element width: `right - left`

**States**:
- `EL_IS_TOO_RIGHT`: Element is completely right of viewport
- `EL_IS_TOO_LEFT`: Element is completely left of viewport
- `EL_IS_WITHIN_HORIZONTAL_VIEW`: Element is fully visible
- `EL_LEFT_AND_RIGHT_TRUNCATED`: Element is wider than viewport
- `EL_LEFT_TRUNCATED`: Left portion is outside viewport
- `EL_RIGHT_TRUNCATED`: Right portion is outside viewport
- `EL_IS_NOT_WITHIN_VIEW`: Generic error state

### isElementOnScreen.js

**Purpose**: Convenience function for boolean visibility check.

**Algorithm**:
```js
function isElementOnScreen(el, full) {
  if (full) {
    // Check if 100% visible (both dimensions)
    return vertical(el).value * horizontal(el).value === 1;
  } else {
    // Check if any part is visible
    return vertical(el).value * horizontal(el).value > 0;
  }
}
```

**Parameters**:
- `el` (HTMLElement): Element to check
- `full` (boolean): If true, requires 100% visibility; if false/omitted, any visibility counts

**Note**: Multiplies vertical and horizontal values to get 2D visibility.

## API Reference

### Main Module (viewability.js)

```js
const viewability = require('viewability');

// Exports:
{
  vertical: Function,      // From vertical.js
  horizontal: Function,    // From horizontal.js
  isElementOnScreen: Function  // From isElementOnScreen.js
}
```

### Individual Functions

#### vertical(element: HTMLElement): ViewabilityResult

Returns vertical visibility information.

```js
const vertical = require('viewability/vertical');
const result = vertical(document.getElementById('my-element'));
// { value: 0.75, state: 'EL_BOTTOM_TRUNCATED' }
```

#### horizontal(element: HTMLElement): ViewabilityResult

Returns horizontal visibility information.

```js
const horizontal = require('viewability/horizontal');
const result = horizontal(document.getElementById('my-element'));
// { value: 1, state: 'EL_IS_WITHIN_HORIZONTAL_VIEW' }
```

#### isElementOnScreen(element: HTMLElement, full?: boolean): boolean

Returns boolean indicating visibility.

```js
const isElementOnScreen = require('viewability/isElementOnScreen');

// Any part visible?
isElementOnScreen(element); // true if value > 0

// Fully visible?
isElementOnScreen(element, true); // true only if value === 1
```

## Testing

### Test Framework

- **Karma**: Test runner for browser environment
- **Mocha**: Test framework
- **Chai**: Assertion library
- **Webpack**: Bundles code for tests

### Test Strategy

Tests create DOM elements dynamically and position them to test different states:

```js
// Example from vertical-spec.js
test = document.createElement('div');
test.style.top = '5000px';  // Position below viewport
const result = vertical(test);
expect(result.state).to.equal('EL_IS_BELOW_VIEW');
```

### Running Tests

```bash
npm test  # Runs Karma with Chrome
```

## Build Process

### Webpack Configuration

The build creates a UMD bundle for browser use:

```js
// webpack.config.js creates:
// dist/viewability.min.js
```

This bundle exposes `viewability` globally when loaded via `<script>` tag.

### Build Command

```bash
npm run build
```

## Performance Considerations

### Efficiency

- **Lightweight**: Each function is ~60 lines of code
- **Fast execution**: Simple arithmetic operations on `getBoundingClientRect()` results
- **No dependencies**: No overhead from external libraries

### Performance Tips

1. **Debounce scroll events**: When using in scroll handlers, debounce to avoid excessive calls:

```js
let timeout;
window.addEventListener('scroll', function() {
  clearTimeout(timeout);
  timeout = setTimeout(checkViewability, 100);
});
```

2. **Use specific modules**: Import only what you need to reduce bundle size:

```js
// Better: Only 60 lines of code
const vertical = require('viewability/vertical');

// vs Full package: All three modules
const viewability = require('viewability');
```

3. **Cache elements**: Store element references instead of repeatedly querying DOM:

```js
const elements = Array.from(document.querySelectorAll('.lazy-load'));
elements.forEach(el => {
  if (vertical(el).value > 0) {
    // Do something
  }
});
```

## Common Use Cases

### 1. Ad Viewability (IAB Standards)

IAB defines viewable impressions as:
- Display ads: 50% of pixels visible for 1 continuous second
- Video ads: 50% of pixels visible for 2 continuous seconds

```js
const vertical = require('viewability/vertical');
const horizontal = require('viewability/horizontal');

function measureAdViewability(adElement) {
  const v = vertical(adElement);
  const h = horizontal(adElement);
  const visiblePercentage = v.value * h.value;

  return visiblePercentage >= 0.5; // 50% threshold
}
```

### 2. Lazy Loading

Load resources only when needed:

```js
const vertical = require('viewability/vertical');

function shouldLoad(element, threshold = 200) {
  const result = vertical(element);

  // Load if visible or within threshold pixels of viewport
  if (result.value > 0) return true;

  if (result.state === 'EL_IS_BELOW_VIEW') {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight + threshold;
  }

  return false;
}
```

### 3. Analytics Tracking

Track which content users actually see:

```js
const isElementOnScreen = require('viewability/isElementOnScreen');

const viewedElements = new Set();

function trackVisibleContent() {
  document.querySelectorAll('[data-track]').forEach(el => {
    if (isElementOnScreen(el) && !viewedElements.has(el)) {
      viewedElements.add(el);
      analytics.track('content_viewed', {
        id: el.dataset.track
      });
    }
  });
}
```

## Browser Compatibility

### Required APIs

- `Element.getBoundingClientRect()` - IE5+
- `window.innerWidth` / `window.innerHeight` - IE9+

### Supported Browsers

- Chrome/Edge: All versions
- Firefox: All versions
- Safari: All versions
- IE: 9+

## Code Style

The project uses [JavaScript Standard Style](https://standardjs.com/):

```bash
npm run lint
```

## Maintenance Notes

### Dependencies

**Production**: None (zero dependencies)

**Development**:
- Babel: For modern JS transpilation
- Webpack: For UMD bundle creation
- Karma: For browser testing
- Standard: For linting

### Version History

Current version: 1.3.4

### Future Enhancements

Potential improvements (not currently implemented):
1. Intersection Observer API support for better performance
2. TypeScript definitions
3. Support for elements within scrollable containers
4. Visibility history tracking
5. Configurable thresholds

## Integration Examples

### React Hook

```js
import { useEffect, useState } from 'react';
const vertical = require('viewability/vertical');

function useViewability(ref) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function check() {
      if (ref.current) {
        setIsVisible(vertical(ref.current).value > 0);
      }
    }

    window.addEventListener('scroll', check);
    check();

    return () => window.removeEventListener('scroll', check);
  }, [ref]);

  return isVisible;
}
```

### Vue Directive

```js
const vertical = require('viewability/vertical');

Vue.directive('viewability', {
  bind(el, binding) {
    const callback = binding.value;

    function check() {
      const result = vertical(el);
      callback(result);
    }

    window.addEventListener('scroll', check);
    el._viewabilityCheck = check;
  },

  unbind(el) {
    window.removeEventListener('scroll', el._viewabilityCheck);
  }
});
```

## Debugging

### Common Issues

1. **Element has zero dimensions**: `getBoundingClientRect()` returns zero if element has no size
   - Check CSS: `display: none` or `visibility: hidden` elements have no rect
   - Use browser DevTools to inspect element dimensions

2. **Incorrect values in tests**:
   - Ensure element is actually in DOM before checking
   - Browser viewport size matters in tests

3. **Values change on scroll**:
   - This is expected behavior
   - Values are relative to current viewport position
   - Use debouncing to control update frequency

### Debug Helper

```js
const vertical = require('viewability/vertical');
const horizontal = require('viewability/horizontal');

function debugViewability(element) {
  const v = vertical(element);
  const h = horizontal(element);
  const rect = element.getBoundingClientRect();

  console.table({
    'Vertical %': (v.value * 100).toFixed(1) + '%',
    'Horizontal %': (h.value * 100).toFixed(1) + '%',
    'Overall %': (v.value * h.value * 100).toFixed(1) + '%',
    'Vertical State': v.state,
    'Horizontal State': h.state,
    'Top': rect.top,
    'Bottom': rect.bottom,
    'Left': rect.left,
    'Right': rect.right,
    'Viewport Height': window.innerHeight,
    'Viewport Width': window.innerWidth
  });
}
```

## Summary

This is a well-designed, focused library that does one thing well: measuring element visibility. The code is clean, well-tested, and has zero dependencies. It's suitable for production use in any browser-based JavaScript application.

Key strengths:
- Simple, understandable code
- Comprehensive test coverage
- Multiple usage patterns (CommonJS, CDN)
- Real-world use cases (ads, lazy loading, analytics)
- Good performance characteristics

When working with this codebase:
1. Each module is self-contained and can be understood independently
2. Tests demonstrate expected behavior clearly
3. The build process is standard (Webpack + Babel)
4. No complex abstractions or design patterns to learn
5. Direct use of browser APIs makes debugging straightforward
