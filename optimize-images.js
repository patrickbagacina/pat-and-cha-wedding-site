const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    const directories = [
        'assets/images/gallery/prenup',
        'assets/images/gallery/wedding_images'
    ];

    for (const dir of directories) {
        console.log(`Optimizing images in ${dir}...`);
        
        if (!fs.existsSync(dir)) {
            console.log(`Directory ${dir} does not exist, skipping...`);
            continue;
        }

        const files = fs.readdirSync(dir).filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file)
        );

        for (const file of files) {
            const inputPath = path.join(dir, file);
            const outputPath = path.join(dir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
            
            try {
                await sharp(inputPath)
                    .webp({ quality: 75 })
                    .toFile(outputPath);
                
                const originalSize = fs.statSync(inputPath).size;
                const optimizedSize = fs.statSync(outputPath).size;
                const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
                
                console.log(`  ✓ ${file} → ${path.basename(outputPath)} (${savings}% smaller)`);
            } catch (err) {
                console.error(`  ✗ Error processing ${file}:`, err.message);
            }
        }

        console.log(`Completed: ${dir}\n`);
    }
    
    console.log('All images optimized!');
}

optimizeImages().catch(err => {
    console.error('Error optimizing images:', err);
    process.exit(1);
});
