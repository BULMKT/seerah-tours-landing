'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Settings, Users, BookOpen, Video, FileText, 
  Eye, Edit, Trash2, Loader2, RefreshCw, CheckCircle,
  AlertCircle, Search, Filter, Calendar, Tag, ExternalLink
} from 'lucide-react';
import DailyTipForm from './DailyTipForm';
import WebinarForm from './WebinarForm';
import PDFGuideForm from './PDFGuideForm';
import CRMLeads from './CRMLeads';
import type { DailyTip, Webinar, PDFGuide } from '@/lib/supabase';

type ContentType = 'crm-leads' | 'daily-tips' | 'webinars' | 'pdf-guides';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<ContentType>('crm-leads');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [dailyTipForm, setDailyTipForm] = useState({ isOpen: false, item: null });
  const [webinarForm, setWebinarForm] = useState({ isOpen: false, item: null });
  const [pdfGuideForm, setPdfGuideForm] = useState({ isOpen: false, item: null });
  const [crmOpen, setCrmOpen] = useState(false);
  
  // Data states
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [pdfGuides, setPdfGuides] = useState<PDFGuide[]>([]);

  const tabs = [
    { id: 'crm-leads', label: '👥 CRM Leads', icon: Users, count: 0 },
    { id: 'daily-tips', label: '📝 Daily Tips', icon: BookOpen, count: dailyTips.length },
    { id: 'webinars', label: '🎥 Webinars', icon: Video, count: webinars.length },
    { id: 'pdf-guides', label: '📄 PDF Guides', icon: FileText, count: pdfGuides.length }
  ];

  // Load data when tab changes
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, activeTab]);

  const loadData = async () => {
    if (activeTab === 'crm-leads') {
      setCrmOpen(true);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/${activeTab}?active=false`);
      const result = await response.json();
      
      if (result.success) {
        switch (activeTab) {
          case 'daily-tips':
            setDailyTips(result.data || []);
            break;
          case 'webinars':
            setWebinars(result.data || []);
            break;
          case 'pdf-guides':
            setPdfGuides(result.data || []);
            break;
        }
      } else {
        setError(result.error || 'Failed to load data');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    switch (activeTab) {
      case 'crm-leads':
        setCrmOpen(true);
        break;
      case 'daily-tips':
        setDailyTipForm({ isOpen: true, item: null });
        break;
      case 'webinars':
        setWebinarForm({ isOpen: true, item: null });
        break;
      case 'pdf-guides':
        setPdfGuideForm({ isOpen: true, item: null });
        break;
    }
  };

  const handleEdit = (item: any) => {
    switch (activeTab) {
      case 'daily-tips':
        setDailyTipForm({ isOpen: true, item });
        break;
      case 'webinars':
        setWebinarForm({ isOpen: true, item });
        break;
      case 'pdf-guides':
        setPdfGuideForm({ isOpen: true, item });
        break;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item? This will make it inactive.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/${activeTab}?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        setSuccess('Item deleted successfully');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete item');
      }
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    const isEditing = !!data.id;
    const method = isEditing ? 'PUT' : 'POST';
    
    const response = await fetch(`/api/${activeTab}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error);
    }

    setSuccess(`${isEditing ? 'Updated' : 'Created'} successfully!`);
    loadData();
    setTimeout(() => setSuccess(''), 3000);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'crm-leads': return [];
      case 'daily-tips': return dailyTips;
      case 'webinars': return webinars;
      case 'pdf-guides': return pdfGuides;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            className="bg-primary rounded-xl w-full max-w-7xl h-[90vh] shadow-2xl border border-white border-opacity-20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white border-opacity-20">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
                    <Settings className="w-8 h-8 text-accent" />
                    Admin Panel
                  </h1>
                  <p className="text-white opacity-70 mt-1">
                    Manage your resources with ease
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {(success || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mx-6 mt-4"
                >
                  {success && (
                    <div className="p-3 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-semibold">{success}</span>
                    </div>
                  )}
                  {error && (
                    <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300">{error}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="px-6 py-4 border-b border-white border-opacity-20">
              <div className="flex gap-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ContentType)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-accent text-primary'
                          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-primary bg-opacity-20 text-primary'
                          : 'bg-white bg-opacity-20 text-white'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="p-6 border-b border-white border-opacity-20">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by title, description, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500"
                      />
                    </div>
                    <button
                      onClick={loadData}
                      disabled={loading}
                      className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                  <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-accent hover:bg-opacity-90 text-primary font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                      <p className="text-white opacity-70">Loading {activeTab}...</p>
                    </div>
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-white opacity-30" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No {activeTab.replace('-', ' ')} found
                      </h3>
                      <p className="text-white opacity-70 mb-4">
                        {searchQuery ? 'Try adjusting your search terms' : `Get started by creating your first ${activeTab.replace('-', ' ').slice(0, -1)}`}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={handleCreate}
                          className="px-6 py-2 bg-accent hover:bg-opacity-90 text-primary font-bold rounded-lg transition-colors"
                        >
                          Create First Item
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredData.map((item: any) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20 hover:bg-opacity-15 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Thumbnail/Icon */}
                          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                            {activeTab === 'daily-tips' && item.image_url ? (
                              <img src={item.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : activeTab === 'webinars' && item.thumbnail_url ? (
                              <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : activeTab === 'pdf-guides' && item.thumbnail_url ? (
                              <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : activeTab === 'daily-tips' ? (
                              <BookOpen className="w-6 h-6 text-accent" />
                            ) : activeTab === 'webinars' ? (
                              <Video className="w-6 h-6 text-accent" />
                            ) : (
                              <FileText className="w-6 h-6 text-accent" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-white font-semibold text-lg leading-tight">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 ml-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.is_active 
                                    ? 'bg-green-500 bg-opacity-20 text-green-400'
                                    : 'bg-red-500 bg-opacity-20 text-red-400'
                                }`}>
                                  {item.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-white opacity-70 text-sm mb-3 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {item.tags.slice(0, 3).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 3 && (
                                  <span className="text-white opacity-50 text-xs px-2 py-1">
                                    +{item.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Meta info */}
                            <div className="flex items-center gap-4 text-white opacity-50 text-xs">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.created_at || item.updatedAt).toLocaleDateString()}
                              </span>
                              {activeTab === 'webinars' && item.duration && (
                                <span>Duration: {item.duration}</span>
                              )}
                              {activeTab === 'pdf-guides' && item.file_size && (
                                <span>Size: {item.file_size}</span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {/* View link */}
                            {((activeTab === 'webinars' && item.youtube_url) || 
                              (activeTab === 'pdf-guides' && item.pdf_url)) && (
                              <a
                                href={activeTab === 'webinars' ? item.youtube_url : item.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                title="View content"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
                              title="Edit item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Forms */}
          <DailyTipForm
            tip={dailyTipForm.item}
            isOpen={dailyTipForm.isOpen}
            onClose={() => setDailyTipForm({ isOpen: false, item: null })}
            onSave={handleSave}
          />
          
          <WebinarForm
            webinar={webinarForm.item}
            isOpen={webinarForm.isOpen}
            onClose={() => setWebinarForm({ isOpen: false, item: null })}
            onSave={handleSave}
          />
          
          <PDFGuideForm
            guide={pdfGuideForm.item}
            isOpen={pdfGuideForm.isOpen}
            onClose={() => setPdfGuideForm({ isOpen: false, item: null })}
            onSave={handleSave}
          />

          {/* CRM Leads */}
          <CRMLeads
            isOpen={crmOpen}
            onClose={() => setCrmOpen(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}