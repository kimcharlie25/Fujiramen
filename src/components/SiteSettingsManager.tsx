import React, { useState } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code
      });
      setLogoPreview(siteSettings.site_logo);
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let logoUrl = logoPreview;
      
      // Upload new logo if selected
      if (logoFile) {
        const uploadedUrl = await uploadImage(logoFile, 'site-logo');
        logoUrl = uploadedUrl;
      }

      // Update all settings
      await updateSiteSettings({
        site_name: formData.site_name,
        site_description: formData.site_description,
        currency: formData.currency,
        currency_code: formData.currency_code,
        site_logo: logoUrl
      });

      setIsEditing(false);
      setLogoFile(null);
    } catch (error) {
      console.error('Error saving site settings:', error);
    }
  };

  const handleCancel = () => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code
      });
      setLogoPreview(siteSettings.site_logo);
    }
    setIsEditing(false);
    setLogoFile(null);
  };

  if (loading) {
    return (
      <div className="bg-fuji-darkGray border-2 border-fuji-gold p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-fuji-black rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-fuji-black rounded w-3/4"></div>
            <div className="h-4 bg-fuji-black rounded w-1/2"></div>
            <div className="h-4 bg-fuji-black rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-fuji-darkGray border-2 border-fuji-gold p-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-fuji-red">
        <h2 className="text-3xl font-kanji font-black text-white uppercase tracking-wider">Site Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-fuji-red text-white px-6 py-3 border-2 border-white hover:bg-white hover:text-fuji-red transition-all duration-300 flex items-center space-x-2 font-sans font-bold uppercase tracking-wider"
          >
            <Save className="h-4 w-4" />
            <span>Edit Settings</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="bg-fuji-black text-fuji-gold px-6 py-3 border-2 border-fuji-gold hover:bg-fuji-gold hover:text-fuji-black transition-all duration-300 flex items-center space-x-2 font-sans font-bold uppercase tracking-wider"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-fuji-red text-white px-6 py-3 border-2 border-white hover:bg-white hover:text-fuji-red transition-all duration-300 flex items-center space-x-2 font-sans font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{uploading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Site Logo */}
        <div>
          <label className="block text-sm font-sans font-medium text-fuji-gold mb-3 uppercase tracking-wide">
            Site Logo
          </label>
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 border-2 border-fuji-gold overflow-hidden bg-fuji-black flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Site Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-3xl text-fuji-gold">🍜</div>
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-fuji-black text-fuji-gold px-6 py-3 border-2 border-fuji-gold hover:bg-fuji-gold hover:text-fuji-black transition-all duration-300 flex items-center space-x-2 cursor-pointer font-sans font-bold uppercase tracking-wider"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Logo</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Site Name */}
        <div>
          <label className="block text-sm font-sans font-medium text-fuji-gold mb-3 uppercase tracking-wide">
            Business Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="site_name"
              value={formData.site_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-fuji-black border-2 border-fuji-gold/50 text-white focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans"
              placeholder="Enter business name"
            />
          ) : (
            <p className="text-xl font-kanji font-bold text-white">{siteSettings?.site_name}</p>
          )}
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-sm font-sans font-medium text-fuji-gold mb-3 uppercase tracking-wide">
            Business Description / Tagline
          </label>
          {isEditing ? (
            <textarea
              name="site_description"
              value={formData.site_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-fuji-black border-2 border-fuji-gold/50 text-white focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans"
              placeholder="Enter business description or tagline"
            />
          ) : (
            <p className="text-fuji-gold font-sans">{siteSettings?.site_description}</p>
          )}
        </div>

        {/* Currency Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-sans font-medium text-fuji-gold mb-3 uppercase tracking-wide">
              Currency Symbol
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-fuji-black border-2 border-fuji-gold/50 text-white focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans"
                placeholder="e.g., ₱, $, €"
              />
            ) : (
              <p className="text-xl font-kanji font-bold text-white">{siteSettings?.currency}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-sans font-medium text-fuji-gold mb-3 uppercase tracking-wide">
              Currency Code
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency_code"
                value={formData.currency_code}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-fuji-black border-2 border-fuji-gold/50 text-white focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans"
                placeholder="e.g., PHP, USD, EUR"
              />
            ) : (
              <p className="text-xl font-kanji font-bold text-white">{siteSettings?.currency_code}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
