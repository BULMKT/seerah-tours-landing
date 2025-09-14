'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Eye, 
  Play, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  FileText,
  Video,
  BookOpen,
  Filter,
  ExternalLink
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import type { DailyTip, Webinar, PDFGuide } from '@/lib/supabase';

// Sample data removed - content will be managed through admin panel

// Sample webinars removed - content will be managed through admin panel

// Sample PDFs removed - content will be managed through admin panel

const tabs = ['All', 'Daily Tips', 'Webinars', 'PDF Guides'];

const allTags = ['Packing', 'Preparation', 'Checklist', 'Spiritual', 'Duas', 'Rituals', 'Health', 'Medical', 'Complete Guide', 'Workshop', 'Safety', 'Manual', 'Items'];

export default function ResourcesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<number | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<number | null>(null);

  // State for loaded resources
  const [resources, setResources] = useState<{
    tips: any[],
    webinars: any[], 
    pdfs: any[]
  }>({
    tips: [],
    webinars: [],
    pdfs: []
  });
  const [loading, setLoading] = useState(true);

  // Load resources from API
  useEffect(() => {
    setMounted(true);
    const loadResources = async () => {
      try {
        setLoading(true);
        
        // Load from API - no fallback data needed
        const [tipsRes, webinarsRes, pdfsRes] = await Promise.allSettled([
          fetch('/api/daily-tips'),
          fetch('/api/webinars'), 
          fetch('/api/pdf-guides')
        ]);

        const tips = tipsRes.status === 'fulfilled' && tipsRes.value.ok 
          ? (await tipsRes.value.json()).data || []
          : [];
          
        const webinars = webinarsRes.status === 'fulfilled' && webinarsRes.value.ok
          ? (await webinarsRes.value.json()).data || []  
          : [];
          
        const pdfs = pdfsRes.status === 'fulfilled' && pdfsRes.value.ok
          ? (await pdfsRes.value.json()).data || []
          : [];

        setResources({ tips, webinars, pdfs });
      } catch (error) {
        console.error('Failed to load resources:', error);
        // Keep sample data as fallback
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  // Filter data based on search and tags
  const filteredData = useMemo(() => {
    const filterItems = (items: any[]) => {
      return items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTags = selectedTags.length === 0 || 
                           selectedTags.some(tag => (item.tags || []).includes(tag));
        return matchesSearch && matchesTags;
      });
    };

    return {
      tips: filterItems(resources.tips),
      webinars: filterItems(resources.webinars),
      pdfs: filterItems(resources.pdfs)
    };
  }, [searchQuery, selectedTags, resources]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const renderTipsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredData.tips.map((tip, index) => (
        <motion.div
          key={tip.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl overflow-hidden shadow-lg cursor-pointer"
          onClick={() => setSelectedTip(tip.id)}
        >
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={tip.image_url || tip.imageUrl}
              alt={tip.title}
              width={500}
              height={500}
              unoptimized={true}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3 bg-primary bg-opacity-80 text-accent text-xs px-2 py-1 rounded-full">
              {tip.category}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bree font-bold text-white text-lg mb-2 line-clamp-2">
              {tip.title}
            </h3>
            <p className="text-white opacity-80 text-sm line-clamp-2 mb-3">
              {tip.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {(tip.tags || []).slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {(tip.tags || []).length > 2 && (
                <span className="text-xs text-white opacity-60">+{(tip.tags || []).length - 2}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderWebinarsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {filteredData.webinars.map((webinar, index) => (
        <motion.div
          key={webinar.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl overflow-hidden shadow-lg cursor-pointer"
          onClick={() => setSelectedWebinar(webinar.id)}
        >
             <div className="aspect-[4/5] relative overflow-hidden">
            <Image
              src={webinar.thumbnail_url || webinar.thumbnailUrl}
              alt={webinar.title}
              width={400}
              height={500}
              unoptimized={true}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {webinar.duration}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bree font-bold text-white text-lg mb-2 line-clamp-2">
              {webinar.title}
            </h3>
            <p className="text-white opacity-80 text-sm line-clamp-2 mb-3">
              {webinar.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {(webinar.tags || []).slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* View Full Playlist Button */}
      <div className="col-span-full flex justify-center mt-4">
        <a
          href="https://youtube.com/@seerahtours"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
        >
          <Video className="w-5 h-5" />
          View Full Playlist on YouTube
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  const renderPDFsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredData.pdfs.map((pdf, index) => (
        <motion.div
          key={pdf.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="aspect-[3/4] relative overflow-hidden">
            <Image
              src={pdf.thumbnail_url || pdf.thumbnailUrl}
              alt={pdf.title}
              width={300}
              height={400}
              unoptimized={true}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-accent bg-opacity-90 text-primary text-xs px-2 py-1 rounded-full font-semibold">
              {pdf.file_size || pdf.size}
            </div>
            <div className="absolute top-3 left-3 bg-primary bg-opacity-80 text-accent text-xs px-2 py-1 rounded-full">
              <Calendar className="w-3 h-3 inline mr-1" />
              {mounted ? new Date(pdf.updated_at || pdf.updatedAt).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              }) : ''}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bree font-bold text-white text-lg mb-2 line-clamp-2">
              {pdf.title}
            </h3>
            <p className="text-white opacity-80 text-sm line-clamp-2 mb-4">
              {pdf.description}
            </p>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSelectedPDF(pdf.id)}
                className="flex-1 btn-primary text-sm py-2 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => setSelectedPDF(pdf.id)}
                className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors duration-300"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {(pdf.tags || []).slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderContent = () => {
    const hasContent = filteredData.tips.length > 0 || filteredData.webinars.length > 0 || filteredData.pdfs.length > 0;
    
    if (!hasContent) {
      return (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="text-2xl font-bree font-bold text-white mb-2">No resources found</h3>
          <p className="text-white opacity-80 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'Daily Tips':
        return renderTipsGrid();
      case 'Webinars':
        return renderWebinarsGrid();
      case 'PDF Guides':
        return renderPDFsGrid();
      default: // 'All'
        return (
          <div className="space-y-16">
            {filteredData.tips.length > 0 && (
              <section>
                <h2 className="text-2xl font-bree font-bold text-white mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-accent" />
                  Daily Tips
                </h2>
                {renderTipsGrid()}
              </section>
            )}
            {filteredData.webinars.length > 0 && (
              <section>
                <h2 className="text-2xl font-bree font-bold text-white mb-6 flex items-center gap-2">
                  <Video className="w-6 h-6 text-accent" />
                  Webinars
                </h2>
                {renderWebinarsGrid()}
              </section>
            )}
            {filteredData.pdfs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bree font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-accent" />
                  PDF Guides
                </h2>
                {renderPDFsGrid()}
              </section>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Back Navigation */}
        <Link 
          href="/"
          className="inline-flex items-center text-accent hover:text-white transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-12">
          <Image
            src="/seerah logo.png"
            alt="Seerah Tours"
            width={200}
            height={80}
            unoptimized={true}
            className="mx-auto mb-8"
          />
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bree font-bold text-white mb-6">
            Seerah Tours Resource Center
          </h1>
          <p className="text-xl text-white opacity-80 max-w-3xl mx-auto">
            Daily Hajj tips, webinar recordings, and downloadable guides — all in one place.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-6 shadow-lg mb-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-accent text-primary'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white opacity-60" />
            <input
              type="text"
              placeholder="Search tips, videos, and guides…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary placeholder-gray-500"
            />
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-white opacity-60 mr-2" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-accent text-primary'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-accent hover:text-white text-sm underline ml-4"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab + searchQuery + selectedTags.join(',')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </motion.div>

        {/* Tip Lightbox Modal */}
        <AnimatePresence>
          {selectedTip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedTip(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-primary rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const tip = resources.tips.find((t: any) => t.id === selectedTip);
                  if (!tip) return null;
                  return (
                    <div className="grid md:grid-cols-2 gap-6 p-6">
                     <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: 'auto' }}>
                        <Image
                          src={tip.image_url || tip.imageUrl}
                          alt={tip.title}
                          width={500}
                          height={500}
                          unoptimized={true}
                          className="object-contain w-full h-auto max-h-[70vh]"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bree font-bold text-white mb-4">{tip.title}</h2>
                        <p className="text-white opacity-80 mb-6">{tip.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {tip.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                       <div className="space-y-3">
                         <button
                           onClick={() => {
                             // Download the image
                             const a = document.createElement('a');
                             a.href = tip.image_url || tip.imageUrl;
                             a.download = tip.title.replace(/[^a-zA-Z0-9]/g, '_') + '.jpg';
                             a.click();
                           }}
                           className="btn-primary w-full flex items-center justify-center gap-2"
                         >
                           <Download className="w-4 h-4" />
                           Download Image
                         </button>
                         <button
                           onClick={() => setSelectedTip(null)}
                           className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-3 rounded-lg transition-colors duration-300"
                         >
                           Close
                         </button>
                       </div>
                      </div>
                    </div>
                  );
                })()}
                <button
                  onClick={() => setSelectedTip(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Webinar Modal */}
        <AnimatePresence>
          {selectedWebinar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedWebinar(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-primary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const webinar = resources.webinars.find((w: any) => w.id === selectedWebinar);
                  if (!webinar) return null;
                  return (
                    <div className="p-6">
                      <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${webinar.youtube_id || webinar.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                          title={webinar.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                      <h2 className="text-xl font-bree font-bold text-white mb-2">{webinar.title}</h2>
                      <p className="text-white opacity-80 mb-4">{webinar.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-accent font-semibold">{webinar.duration}</span>
                        <button
                          onClick={() => setSelectedWebinar(null)}
                          className="btn-primary"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })()}
                <button
                  onClick={() => setSelectedWebinar(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Modal */}
        <AnimatePresence>
          {selectedPDF && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedPDF(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-primary rounded-xl max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const pdf = resources.pdfs.find((p: any) => p.id === selectedPDF);
                  if (!pdf) return null;
                  return (
                    <div className="p-6 text-center">
                      <FileText className="w-16 h-16 text-accent mx-auto mb-4" />
                      <h2 className="text-xl font-bree font-bold text-white mb-2">{pdf.title}</h2>
                      <p className="text-white opacity-80 mb-4">{pdf.description}</p>
                      <div className="text-accent font-semibold mb-6">{pdf.file_size || pdf.size}</div>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            // Open PDF in new tab for viewing
                            window.open(pdf.pdf_url || pdf.pdfUrl, '_blank');
                          }}
                          className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View PDF
                        </button>
                        <button
                          onClick={() => {
                            // Download PDF
                            const a = document.createElement('a');
                            a.href = pdf.pdf_url || pdf.pdfUrl;
                            a.download = pdf.title + '.pdf';
                            a.click();
                          }}
                          className="w-full bg-accent hover:bg-opacity-90 text-primary font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                        <button
                          onClick={() => setSelectedPDF(null)}
                          className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-3 rounded-lg transition-colors duration-300"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })()}
                <button
                  onClick={() => setSelectedPDF(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}