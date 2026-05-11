import { useState } from "react";
import { Copy, CheckCircle, Share2, Facebook, Twitter } from "lucide-react";

const SOCIAL_POSTS = [
  {
    platform: "instagram",
    icon: "📸",
    title: "Instagram Post",
    template: "🏠✨ Just discovered SmartBuy™ by @buywiser — an AI-guided home buying experience with real experts.\n\nHere's what I love:\n✓ 2.5% commission savings back in my pocket\n✓ Licensed mortgage pros on demand\n✓ AI handles the complexity\n✓ I earn bonus tokens for referrals\n\nIf you're buying a home in CA, this is a game-changer. Check it out:\n[LINK]\n\n#SmartBuy #HomeBuying #CaliforniaRealEstate #MoneySavings"
  },
  {
    platform: "facebook",
    icon: "👍",
    title: "Facebook Post",
    template: "I've been exploring home buying options, and I just found something I think you should know about.\n\nSmartBuy™ from BuyWiser completely changed how I'm thinking about the home purchase process:\n\n🏠 Get up to 2.5% of your home price back as a savings pool\n🤖 AI guides you through every step\n👨‍💼 Real licensed professionals available when you need them\n💰 Earn bonus tokens when you refer friends\n\nNo pressure, but if you're thinking about buying a home in California, it's worth checking out. The savings alone are incredible.\n\nInterested? [LINK]\n\n— Bought with SmartBuy™"
  },
  {
    platform: "twitter",
    icon: "𝕏",
    title: "X/Twitter Post",
    template: "just used @BuyWiserHome's SmartBuy™ and wow\n\n✓ kept 2.5% of my home price (that's real money)\n✓ AI + expert guidance (not just AI)\n✓ transparent, no surprises\n✓ even earning bonus tokens for referrals\n\nif you're buying in CA, this is worth your time\n\n[LINK]"
  },
  {
    platform: "linkedin",
    icon: "💼",
    title: "LinkedIn Post",
    template: "Excited to share my experience with SmartBuy™ by BuyWiser Home Loans.\n\nIn today's real estate market, transparency and expert guidance matter. SmartBuy delivers both:\n\n• AI-powered transaction management with licensed professional oversight\n• Commission savings (up to 2.5%) returned to homebuyers\n• Accessible expertise for every stage of the home purchase journey\n• Innovative referral rewards that benefit both parties\n\nAs someone navigating the California real estate market, I appreciated the clarity and the commitment to putting buyers' interests first.\n\nIf you're exploring home buying options, it's worth a conversation.\n\n[LINK]\n\n#RealEstate #Proptech #Homebuying #California"
  }
];

export default function SocialPostGenerator({ userEmail, referralLink }) {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  const post = SOCIAL_POSTS[selected];
  const postText = post.template.replace("[LINK]", referralLink);

  const handleCopyPost = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSharePlatform = (platform) => {
    const text = encodeURIComponent(postText);
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      instagram: null, // Instagram doesn't support direct sharing via URL
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
      {/* Platform Selector */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-3">Choose Platform</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SOCIAL_POSTS.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl font-black text-xs transition ${
                selected === i
                  ? "bg-slate-900 text-white border border-slate-700"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-lg">{p.icon}</span>
              {p.platform === "twitter" ? "X" : p.platform.charAt(0).toUpperCase() + p.platform.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Post Preview */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-2">{post.title} Preview</p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-32">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
            {postText}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyPost}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-black text-sm transition ${
            copied
              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
              : "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700"
          }`}
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy Post
            </>
          )}
        </button>
        {post.platform !== "instagram" && (
          <button
            onClick={() => handleSharePlatform(post.platform)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition"
          >
            <Share2 className="h-4 w-4" /> Share Now
          </button>
        )}
      </div>

      <p className="text-[10px] text-slate-500 leading-relaxed">
        💡 <strong>Tip:</strong> For Instagram, copy the post and paste it directly in your post caption. Your referral link is included and tracks conversions automatically.
      </p>
    </div>
  );
}