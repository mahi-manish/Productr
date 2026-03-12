import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/form/Button';
import EmailPhoneInput, { validateEmailPhone } from '../../components/form/EmailPhoneInput';
import logo from '../../assets/named-logo.png';

const OTP_LENGTH = 6;

export default function LoginForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(20);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const { login, verifyOtp } = useAuth();
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

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const errorMsg = validateEmailPhone(email);
        if (errorMsg) {
            setEmailError(errorMsg);
            return;
        }

        setEmailError('');
        setError('');
        setLoading(true);

        try {
            const isEmail = email.includes('@');
            const payload = isEmail ? { email } : { phoneNumber: email };
            await login(payload);
            setStep(2);
            setTimer(20);
        } catch (err) {
            if (err.response?.status === 404) {
                setEmailError(err.response?.data?.message || 'Account not found.');
            } else {
                setError(err.response?.data?.message || 'Something went wrong, please retry.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (emailError) setEmailError('');
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
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

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < OTP_LENGTH) {
            setError('Please enter a valid OTP');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const isEmail = email.includes('@');
            const payload = {
                ...(isEmail ? { email } : { phoneNumber: email }),
                otp: otpValue
            };

            await verifyOtp(payload);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong, please retry.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setOtp(Array(OTP_LENGTH).fill(''));
        setError('');
        setTimer(20);
        inputRefs.current[0]?.focus();

        try {
            const isEmail = email.includes('@');
            const payload = isEmail ? { email } : { phoneNumber: email };
            const data = await login(payload);
            if (data.otp) {
                alert(`DEVELOPMENT MODE: Your OTP is ${data.otp}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong, please retry.');
        }
    };

    return (
        <div className="w-full max-w-[350px] h-full flex flex-col py-8">

            {/* Mobile Logo */}
            <div className="flex justify-center mb-8 md:hidden">
                <img src={logo} alt="Productr Logo" className="w-48 h-auto object-contain" />
            </div>

            <div className="flex-grow flex flex-col justify-start">
                <h1 className="text-xl font-bold text-brand-primary mb-6 text-center tracking-wider">
                    Login to your Account
                </h1>

                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} className="space-y-5 mt-4">
                        <EmailPhoneInput
                            value={email}
                            onChange={handleEmailChange}
                            error={emailError}
                            disabled={loading}
                        />

                        {error && (
                            <p className="mt-1.5 text-xs text-red-500 text-center">{error}</p>
                        )}

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Login'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-5 mt-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1.5 tracking-wider">
                                Enter OTP
                            </label>
                            <div className="flex gap-2 justify-between">
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
                                        className={`w-11 h-9 text-center text-base font-normal bg-white border rounded-md focus:outline-none focus:ring-2 transition-all shadow-sm ${error ? 'border-red-400 text-black focus:border-red-400 focus:ring-red-400/20' : 'border-gray-300 text-black focus:border-brand-primary focus:ring-brand-primary/20'
                                            }`}
                                    />
                                ))}
                            </div>
                            {error && (
                                <p className="mt-1.5 text-xs text-red-500">{error}</p>
                            )}
                        </div>

                        <Button type="submit" className="mt-1 tracking-wider" disabled={loading}>
                            {loading ? 'Processing...' : 'Enter your OTP'}
                        </Button>

                        <div className="text-center text-xs text-gray-400">
                            Didn't receive OTP ?{' '}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={timer > 0}
                                className={`font-bold transition-all ${timer > 0
                                    ? 'text-brand-primary cursor-not-allowed'
                                    : 'text-brand-primary hover:underline cursor-pointer'
                                    }`}
                            >
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Signup box */}
            <div className="mt-auto border border-solid border-gray-300 rounded-lg p-3 text-center bg-white shadow-sm">
                <p className="text-xs text-gray-400 mb-0.5">
                    Don't have a Productr Account
                </p>
                <a
                    href="/signup"
                    className="text-brand-primary font-semibold text-xs hover:underline inline-block"
                >
                    SignUp Here
                </a>
            </div>

        </div>
    );
}