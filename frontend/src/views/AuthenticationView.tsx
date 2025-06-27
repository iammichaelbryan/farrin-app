import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Plane, ArrowLeft, Mail, Shield, CheckCircle, Plus, X } from 'lucide-react';
import { apiClient } from '@/services/api';
import { LoginDTO, RegisterDTO, PasswordResetDTO, UserResponseDTO, QuestionnaireData, Country } from '@/types';
import TravelQuestionnaire from '@/components/TravelQuestionnaire';
import { useUser } from '@/contexts/UserContext';

type AuthState = 'login' | 'register' | 'password-reset-request' | 'password-reset-code' | 'password-reset-new' | 'email-verification' | 'questionnaire' | 'login-success' | 'register-success' | 'password-reset-success' | 'email-verification-success';

const AuthenticationView: React.FC = () => {
  const navigate = useNavigate();
  const { login, saveQuestionnaireData, refreshUserData } = useUser();
  const [authState, setAuthState] = useState<AuthState>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userResponse, setUserResponse] = useState<UserResponseDTO | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');

  const [loginData, setLoginData] = useState<LoginDTO>({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState<RegisterDTO>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: undefined,
    citizenshipIds: [1,2],
  });

  const [passwordResetData, setPasswordResetData] = useState<PasswordResetDTO>({
    email: '',
    resetCode: '',
    newPassword: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCitizenships, setSelectedCitizenships] = useState<number[]>([0]);

  const displayLoginForm = () => authState === 'login';
  const displayRegistrationForm = () => authState === 'register';
  const displayPasswordResetRequestForm = () => authState === 'password-reset-request';
  const displayPasswordResetCodeForm = () => authState === 'password-reset-code';
  const displayNewPasswordForm = () => authState === 'password-reset-new';
  const displayEmailVerificationForm = () => authState === 'email-verification';
  const displayQuestionnaireForm = () => authState === 'questionnaire';
  const displayRegistrationSuccess = () => authState === 'register-success';
  const displayLoginSuccess = () => authState === 'login-success';
  const displayPasswordResetSuccess = () => authState === 'password-reset-success';
  const displayEmailVerificationSuccess = () => authState === 'email-verification-success';

  const captureRegistrationFormData = () => ({
    email: registerData.email,
    password: registerData.password,
    firstName: registerData.firstName,
    lastName: registerData.lastName,
    dob: new Date(registerData.dateOfBirth),
    citizenshipIds: new Set(registerData.citizenshipIds)
  });

  const captureLoginFormData = () => ({
    email: loginData.email,
    password: loginData.password
  });

  const capturePasswordResetFormData = () => ({
    email: passwordResetData.email,
    resetCode: passwordResetData.resetCode,
    newPassword: passwordResetData.newPassword
  });

  const captureEmailInput = () => passwordResetData.email;

  const redirectToDashboard = () => {
    navigate('/dashboard');
    return true;
  };

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    
    // Standard email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasUppercase) return 'Password must contain at least one uppercase letter';
    if (!hasLowercase) return 'Password must contain at least one lowercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSymbol) return 'Password must contain at least one symbol';
    
    return null;
  };

  const validateForm = (formType: 'login' | 'register' | 'password-reset') => {
    const errors: {[key: string]: string} = {};
    
    if (formType === 'login') {
      const emailError = validateEmail(loginData.email);
      if (emailError) errors.email = emailError;
      
      if (!loginData.password) errors.password = 'Password is required';
    }
    
    if (formType === 'register') {
      if (!registerData.firstName.trim()) errors.firstName = 'First name is required';
      if (!registerData.lastName.trim()) errors.lastName = 'Last name is required';
      
      const emailError = validateEmail(registerData.email);
      if (emailError) errors.email = emailError;
      
      const passwordError = validatePassword(registerData.password);
      if (passwordError) errors.password = passwordError;
      
      if (registerData.password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (!registerData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
      
      if (registerData.citizenshipIds.length === 0) {
        errors.citizenship = 'At least one citizenship is required';
      }
    }
    
    if (formType === 'password-reset') {
      const emailError = validateEmail(passwordResetData.email);
      if (emailError) errors.email = emailError;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        console.log('🔄 Loading countries...');
        const response = await apiClient.getAllCountries();
        console.log('📡 Countries response:', response);
        if (response.success && response.data) {
          console.log('✅ Countries loaded:', response.data.length, 'countries');
          setCountries(response.data);
        } else {
          console.warn('⚠️ Countries response not successful:', response);
        }
      } catch (error) {
        console.error('❌ Failed to load countries:', error);
      }
    };
    loadCountries();
  }, []);

  const addCitizenship = () => {
    setSelectedCitizenships([...selectedCitizenships, 0]);
  };

  // Initialize selectedCitizenships with one empty entry on mount
  useEffect(() => {
    if (selectedCitizenships.length === 0) {
      setSelectedCitizenships([0]);
    }
  }, []);

  const removeCitizenship = (index: number) => {
    if (selectedCitizenships.length > 1) {
      const updatedCitizenships = selectedCitizenships.filter((_, i) => i !== index);
      setSelectedCitizenships(updatedCitizenships);
      setRegisterData({
        ...registerData,
        citizenshipIds: updatedCitizenships.filter(id => id > 0)
      });
    }
  };

  const updateCitizenship = (index: number, countryId: number) => {
    const updatedCitizenships = selectedCitizenships.map((id, i) => 
      i === index ? countryId : id
    );
    setSelectedCitizenships(updatedCitizenships);
    setRegisterData({
      ...registerData,
      citizenshipIds: updatedCitizenships.filter(id => id > 0)
    });
  };


  const onLoginButtonClick = async () => {
    setError('');
    setValidationErrors({});

    if (!validateForm('login')) {
      return false;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.login(loginData);
      if (response.success && response.data) {
        localStorage.setItem('authToken', 'dummy-token');
        
        // Convert UserResponseDTO to User format
        const userData: UserResponseDTO = response.data;
        const userForContext = {
          ...userData,
          dateOfBirth: '',
          dob: '',
          createdAt: new Date().toISOString(),
          citizenshipIds: [],
          citizenships: []
        };
        
        login(userForContext);
        setUserResponse(response.data as UserResponseDTO);
        
        // Check if this is the user's first login using loginCount
        const isFirstLogin = response.data.loginCount === 1;
        
        if (isFirstLogin) {
          setAuthState('login-success');
          setTimeout(() => setAuthState('questionnaire'), 2000);
        } else {
          setAuthState('login-success');
          setTimeout(() => redirectToDashboard(), 2000);
        }
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterButtonClick = async () => {
    setError('');
    setValidationErrors({});

    if (!validateForm('register')) {
      return false;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.register(registerData);
      if (response.success) {
        // Registration successful - store email for verification
        setRegisteredEmail(registerData.email);
        setAuthState('register-success');
        setTimeout(() => setAuthState('email-verification'), 3000);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordResetRequestClick = async () => {
    setError('');
    setValidationErrors({});

    if (!validateForm('password-reset')) {
      return false;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.requestPasswordReset(passwordResetData.email);
      if (response.success) {
        setSuccessMessage('Reset code sent to your email');
        setAuthState('password-reset-code');
        return true;
      } else {
        setError(response.message || 'Failed to send reset code');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordResetSubmitClick = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.resetPassword(passwordResetData);
      if (response.success) {
        setAuthState('password-reset-success');
        setTimeout(() => setAuthState('login'), 3000);
        return true;
      } else {
        setError(response.message || 'Password reset failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailVerificationSubmit = async () => {
    setIsLoading(true);
    setError('');

    if (!registeredEmail) {
      setError('Email not found. Please register again.');
      setIsLoading(false);
      return false;
    }

    try {
      const response = await apiClient.verifyEmail(verificationCode, registeredEmail);
      if (response.success) {
        // Refresh user data if user is already logged in
        try {
          await refreshUserData();
        } catch (refreshError) {
          console.warn('Failed to refresh user data after email verification:', refreshError);
        }
        
        setAuthState('email-verification-success');
        setTimeout(() => setAuthState('login'), 3000);
        return true;
      } else {
        setError(response.message || 'Email verification failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const renderValidationError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      return (
        <p className="text-red-500 text-sm mt-1">{validationErrors[fieldName]}</p>
      );
    }
    return null;
  };

  const renderBackButton = () => {
    if (authState === 'password-reset-request' || authState === 'password-reset-code' || authState === 'password-reset-new') {
      return (
        <button
          onClick={() => setAuthState('login')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </button>
      );
    }
    return null;
  };

  const renderLoginForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600">Sign in to your Farrin account</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onLoginButtonClick(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email (e.g., user@example.com)"
          />
          {renderValidationError('email')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
          {renderValidationError('password')}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setAuthState('password-reset-request')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <button
          onClick={() => setAuthState('register')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );

  const renderRegistrationForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
        <p className="text-gray-600">Join Farrin and start planning your trips</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onRegisterButtonClick(); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              required
              value={registerData.firstName}
              onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {renderValidationError('firstName')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              required
              value={registerData.lastName}
              onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {renderValidationError('lastName')}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {renderValidationError('email')}
          <p className="text-xs text-gray-500 mt-1">Example: user@example.com</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            required
            value={registerData.dateOfBirth}
            onChange={(e) => setRegisterData({ ...registerData, dateOfBirth: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {renderValidationError('dateOfBirth')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender (optional)
          </label>
          <select
            value={registerData.gender || ''}
            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Citizenship(s) {countries.length > 0 && `(${countries.length} countries loaded)`}
            </label>
            <button
              type="button"
              onClick={addCitizenship}
              className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Citizenship
            </button>
          </div>
          <div className="space-y-3">
            {selectedCitizenships.map((countryId, index) => (
              <div key={index} className="flex items-center space-x-2">
                <select
                  value={countryId}
                  onChange={(e) => updateCitizenship(index, parseInt(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required={index === 0}
                >
                  <option value={0}>Select country</option>
                  {countries
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                </select>
                {selectedCitizenships.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCitizenship(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Add all countries where you hold citizenship. This helps determine travel requirements.
          </p>
          {renderValidationError('citizenship')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Min 8 chars: A-Z, a-z, 0-9, symbols"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
          {renderValidationError('password')}
          <p className="text-xs text-gray-500 mt-1">Must contain: uppercase, lowercase, number, and symbol</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {renderValidationError('confirmPassword')}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center">
        <span className="text-gray-600">Already have an account? </span>
        <button
          onClick={() => setAuthState('login')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign in
        </button>
      </div>
    </div>
  );

  const renderPasswordResetRequest = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div className="text-center">
        <Mail className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-600">Enter your email to receive a reset code</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onPasswordResetRequestClick(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={passwordResetData.email}
            onChange={(e) => setPasswordResetData({ ...passwordResetData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
          {renderValidationError('email')}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send Reset Code'}
        </button>
      </form>
    </div>
  );

  const renderPasswordResetCode = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div className="text-center">
        <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Reset Code</h2>
        <p className="text-gray-600">Check your email for the reset code</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); setAuthState('password-reset-new'); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reset Code
          </label>
          <input
            type="text"
            required
            value={passwordResetData.resetCode}
            onChange={(e) => setPasswordResetData({ ...passwordResetData, resetCode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter reset code"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );

  const renderNewPasswordForm = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div className="text-center">
        <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">New Password</h2>
        <p className="text-gray-600">Enter your new password</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onPasswordResetSubmitClick(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={passwordResetData.newPassword}
              onChange={(e) => setPasswordResetData({ ...passwordResetData, newPassword: e.target.value })}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );

  const renderEmailVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Mail className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h2>
        <p className="text-gray-600">Check your email for the verification code</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onEmailVerificationSubmit(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            required
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter verification code"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );

  const handleQuestionnaireComplete = async (questionnaireData: QuestionnaireData) => {
    try {
      const success = await saveQuestionnaireData(questionnaireData);
      if (success) {
        console.log('Questionnaire data saved successfully');
      } else {
        console.warn('Failed to save questionnaire data, proceeding anyway');
      }
    } catch (error) {
      console.error('Error saving questionnaire data:', error);
    }
    
    // Redirect to dashboard regardless of save success
    redirectToDashboard();
  };

  const renderQuestionnaireForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Farrin!</h2>
        <p className="text-gray-600">Let's set up your travel preferences to get personalized recommendations</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          🎉 This is your first time logging in! Complete the travel preferences questionnaire to get started with personalized recommendations.
        </p>
      </div>

      <TravelQuestionnaire
        onComplete={handleQuestionnaireComplete}
        onSkip={redirectToDashboard}
      />
    </div>
  );

  const renderSuccessState = (title: string, message: string) => (
    <div className="text-center space-y-6">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );

  const renderCurrentForm = () => {
    if (displayLoginForm()) return renderLoginForm();
    if (displayRegistrationForm()) return renderRegistrationForm();
    if (displayPasswordResetRequestForm()) return renderPasswordResetRequest();
    if (displayPasswordResetCodeForm()) return renderPasswordResetCode();
    if (displayNewPasswordForm()) return renderNewPasswordForm();
    if (displayEmailVerificationForm()) return renderEmailVerification();
    if (displayRegistrationSuccess()) return renderSuccessState('Account Created!', 'Please check your email to verify your account.');
    if (displayLoginSuccess()) return renderSuccessState('Welcome Back!', 'Redirecting to your dashboard...');
    if (displayPasswordResetSuccess()) return renderSuccessState('Password Reset!', 'Your password has been successfully reset.');
    if (displayEmailVerificationSuccess()) return renderSuccessState('Email Verified!', 'Your account has been verified. Redirecting to login...');
    if (displayQuestionnaireForm()) return renderQuestionnaireForm();
    return renderLoginForm();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="text-center text-white">
          <Plane className="h-20 w-20 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4">Welcome to Farrin</h1>
          <p className="text-xl opacity-90 mb-8">Your Ultimate Travel Companion</p>
          <div className="space-y-4 text-lg opacity-80">
            <div className="flex items-center">
              <span className="mr-3">✈️</span>
              <span>Plan amazing trips with AI recommendations</span>
            </div>
            <div className="flex items-center">
              <span className="mr-3">🗺️</span>
              <span>Manage detailed itineraries</span>
            </div>
            <div className="flex items-center">
              <span className="mr-3">🌍</span>
              <span>Discover destinations worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo for mobile */}
          <div className="text-center lg:hidden">
            <Plane className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Farrin</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {renderCurrentForm()}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationView;