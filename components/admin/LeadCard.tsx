'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, MessageSquare, 
  Edit3, Check, X, ChevronDown, ChevronRight, Tag, Clock
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

interface LeadCardProps {
  lead: Lead;
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>;
}

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  qualified: { label: 'Qualified', color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' }
};

export default function LeadCard({ lead, onUpdate }: LeadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(lead.id, { status, notes });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStatus(lead.status);
    setNotes(lead.notes || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const statusConfig = STATUS_CONFIG[lead.status];

  return (
    <motion.div
      layout
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {lead.full_name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {lead.email}
              </div>
              {lead.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {lead.phone}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              <div className={`inline-block w-2 h-2 rounded-full ${statusConfig.dot} mr-1`}></div>
              {statusConfig.label}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {lead.city_country && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {lead.city_country}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(lead.created_at)}
          </div>
          {lead.hajj_status && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {lead.hajj_status}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Lead Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {lead.previous_experience && (
                  <div>
                    <span className="text-gray-500">Experience:</span>
                    <span className="ml-2 font-medium">{lead.previous_experience}</span>
                  </div>
                )}
                {lead.travelling_with && (
                  <div>
                    <span className="text-gray-500">Travelling with:</span>
                    <span className="ml-2 font-medium">{lead.travelling_with}</span>
                  </div>
                )}
              </div>

              {lead.call_goals && (
                <div>
                  <span className="text-gray-500 text-sm">Goals:</span>
                  <p className="mt-1 text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                    {lead.call_goals}
                  </p>
                </div>
              )}

              {/* Status & Notes Section */}
              <div className="border-t border-gray-50 pt-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Lead['status'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this lead..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-accent hover:bg-opacity-90 text-primary px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lead.notes && (
                      <div>
                        <span className="text-gray-500 text-sm">Notes:</span>
                        <p className="mt-1 text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                          {lead.notes}
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 text-accent hover:text-opacity-80 text-sm font-medium transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Update Status & Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}