const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDirectory = './src/assets/images';
const outputDirectory = './public/assets/images';

// Screen size breakpoints - optimized for common device widths
const breakpoints = {
    mobile: 600,    // Small mobile devices 
    tablet: 1024,   // Tablets and medium devices
    desktop: 1920   // Desktop and large screens
};

// Image quality settings - balanced for quality vs file size
const quality = {
    jpeg: 80,    // Good quality with reasonable compression
    webp: 75,    // WebP can maintain good quality at lower settings
    avif: 65,    // AVIF provides better compression at lower quality settings
    png: 80      // PNGs need higher quality for text/UI elements
};

// Process each image into responsive formats
async function processImage(inputPath) {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const ext = path.extname(inputPath).toLowerCase();
    const originalFormat = ext.replace('.', '');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    try {
        const metadata = await sharp(inputPath).metadata();
        const originalWidth = metadata.width;

        // If the image is a PNG with transparency or suitable for SVG conversion
        const isPNG = originalFormat === 'png';
        const isJPEG = originalFormat === 'jpg' || originalFormat === 'jpeg';
        
        // Process images for different screen sizes
        const sizeVariants = [
            { 
                name: '-m', 
                width: Math.min(breakpoints.mobile, originalWidth),
                withoutEnlargement: true 
            },
            { 
                name: '-t', 
                width: Math.min(breakpoints.tablet, originalWidth),
                withoutEnlargement: true 
            },
            { 
                name: '', 
                width: Math.min(breakpoints.desktop, originalWidth),
                withoutEnlargement: true 
            }
        ];

        // Process each size variant
        for (const size of sizeVariants) {
            // Skip if the original image is smaller than this size variant
            if (originalWidth <= size.width * 0.8) continue;

            // Base sharp instance for this size
            const resized = sharp(inputPath)
                .resize(size.width, null, { 
                    withoutEnlargement: size.withoutEnlargement,
                    fit: 'inside'
                });

            // WebP version (best for most browsers)
            await resized
                .clone()
                .webp({ quality: quality.webp })
                .toFile(`${outputDirectory}/${filename}${size.name}.webp`);

            // AVIF version (best compression but less support)
            try {
                await resized
                    .clone()
                    .avif({ quality: quality.avif })
                    .toFile(`${outputDirectory}/${filename}${size.name}.avif`);
            } catch (e) {
                console.log(`AVIF conversion failed for ${filename}, skipping: ${e.message}`);
            }

            // Original format version (as fallback)
            if (isPNG) {
                await resized
                    .clone()
                    .png({ quality: quality.png })
                    .toFile(`${outputDirectory}/${filename}${size.name}.png`);
            } else if (isJPEG) {
                await resized
                    .clone()
                    .jpeg({ quality: quality.jpeg })
                    .toFile(`${outputDirectory}/${filename}${size.name}.jpg`);
            }
        }

        console.log(`Processed ${filename} - created ${sizeVariants.length * 3} variants`);
    } catch (error) {
        console.error(`Error processing ${filename}:`, error);
    }
}

// Helper function to only process image files
function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

// Process all images in directory
async function processAllImages() {
    console.log('Starting batch image optimization...');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }
    
    try {
        const files = fs.readdirSync(imageDirectory);
        const imageFiles = files.filter(file => isImageFile(file));
        
        console.log(`Found ${imageFiles.length} images to process`);
        
        for (const file of imageFiles) {
            await processImage(path.join(imageDirectory, file));
        }
        
        console.log('Image optimization complete!');
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

// Create an optimized version of a specific image
async function optimizeImage(inputPath, outputPath, options = {}) {
    const defaultOptions = {
        width: null,
        height: null,
        quality: 80,
        format: 'webp'
    };
    
    const opts = { ...defaultOptions, ...options };
    
    try {
        let image = sharp(inputPath);
        
        // Resize if dimensions provided
        if (opts.width || opts.height) {
            image = image.resize(opts.width, opts.height, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }
        
        // Convert to specified format
        switch (opts.format) {
            case 'webp':
                image = image.webp({ quality: opts.quality });
                break;
            case 'avif':
                image = image.avif({ quality: opts.quality });
                break;
            case 'jpg':
            case 'jpeg':
                image = image.jpeg({ quality: opts.quality });
                break;
            case 'png':
                image = image.png({ quality: opts.quality });
                break;
        }
        
        await image.toFile(outputPath);
        console.log(`Optimized image saved to ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`Error optimizing image:`, error);
        return false;
    }
}

// Export functions
module.exports = {
    processImage,
    processAllImages,
    optimizeImage
}; 