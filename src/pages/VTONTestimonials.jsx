import { useEffect, useState } from 'react';
import { Volume2, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VTONTestimonials() {
  const [currentVideo, setCurrentVideo] = useState('frank-cody');
  const [autoPlay, setAutoPlay] = useState(true);

  // Videos - replace URLs with actual testimonial links
  const videos = {
    'frank-cody': {
      title: 'Frank & Cody - Veterans Benefiting from VTON',
      url: 'https://youtu.be/DkMjJUaoDj4?si=j0T3yV5xK0m8fJ1Q',
      description: 'Real veterans share their experience with the Veteran\'s Next Home benefit program'
    },
    'your-speech': {
      title: 'Learn About Your Veteran\'s Next Home Benefit',
      url: 'https://youtu.be/DkMjJUaoDj4?si=j0T3yV5xK0m8fJ1Q',
      description: 'Hear directly from our team about how this benefit works'
    }
  };

  useEffect(() => {
    // Auto-transition from Frank & Cody to your speech after video ends (roughly 3-4 min)
    if (currentVideo === 'frank-cody' && autoPlay) {
      const timer = setTimeout(() => {
        setCurrentVideo('your-speech');
      }, 240000); // 4 minutes
      return () => clearTimeout(timer);
    }
  }, [currentVideo, autoPlay]);

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur border-b border-blue-700/50 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">Veteran's Next Home™ Benefit</h1>
          <p className="text-blue-200 text-sm">Learn how you could benefit</p>
        </div>
        <img 
          src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" 
          alt="BuyWiser" 
          className="h-8 brightness-0 invert"
        />
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full max-w-4xl">
          <iframe
            src={videos[currentVideo].url}
            title={videos[currentVideo].title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-xl shadow-2xl"
          />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="bg-slate-900/90 backdrop-blur border-t border-blue-700/50 px-4 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-blue-300" />
          <span className="text-blue-100 text-sm">
            {currentVideo === 'frank-cody' ? 'Frank & Cody\'s Story' : 'Your Benefit Explained'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentVideo === 'frank-cody' && (
            <Button
              onClick={() => setCurrentVideo('your-speech')}
              variant="outline"
              size="sm"
              className="border-blue-400 text-blue-300 hover:bg-blue-900/50"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Skip to Explanation
            </Button>
          )}
          
          <Button
            onClick={() => setCurrentVideo('frank-cody')}
            size="sm"
            variant={currentVideo === 'frank-cody' ? 'default' : 'outline'}
            className={currentVideo === 'frank-cody' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-400 text-blue-300'}
          >
            Testimonials
          </Button>
          
          <Button
            onClick={() => setCurrentVideo('your-speech')}
            size="sm"
            variant={currentVideo === 'your-speech' ? 'default' : 'outline'}
            className={currentVideo === 'your-speech' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-400 text-blue-300'}
          >
            How It Works
          </Button>
        </div>

        <p className="text-xs text-blue-300/70 text-center w-full">
          📱 Scanned from your VTON welcome letter
        </p>
      </div>
    </div>
  );
}