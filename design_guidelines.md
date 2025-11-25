# Design Guidelines for प्राजक्तप्रभा Blog

## Design Approach
**Reference-Based Approach** drawing inspiration from Medium's content-first design, Instagram's visual grid aesthetics, and creative portfolio sites like Cargo. The design celebrates Marathi creative expression through generous whitespace, photography-forward layouts, and elegant typography that honors both Devanagari and Latin scripts.

## Typography System

**Font Families:**
- Primary (Marathi/Devanagari): 'Noto Sans Devanagari' (Google Fonts)
- Secondary (English): 'Inter' (Google Fonts)
- Accent (Headings): 'Tiro Devanagari Marathi' or 'Mukta' for decorative Marathi text

**Hierarchy:**
- Site Title: 48px (mobile), 72px (desktop), bold, tracking-tight
- Tagline/Subtitle: 16px (mobile), 20px (desktop), regular weight, line-height 1.6
- Navigation: 16px, medium weight
- Card Titles: 20px (mobile), 24px (desktop), semibold
- Body Text: 16px, regular, line-height 1.7
- Metadata/Tags: 14px, medium weight
- Post Content: 18px, line-height 1.8 for optimal Devanagari readability

## Layout System

**Spacing Units:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 (p-4, mb-8, gap-6, etc.)

**Container Strategy:**
- Max-width: 1280px for main content
- Card grid container: max-w-6xl
- Single post content: max-w-3xl (optimal reading width)
- Section padding: py-12 (mobile), py-20 (desktop)

**Grid Specifications:**
- Home/Category Pages: `grid grid-cols-1 md:grid-cols-2 gap-8`
- Tag Cloud: `flex flex-wrap gap-3`
- Social Icons: `flex gap-6`

## Component Library

### Header/Navigation
**Sticky header with two-section layout:**
- Top section: Site title centered, tagline below, social icons row (Instagram/YouTube/Facebook with recognizable brand icons)
- Navigation bar: Category tabs in horizontal row, search box aligned right
- Mobile: Hamburger menu, collapsible navigation
- Height: 120px (desktop), auto (mobile)
- Spacing: pt-6 pb-4 between title and nav, px-8 horizontal padding

### Content Cards
**Medium-inspired card design:**
- Aspect ratio for thumbnail: 16:9 or 4:3
- Card structure: Image top (full-width), content section with padding p-6
- Rounded corners: rounded-lg
- Shadow: shadow-md, hover:shadow-xl transition
- Card interior: Category badge (top), title (mb-2), excerpt (mb-4, text clamp 3 lines), metadata row (tags + date)
- Spacing between cards: gap-8

### Photo Slideshow/Carousel
**Hero-style carousel on home page:**
- Full-width section: w-full, height: 400px (mobile), 600px (desktop)
- Slides: Large format photos with subtle gradient overlay on bottom third
- Overlay content: Small caption text, Instagram link icon (positioned bottom-right)
- Controls: Subtle arrow buttons (sides), dot indicators (bottom-center)
- Auto-play: 5-second interval, pause on hover
- Position: Below header, above content grid (first section on home)

### Single Post Layout
**Reading-optimized layout:**
- Hero area: Featured image (if available), full-width, max-height 500px, object-fit cover
- Content container: max-w-3xl, centered, px-6 md:px-8
- Post header: Category badge, title (mb-4), metadata bar (date, tags in pill format, reading time estimate)
- Content body: Generous line-height, mb-6 between paragraphs
- Social share bar: Sticky on desktop (right side), floating buttons (Facebook/Twitter/WhatsApp icons)
- Bottom section: "Back to [Category]" link, "More from [Category]" suggestions (3 cards in row)

### Tag Pills & Badges
- Tag pills: Rounded-full, px-4 py-1.5, inline-flex, clickable with hover lift
- Category badges: Rounded-md, px-3 py-1, uppercase, tracking-wide, text-xs

### Search Box
- Input field: Rounded-lg, px-4 py-2, border, focus ring
- Icon: Magnifying glass SVG (left-aligned inside input)
- Width: w-full (mobile), w-64 (desktop)
- Position: In navigation bar (desktop), expandable (mobile)

### About Section
**Two-column layout (desktop), stacked (mobile):**
- Left: Headshot or creative photo (rounded-xl, max-w-sm)
- Right: Biography text (mb-6), "Contact Me" button
- Background: Subtle gradient or solid with generous padding (py-16)

### Pagination Controls
- "View More" button: Centered, rounded-lg, px-8 py-3, prominent size
- Loading state: Skeleton cards (shimmer effect)
- Disabled state: Reduced opacity

### Social Media Section
**Dedicated social hub area (in footer or sidebar):**
- Three columns: Instagram | YouTube | Facebook
- Each column: Platform icon, thumbnail preview, follower count placeholder, "Follow" link
- Layout: flex or grid-cols-3, gap-8

## Images

**Image Strategy:**

1. **Hero Carousel Images (5-7 photos):**
   - Lifestyle/dance performance shots showcasing the creator
   - Dimensions: 1920x1080px minimum
   - Treatment: Subtle vignette, bottom gradient for text overlay
   - Each linked to corresponding Instagram post

2. **Content Thumbnails:**
   - Poetry: Abstract Devanagari calligraphy, nature imagery
   - Articles: Personal photos, nostalgic themes
   - Ukhane: Traditional Marathi cultural imagery
   - Dimensions: 800x600px minimum

3. **About Section:**
   - Professional/creative portrait of the creator
   - Dimensions: 600x600px (square) or 800x1000px (portrait)

4. **Social Platform Thumbnails:**
   - Actual screenshots or placeholder branded images
   - Dimensions: 300x300px per platform

5. **Placeholder Strategy:**
   - Use subtle gradients with Devanagari typography for missing images
   - Ensure all images have descriptive alt text in Marathi and English

## Accessibility Features
- ARIA labels for navigation, carousel controls, and search
- Skip-to-content link
- Focus indicators with high contrast rings
- Semantic HTML: `<article>`, `<nav>`, `<main>`, `<aside>`
- Lang attributes: `lang="mr"` for Marathi sections, `lang="en"` for English
- Keyboard navigation for carousel and pagination

## Animations
**Minimal, purposeful animations:**
- Card hover: Gentle lift (translateY(-4px)), shadow expansion
- Carousel transitions: Smooth fade or slide (0.5s ease)
- Page load: Subtle fade-in for content cards (stagger by 100ms)
- No distracting scroll-triggered animations

## Key Design Principles
1. **Devanagari Excellence:** Prioritize readability and beauty of Marathi script through proper line-height and font selection
2. **Breathing Room:** Never crowd content - generous margins create sophisticated feel
3. **Photography-Forward:** Let images tell the story, use them generously
4. **Cultural Authenticity:** Design elements should honor Marathi creative traditions while feeling modern
5. **Mobile-First Responsiveness:** Ensure flawless single-column mobile experience before enhancing for desktop