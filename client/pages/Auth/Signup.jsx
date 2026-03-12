import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/form/Button';
import TextInput from '../../components/form/TextInput';
import EmailPhoneInput, { validateEmailPhone } from '../../components/form/EmailPhoneInput';
import logo from '../../assets/named-logo.png';

const OTP_LENGTH = 6;

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    emailPhone: '',
  });
  const [emailPhoneError, setEmailPhoneError] = useState('');

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(20);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const { signup, verifyOtp, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'emailPhone' && emailPhoneError) setEmailPhoneError('');
    if (error) setError('');
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    const err = validateEmailPhone(formData.emailPhone);
    if (err) {
      setEmailPhoneError(err);
      return;
    }

    setError('');
    setEmailPhoneError('');
    setLoading(true);

    try {
      const isEmail = formData.emailPhone.includes('@');
      const payload = {
        fullName: formData.fullName,
        ...(isEmail ? { email: formData.emailPhone } : { phoneNumber: formData.emailPhone }),
      };

      await signup(payload);
      setStep(2);
      setTimer(20);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (otpError) setOtpError('');
    if (error) setError('');

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setError('');
    setTimer(20);
    inputRefs.current[0]?.focus();

    try {
      const isEmail = formData.emailPhone.includes('@');
      const payload = isEmail ? { email: formData.emailPhone } : { phoneNumber: formData.emailPhone };
      await login(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      return handleStep1Submit(e);
    }

    const otpValue = otp.join('');
    if (otpValue.length < OTP_LENGTH) {
      setOtpError('Please enter a valid OTP');
      return;
    }

    setOtpError('');
    setError('');
    setLoading(true);
    try {
      const isEmail = formData.emailPhone.includes('@');
      const payload = {
        ...(isEmail ? { email: formData.emailPhone } : { phoneNumber: formData.emailPhone }),
        otp: otpValue
      };

      await verifyOtp(payload);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-lightbg flex items-center justify-center font-eloquia p-4">
      <div className="w-full max-w-[400px] flex flex-col py-8">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Productr Logo" className="w-48 h-auto object-contain" />
        </div>

        <div className="flex-grow flex flex-col justify-start bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-xl font-bold text-brand-primary mb-6 text-center tracking-wider">
            Create your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}

            <TextInput
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={step === 2 || loading}
              required
            />

            <EmailPhoneInput
              name="emailPhone"
              value={formData.emailPhone}
              onChange={handleChange}
              error={emailPhoneError}
              disabled={step === 2 || loading}
            />

            {step === 2 && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-sm font-small text-gray-700 text-center mb-4">
                  An OTP is being sent to your email/phone
                </p>
                <div className="flex gap-2 justify-center mb-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={loading}
                      className={`w-11 h-11 text-center text-lg font-medium bg-white border rounded-md focus:outline-none focus:ring-2 transition-all shadow-sm ${otpError ? 'border-red-400 text-black focus:border-red-400 focus:ring-red-400/20' : 'border-gray-300 text-black focus:border-brand-primary focus:ring-brand-primary/20'
                        }`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="mt-1.5 text-xs text-red-500 text-center">{otpError}</p>
                )}

                <div className="text-center text-xs text-gray-500 mt-4">
                  Didn't receive OTP ?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0 || loading}
                    className={`font-bold transition-all ${timer > 0
                      ? 'text-brand-primary cursor-not-allowed'
                      : 'text-brand-primary hover:underline cursor-pointer'
                      }`}
                  >
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="mt-6">
              {loading ? 'Processing...' : step === 1 ? 'Sign Up' : 'Submit'}
            </Button>

          </form>
        </div>

        <div className="mt-6 border border-solid border-gray-300 rounded-lg p-3 text-center bg-white shadow-sm">
          <p className="text-xs text-gray-500 mb-0.5">
            Already have an account?
          </p>
          <Link
            to="/login"
            className="text-brand-primary font-semibold text-xs hover:underline inline-block"
          >
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
