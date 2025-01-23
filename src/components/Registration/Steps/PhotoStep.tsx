import { useState } from 'react';
import { Camera, ArrowLeft, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { photoSchema, PhotoData } from '../../../types/registration';
import ImageCropper from '../../Common/ImageCropper';

interface PhotoStepProps {
  onNext: (data: PhotoData) => void;
  onPrevious: () => void;
}

export default function PhotoStep({ onNext, onPrevious }: PhotoStepProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const { handleSubmit, formState: { errors }, setValue } = useForm<PhotoData>({
    resolver: zodResolver(photoSchema)
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

      setValue('photo', file);
      setSelectedImage(croppedImageUrl);
      setShowCropper(false);

      // Auto submit after crop
      onNext({ photo: file });
    } catch (error) {
      console.error('Error processing cropped image:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(() => { })} className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 border border-white flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-500" />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleImageSelect}
            />
            <Camera className="w-5 h-5 text-gray-600" />
          </label>
        </div>
        {errors.photo && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.photo.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onPrevious}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>
        <button
          type="button"
          onClick={() => document.querySelector('input[type="file"]')?.click()}
          className="w-full bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-[#02bde8] hover:to-[#13db63] text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-[-1px] hover:shadow-lg"
        >
          {selectedImage ? 'Alterar Foto' : 'Selecionar'}
        </button>
      </div>

      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </form>
  );
}