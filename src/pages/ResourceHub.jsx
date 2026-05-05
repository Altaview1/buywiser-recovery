import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, BookOpen, Target, AlertCircle, Zap, X, ChevronDown, Copy, Check } from "lucide-react";

const NAVY = "#0B1F3B";

const CATEGORY_INFO = {
  sales_script: { label: "Sales Scripts", icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
  objection_handler: { label: "Objection Handlers", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
  offer_guideline: { label: "Offer Guidelines", icon: Zap, color: "text-green-600", bg: "bg-green-50" },
  training: { label: "Training", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
};

function ResourceCard({ resource, onSelect }) {
  const info = CATEGORY_INFO[resource.category];
  const Icon = info.icon;

  return (
    <button onClick={() => onSelect(resource)}
      className={`w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition ${info.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${info.color}`} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{resource.title}</p>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{resource.summary || resource.content.slice(0, 80)}</p>
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {resource.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-600">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function ResourceDetail({ resource, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const info = CATEGORY_INFO[resource.category];
  const Icon = info.icon;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className={`px-4 py-4 border-b border-slate-200 sticky top-0 flex items-center justify-between ${info.bg}`}>
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`h-5 w-5 flex-shrink-0 ${info.color}`} />
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-widest ${info.color}`}>{info.label}</p>
            <p className="font-bold text-slate-900 text-sm truncate">{resource.title}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition flex-shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="prose prose-sm max-w-none prose-slate whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {resource.content}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-200 px-4 py-3 flex gap-2 touch-manipulation">
        <button onClick={handleCopy}
          className="flex-1 py-3 rounded-lg font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition flex items-center justify-center gap-2">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Text"}
        </button>
        <button onClick={onClose}
          className="flex-1 py-3 rounded-lg font-bold text-sm text-white transition active:opacity-80"
          style={{ background: NAVY }}>
          Done
        </button>
      </div>
    </div>
  );
}

export default function ResourceHub({ onClose }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      const data = await base44.entities.Resource.list("-updated_date", 100);
      setResources(data);
      setLoading(false);
    };
    fetchResources();
  }, []);

  const filtered = resources.filter(r => {
    const matchCategory = filter === "all" || r.category === filter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const featured = resources.filter(r => r.is_featured);

  if (selectedResource) {
    return <ResourceDetail resource={selectedResource} onClose={() => setSelectedResource(null)} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-200 sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Resources</p>
            <h1 className="text-base font-bold text-slate-900">Sales Resources & Scripts</h1>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">📌 Featured Resources</p>
                <div className="space-y-2">
                  {featured.map(r => (
                    <ResourceCard key={r.id} resource={r} onSelect={setSelectedResource} />
                  ))}
                </div>
              </div>
            )}

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 touch-manipulation">
              <button onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  filter === "all" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}>
                All
              </button>
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    filter === key ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}>
                  {info.label}
                </button>
              ))}
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-sm">No resources found</p>
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-medium">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
                <div className="space-y-2">
                  {filtered.map(r => (
                    <ResourceCard key={r.id} resource={r} onSelect={setSelectedResource} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}