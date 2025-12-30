// LoginPage.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import Axios from '../utils/Axios';
import { setUserDetails } from '../store/userSlice';
import { setCentres, setCurrentCentre } from '../store/centresSlice';
import { AppDispatch } from '../store';

// Types
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'vendeur' | string;
  centre?: Centre;
}

interface Centre {
  id: string;
  name: string;
  address?: string;
  // Ajoutez d'autres propriétés selon votre structure
}

interface CentresResponse {
  data: Centre[];
  success: boolean;
  message?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

    return newErrors;
  };

  // Gestion des changements
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setLoginError('');
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Appel API de connexion
      const response = await Axios.post<LoginResponse>('/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Stocker les tokens
        if (rememberMe) {
          // Si "Se souvenir de moi" est coché, stocker dans localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        } else {
          // Sinon, stocker dans sessionStorage (expire à la fermeture du navigateur)
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('refreshToken', refreshToken);
        }

        // Mettre à jour Redux avec les infos utilisateur
        dispatch(setUserDetails(user));
        
        // Gestion des centres selon le rôle
        if (user.role === 'vendeur') {
          // vendeur = 1 seul centre
          const centre = user.centre ? [user.centre] : [];
          dispatch(setCentres(centre));
          dispatch(setCurrentCentre(user.centre || null));
        } else if (user.role === 'admin') {
          // admin = récupérer tous les centres
          const centresRes = await Axios.get<CentresResponse>('/api/centres');
          const centres = centresRes.data.data || [];
          console.log('Centres récupérés pour admin:', centres);
          dispatch(setCentres(centres));
          dispatch(setCurrentCentre(centres[0] || null));
        }

        // Navigation
        navigate('/admin');
      } else {
        setLoginError(response.data.message || 'Erreur de connexion');
      }
    } catch (error: any) {
      console.error('Erreur login:', error);

      // Gestion des différents types d'erreurs
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case 404:
            setLoginError('Email ou mot de passe incorrect');
            break;
          case 400:
            setLoginError(message || 'Email ou mot de passe incorrect');
            break;
          case 403:
            setLoginError(message || 'Votre compte a été désactivé');
            break;
          default:
            setLoginError('Une erreur est survenue. Veuillez réessayer.');
        }
      } else if (error.request) {
        setLoginError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        setLoginError('Une erreur inattendue est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Style constants
  const inputClass = `
    w-full px-4 py-3 pl-12 bg-gray-50 border 
    ${errors.email || errors.password ? 'border-red-300' : 'border-gray-300'} 
    rounded-lg focus:outline-none focus:ring-2 
    focus:ring-blue-500 focus:border-transparent 
    transition-all duration-200
    placeholder:text-gray-400
  `;

  const buttonClass = `
    w-full py-3 px-4 rounded-lg font-medium text-white 
    bg-gradient-to-r from-blue-600 to-indigo-600 
    hover:from-blue-700 hover:to-indigo-700 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
    transition-all duration-200 transform hover:-translate-y-0.5 
    disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none
    flex items-center justify-center gap-2
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Carte de connexion */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* En-tête */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion Sécurisée
            </h1>
            <p className="text-gray-600">
              Accédez à votre espace professionnel
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="votre@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                  aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Checkbox "Se souvenir de moi" */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            {/* Message d'erreur global */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{loginError}</p>
                </div>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className={buttonClass}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        {/* Informations de sécurité */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            <Lock className="inline w-3 h-3 mr-1" />
            Vos données sont sécurisées avec un chiffrement SSL 256-bit
          </p>
          <p className="text-xs text-gray-500 mt-1">
            © {new Date().getFullYear()} Ste Desire B.E.A. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;