'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, Phone, MapPin, Globe, Target, Users,
  Calendar, Home, Heart, MessageSquare, Tag, Clock,
  CheckCircle, AlertCircle, Plane, Info
} from 'lucide-react';

interface LeadDetailsModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (leadId: string, status: string, notes?: string) => void;
}

export default function LeadDetailsModal({ lead, isOpen, onClose, onUpdateStatus }: LeadDetailsModalProps) {
  if (!lead) return null;

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

  const InfoRow = ({ icon: Icon, label, value, className = '' }: any) => {
    if (!value) return null;
    return (
      <div className={`flex items-start gap-3 p-3 rounded-lg bg-white bg-opacity-5 ${className}`}>
        <Icon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-white opacity-60 text-sm">{label}</div>
          <div className="text-white font-medium">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 text-center">
              {/* Centering trick */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>

              {/* Modal content */}
              <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-primary border border-white border-opacity-20 rounded-xl shadow-xl">
                {/* Header */}
                <div className="bg-white bg-opacity-10 px-6 py-4 border-b border-white border-opacity-20">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <User className="w-6 h-6 text-accent" />
                        Lead Details
                      </h2>
                      <p className="text-white opacity-60 text-sm mt-1">
                        Submitted: {formatDate(lead.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {/* Status Bar */}
                  <div className="mb-6 p-4 bg-white bg-opacity-5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white opacity-60 text-sm block mb-2">Current Status</label>
                        <select
                          value={lead.status || 'new'}
                          onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                          className={`px-4 py-2 rounded-lg font-semibold text-white ${getStatusColor(lead.status || 'new')} bg-opacity-20 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-accent`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`mailto:${lead.email}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Send Email
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-accent" />
                      Contact Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <InfoRow icon={User} label="Full Name" value={lead.full_name} />
                      <InfoRow icon={Mail} label="Email" value={lead.email} />
                      <InfoRow icon={Phone} label="Phone" value={lead.phone} />
                      <InfoRow icon={MapPin} label="City & Country" value={lead.city_country} />
                    </div>
                  </div>

                  {/* Hajj Experience & Status */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-accent" />
                      Hajj Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <InfoRow
                        icon={CheckCircle}
                        label="Previous Experience"
                        value={lead.previous_experience}
                      />
                      <InfoRow
                        icon={Target}
                        label="Hajj Status"
                        value={lead.hajj_status}
                        className={lead.hajj_status === 'Committed' ? 'border border-green-500 border-opacity-30' : ''}
                      />
                    </div>
                  </div>

                  {/* Travel Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      Travel Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <InfoRow icon={Users} label="Travelling With" value={lead.travelling_with} />
                      {lead.traveller_count && (
                        <InfoRow icon={Users} label="Number of Travellers" value={lead.traveller_count} />
                      )}
                      {lead.departure_city && (
                        <InfoRow icon={Plane} label="Departure Preference" value={lead.departure_city} />
                      )}
                      {lead.rooming_preference && (
                        <InfoRow icon={Home} label="Rooming Preference" value={lead.rooming_preference} />
                      )}
                    </div>
                  </div>

                  {/* Mobility & Medical */}
                  {lead.mobility_considerations && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-accent" />
                        Special Considerations
                      </h3>
                      <div className="p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg">
                        <p className="text-white">{lead.mobility_considerations}</p>
                      </div>
                    </div>
                  )}

                  {/* Questions & Goals */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-accent" />
                      Questions & Concerns
                    </h3>
                    <div className="p-4 bg-white bg-opacity-5 rounded-lg">
                      <p className="text-white whitespace-pre-wrap">{lead.call_goals}</p>
                    </div>
                  </div>

                  {/* Source & Marketing */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-accent" />
                      Marketing Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {lead.hear_about_us && (
                        <InfoRow icon={Info} label="How They Heard About Us" value={lead.hear_about_us} />
                      )}
                      {lead.hear_about_us_other && (
                        <InfoRow icon={Info} label="Other Source" value={lead.hear_about_us_other} />
                      )}
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-accent" />
                      Internal Notes
                    </h3>
                    <textarea
                      className="w-full p-4 bg-white bg-opacity-5 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      rows={4}
                      placeholder="Add notes about this lead..."
                      defaultValue={lead.notes || ''}
                      onBlur={(e) => onUpdateStatus(lead.id, lead.status || 'new', e.target.value)}
                    />
                  </div>

                  {/* Timestamps */}
                  <div className="text-white opacity-50 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Created: {formatDate(lead.created_at)}</span>
                    </div>
                    {lead.updated_at && lead.updated_at !== lead.created_at && (
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>Last Updated: {formatDate(lead.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}