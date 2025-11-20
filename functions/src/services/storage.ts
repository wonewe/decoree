import * as admin from "firebase-admin";
import axios from "axios";

const bucket = admin.storage().bucket();

/**
 * Download image from KOPIS and upload to Firebase Storage
 * @param {string} imageUrl - KOPIS image URL
 * @param {string} eventId - Event ID for filename
 * @return {Promise<string>} Public URL of uploaded image
 */
export const uploadKopisImage = async (
  imageUrl: string,
  eventId: string
): Promise<string> => {
  try {
    // Download image from KOPIS
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KopisBot/1.0)",
      },
    });

    // Determine file extension from URL or content-type
    const contentType = response.headers["content-type"] || "image/jpeg";
    const extension = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)?.[1] || "jpg";
    const filename = `kopis-posters/${eventId}.${extension}`;

    // Upload to Firebase Storage
    const file = bucket.file(filename);
    await file.save(Buffer.from(response.data), {
      metadata: {
        contentType: contentType,
        metadata: {
          source: "kopis",
          originalUrl: imageUrl,
        },
      },
    });

    // Make file publicly accessible
    await file.makePublic();

    // Return public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    console.log(`Uploaded image for ${eventId}: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`Failed to upload image for ${eventId}:`, error);
    // Return original URL as fallback
    return imageUrl;
  }
};
