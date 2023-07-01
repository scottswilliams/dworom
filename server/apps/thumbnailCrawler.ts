import axios from 'axios';
import { load } from 'cheerio';
import { Pool } from 'pg';
import sharp from 'sharp';

export async function thumbnailCrawler(url: string, pool: Pool) {
    try {
        const response = await axios.get(url);
        const baseUrl = response.request.res.responseUrl; // Get base URL from the response
        const html = response.data;

        const $ = load(html);
        let bestImageUrl: string | undefined = undefined;
        let bestScore = 0;

        $('img').each((_index, element) => {
            let imageUrl = $(element).attr('src');
            const width = parseInt($(element).attr('width') || '0', 10);
            const height = parseInt($(element).attr('height') || '0', 10);
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = new URL(imageUrl, baseUrl).href;
            }
            
            // Ignore images that are likely to be icons or very small
            if (width < 50 || height < 50) {
                return;
            }

            // Calculate a "score" for this image
            let score = 0;

            if (width > 100 || height > 100) {
                score += 10;
            }

            // Favor images with a "normal" aspect ratio (between 0.5 and 2)
            const aspectRatio = width / height;
            if (aspectRatio > 0.5 && aspectRatio < 2) {
                score += 20;
            }

            // Update if this score is the best we've seen
            if (score > bestScore) {
                bestScore = score;
                bestImageUrl = imageUrl;
            }
        });



        if (bestImageUrl) {
            // Download the image
            const imageResponse = await axios.get(bestImageUrl, { responseType: 'arraybuffer' });

            // Resize the image to 50x50 px
            const thumbnailBuffer = await sharp(imageResponse.data).resize(50, 50).toBuffer();

            // Save the thumbnail to the database
            return thumbnailBuffer;
        } else {
            console.log('No images found');
        }
    } catch (error) {
        console.error(error);
    }

    return null;
}