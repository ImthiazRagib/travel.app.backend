// import sharp from 'sharp';

// export async function processImage(
//   buffer: Buffer,
//   width = 1280,
//   quality = 75,
// ) {
//   return await sharp(buffer)
//     .resize({ width, withoutEnlargement: true }) // Prevent upscale
//     .jpeg({ quality, mozjpeg: true })            // High-quality compression
//     .toBuffer();
// }