# Image Optimization Guide

This guide explains how to optimize images on the website for better performance across all devices.

## Quick Start

1. **Add images to the source directory**: Place your original images in `src/assets/images/`.
2. **Run the optimization script**: `npm run optimize-images`
3. **Use the optimized image component in your templates**: 
   ```html
   {% include "components/optimized-image.html",
       src: "image-name.jpg", 
       alt: "Alt text description",
       width: 1200,
       height: 800,
       loading: "lazy",
       sizes: "(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
   %}
   ```

## How It Works

Our image optimization system:

1. Creates multiple versions of each image at different resolutions:
   - Mobile: 600px width
   - Tablet: 1024px width
   - Desktop: 1920px width

2. Converts images to modern formats with appropriate fallbacks:
   - AVIF: Best compression, newer browsers
   - WebP: Good compression, wide browser support
   - Original format (JPG/PNG): Maximum compatibility

3. Applies proper lazy loading and provides fade-in effects for a better user experience

4. Uses responsive techniques to serve the right image size to each device based on screen size

## Image Component Parameters

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `src` | Image filename with extension | - | Yes |
| `alt` | Alt text for accessibility | - | Yes |
| `width` | Original image width (should be 2x display size) | - | Yes |
| `height` | Original image height (should be 2x display size) | - | Yes |
| `loading` | "lazy" or "eager" (use eager for above-the-fold images) | "lazy" | No |
| `sizes` | Responsive sizes attribute | "100vw" | No |
| `class` | CSS classes for the img element | "" | No |
| `pictureClass` | CSS classes for the picture element | "" | No |

## Best Practices for Image Optimization

1. **Use descriptive filenames**: Name your images with descriptive, hyphenated names (e.g., "rv-slide-repair.jpg" instead of "IMG12345.jpg").

2. **Provide proper dimensions**: Always specify the correct width and height attributes to prevent layout shifts.

3. **Use appropriate sizes attribute**: The `sizes` attribute helps browsers determine which image size to download. Examples:
   - Full-width image: `"100vw"`
   - Half-width on desktop, full on mobile: `"(max-width: 600px) 100vw, 50vw"`
   - Variable width based on breakpoints: `"(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"`

4. **Set loading attribute appropriately**:
   - Use `loading="eager"` for above-the-fold images (visible without scrolling)
   - Use `loading="lazy"` (default) for all other images

5. **Optimize source images**: Before adding to the project, optimize your source images:
   - Use appropriate dimensions (no larger than 2x display size)
   - Remove unnecessary metadata
   - Use JPG for photos and complex images
   - Use PNG for images with transparency or simple graphics
   - Consider using SVG for icons and simple graphics

## CSS Helper Classes

These CSS helper classes are available for common image use cases:

- `.hero-image`: For full-width hero/banner images
- `.cs-background-img`: For background images in cards/sections
- `.about-image`: For images in the about section
- `.cta-image`: For call-to-action background images
- `.sbs-image`: For side-by-side images

## Implementation in Different Page Components

### Hero Images
```html
{% include "components/optimized-image.html", 
    src: "Road.jpg",
    alt: "RV on beach",
    width: 1800,
    height: 1200,
    loading: "eager",
    sizes: "100vw",
    pictureClass: "cs-picture",
    class: "hero-image"
%}
```

### Service Cards
```html
{% include "components/optimized-image.html", 
    src: "service-image.jpg",
    alt: "Service description",
    width: 610,
    height: 610,
    loading: "lazy",
    sizes: "(max-width: 600px) 100vw, 305px",
    pictureClass: "cs-background",
    class: "cs-background-img"
%}
```

### CTA Background
```html
{% include "components/optimized-image.html", 
    src: "cta-background.jpg",
    alt: "Call to action",
    width: 2500,
    height: 1667,
    loading: "lazy",
    sizes: "100vw",
    pictureClass: "cta-background",
    class: "cta-image"
%}
```

## Troubleshooting

If images aren't optimizing properly:

1. Check that the image exists in the `src/assets/images/` directory
2. Make sure you're using the correct filename with extension in the `src` parameter
3. Run `npm run optimize-images` to generate optimized versions
4. Check the browser console for any errors
5. Verify that the width and height attributes are correctly specified

## Technical Details

The optimized image system uses Sharp via the `@codestitchofficial/eleventy-plugin-sharp-images` plugin configured in `.eleventy.js`. The configuration specifies:

- Three image sizes (600px, 1024px, 1920px) to cover different device needs
- Three formats (original, WebP, AVIF) for browser compatibility and performance
- Quality settings that balance visual quality and file size

The optimization happens during the build process when you run:
```
npm run optimize-images
```

## Examples from the Website

Here are examples of optimized images used throughout the site:

1. **Hero Image on Home Page**: Full-width background image with eager loading
2. **Service Cards**: Optimized background images for services section
3. **About Page Side-by-Side Images**: Responsive images that adjust to screen size
4. **CTA Section Background**: Full-width background with overlay for better text readability
