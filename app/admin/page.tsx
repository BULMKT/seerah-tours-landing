'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, Settings, Users, BookOpen, Video, FileText, 
  Eye, Edit, Trash2, Loader2, RefreshCw, CheckCircle,
  AlertCircle, Search, Filter, Calendar, Tag, ExternalLink,
  Phone, Mail, MessageSquare, Download, Plus, Lock
} from 'lucide-react';

import DailyTipForm from '@/components/admin/DailyTipForm';
import WebinarForm from '@/components/admin/WebinarForm';
import PDFGuideForm from '@/components/admin/PDFGuideForm';
import LeadDetailsModal from '@/components/admin/LeadDetailsModal';
import type { DailyTip, Webinar, PDFGuide } from '@/lib/supabase';

type ContentType = 'crm-leads' | 'daily-tips' | 'webinars' | 'pdf-guides';

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city_country?: string;
  previous_experience?: string;
  hajj_status?: string;
  travelling_with?: string;
  traveller_count?: number;
  departure_city?: string;
  rooming_preference?: string;
  mobility_considerations?: string;
  call_goals?: string;
  hear_about_us?: string;
  hear_about_us_other?: string;
  consent?: boolean;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<ContentType>('crm-leads');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [dailyTipForm, setDailyTipForm] = useState({ isOpen: false, item: null });
  const [webinarForm, setWebinarForm] = useState({ isOpen: false, item: null });
  const [pdfGuideForm, setPdfGuideForm] = useState({ isOpen: false, item: null });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetailsOpen, setLeadDetailsOpen] = useState(false);

  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [pdfGuides, setPdfGuides] = useState<PDFGuide[]>([]);

  // Authentication
  const ADMIN_PASSWORD = 'seerah2026admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('Incorrect password');
      setTimeout(() => setAuthError(''), 3000);
    }
  };

  const tabs = [
    { id: 'crm-leads', label: '👥 CRM Leads', icon: Users, count: leads.length },
    { id: 'daily-tips', label: '📝 Daily Tips', icon: BookOpen, count: dailyTips.length },
    { id: 'webinars', label: '🎥 Webinars', icon: Video, count: webinars.length },
    { id: 'pdf-guides', label: '📄 PDF Guides', icon: FileText, count: pdfGuides.length }
  ];

  // Load data when tab changes
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      let result;

      switch (activeTab) {
        case 'crm-leads':
          response = await fetch('/api/leads');
          result = await response.json();
          if (result.success) {
            setLeads(result.data || []);
          } else {
            setError(result.error || 'Failed to load leads');
          }
          break;
        case 'daily-tips':
          response = await fetch('/api/daily-tips?active=false');
          result = await response.json();
          if (result.success) {
            setDailyTips(result.data || []);
          } else {
            setError(result.error || 'Failed to load daily tips');
          }
          break;
        case 'webinars':
          response = await fetch('/api/webinars?active=false');
          result = await response.json();
          if (result.success) {
            setWebinars(result.data || []);
          } else {
            setError(result.error || 'Failed to load webinars');
          }
          break;
        case 'pdf-guides':
          response = await fetch('/api/pdf-guides?active=false');
          result = await response.json();
          if (result.success) {
            setPdfGuides(result.data || []);
          } else {
            setError(result.error || 'Failed to load PDF guides');
          }
          break;
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

  const updateLeadStatus = async (leadId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status, notes })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Lead updated successfully');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update lead');
      }
    } catch (err) {
      setError('Failed to update lead');
      console.error('Update lead error:', err);
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'crm-leads': return leads;
      case 'daily-tips': return dailyTips;
      case 'webinars': return webinars;
      case 'pdf-guides': return pdfGuides;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item => {
    if (activeTab === 'crm-leads') {
      const lead = item as Lead;
      return lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lead.phone?.includes(searchQuery) ||
             lead.city_country?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    const content = item as DailyTip | Webinar | PDFGuide;
    return content.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           content.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (content.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'converted': return 'bg-purple-500';
      case 'closed': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Enter the admin password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {authError && (
                <p className="text-red-500 text-sm mt-2">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center text-accent hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="h-6 w-px bg-white opacity-30"></div>
            <h1 className="text-3xl font-bree font-bold text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-accent" />
              Admin Panel
            </h1>
          </div>
          <Image
            src="/seerah logo.png"
            alt="Seerah Tours"
            width={150}
            height={60}
            className="opacity-80"
          />
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {(success || error) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              {success && (
                <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-semibold">{success}</span>
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ContentType)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
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

        {/* Toolbar */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab.replace('-', ' ')}...`}
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
          
          {activeTab !== 'crm-leads' && (
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-accent hover:bg-opacity-90 text-primary font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                <p className="text-white opacity-70">Loading {activeTab.replace('-', ' ')}...</p>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-white opacity-30" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No {activeTab.replace('-', ' ')} found
                </h3>
                <p className="text-white opacity-70 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : `No ${activeTab.replace('-', ' ')} have been created yet`}
                </p>
                {activeTab !== 'crm-leads' && !searchQuery && (
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
            <div className="p-6">
              {activeTab === 'crm-leads' ? (
                // CRM Leads View
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white border-opacity-20">
                      <tr>
                        <th className="text-left p-4 text-white font-semibold">Contact</th>
                        <th className="text-left p-4 text-white font-semibold">Status</th>
                        <th className="text-left p-4 text-white font-semibold">Interest</th>
                        <th className="text-left p-4 text-white font-semibold">Submitted</th>
                        <th className="text-left p-4 text-white font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((lead: any) => (
                        <tr key={lead.id} className="border-b border-white border-opacity-10">
                          <td className="p-4">
                            <div>
                              <div className="font-semibold text-white">{lead.full_name}</div>
                              <div className="text-sm text-white opacity-70">{lead.email}</div>
                              <div className="text-sm text-white opacity-70">{lead.phone}</div>
                              <div className="text-sm text-accent">{lead.city_country}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <select
                              value={lead.status || 'new'}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-semibold border-none focus:outline-none focus:ring-2 focus:ring-accent text-white ${getStatusColor(lead.status || 'new')} bg-opacity-20`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="converted">Converted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <span className="text-white text-sm">
                              {lead.hajj_status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-white opacity-70 text-sm">
                              {formatDate(lead.created_at)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setLeadDetailsOpen(true);
                                }}
                                className="p-2 bg-accent hover:bg-opacity-80 text-primary rounded-lg transition-colors"
                                title="View Full Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={`mailto:${lead.email}`}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                title="Send Email"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                              <a
                                href={`tel:${lead.phone}`}
                                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                title="Call"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Content Management View
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
                              {formatDate(item.created_at || item.updatedAt)}
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
          )}
        </div>

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

        <LeadDetailsModal
          lead={selectedLead}
          isOpen={leadDetailsOpen}
          onClose={() => {
            setLeadDetailsOpen(false);
            setSelectedLead(null);
          }}
          onUpdateStatus={updateLeadStatus}
        />
      </div>
    </div>
  );
}