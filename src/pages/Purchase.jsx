import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Home, Building2, Star, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Purchase() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    loan_type: 'Purchase',
    property_type: '',
    property_use: '',
    credit_score: '',
    found_home: '',
    purchase_price: '275000',
    military_service: '',
    buy_timeframe: '',
    first_time_buyer: '',
    bankruptcy: '',
    annual_income: '',
    monthly_debt: '',
    employment_status: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await base44.entities.ContactSubmission.create({
        ...formData,
        form_type: 'purchase_application'
      });
      toast.success('Application submitted successfully! We will contact you shortly.');
      setStep(1);
      setFormData({
        loan_type: 'Purchase',
        property_type: '',
        property_use: '',
        credit_score: '',
        found_home: '',
        purchase_price: '275000',
        military_service: '',
        buy_timeframe: '',
        first_time_buyer: '',
        bankruptcy: '',
        annual_income: '',
        monthly_debt: '',
        employment_status: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StepCard = ({ icon: Icon, title, options, field }) => (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center uppercase">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                setFormData({...formData, [field]: option});
                if (step < 13) setStep(step + 1);
              }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all text-center"
            >
              <Icon className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">{option}</p>
            </button>
          ))}
        </div>
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const renderStep = () => {
    switch(step) {
      case 1:
        return <StepCard icon={Key} title="Select Property Type" options={['Single Family', 'Multi-Family', 'Condominium', 'Townhouse', 'Manufactured Home']} field="property_type" />;
      case 2:
        return <StepCard icon={Home} title="What is the Property Use?" options={['Primary Residence', 'Vacation Home', 'Investment Property']} field="property_use" />;
      case 3:
        return <StepCard icon={Star} title="How is Your Credit?" options={['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']} field="credit_score" />;
      case 4:
        return <StepCard icon={CheckCircle2} title="Have You Already Found a Home?" options={['Yes', 'No']} field="found_home" />;
      case 5:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Purchase Price</h2>
              <div className="mb-8">
                <Label htmlFor="purchase_price">Purchase Price</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
                  className="text-lg"
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(step + 1)} className="flex-1 bg-green-600 hover:bg-green-700">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 6:
        return <StepCard icon={CheckCircle2} title="Military Service?" options={['Yes', 'No']} field="military_service" />;
      case 7:
        return <StepCard icon={CheckCircle2} title="You Expect to Buy Within?" options={['Soon', 'Next 60 days', 'Next 6 months', 'Not very soon']} field="buy_timeframe" />;
      case 8:
        return <StepCard icon={CheckCircle2} title="First Time Home Buyer?" options={['Yes', 'No']} field="first_time_buyer" />;
      case 9:
        return <StepCard icon={CheckCircle2} title="Bankruptcy in Last 7 Years?" options={['Yes', 'No']} field="bankruptcy" />;
      case 10:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Annual Household Income?</h2>
              <div className="mb-8">
                <Label htmlFor="annual_income">Annual Income</Label>
                <Input
                  id="annual_income"
                  type="number"
                  value={formData.annual_income}
                  onChange={(e) => setFormData({...formData, annual_income: e.target.value})}
                  className="text-lg"
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(step + 1)} className="flex-1 bg-green-600 hover:bg-green-700">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 11:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Monthly Debt Payments</h2>
              <div className="mb-8">
                <Label htmlFor="monthly_debt">Monthly Debt</Label>
                <Input
                  id="monthly_debt"
                  type="number"
                  value={formData.monthly_debt}
                  onChange={(e) => setFormData({...formData, monthly_debt: e.target.value})}
                  className="text-lg"
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(step + 1)} className="flex-1 bg-green-600 hover:bg-green-700">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 12:
        return <StepCard icon={Building2} title="Employment Status" options={['Employed', 'Self Employed', 'Retired', 'Unemployed']} field="employment_status" />;
      case 13:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tell Us About Yourself</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  By providing your information, you agree to receive communications from BuyWiser.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full max-w-2xl mx-auto">
            <div 
              className="h-full bg-green-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 13) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">Step {step} of 13</p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}