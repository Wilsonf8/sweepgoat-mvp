import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, X } from 'lucide-react';
import api from '../services/api';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  error?: string;
}

export function ImageUpload({ onImageUploaded, error }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setUploadError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Initialize crop to 16:9 when image loads
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    // Calculate 16:9 crop
    const aspectRatio = 16 / 9;
    let cropWidth = width;
    let cropHeight = width / aspectRatio;

    // If height is too small, adjust based on height
    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = height * aspectRatio;
    }

    const cropX = (width - cropWidth) / 2;
    const cropY = (height - cropHeight) / 2;

    setCrop({
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x: cropX,
      y: cropY,
    });
  };

  // Generate cropped image blob
  const getCroppedImg = async (): Promise<Blob | null> => {
    if (!completedCrop || !imgRef.current) return null;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas to 1920x1080 (16:9 HD)
    const targetWidth = 1920;
    const targetHeight = 1080;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/jpeg',
        0.9
      );
    });
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !completedCrop) return;

    setIsUploading(true);
    setUploadError('');

    try {
      // Get cropped image blob
      const croppedBlob = await getCroppedImg();
      if (!croppedBlob) {
        throw new Error('Failed to crop image');
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', croppedBlob, selectedFile.name);

      // Upload to backend
      const response = await api.post('/api/host/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Success - call parent callback with image URL
      onImageUploaded(response.data.imageUrl);

      // Reset state
      setSelectedFile(null);
      setImageSrc('');
      setCrop({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      });
      setCompletedCrop(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to upload image. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedFile(null);
    setImageSrc('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
        Giveaway Image <span className="text-red-400">*</span>
      </label>

      {/* File Input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Messages */}
      {(uploadError || error) && (
        <div className="mb-4 p-4 border border-red-500 bg-red-500/10 rounded">
          <p className="text-sm text-red-400 font-light">{uploadError || error}</p>
        </div>
      )}

      {!imageSrc ? (
        /* Upload Button */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-zinc-800 rounded-lg p-12 flex flex-col items-center justify-center hover:border-zinc-700 transition-colors"
        >
          <Upload className="w-12 h-12 text-zinc-500 mb-4" strokeWidth={1.5} />
          <p className="text-sm font-light text-white mb-2">
            Click to upload giveaway image
          </p>
          <p className="text-xs font-light text-zinc-500">
            16:9 aspect ratio • Max 5MB • JPEG, PNG, or WebP
          </p>
        </button>
      ) : (
        /* Crop Tool */
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-light text-white">
                Adjust the crop area to select your image (16:9 ratio)
              </p>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={16 / 9}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-w-full h-auto"
              />
            </ReactCrop>
          </div>

          {/* Upload Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !completedCrop}
              className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-zinc-800 text-white hover:bg-zinc-700 rounded transition-colors text-sm font-light"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs font-light text-zinc-500">
            Final image will be optimized to 1920x1080px (Full HD)
          </p>
        </div>
      )}
    </div>
  );
}