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
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Company Intelligence</h2>
        <p className="text-slate-500 dark:text-zinc-500 text-sm">Define the core entity data for the AI context.</p>
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
            />
            <Input 
              label="Contact Email" 
              name="email"
              type="email"
              value={formData.email} 
              onChange={handleChange} 
            />
            <Input 
              label="Phone Number" 
              name="phone"
              type="tel"
              value={formData.phone} 
              onChange={handleChange} 
            />
            <Input 
              label="Website" 
              name="website"
              type="url"
              value={formData.website} 
              onChange={handleChange} 
            />
          </div>
          <Input 
            label="Address" 
            name="address"
            value={formData.address} 
            onChange={handleChange} 
          />
          
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 font-display tracking-widest uppercase">Business Overview</label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 px-3 py-2 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500/50 transition-colors font-sans text-sm rounded-lg"
              placeholder="Describe the company mission, products, and services..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
            <Button type="submit" isLoading={loading}>
              Save & Index Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanyDetails;