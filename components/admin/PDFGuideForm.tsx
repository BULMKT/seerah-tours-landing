'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Save, X, Eye, Loader2, AlertCircle, CheckCircle, FileText, ExternalLink, Download } from 'lucide-react';
import type { PDFGuide } from '@/lib/supabase';
import FileUpload from './FileUpload';

interface PDFGuideFormProps {
  guide?: PDFGuide | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (guide: any) => Promise<void>;
}

const COMMON_TAGS = [
  'Complete Guide', 'Checklist', 'Preparation', 'Health', 'Safety', 'Medical',
  'Spiritual', 'Duas', 'Rituals', 'Logistics', 'Tips', 'Essential', 'Beginner'
];

export default function PDFGuideForm({ guide, isOpen, onClose, onSave }: PDFGuideFormProps) {
  const [formData, setFormData] = useState({
    title: guide?.title || '',
    description: guide?.description || '',
    pdfUrl: guide?.pdf_url || '',
    thumbnailUrl: guide?.thumbnail_url || '',
    fileSize: guide?.file_size || '',
    tags: guide?.tags || [],
    isActive: guide?.is_active !== false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.pdfUrl.trim()) {
        throw new Error('PDF URL is required');
      }

      // Basic URL validation
      try {
        new URL(formData.pdfUrl);
      } catch {
        throw new Error('Please enter a valid PDF URL');
      }

      const guideData = {
        ...formData,
        id: guide?.id
      };

      await onSave(guideData);
      setSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save PDF guide');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tagToAdd: string) => {
    const tag = tagToAdd.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.pdfUrl.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-primary rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-bold text-white">
                  {guide ? '📄 Edit PDF Guide' : '➕ Add New PDF Guide'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">
                      PDF guide saved successfully! 🎉
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    📝 Guide Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Complete Hajj Preparation Checklist"
                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500"
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    📋 Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what this PDF guide covers and how it helps pilgrims..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500 resize-none"
                    disabled={loading}
                  />
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    📄 Upload PDF Guide *
                  </label>
                  <FileUpload
                    type="pdf"
                    currentFile={formData.pdfUrl}
                    onUpload={(fileUrl, fileData) => {
                      handleInputChange('pdfUrl', fileUrl);
                      if (fileData?.fileSize) {
                        handleInputChange('fileSize', fileData.fileSize);
                      }
                    }}
                    placeholder="Upload your PDF guide"
                  />
                  <div className="text-white text-sm opacity-70 mt-2">
                    💡 <strong>Tip:</strong> Upload PDF files directly from your computer - no need for external links!
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    🖼️ Upload Thumbnail (Optional)
                  </label>
                  <FileUpload
                    type="image"
                    currentFile={formData.thumbnailUrl}
                    onUpload={(fileUrl) => handleInputChange('thumbnailUrl', fileUrl)}
                    placeholder="Upload a thumbnail image for your PDF"
                  />
                </div>

                {/* File Size - Auto-filled by upload */}
                {formData.fileSize && (
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      📏 File Size
                    </label>
                    <div className="px-4 py-3 bg-white bg-opacity-10 rounded-lg text-white">
                      {formData.fileSize}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    🏷️ Tags
                  </label>
                  
                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Tag */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add custom tag..."
                      className="flex-1 px-3 py-2 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(newTag);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addTag(newTag)}
                      disabled={!newTag.trim()}
                      className="px-4 py-2 bg-accent hover:bg-opacity-80 disabled:bg-opacity-50 text-primary font-semibold rounded-lg transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>

                  {/* Quick Tags */}
                  <div>
                    <div className="text-white text-sm opacity-70 mb-2">Quick add:</div>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_TAGS.filter(tag => !formData.tags.includes(tag)).map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded text-xs transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="w-5 h-5 text-accent bg-white border-gray-300 rounded focus:ring-accent focus:ring-2"
                      disabled={loading}
                    />
                    <span className="text-white font-semibold">
                      ✅ Active (visible to users)
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="flex-1 bg-accent hover:bg-opacity-90 disabled:bg-opacity-50 text-primary font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {guide ? 'Update Guide' : 'Create Guide'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}