'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  accept?: string;
  onUpload: (fileUrl: string, fileData: any) => void;
  currentFile?: string;
  type: 'image' | 'pdf';
  placeholder?: string;
}

export default function FileUpload({ 
  accept = "*/*", 
  onUpload, 
  currentFile, 
  type,
  placeholder = "Click or drag files here"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(currentFile || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUploadedFile(result.fileUrl);
        onUpload(result.fileUrl, result);
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    onUpload('', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getIcon = () => {
    if (type === 'image') return <ImageIcon className="w-8 h-8" />;
    if (type === 'pdf') return <FileText className="w-8 h-8" />;
    return <Upload className="w-8 h-8" />;
  };

  const getAcceptTypes = () => {
    if (type === 'image') return 'image/*';
    if (type === 'pdf') return 'application/pdf';
    return accept;
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative group"
          >
            {type === 'image' ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-accent bg-accent bg-opacity-10">
                <img 
                  src={uploadedFile} 
                  alt="Uploaded" 
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <div className="flex items-center text-white text-sm">
                    <Check className="w-4 h-4 mr-2" />
                    Image uploaded successfully
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-accent bg-accent bg-opacity-10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-700">
                    <FileText className="w-6 h-6 mr-3 text-accent" />
                    <div>
                      <div className="font-medium">PDF uploaded</div>
                      <div className="text-sm text-gray-500">{uploadedFile.split('/').pop()}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer
              ${isDragging 
                ? 'border-accent bg-accent bg-opacity-20 scale-105' 
                : 'border-gray-300 hover:border-accent hover:bg-accent hover:bg-opacity-5'
              }
              ${isUploading ? 'pointer-events-none opacity-75' : ''}
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptTypes()}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="text-center">
              <div className={`mx-auto mb-4 ${isDragging ? 'text-accent' : 'text-gray-400'}`}>
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                ) : (
                  getIcon()
                )}
              </div>
              
              <div className="text-lg font-medium text-gray-700 mb-2">
                {isUploading ? 'Uploading...' : placeholder}
              </div>
              
              <div className="text-sm text-gray-500">
                {type === 'image' 
                  ? 'PNG, JPG, JPEG, WebP up to 10MB'
                  : type === 'pdf'
                  ? 'PDF files up to 10MB'
                  : 'Drag and drop or click to browse'
                }
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}