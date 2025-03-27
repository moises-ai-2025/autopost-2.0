import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { Image, Upload } from 'lucide-react';
import axios from 'axios';

interface BrandIdentityFormValues {
  brandVoice: string;
  targetAudience: string;
}

const BrandIdentitySchema = Yup.object().shape({
  brandVoice: Yup.string().required('Brand voice is required'),
  targetAudience: Yup.string().required('Target audience is required')
});

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

const BrandIdentity: React.FC = () => {
  const { updateUser, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#4F46E5');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
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

  const handleSubmit = async (values: BrandIdentityFormValues) => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      console.log("Starting form submission...");
      
      // Add the selected color to the brand colors
      const brandData = {
        brandColors: [selectedColor],
        brandVoice: values.brandVoice,
        targetAudience: values.targetAudience,
        logo: logoPreview
      };
      
      // Mark setup as complete and save brand data
      updateUser({ 
        setupComplete: true,
        brandData: brandData
      });
      
      // Get the latest user data from localStorage
      const savedUserData = localStorage.getItem('user');
      const userData = savedUserData ? JSON.parse(savedUserData) : currentUser;
      
      // Prepare data for direct API call
      const apiData = {
        nome: userData.name,
        email: userData.email,
        senha: userData.password || '',
        empresa: userData.businessName || '',
        segmentos: userData.businessInfo?.industry || '',
        sub_segmentos: userData.businessInfo?.subIndustry || '',
        voice: values.brandVoice,
        descricao: userData.businessInfo?.description || '',
        cor_primaria: selectedColor,
        target: values.targetAudience
      };
      
      console.log("Sending direct API request with data:", apiData);
      
      // Make direct API call
      const response = await axios.post(
        'https://n8n-blue.up.railway.app/webhook/app/api/create/user', 
        apiData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("API response:", response);
      
      toast.success("Cadastro finalizado com sucesso!");
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
    } catch (error: any) {
      console.error('Error in form submission:', error);
      
      let errorMessage = 'Falha ao finalizar cadastro. Por favor, tente novamente.';
      
      if (error.response) {
        console.log('Error response:', error.response);
        
        if (error.response.status === 409) {
          // User already exists - treat as success
          toast.success("Usuário já cadastrado. Redirecionando para o dashboard.");
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
          return;
        }
        
        errorMessage = error.response.data?.msg || errorMessage;
      }
      
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Define sua identidade de marca
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Isso nos ajuda a criar conteúdo que corresponde ao estilo da sua marca
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{apiError}</span>
            </div>
          )}
          
          <Formik
            initialValues={{
              brandVoice: '',
              targetAudience: ''
            }}
            validationSchema={BrandIdentitySchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo da marca (opcional)
                  </label>
                  <div className="mt-1 flex items-center space-x-5">
                    <div className="flex-shrink-0">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
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

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Salvando...' : 'Finalizar configuração'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BrandIdentity;
