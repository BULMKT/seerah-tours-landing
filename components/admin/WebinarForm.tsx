'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Eye, Loader2, AlertCircle, CheckCircle, Video, ExternalLink, Play } from 'lucide-react';
import type { Webinar } from '@/lib/supabase';
import { extractYoutubeId, getYoutubeThumbnail } from '@/lib/supabase';

interface WebinarFormProps {
  webinar?: Webinar | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (webinar: any) => Promise<void>;
}

const COMMON_TAGS = [
  'Complete Guide', 'Workshop', 'Preparation', 'Health', 'Safety', 'Medical',
  'Spiritual', 'Duas', 'Rituals', 'Logistics', 'Tips', 'Q&A', 'Live Session'
];

export default function WebinarForm({ webinar, isOpen, onClose, onSave }: WebinarFormProps) {
  const [formData, setFormData] = useState({
    title: webinar?.title || '',
    description: webinar?.description || '',
    youtubeUrl: webinar?.youtube_url || '',
    duration: webinar?.duration || '',
    tags: webinar?.tags || [],
    isActive: webinar?.is_active !== false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [youtubePreview, setYoutubePreview] = useState<{ id: string; thumbnail: string } | null>(null);

  // Extract YouTube info when URL changes
  useEffect(() => {
    if (formData.youtubeUrl) {
      const youtubeId = extractYoutubeId(formData.youtubeUrl);
      if (youtubeId) {
        setYoutubePreview({
          id: youtubeId,
          thumbnail: getYoutubeThumbnail(youtubeId)
        });
      } else {
        setYoutubePreview(null);
      }
    } else {
      setYoutubePreview(null);
    }
  }, [formData.youtubeUrl]);

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
      if (!formData.youtubeUrl.trim()) {
        throw new Error('YouTube URL is required');
      }

      // Validate YouTube URL
      const youtubeId = extractYoutubeId(formData.youtubeUrl);
      if (!youtubeId) {
        throw new Error('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)');
      }

      const webinarData = {
        ...formData,
        id: webinar?.id
      };

      await onSave(webinarData);
      setSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save webinar');
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

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.youtubeUrl.trim();

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
            className="bg-primary rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-bold text-white">
                  {webinar ? '🎥 Edit Webinar' : '➕ Add New Webinar'}
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
                      Webinar saved successfully! 🎉
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
                    📝 Webinar Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Complete Hajj Preparation Workshop"
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
                    placeholder="Describe what viewers will learn in this webinar..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500 resize-none"
                    disabled={loading}
                  />
                </div>

                {/* YouTube URL */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    🎥 YouTube URL *
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.youtubeUrl}
                        onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                        className="flex-1 px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500"
                        disabled={loading}
                      />
                      {youtubePreview && (
                        <a
                          href={formData.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View
                        </a>
                      )}
                    </div>
                    
                    {youtubePreview && (
                      <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Video className="w-4 h-4 text-accent" />
                          <span className="text-white text-sm font-semibold">YouTube Preview:</span>
                          <span className="text-accent text-sm">ID: {youtubePreview.id}</span>
                        </div>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                          <img 
                            src={youtubePreview.thumbnail} 
                            alt="YouTube thumbnail" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-white text-sm opacity-70">
                      💡 <strong>Tip:</strong> You can use any YouTube URL format:
                      <ul className="mt-1 ml-4 space-y-1">
                        <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                        <li>• https://youtu.be/VIDEO_ID</li>
                        <li>• https://www.youtube.com/embed/VIDEO_ID</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    ⏱️ Duration (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 1:45:30 or 45 minutes"
                    className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500"
                    disabled={loading}
                  />
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
                        {webinar ? 'Update Webinar' : 'Create Webinar'}
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