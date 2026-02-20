import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    comments: '',
    how_heard: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await base44.entities.ContactSubmission.create({
        ...formData,
        form_type: 'contact'
      });
      
      toast.success('Message sent successfully! We will contact you shortly.');
      setFormData({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        comments: '',
        how_heard: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-64 bg-gradient-to-r from-blue-400 to-purple-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20" />
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="bg-gray-50">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-900 font-medium">5115 Lankershim Blvd #705</p>
                        <p className="text-gray-900">North Hollywood, CA 91601</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-900 font-medium">Phone:</p>
                        <p className="text-gray-900">(818) 300-2642</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-900 font-medium">Email:</p>
                        <p className="text-gray-900">bennett@buywiser.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-gray-600 space-y-2">
                <p className="font-semibold text-gray-900">Office Hours:</p>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: By Appointment</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="phone">Mobile Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
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
                    <Label htmlFor="comments">Your Comments</Label>
                    <Textarea
                      id="comments"
                      rows={4}
                      value={formData.comments}
                      onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="how_heard">How did you hear about us?</Label>
                    <Input
                      id="how_heard"
                      value={formData.how_heard}
                      onChange={(e) => setFormData({...formData, how_heard: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Submit'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By providing your phone number and email, you agree to receive marketing communications from BuyWiser.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}