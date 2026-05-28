import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { configureCloudinary } from './cloudinary.config';

@Injectable()
export class UploadService {
  private cloudinary = configureCloudinary(new ConfigService());

  async uploadImage(file: any) {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'nutricare' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    return {
      imageUrl: (uploadResult as any).secure_url,
      publicId: (uploadResult as any).public_id,
    };
  }
}