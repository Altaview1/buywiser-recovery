import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Video, Grid3X3, Link } from 'lucide-react';

export default function MetaCampaignSetup() {
  const [selectedType, setSelectedType] = useState(null);
  const [setupComplete, setSetupComplete] = useState(false);

  const campaignTypes = [
    {
      id: 'carousel',
      name: 'Carousel Ads',
      icon: Grid3X3,
      description: 'Multiple images/videos in a single ad. Great for showcasing different benefit angles.',
      specs: ['3-10 images/videos', 'Individual headlines', 'Link to landing pages', '1.91:1 aspect ratio'],
      useCase: 'Highlight different VA loan benefits or testimonials'
    },
    {
      id: 'video',
      name: 'Video Ads',
      icon: Video,
      description: 'Engaging video content. Ideal for testimonials or explainer videos.',
      specs: ['15 seconds - 2 minutes', 'Auto-play with sound off', 'High engagement rates', '16:9 or 1:1 aspect ratio'],
      useCase: 'Veteran testimonials or quick benefit explanations'
    },
    {
      id: 'landing',
      name: 'Landing Page Ads',
      icon: Link,
      description: 'Drive traffic to a dedicated landing page. Best for lead capture.',
      specs: ['Single call-to-action', 'Custom landing page URL', 'Lead form integration', 'Conversion tracking'],
      useCase: 'Drive to personalized veteran benefit landing page'
    }
  ];

  const handleSelectCampaign = (type) => {
    setSelectedType(type);
  };

  const handleSetupComplete = () => {
    setSetupComplete(true);
    setTimeout(() => setSetupComplete(false), 3000);
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-lg">🎨</span> Campaign Type Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaignTypes.map((campaign) => {
            const Icon = campaign.icon;
            return (
              <div
                key={campaign.id}
                onClick={() => handleSelectCampaign(campaign.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedType === campaign.id
                    ? 'border-purple-600 bg-white shadow-md'
                    : 'border-purple-200 hover:border-purple-400'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className="h-5 w-5 text-purple-600" />
                  {selectedType === campaign.id && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
                <h3 className="font-semibold text-sm text-slate-900 mb-1">{campaign.name}</h3>
                <p className="text-xs text-slate-600 mb-3">{campaign.description}</p>
                
                <div className="space-y-2 mb-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Specs:</p>
                  <ul className="space-y-1">
                    {campaign.specs.map((spec, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-purple-600 mt-0.5">•</span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-purple-100">
                  <p className="text-xs text-slate-600">
                    <strong>Use case:</strong> {campaign.useCase}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {selectedType && (
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-sm text-slate-900 mb-3">Next Steps for {campaignTypes.find(c => c.id === selectedType)?.name}</h4>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <span>Go to Meta Ads Manager → Create Campaign</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">2.</span>
                <span>Select campaign objective: Conversions (lead capture) or Traffic</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">3.</span>
                <span>In targeting, select your "VTON Veterans" custom audience</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">4.</span>
                <span>Create your ad creative using the specs above</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">5.</span>
                <span>Set daily budget and schedule (start small: $5-10/day)</span>
              </li>
            </ol>

            <Button
              onClick={handleSetupComplete}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              ✓ Campaign Setup Complete
            </Button>

            {setupComplete && (
              <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-xs text-green-700">
                ✓ Campaign configuration saved. Monitor performance in Meta Ads Manager.
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-slate-500 text-center pt-2">
          💡 Tip: Start with carousel ads to test different messaging. Video performs best with testimonials.
        </div>
      </CardContent>
    </Card>
  );
}