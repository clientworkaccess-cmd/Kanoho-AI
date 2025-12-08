import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { WEBHOOK_GENERAL } from '../constants';
import { useToast } from '../hooks/useToast';

const CompanyDetails: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    overview: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    setLoading(true);
    try {
      // Create a formatted text representation
      const fileContent = `
COMPANY PROFILE
---------------
Name: ${formData.companyName}
Email: ${formData.email}
Phone: ${formData.phone}
Website: ${formData.website}
Address: ${formData.address}

OVERVIEW
--------
${formData.overview}
      `.trim();

      const blob = new Blob([fileContent], { type: 'text/plain' });
      const filename = `${formData.companyName.replace(/\s+/g, '_')}_Profile.txt`;

      // 1. Insert Metadata
      const { error: dbError } = await supabase.from('files').insert({
        user_id: user.id,
        name: filename,
        category: 'Company Profile',
        size_mb: blob.size / (1024 * 1024),
        mime_type: 'text/plain',
        status: 'processed',
      });

      if (dbError) throw dbError;

      // 2. Upload to Webhook
      const uploadData = new FormData();
      // Use filename as the key so the webhook sees the actual filename
      uploadData.append(filename, blob, filename);
      
      // Send file_name without extension
      const fileNameNoExt = filename.replace(/\.[^/.]+$/, "");
      uploadData.append('file_name', fileNameNoExt);
      
      uploadData.append('email', user.email);

      const response = await fetch(WEBHOOK_GENERAL, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) throw new Error('Webhook failed');

      addToast('Company profile saved and indexed.', 'success');
      // Reset logic could go here, but usually users want to see what they typed
    } catch (error) {
      console.error(error);
      addToast('Failed to save profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-waveDark-600 dark:text-waveLight-500 tracking-tight">Company Profile</h2>
        <p className="text-waveDark-100 dark:text-waveLight-100 text-sm">Define the core entity data for the AI context.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Company Name" 
              name="companyName"
              required 
              value={formData.companyName} 
              onChange={handleChange} 
              placeholder="Kanoho"
            />
            <Input 
              label="Contact Email" 
              name="email"
              type="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="example@gmail.com"
            />
            <Input 
              label="Phone Number" 
              name="phone"
              type="tel"
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+1 725 432 4433"
            />
            <Input 
              label="Website" 
              name="website"
              type="url"
              value={formData.website} 
              onChange={handleChange} 
              placeholder="https://www.example.com"
            />
          </div>
          <Input 
            label="Address" 
            name="address"
            value={formData.address} 
            onChange={handleChange} 
            placeholder="123 Main Street, Springfield, USA"
          />
          
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-waveDark-100 dark:text-waveLight-100 font-display tracking-widest uppercase">Business Overview</label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              rows={6}
              className="w-full bg-waveDark-500 dark:bg-waveLight-900 border border-waveDark-300 dark:border-waveLight-800 text-waveDark-100 dark:text-waveLight-100 px-3 py-2 focus:outline-none transition-colors font-sans text-sm rounded-lg"
              placeholder="Describe the company mission, products, and services..."
            />
          </div>

          <div className="pt-4 border-t border-waveDark-300 dark:border-waveLight-800 flex justify-end">
            <Button type="submit" isLoading={loading}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanyDetails;