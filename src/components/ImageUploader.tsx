// ImageUploader component: Handles image file selection with drag-and-drop
import { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragAreaRef.current?.classList.add('drag-active');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragAreaRef.current?.classList.remove('drag-active');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragAreaRef.current?.classList.remove('drag-active');

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  return (
    <div
      ref={dragAreaRef}
      className="image-uploader"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="file-input"
      />
      <div className="uploader-content">
        <div className="uploader-icon">📸</div>
        <h3>Upload Retina Image</h3>
        <p>Drag and drop your image here, or click to select</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Select Image
        </button>
        <p className="uploader-hint">Supported formats: PNG, JPG, JPEG</p>
      </div>
    </div>
  );
}

export default ImageUploader;
