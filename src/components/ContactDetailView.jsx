import { X, Mail, Phone, Home, FileText, DollarSign, CreditCard, Clock } from "lucide-react";

export default function ContactDetailView({ contact, onClose }) {
  if (!contact) return null;

  const contactType = contact.form_type || contact.loan_purpose ? "submission" : "lead";
  const creditScoreRange = contact.credit_score_range || contact.credit_score || "—";
  const loanType = contact.loan_type || contact.loan_purpose || "—";
  const status = contact.status || "—";

  const statusColor = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-700",
    qualified: "bg-purple-100 text-purple-700",
    closed: "bg-green-100 text-green-700",
    submitted: "bg-slate-100 text-slate-600",
  };

  const getStatusColor = (s) => {
    const lower = (s || "").toLowerCase();
    return statusColor[lower] || statusColor.new;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200 bg-slate-50">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {contact.first_name || contact.name} {contact.last_name || ""}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {contact.email || "No email"} • {contact.phone || "No phone"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200 transition">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Status & Key Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</p>
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Added</p>
              <p className="text-sm text-slate-700">
                {contact.created_date
                  ? new Date(contact.created_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                <Mail className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline break-all">
                    {contact.email || "—"}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:underline">
                    {contact.phone || "—"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Loan & Credit Information */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loan Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-600 font-semibold">Loan Type</p>
                  <p className="text-sm text-slate-800 font-medium">{loanType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-amber-50 rounded-lg p-3 border border-amber-100">
                <CreditCard className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-amber-700 font-semibold">Credit Score</p>
                  <p className="text-sm text-slate-800 font-medium">{creditScoreRange}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Information (if available) */}
          {(contact.property_address || contact.property_price) && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Information</p>
              <div className="space-y-3">
                {contact.property_address && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                    <Home className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Address</p>
                      <p className="text-sm text-slate-700">{contact.property_address}</p>
                    </div>
                  </div>
                )}
                {contact.property_price && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                    <DollarSign className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Property Price</p>
                      <p className="text-sm text-slate-700">${contact.property_price.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comments/Notes */}
          {contact.comments || contact.internal_notes || contact.agent_comment ? (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {contact.comments || contact.internal_notes || contact.agent_comment}
                </p>
              </div>
            </div>
          ) : null}

          {/* How They Heard */}
          {contact.how_heard && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source</p>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-700">{contact.how_heard}</p>
              </div>
            </div>
          )}

          {/* Employment Info (if available) */}
          {(contact.employment_type || contact.employer_name) && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employment</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contact.employment_type && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 font-semibold">Employment Type</p>
                    <p className="text-sm text-slate-700">{contact.employment_type}</p>
                  </div>
                )}
                {contact.employer_name && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 font-semibold">Employer</p>
                    <p className="text-sm text-slate-700">{contact.employer_name}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}