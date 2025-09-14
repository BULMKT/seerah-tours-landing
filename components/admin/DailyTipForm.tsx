'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Save, X, Eye, Loader2, AlertCircle, CheckCircle, ImageIcon, Tag } from 'lucide-react';
import type { DailyTip } from '@/lib/supabase';
import FileUpload from './FileUpload';

interface DailyTipFormProps {
  tip?: DailyTip | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tip: any) => Promise<void>;
}

const CATEGORIES = [
  'Preparation', 'Spiritual', 'Logistics', 'Health', 'Duas', 'General'
];

const COMMON_TAGS = [
  'Packing', 'Preparation', 'Checklist', 'Spiritual', 'Duas', 'Rituals', 
  'Health', 'Medical', 'Safety', 'Complete Guide', 'Workshop', 'Tips'
];

export default function DailyTipForm({ tip, isOpen, onClose, onSave }: DailyTipFormProps) {
  const [formData, setFormData] = useState({
    title: tip?.title || '',
    description: tip?.description || '',
    imageUrl: tip?.image_url || '',
    category: tip?.category || 'General',
    tags: tip?.tags || [],
    isActive: tip?.is_active !== false
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
      if (!formData.imageUrl.trim()) {
        throw new Error('Image URL is required');
      }

      const tipData = {
        ...formData,
        id: tip?.id
      };

      await onSave(tipData);
      setSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tip');
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

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.imageUrl.trim();

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
                  {tip ? '✏️ Edit Daily Tip' : '➕ Add New Daily Tip'}
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
                      Daily tip saved successfully! 🎉
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
                    📝 Tip Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Essential Hajj Packing Checklist"
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
                    placeholder="Provide a helpful description that explains what this tip covers..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500 resize-none"
                    disabled={loading}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    🖼️ Upload Image *
                  </label>
                  <FileUpload
                    type="image"
                    currentFile={formData.imageUrl}
                    onUpload={(fileUrl) => handleInputChange('imageUrl', fileUrl)}
                    placeholder="Upload image for your daily tip"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    📂 Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                    disabled={loading}
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

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
                        {tip ? 'Update Tip' : 'Create Tip'}
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