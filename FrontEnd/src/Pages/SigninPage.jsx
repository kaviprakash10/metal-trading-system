import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, verifyOtp, clearOtpState, googleAuthUser } from "../slice/Authslice";
import Logo2 from "../assets/Logo2.png";
import PassOff from "../assets/PassOff.png";
import PassOn from "../assets/PassOn.png";
import { useGoogleLogin } from "@react-oauth/google";

export default function SigninPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, requiresOtp, otpPhone, otpEmail } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      loginUser({
        formData,
        redirect: (path) => navigate(path, { replace: true }),
      }),
    );
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    dispatch(
      verifyOtp({
        email: otpEmail,
        otp,
        redirect: (path) => navigate(path, { replace: true }),
      }),
    );
  };

  const handleBackToLogin = () => {
    dispatch(clearOtpState());
    setOtp("");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();

        dispatch(
          googleAuthUser({
            email: googleUser.email,
            userName: googleUser.name,
            googleId: googleUser.sub,
            redirect: (path) => navigate(path, { replace: true }),
          })
        );
      } catch (err) {
        console.error("Google login error", err);
      }
    },
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-30 h-30 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full mb-4 shadow-lg overflow-hidden">
            <img
              src={Logo2}
              alt="Luna Gold"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">GoldVault</h1>
          <p className="text-gray-600">
            Welcome back to your investment journey
          </p>
        </div>

        {/* Sign In Form Card / OTP Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {!requiresOtp ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>

              {/* Server Error */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {Array.isArray(error) ? error.join(", ") : error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <img
                          src={PassOff}
                          className="hover:brightness-50 hover:contrast-50 w-5 h-5"
                          alt="Hide password"
                        />
                      ) : (
                        <img
                          src={PassOn}
                          className="hover:brightness-50 hover:contrast-50 w-5 h-5"
                          alt="Show password"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-300 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    Create Account
                  </Link>
                </p>
              </>
              ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                <p className="text-sm text-gray-600 mb-6">
                  An OTP has been sent to your registered number: <span className="font-semibold text-gray-800">{otpPhone}</span>
                </p>

                {/* Server Error */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {Array.isArray(error) ? error.join(", ") : error}
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-300 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Back to Login
                  </button>
                </form>
              </>
          )}
            </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Secure gold investment platform trusted by thousands
          </p>
        </div>
      </div>
      );
}
