import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Building, Palette, Instagram, Facebook, Twitter, Linkedin, Plus, Upload } from 'lucide-react';

interface ProfileFormValues {
  name: string;
  email: string;
  businessName: string;
  industry: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface BrandingFormValues {
  brandVoice: string;
  targetAudience: string;
  primaryColor: string;
}

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  businessName: Yup.string().required('Business name is required'),
  industry: Yup.string().required('Industry is required')
});

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required')
});

const BrandingSchema = Yup.object().shape({
  brandVoice: Yup.string().required('Brand voice is required'),
  targetAudience: Yup.string().required('Target audience is required')
});

const industries = [
  'Retail',
  'Food & Beverage',
  'Health & Wellness',
  'Professional Services',
  'Technology',
  'Education',
  'Real Estate',
  'Beauty & Personal Care',
  'Home Services',
  'Travel & Hospitality',
  'Entertainment',
  'Other'
];

const voiceOptions = [
  'Professional',
  'Friendly',
  'Casual',
  'Authoritative',
  'Playful',
  'Inspirational',
  'Educational',
  'Conversational'
];

const Settings: React.FC = () => {
  const { currentUser, updateUser, saveUserToDatabase } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingBranding, setIsUpdatingBranding] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(currentUser?.brandData?.logo || null);
  const [selectedColor, setSelectedColor] = useState(currentUser?.brandData?.brandColors?.[0] || '#4F46E5');

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    try {
      setIsUpdatingProfile(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        name: values.name,
        businessName: values.businessName
      });
      
      // Save to database
      await saveUserToDatabase();
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (values: PasswordFormValues) => {
    try {
      setIsUpdatingPassword(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleBrandingUpdate = async (values: BrandingFormValues) => {
    try {
      setIsUpdatingBranding(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would save all the brand info to the backend
      const brandData = {
        ...values,
        brandColors: [selectedColor],
        logo: logoPreview
      };
      
      // Update user with branding info
      updateUser({ 
        brandData: brandData 
      });
      
      // Save to database
      await saveUserToDatabase();
      
      toast.success('Branding information updated successfully!');
    } catch (error) {
      toast.error('Failed to update branding information. Please try again.');
    } finally {
      setIsUpdatingBranding(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <Lock className="h-5 w-5" /> },
    { id: 'business', label: 'Business', icon: <Building className="h-5 w-5" /> },
    { id: 'branding', label: 'Branding', icon: <Palette className="h-5 w-5" /> },
    { id: 'connections', label: 'Connections', icon: <Instagram className="h-5 w-5" /> }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Settings</h2>
                <Formik
                  initialValues={{
                    name: currentUser?.name || '',
                    email: currentUser?.email || '',
                    businessName: currentUser?.businessName || '',
                    industry: currentUser?.businessInfo?.industry || 'Technology' // Default value
                  }}
                  validationSchema={ProfileSchema}
                  onSubmit={handleProfileUpdate}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full name
                          </label>
                          <div className="mt-1">
                            <Field
                              id="name"
                              name="name"
                              type="text"
                              className={`appearance-none block w-full px-3 py-2 border ${
                                errors.name && touched.name ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                          </label>
                          <div className="mt-1">
                            <Field
                              id="email"
                              name="email"
                              type="email"
                              className={`appearance-none block w-full px-3 py-2 border ${
                                errors.email && touched.email ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                            Business name
                          </label>
                          <div className="mt-1">
                            <Field
                              id="businessName"
                              name="businessName"
                              type="text"
                              className={`appearance-none block w-full px-3 py-2 border ${
                                errors.businessName && touched.businessName ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            <ErrorMessage name="businessName" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                            Industry
                          </label>
                          <div className="mt-1">
                            <Field
                              as="select"
                              id="industry"
                              name="industry"
                              className={`appearance-none block w-full px-3 py-2 border ${
                                errors.industry && touched.industry ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            >
                              {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                  {industry}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="industry" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h2>
                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }}
                  validationSchema={PasswordSchema}
                  onSubmit={handlePasswordUpdate}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current password
                        </label>
                        <div className="mt-1">
                          <Field
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            className={`appearance-none block w-full px-3 py-2 border ${
                              errors.currentPassword && touched.currentPassword ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          />
                          <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New password
                        </label>
                        <div className="mt-1">
                          <Field
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            className={`appearance-none block w-full px-3 py-2 border ${
                              errors.newPassword && touched.newPassword ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          />
                          <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm new password
                        </label>
                        <div className="mt-1">
                          <Field
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className={`appearance-none block w-full px-3 py-2 border ${
                              errors.confirmPassword && touched.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          />
                          <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isUpdatingPassword}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {isUpdatingPassword ? 'Atualizando...' : 'Atualizar Senha'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {activeTab === 'branding' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Identidade da Marca</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Estas informações ajudam a criar conteúdo que corresponde ao estilo da sua marca.
                </p>

                <Formik
                  initialValues={{
                    brandVoice: currentUser?.brandData?.brandVoice || '',
                    targetAudience: currentUser?.brandData?.targetAudience || '',
                    primaryColor: currentUser?.brandData?.brandColors?.[0] || '#4F46E5'
                  }}
                  validationSchema={BrandingSchema}
                  onSubmit={handleBrandingUpdate}
                  enableReinitialize
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Logo da marca (opcional)
                        </label>
                        <div className="mt-1 flex items-center space-x-5">
                          <div className="flex-shrink-0">
                            {logoPreview || currentUser?.brandData?.logo ? (
                              <img
                                src={logoPreview || currentUser?.brandData?.logo}
                                alt="Logo preview"
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                <Upload className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                          >
                            Upload
                            <input
                              id="logo-upload"
                              name="logo"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleLogoChange}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Cor primária da marca
                        </label>
                        <div className="mt-1 flex items-center space-x-3">
                          <div
                            className="h-8 w-8 rounded-full border border-gray-300"
                            style={{ backgroundColor: selectedColor }}
                          ></div>
                          <input
                            type="color"
                            value={selectedColor}
                            onChange={handleColorChange}
                            className="h-8 w-16"
                          />
                          <span className="text-sm text-gray-500">{selectedColor}</span>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-700">
                          Tom de voz da marca
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            id="brandVoice"
                            name="brandVoice"
                            className={`appearance-none block w-full px-3 py-2 border ${
                              errors.brandVoice && touched.brandVoice ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          >
                            <option value="">Selecione um tom de voz</option>
                            {voiceOptions.map((voice) => (
                              <option key={voice} value={voice}>
                                {voice}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="brandVoice" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                          Público-alvo
                        </label>
                        <div className="mt-1">
                          <Field
                            as="textarea"
                            id="targetAudience"
                            name="targetAudience"
                            rows={3}
                            className={`appearance-none block w-full px-3 py-2 border ${
                              errors.targetAudience && touched.targetAudience ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Descreva seus clientes ideais..."
                          />
                          <ErrorMessage name="targetAudience" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isUpdatingBranding}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {isUpdatingBranding ? 'Salvando...' : 'Salvar Identidade da Marca'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {activeTab === 'connections' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Social Media Connections</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Connect your social media accounts to enable automatic posting and scheduling.
                </p>

                <div className="space-y-4">
                  {[
                    { name: 'Instagram', icon: <Instagram className="h-6 w-6 text-pink-600" />, connected: false },
                    { name: 'Facebook', icon: <Facebook className="h-6 w-6 text-blue-600" />, connected: true },
                    { name: 'Twitter', icon: <Twitter className="h-6 w-6 text-blue-400" />, connected: false },
                    { name: 'LinkedIn', icon: <Linkedin className="h-6 w-6 text-blue-700" />, connected: true }
                  ].map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{platform.name}</h3>
                          <p className="text-xs text-gray-500">
                            {platform.connected ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <button
                        className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                          platform.connected
                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            : 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {platform.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Platform
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Informações do Negócio</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Gerencie as informações básicas sobre seu negócio.
                </p>
                
                <Formik
                  initialValues={{
                    businessName: currentUser?.businessName || '',
                    industry: currentUser?.businessInfo?.industry || 'Technology',
                    subIndustry: currentUser?.businessInfo?.subIndustry || '',
                    description: currentUser?.businessInfo?.description || '',
                    website: currentUser?.businessInfo?.website || ''
                  }}
                  onSubmit={async (values) => {
                    try {
                      setIsUpdatingProfile(true);
                      updateUser({ 
                        businessName: values.businessName,
                        businessInfo: {
                          industry: values.industry,
                          subIndustry: values.subIndustry,
                          description: values.description,
                          website: values.website
                        }
                      });
                      
                      // Save to database
                      await saveUserToDatabase();
                      
                      toast.success('Informações do negócio atualizadas!');
                    } catch (error) {
                      toast.error('Falha ao atualizar informações.');
                    } finally {
                      setIsUpdatingProfile(false);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                          Nome do negócio
                        </label>
                        <div className="mt-1">
                          <Field
                            id="businessName"
                            name="businessName"
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                          Segmento
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            id="industry"
                            name="industry"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            {industries.map((industry) => (
                              <option key={industry} value={industry}>
                                {industry}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subIndustry" className="block text-sm font-medium text-gray-700">
                          Sub-segmento (opcional)
                        </label>
                        <div className="mt-1">
                          <Field
                            id="subIndustry"
                            name="subIndustry"
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Ex: Software B2B, Restaurante Italiano, etc."
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Descrição do negócio
                        </label>
                        <div className="mt-1">
                          <Field
                            as="textarea"
                            id="description"
                            name="description"
                            rows={4}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Descreva brevemente o que seu negócio faz..."
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Website (opcional)
                        </label>
                        <div className="mt-1">
                          <Field
                            id="website"
                            name="website"
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Salvando...' : 'Salvar Informações'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
