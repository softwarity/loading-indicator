# Release Notes

## 3.0.1

### Features

- **[Material 3 Expressive Loading Indicator](https://m3.material.io/components/loading-indicator/overview)** - New animated loading indicator with smooth morphing between 7 organic shapes
- **Customizable diameter** - Adjustable size via `[diameter]` input (default: 48px)
- **Optional container** - Circular background with `withContainer` attribute for better visibility
- **60fps animation** - Butter-smooth animation using requestAnimationFrame
- **Light/Dark theme support** - Automatically adapts to color scheme changes

### API

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `diameter` | `number` | `48` | Size of the loading indicator in pixels |
| `withContainer` | `boolean` | `false` | Displays a circular background container |

### Theming

Customize via SCSS mixin:

```scss
@use '@softwarity/loading-indicator/loading-indicator-theme' as loading-indicator;

@include loading-indicator.overrides((
  background-color: light-dark(#e8def8, #4a4458),
  shape-color: light-dark(#6750a4, #ccc2dc)
));
```

### Requirements

- Angular >= 21.0.0

---
