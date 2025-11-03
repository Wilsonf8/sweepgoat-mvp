# Sweepgoat Design System - Minimalist Clean

**Last Updated**: 2025-11-01
**Style**: Minimalist Clean
**Philosophy**: Extreme simplicity, generous white space, focus on typography, monochromatic palette

---

## Color Palette

### Background Colors
- **Primary Background**: `bg-black` (#000000)
- **Secondary Background**: `bg-zinc-950` (very dark gray)
- **Card/Section Background**: `bg-zinc-900`
- **Borders**: `border-zinc-800`, `border-zinc-900`

### Text Colors
- **Primary Text**: `text-white` (headings)
- **Secondary Text**: `text-zinc-400`, `text-zinc-500` (body text)
- **Muted Text**: `text-zinc-600`, `text-zinc-700` (subtle elements)
- **Hover States**: `hover:text-white`

### Accent Colors (Use Sparingly)
- **Icons/Decorative**: `text-zinc-600`, `text-zinc-700`
- **Avoid**: Purple, blue, pink, or any vibrant colors

---

## Typography

### Font Weights
- **Headings**: `font-light` (300)
- **Subheadings**: `font-normal` (400)
- **Body Text**: `font-light` (300)
- **Small Labels**: `font-light` (300)
- **Never Use**: `font-bold`, `font-extrabold`, `font-semibold`

### Heading Sizes
```tsx
// H1 - Hero Headlines
className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight"

// H2 - Section Titles
className="text-3xl md:text-4xl font-light text-white tracking-tight"

// H3 - Card/Feature Titles
className="text-xl md:text-2xl font-normal text-white"

// H4 - Small Headings
className="text-lg font-normal text-white"
```

### Body Text
```tsx
// Large Body Text
className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed"

// Standard Body Text
className="text-base text-zinc-500 font-light leading-relaxed"

// Small Body Text
className="text-sm text-zinc-400 font-light leading-relaxed"

// Extra Small / Labels
className="text-xs text-zinc-500 font-light"
```

### Special Text Styles
```tsx
// Uppercase Labels (navigation, badges)
className="text-xs font-light text-zinc-500 uppercase tracking-wider"

// Numbered Steps
className="text-sm font-light text-zinc-700"
```

---

## Spacing

### Section Padding
```tsx
// Small Sections
className="py-16 md:py-20"

// Medium Sections (default)
className="py-20 md:py-32"

// Large Sections (hero)
className="py-32 md:py-40"
```

### Margin Between Elements
- **Section Title to Description**: `mb-4`
- **Description to Content**: `mb-20`
- **Between Cards**: `gap-8`, `gap-10`
- **Within Cards**: `p-8`, `p-10`
- **Hero Elements**: `mb-8`, `mb-12`, `mb-24`

### Container
```tsx
className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl"
```

---

## Components

### Buttons

#### Primary Button
```tsx
className="bg-white text-black hover:bg-zinc-200 px-8 py-4 text-sm font-light rounded transition-all duration-300 cursor-pointer"
```

#### Secondary Button
```tsx
className="bg-zinc-800 text-white hover:bg-zinc-700 px-8 py-4 text-sm font-light rounded transition-all duration-300 cursor-pointer"
```

#### Outline Button
```tsx
className="border border-zinc-700 text-zinc-300 hover:border-white hover:text-white px-8 py-4 text-sm font-light rounded transition-all duration-300 cursor-pointer"
```

#### Ghost Button
```tsx
className="text-zinc-400 hover:text-white px-8 py-4 text-sm font-light rounded transition-all duration-300 cursor-pointer"
```

### Cards

#### Simple Border Card
```tsx
<div className="p-8 border-l border-zinc-800">
  <div className="text-zinc-600 mb-6">{icon}</div>
  <h3 className="text-lg font-normal text-white mb-3">{title}</h3>
  <p className="text-sm text-zinc-500 leading-relaxed font-light">{description}</p>
</div>
```

#### Full Border Card
```tsx
<div className="p-10 border border-zinc-800">
  <h3 className="text-xl font-normal text-white mb-8">{title}</h3>
  {/* Content */}
</div>
```

### Navigation

#### Fixed Navigation Bar
```tsx
<nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  isScrolled ? 'bg-black/80 border-b border-zinc-900' : 'bg-transparent'
}`}>
  {/* Content */}
</nav>
```

#### Navigation Links
```tsx
<button className="text-xs font-light text-zinc-500 hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
  {label}
</button>
```

### Lists

#### Feature List with Dashes
```tsx
<ul className="space-y-4">
  {items.map((item, idx) => (
    <li key={idx} className="flex items-start gap-3">
      <span className="text-zinc-700 mt-1">—</span>
      <span className="text-sm text-zinc-400 font-light">{item}</span>
    </li>
  ))}
</ul>
```

#### Numbered Steps
```tsx
<div className="max-w-2xl mx-auto border-l border-zinc-800 pl-12">
  <div className="space-y-10">
    {steps.map((step, idx) => (
      <div key={idx} className="flex items-start gap-6">
        <div className="text-zinc-700 text-sm font-light flex-shrink-0 w-8">
          0{idx + 1}
        </div>
        <p className="text-sm text-zinc-400 font-light pt-0.5">{step}</p>
      </div>
    ))}
  </div>
</div>
```

### Badges/Labels

#### Simple Badge
```tsx
<div className="inline-block px-3 py-1 text-xs font-light tracking-wider uppercase text-zinc-500">
  {label}
</div>
```

### Trust Indicators

#### Minimal Text with Bullets
```tsx
<div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-xs text-zinc-500 font-light">
  <span>No credit card required</span>
  <span className="hidden sm:inline text-zinc-700">•</span>
  <span>Setup in 5 minutes</span>
  <span className="hidden sm:inline text-zinc-700">•</span>
  <span>Cancel anytime</span>
</div>
```

### Image Placeholders

```tsx
<div className="rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
  <div className="aspect-video bg-zinc-900 flex items-center justify-center">
    <div className="text-center text-zinc-600">
      {/* Icon */}
      <p className="text-sm font-light text-zinc-500">{label}</p>
    </div>
  </div>
</div>
```

---

## Layout Patterns

### Section Header (Centered)
```tsx
<div className="text-center mb-20">
  <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
    {title}
  </h2>
  <p className="text-base text-zinc-500 max-w-xl mx-auto font-light">
    {description}
  </p>
</div>
```

### Three Column Grid
```tsx
<div className="grid md:grid-cols-3 gap-8">
  {/* Cards with border-l */}
</div>
```

### Two Column Grid
```tsx
<div className="grid md:grid-cols-2 gap-8">
  {/* Full border cards */}
</div>
```

### Four Column Grid
```tsx
<div className="grid md:grid-cols-4 gap-6">
  {/* Small cards */}
</div>
```

---

## Icons

### Style Guidelines
- Use outline icons (stroke, not fill)
- Stroke width: `strokeWidth={1.5}` or `strokeWidth={1}`
- Color: `text-zinc-600` or `text-zinc-700` (muted)
- Size: `w-12 h-12` for features, `w-10 h-10` for smaller icons
- **Avoid**: Colored icons (purple, blue, etc.)

### Example
```tsx
<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="..." />
</svg>
```

---

## Borders & Corners

### Border Widths
- **Default**: `border` (1px)
- **Never Use**: `border-2`, `border-4`

### Border Radius
- **Default**: `rounded` (4px)
- **Larger Elements**: `rounded-lg` (8px)
- **Never Use**: `rounded-2xl`, `rounded-full` (except for specific cases)

### Border Colors
- `border-zinc-800` (primary)
- `border-zinc-900` (darker, for navigation)
- `border-zinc-700` (lighter, for hover states)

---

## Transitions & Animations

### Standard Transition
```tsx
className="transition-all duration-300"
```

### Color Transitions Only
```tsx
className="transition-colors duration-300"
```

### Hover States
- **Color Changes Only**: No scale, translate, or shadow changes
- **Text**: `hover:text-white`
- **Borders**: `hover:border-white`
- **Backgrounds**: `hover:bg-zinc-200`, `hover:bg-zinc-700`

### **Avoid**
- Shadow animations
- Transform animations (translate, scale, rotate)
- Blur effects
- Gradient animations

---

## What NOT to Use

### ❌ Avoid These Styles
- **Colors**: Purple, blue, pink, any vibrant colors
- **Effects**: Backdrop blur, shadows, glows
- **Animations**: Hover lifts, scale, complex transitions
- **Typography**: Bold, extrabold, semibold fonts
- **Gradients**: Any background or text gradients
- **Rounded Corners**: rounded-2xl, rounded-3xl
- **Borders**: Thick borders (border-2, border-4)

---

## Forms (To Be Applied)

### Input Fields
```tsx
<input
  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white text-sm font-light rounded focus:outline-none focus:border-zinc-700 transition-colors"
  placeholder="Email address"
/>
```

### Labels
```tsx
<label className="block text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
  {label}
</label>
```

### Error Messages
```tsx
<p className="text-xs text-zinc-500 mt-1 font-light">
  {error}
</p>
```

---

## Application Guidelines

### When Creating New Pages
1. Start with pure black background (`bg-black`)
2. Use generous white space (large padding/margins)
3. Keep typography light and minimal
4. Use zinc color scale for everything
5. Avoid any vibrant colors or effects
6. Keep borders simple and subtle
7. Minimal hover states (color changes only)

### When Creating New Components
1. Reference this design system first
2. Use existing component patterns
3. Maintain consistency with spacing scale
4. Keep it simple - when in doubt, remove decoration
5. Test that it feels "calm" and "understated"

---

## Examples to Reference

- **Main Landing Page**: `/src/pages/LandingPage.tsx`
- **Button Component**: `/src/components/Button.tsx`
- **Navigation Component**: `/src/components/Navigation.tsx`
- **Section Component**: `/src/components/Section.tsx`

---

## Quick Reference

**Primary Colors**: Black, White, Zinc shades only
**Font Weight**: Light (300) or Normal (400) only
**Spacing**: Generous (20-40px section padding)
**Borders**: 1px, zinc-800
**Corners**: Small (4-8px)
**Transitions**: 300ms, color changes only
**Philosophy**: Less is more, focus on content