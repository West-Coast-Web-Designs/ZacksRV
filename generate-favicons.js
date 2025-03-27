const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = './src/assets/images/PFav.png';
const outputDir = './src/assets/favicons';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Define favicon sizes and outputs
const favicons = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 384, name: 'android-chrome-384x384.png' },
    { size: 150, name: 'mstile-150x150.png' }
];

async function generateFavicons() {
    try {
        // Generate each favicon size
        for (const favicon of favicons) {
            await sharp(sourceImage)
                .resize(favicon.size, favicon.size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toFile(path.join(outputDir, favicon.name));
            
            console.log(`Generated ${favicon.name}`);
        }

        // Generate ICO file (16x16 and 32x32 combined)
        const ico16 = await sharp(sourceImage)
            .resize(16, 16, { fit: 'contain' })
            .png()
            .toBuffer();
        
        const ico32 = await sharp(sourceImage)
            .resize(32, 32, { fit: 'contain' })
            .png()
            .toBuffer();

        // Write the ICO file
        fs.writeFileSync(path.join(outputDir, 'favicon.ico'), Buffer.concat([ico16, ico32]));
        console.log('Generated favicon.ico');

        console.log('All favicons generated successfully!');
    } catch (error) {
        console.error('Error generating favicons:', error);
    }
}

// Update the site.webmanifest file
const manifest = {
    "name": "Parson's Mobile Service",
    "short_name": "Parson's RV",
    "icons": [
        {
            "src": "/assets/favicons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/assets/favicons/android-chrome-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
        }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
};

fs.writeFileSync(
    path.join(outputDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
);

// Update browserconfig.xml
const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/assets/favicons/mstile-150x150.png"/>
            <TileColor>#da532c</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

fs.writeFileSync(
    path.join(outputDir, 'browserconfig.xml'),
    browserconfig
);

// Run the favicon generation
generateFavicons(); 