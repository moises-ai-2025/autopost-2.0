import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { Image } from 'lucide-react';

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required')
});

const ForgotPassword: React.FC = () => {
  const { resetPassword, isLoading } = useAuth();
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setResetError(null);
      const { success, message } = await resetPassword(values.email);
      
      if (success) {
        setResetSent(true);
        toast.success(message);
      } else {
        setResetError(message);
        toast.error(message);
      }
    } catch (error) {
      const errorMessage = 'An error occurred. Please try again.';
      setResetError(errorMessage);
      toast.error(errorMessage);
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Image className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {resetSent ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Password reset email sent</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Check your email for instructions to reset your password.</p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Return to login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {resetError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{resetError}</span>
                </div>
              )}
              
              <Formik
                initialValues={{ email: '' }}
                validationSchema={ForgotPasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.email && touched.email ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isLoading ? 'Sending...' : 'Send reset instructions'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
