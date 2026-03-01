import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const HOMEPAGE_IMAGES_DIR = path.resolve('public/images/homepage');
const TARGET_WIDTHS = [400, 800];
const QUALITY = 82;

function isBaseWebp(fileName) {
    return (
        fileName.toLowerCase().endsWith('.webp') &&
        !fileName.toLowerCase().match(/-\d+w\.webp$/)
    );
}

function collectBaseImages(dirPath, output = []) {
    if (!fs.existsSync(dirPath)) {
        return output;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            collectBaseImages(fullPath, output);
            continue;
        }

        if (entry.isFile() && isBaseWebp(entry.name)) {
            output.push(fullPath);
        }
    }

    return output;
}

async function generateVariant(sourcePath, width) {
    const ext = path.extname(sourcePath);
    const variantPath = sourcePath.replace(ext, `-${width}w${ext}`);

    if (fs.existsSync(variantPath)) {
        return { created: false, path: variantPath };
    }

    await sharp(sourcePath)
        .resize({
            width,
            withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(variantPath);

    return { created: true, path: variantPath };
}

async function main() {
    const sources = collectBaseImages(HOMEPAGE_IMAGES_DIR);

    if (sources.length === 0) {
        console.log('[images] No base homepage WebP files found.');
        return;
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const sourcePath of sources) {
        for (const width of TARGET_WIDTHS) {
            const result = await generateVariant(sourcePath, width);

            if (result.created) {
                createdCount += 1;
                console.log(`[images] Created ${path.relative(process.cwd(), result.path)}`);
            } else {
                skippedCount += 1;
            }
        }
    }

    console.log(
        `[images] Done. created=${createdCount}, skipped=${skippedCount}, sources=${sources.length}`,
    );
}

main().catch((error) => {
    console.error('[images] Failed to generate responsive variants.');
    console.error(error);
    process.exitCode = 1;
});