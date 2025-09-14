'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Eye, Edit, Phone, Mail, MapPin, Calendar,
  Filter, Search, RefreshCw, Loader2, CheckCircle,
  AlertCircle, Clock, Star, MessageSquare
} from 'lucide-react';

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city_country?: string;
  previous_experience?: string;
  hajj_status?: string;
  travelling_with?: string;
  call_goals?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface CRMLeadsProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Leads', color: 'bg-gray-500' },
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-green-500' },
  { value: 'converted', label: 'Converted', color: 'bg-purple-500' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-600' }
];

export default function CRMLeads({ isOpen, onClose }: CRMLeadsProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>('');
  const [editingNotes, setEditingNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadLeads();
    }
  }, [isOpen, selectedStatus]);

  const loadLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      
      const response = await fetch(`/api/leads?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setLeads(result.data || []);
      } else {
        setError(result.error || 'Failed to load leads');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Load leads error:', err);
    } finally {
      setLoading(false);
    }
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
        loadLeads();
        setSelectedLead(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update lead');
      }
    } catch (err) {
      setError('Failed to update lead');
      console.error('Update lead error:', err);
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditingStatus(lead.status);
    setEditingNotes(lead.notes || '');
  };

  const handleSaveEdit = () => {
    if (selectedLead) {
      updateLeadStatus(selectedLead.id, editingStatus, editingNotes);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone?.includes(searchQuery) ||
    lead.city_country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption?.color || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                    <Users className="w-8 h-8 text-accent" />
                    CRM - Lead Management
                  </h1>
                  <p className="text-white opacity-70 mt-1">
                    Manage your Hajj inquiry leads
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ×
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

            {/* Toolbar */}
            <div className="p-6 border-b border-white border-opacity-20">
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500"
                    />
                  </div>

                  <button
                    onClick={loadLeads}
                    disabled={loading}
                    className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                
                <div className="text-white opacity-70 text-sm">
                  {filteredLeads.length} of {leads.length} leads
                </div>
              </div>
            </div>

            {/* Leads List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                    <p className="text-white opacity-70">Loading leads...</p>
                  </div>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-white opacity-30" />
                    <h3 className="text-xl font-semibold text-white mb-2">No leads found</h3>
                    <p className="text-white opacity-70">
                      {searchQuery ? 'Try adjusting your search terms' : 'No leads have been submitted yet'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20 hover:bg-opacity-15 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">
                              {lead.full_name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-white opacity-70 text-sm">
                                <Mail className="w-4 h-4" />
                                <span>{lead.email}</span>
                              </div>
                              {lead.phone && (
                                <div className="flex items-center gap-2 text-white opacity-70 text-sm">
                                  <Phone className="w-4 h-4" />
                                  <span>{lead.phone}</span>
                                </div>
                              )}
                              {lead.city_country && (
                                <div className="flex items-center gap-2 text-white opacity-70 text-sm">
                                  <MapPin className="w-4 h-4" />
                                  <span>{lead.city_country}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {lead.hajj_status && (
                                <div className="text-white opacity-70 text-sm">
                                  <strong>Status:</strong> {lead.hajj_status}
                                </div>
                              )}
                              {lead.travelling_with && (
                                <div className="text-white opacity-70 text-sm">
                                  <strong>Travelling:</strong> {lead.travelling_with}
                                </div>
                              )}
                              {lead.previous_experience && (
                                <div className="text-white opacity-70 text-sm">
                                  <strong>Experience:</strong> {lead.previous_experience}
                                </div>
                              )}
                            </div>
                          </div>

                          {lead.call_goals && (
                            <div className="mb-3">
                              <div className="text-white opacity-70 text-sm">
                                <strong>Goals:</strong> {lead.call_goals}
                              </div>
                            </div>
                          )}

                          {lead.notes && (
                            <div className="mb-3 p-2 bg-white bg-opacity-10 rounded text-white text-sm">
                              <strong>Notes:</strong> {lead.notes}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-white opacity-50 text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created: {formatDate(lead.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Updated: {formatDate(lead.updated_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditLead(lead)}
                            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
                            title="Edit lead"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Edit Lead Modal */}
          <AnimatePresence>
            {selectedLead && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4"
                onClick={() => setSelectedLead(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-primary rounded-xl max-w-md w-full shadow-2xl border border-white border-opacity-20 p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold text-white mb-4">
                    Edit Lead: {selectedLead.full_name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Status</label>
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                      >
                        {STATUS_OPTIONS.slice(1).map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Notes</label>
                      <textarea
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Add notes about this lead..."
                        rows={4}
                        className="w-full px-4 py-2 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary placeholder-gray-500 resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-accent hover:bg-opacity-90 text-primary font-bold py-3 px-4 rounded-lg transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}