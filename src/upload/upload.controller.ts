import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image file to Cloudinary' })
  @ApiResponse({
    status: 201, description: 'Image uploaded successfully.', schema: {
      example: { imageUrl: 'https://res.cloudinary.com/.../image.jpg', publicId: 'nutricare/abc123' }
    }
  })
  async uploadImage(@UploadedFile() file: any) {
    return this.uploadService.uploadImage(file);
  }
}