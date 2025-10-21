# Design Guidelines: PokePao Poke Bowl Café Website

## Design Approach: Reference-Based (Food & Beverage E-commerce)
Drawing inspiration from modern food delivery platforms (Uber Eats, DoorDash) combined with fresh, health-focused restaurant aesthetics (Sweetgreen, Chipotle digital experience). The design emphasizes vibrant food imagery, seamless ordering flow, and appetizing visual hierarchy.

## Core Design Principles
1. **Visual Appetite Appeal**: Food-first imagery that makes visitors hungry
2. **Frictionless Ordering**: Clear, intuitive path from browse to cart to checkout
3. **Fresh & Vibrant Energy**: Reflects the Hawaiian poke bowl concept with bright, tropical undertones
4. **Trust & Transparency**: Clear pricing, ingredient visibility, social proof

## Color Palette

### Primary Colors
- **Ocean Blue**: 198 71% 55% (Primary brand color, headers, CTAs)
- **Sunset Orange**: 16 90% 55% (Secondary CTA, accents, highlights)
- **Deep Navy**: 210 40% 20% (Text, navigation)

### Supporting Colors
- **Pure White**: 0 0% 100% (Backgrounds, cards)
- **Soft Gray**: 210 20% 96% (Section backgrounds)
- **Warm Gold**: 45 100% 50% (Awards, ratings, special badges)
- **Fresh Green**: 140 50% 45% (Success states, fresh/healthy indicators)

### Functional Colors
- **Error Red**: 0 70% 55%
- **Warning Amber**: 38 92% 50%
- **Info Blue**: 210 80% 60%

## Typography

### Font Families
- **Headings**: Poppins (600, 700) - Bold, modern, friendly
- **Body**: Lato (400, 700) - Clean, readable, professional
- **Accent**: Poppins for menu items, prices, CTAs

### Type Scale
- **Hero Headline**: text-5xl md:text-7xl font-bold (Poppins)
- **Section Headers**: text-3xl md:text-5xl font-bold (Poppins)
- **Subsection Titles**: text-2xl md:text-3xl font-semibold (Poppins)
- **Body Large**: text-lg md:text-xl (Lato)
- **Body Regular**: text-base (Lato)
- **Small Text**: text-sm (Lato)

## Layout System

### Spacing Primitives
Primary spacing units: **4, 6, 8, 12, 16, 24** (Tailwind units)
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-24
- Grid gaps: gap-6 to gap-8
- Card spacing: p-6 md:p-8

### Container Strategy
- Max-width sections: max-w-7xl mx-auto
- Content-focused: max-w-4xl mx-auto
- Full-width hero: w-full with overlay

### Grid Layouts
- Service cards: grid-cols-1 md:grid-cols-3 gap-8
- Menu items: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
- Testimonials: grid-cols-1 md:grid-cols-2 gap-8
- Footer columns: grid-cols-1 md:grid-cols-4 gap-8

## Component Library

### Navigation
- **Sticky Header**: Ocean blue gradient background, white text
- **Logo**: Left-aligned, 48px height on desktop
- **Nav Links**: Horizontal desktop, hamburger mobile, underline hover effect with orange accent
- **Social Icons**: WhatsApp, Instagram, TikTok in header top bar
- **Phone Number**: Prominent in header, clickable on mobile
- **Mobile Menu**: Slide-down panel, full navigation + CTA button

### Hero Section
- **Height**: 80vh minimum, max 90vh
- **Background**: Animated marquee/carousel of appetizing poke bowl images
- **Overlay**: Dark gradient (40% opacity) for text readability
- **Award Badge**: Floating badge "Deutschlands Beste Poke Bowl 2024" with trophy icon, glass-morphism effect
- **Primary CTA**: Orange button, large (px-10 py-4), rounded-full
- **Typography**: Large hero headline with text shadow for depth

### Cards & Components

**Service Cards** (Delivery, Pickup, Reservation):
- White background, rounded-2xl, shadow-lg
- Icon at top (64px, blue accent)
- Badge for special offers (absolute positioned, -top-4)
- Hover: Lift effect (translateY -10px)
- CTA buttons: Orange primary or blue outline secondary

**Menu Item Cards**:
- Image: 16:9 ratio, rounded-t-xl, object-cover
- Content: p-6, white background
- Title: text-xl font-bold
- Description: text-sm text-gray-600, 2-line clamp
- Price: text-2xl font-bold, ocean blue
- Add to Cart button: Orange, full-width, rounded-full
- Hover: Shadow enhancement, subtle lift

**Cart Widget**:
- Fixed bottom-right, z-index 1000
- Floating action button with item count badge
- Pulsing animation when items added
- Modal overlay: Full-screen with blur backdrop

**Category Tabs** (Menu sections):
- Horizontal scroll on mobile
- Active state: Orange underline (4px thick)
- Text: Uppercase, font-semibold, tracking-wide
- Smooth scroll to sections

### Forms & Inputs
- Input fields: border-2 border-gray-300, rounded-lg, p-4
- Focus state: border-blue-500, ring-2 ring-blue-200
- Labels: font-semibold, mb-2
- Submit buttons: Orange CTA style
- Validation: Inline messages, red for errors, green for success

### Footer
- **Background**: Deep navy (210 40% 20%)
- **Text**: White/light gray
- **Layout**: 4-column grid on desktop, stack on mobile
- **Sections**: Quick Links, Contact Info, Opening Hours, Newsletter Signup
- **Social Icons**: Large, interactive, white with hover color
- **Copyright**: Centered, smaller text, border-top separator

## Images & Media

### Hero Section Images
**Primary Hero Image**: High-quality, appetizing poke bowl photography
- Vibrant ingredients clearly visible (salmon, avocado, edamame, rice)
- Professional lighting, shallow depth of field
- Hawaiian/tropical aesthetic undertones
- Animated background: Horizontal marquee/slider effect (2 copies for seamless loop)

### Menu Section Images
- **Product Photography**: Each menu item has a high-quality image
- Consistent lighting and styling across all items
- Square format (1:1) for grid display
- Show portion size realistically
- Include garnish and presentation details

### Additional Imagery
- **About Section**: Team photos, kitchen/preparation shots, restaurant interior
- **Testimonial Section**: Customer photos (if available) or avatar placeholders
- **Contact Section**: Embedded Google Maps for location
- **Background Patterns**: Subtle tropical leaf patterns for section dividers (opacity 5-10%)

## Interactive Elements

### Buttons
- **Primary CTA**: Orange, shadow-lg, hover lift + shadow enhancement
- **Secondary**: Blue outline, transparent, hover fills blue
- **Tertiary**: Text links with orange underline on hover

### Animations
**Sparingly Used**:
- Fade-in on scroll for section reveals (0.6s ease-out)
- Card hover states (transform, shadow)
- Hero image marquee (80s linear infinite)
- Cart widget scale entrance
- Mobile menu slide-down

**No Excessive Motion**: Avoid distracting parallax, spinning elements, or complex transitions

### Microinteractions
- Button press: Subtle scale (0.98)
- Add to cart: Item flies to cart icon with particle effect
- Form validation: Shake animation on error
- Loading states: Spinner in brand colors

## Page-Specific Guidelines

### Menu/Pickup Page
- Sticky category navigation
- Filter/search at top
- Grid of menu items with images
- Add to cart inline on each card
- Cart summary sticky on desktop (sidebar), floating on mobile
- Clear checkout flow

### Contact Page
- Split layout: Form (left) + Map (right) on desktop
- Contact info cards: Phone, Email, Address with icons
- Opening hours prominent
- Social media links repeated
- Form: Name, Email, Phone, Message fields

### About Page
- Story section with team photo
- Values/mission statement
- Awards and recognition badges
- Origin story of Hawaiian poke concept
- Gallery of restaurant/food images

## Accessibility & Dark Mode
- Maintain AA contrast ratios minimum
- Dark mode: Not required (light theme is on-brand for fresh food)
- Alt text for all images
- Keyboard navigation support
- ARIA labels for interactive elements

## Mobile Optimization
- Touch targets: Minimum 44px height
- Simplified navigation: Hamburger menu
- Single-column layouts below md breakpoint
- Larger tap areas for cart interactions
- Bottom navigation consideration for key actions

---

**Design Philosophy**: Create an appetizing, modern digital storefront that makes ordering poke bowls feel fresh, easy, and exciting. Every element should drive conversion while maintaining the vibrant, healthy brand identity of PokePao.