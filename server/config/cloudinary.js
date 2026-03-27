import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
        api_key: process.env.CLOUDINARY_CLIENT_API_KEY,
        api_secret: process.env.CLOUDINARY_CLIENT_API_SECRET,
    });
};

export const uploadBufferToCloudinary = (buffer, folder = "dsa_dude_pdfs") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image', // Use 'image' for PDFs so they can be viewed inline and transformed
                folder: folder,
                format: 'pdf'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        // End the stream with the buffer data
        uploadStream.end(buffer);
    });
};
