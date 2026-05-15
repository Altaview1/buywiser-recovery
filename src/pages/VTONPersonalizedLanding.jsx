import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronRight, Home } from 'lucide-react';

export default function VTONPersonalizedLanding() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [propertyPhoto, setPropertyPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoTransition, setAutoTransition] = useState(false);

  useEffect(() => {
    loadLead();
    // Track page visit
    if (leadId) {
      base44.functions.invoke('notifyLeadPageVisit', { lead_id: leadId }).catch(err => 
        console.log('Could not track visit:', err)
      );
    }
  }, [leadId]);

  const loadLead = async () => {
    try {
      if (!leadId) {
        setLoading(false);
        return;
      }

      // Fetch lead data
      const leads = await base44.entities.VTONLead.list();
      const currentLead = leads.find(l => l.id === leadId);
      
      if (currentLead) {
        setLead(currentLead);
        // Fetch property photo from PropertyRadar
        try {
          const photoResult = await base44.functions.invoke('fetchPropertyFromUrl', {
            property_address: currentLead.property_address,
            city: currentLead.city,
            state: currentLead.state,
            zip_code: currentLead.zip_code
          });
          if (photoResult?.data?.photo_url) {
            setPropertyPhoto(photoResult.data.photo_url);
          }
        } catch (photoErr) {
          console.log('Could not fetch property photo:', photoErr);
        }
      }
    } catch (err) {
      console.error('Failed to load lead:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-transition to testimonials after 6 seconds
  useEffect(() => {
    if (lead && !loading) {
      const timer = setTimeout(() => {
        setAutoTransition(true);
        // Navigate to testimonials with lead context
        setTimeout(() => {
          navigate('/vton-testimonials', { state: { fromLead: leadId } });
        }, 500);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [lead, loading, navigate, leadId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your personalized benefit details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <Home className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Lead not found</p>
        </div>
      </div>
    );
  }

  const estimatedBenefit = lead.estimated_benefit || Math.round((lead.listing_price || 0) * 0.015);
  const yearsAtProperty = lead.listing_date ? Math.floor((new Date() - new Date(lead.listing_date)) / (1000 * 60 * 60 * 24 * 365)) : 'N/A';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 transition-opacity duration-500 ${autoTransition ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Property Photo Hero */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 aspect-video bg-slate-200">
          {propertyPhoto ? (
            <img 
              src={propertyPhoto} 
              alt={`${lead.first_name}'s home`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
              <Home className="h-24 w-24 text-slate-500 opacity-50" />
            </div>
          )}
          
          {/* Overlay with veteran badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-between p-6">
            <div className="text-right">
              <span className="inline-block px-3 py-1.5 bg-amber-400/90 text-amber-900 text-sm font-bold rounded-full backdrop-blur-sm">
                🎖️ Veteran Benefit Program
              </span>
            </div>
            <div className="text-white">
              <p className="text-sm font-semibold opacity-90 mb-2">Your Property</p>
              <p className="text-2xl font-bold">{lead.property_address}</p>
              <p className="text-lg opacity-90">{lead.city}, {lead.state} {lead.zip_code}</p>
            </div>
          </div>
        </div>

        {/* Personalized Greeting & Key Facts */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Hi {lead.first_name},
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            As a veteran homeowner, you may qualify for a meaningful credit on your next home purchase.
          </p>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Property Value */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">Your Home Value</p>
              <p className="text-3xl font-bold text-blue-900">
                ${lead.listing_price ? (lead.listing_price / 1000000).toFixed(2) : '0.00'}M
              </p>
            </div>

            {/* Estimated Benefit */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm font-semibold text-green-600 mb-2 uppercase tracking-wide">Potential Credit</p>
              <p className="text-3xl font-bold text-green-900">
                ${estimatedBenefit.toLocaleString()}
              </p>
              <p className="text-xs text-green-700 mt-2">1.5% of next purchase price</p>
            </div>

            {/* Years at Property */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <p className="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wide">Homeowner Since</p>
              <p className="text-3xl font-bold text-purple-900">
                {yearsAtProperty === 'N/A' ? '—' : `${yearsAtProperty}+ yrs`}
              </p>
            </div>
          </div>

          {/* What You Get */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8">
            <p className="font-semibold text-blue-900 mb-2">What Qualifies</p>
            <p className="text-blue-800 text-sm leading-relaxed">
              As a veteran homeowner, you may receive up to 1.5% of your next home's purchase price as a closing credit — funded entirely by BuyWiser's Veterans GAP Benefit Program.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/vton-testimonials', { state: { fromLead: leadId } })}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white text-lg font-bold rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all shadow-lg"
          >
            Watch Veteran Stories
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Auto-transition notice */}
          <p className="text-center text-slate-500 text-sm mt-4 animate-pulse">
            Loading veteran testimonials...
          </p>
        </div>

        {/* Contact Footer */}
        <div className="text-center text-slate-600 text-sm">
          <p className="font-semibold text-slate-900 mb-2">Questions?</p>
          <p className="mb-1">Call us: <span className="font-bold text-slate-900">(818) 300-2642</span></p>
          <p>Or visit: <span className="font-bold text-slate-900">buywiser.com/vton</span></p>
        </div>
      </div>
    </div>
  );
}