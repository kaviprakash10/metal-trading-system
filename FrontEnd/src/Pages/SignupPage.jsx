import "../App.css";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../slice/Authslice';
import Logo2 from '../assets/Logo2.png';
import PassOff from '../assets/PassOff.png';
import PassOn from '../assets/PassOn.png';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setClientError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setClientError('Passwords do not match');
      return;
    }

    const redirect = () => navigate('/login');

    dispatch(registerUser({
      formData: {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      },
      redirect,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 via-white to-amber-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elemets (Keeping subtle for depth) */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/40 pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>

      <div className="w-full max-w-[520px] relative z-10 animate-scale-in">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[32px] mb-6 shadow-2xl shadow-amber-900/10 p-4 border border-amber-50 group transition-transform hover:scale-110">
            <img src={Logo2} alt="Luna Gold" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter uppercase">Luna <span className="text-amber-600">Gold</span></h1>
          <p className="text-gray-400 font-light text-lg">Invest in the world's most stable asset</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[44px] shadow-2xl shadow-amber-900/5 p-10 md:p-12 border border-white animate-slide-up [animation-delay:200ms]">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Create your Account</h2>

          {/* Server/Client Errors */}
          {(error || clientError) && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-shake">
              {clientError || (Array.isArray(error) ? error.join(', ') : error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Name */}
            <div className="space-y-2">
              <label htmlFor="userName" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Display Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none text-gray-900 font-medium"
                placeholder="How should we address you?"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none text-gray-900 font-medium"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Password Grid */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none pr-12 text-gray-900 font-medium"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity">
                      {showPassword ? <img src={PassOff} className="w-4 h-4" /> : <img src={PassOn} className="w-4 h-4" />}
                    </button>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none pr-12 text-gray-900 font-medium"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity">
                      {showConfirmPassword ? <img src={PassOff} className="w-4 h-4" /> : <img src={PassOn} className="w-4 h-4" />}
                    </button>
                  </div>
               </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/30 border border-amber-100/50">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-5 h-5 accent-amber-600 rounded cursor-pointer"
                required
              />
              <label htmlFor="agreeToTerms" className="text-xs text-gray-500 leading-relaxed font-medium">
                I acknowledge the{' '}
                <a href="#" className="text-amber-700 font-bold hover:underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-amber-700 font-bold hover:underline">Privacy Policy</a>
                {' '}of Luna Gold Pvt Ltd.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-amber-600/20 hover:shadow-amber-600/30 hover:from-amber-700 hover:to-amber-800 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-10 text-center">
            <p className="text-gray-400 font-light">
               Already have an account?{' '}
               <Link to="/login" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">
                 Sign in
               </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-10 uppercase tracking-[0.2em] font-medium">
          Trusted by 50,000+ investors nationwide
        </p>
      </div>
    </div>
  );
}
