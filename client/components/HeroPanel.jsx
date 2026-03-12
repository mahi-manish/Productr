import { Link } from 'react-router-dom';
import abstractBg from '../assets/abstract.png';
import runningImg from '../assets/running.jpg';
import namedLogo from '../assets/named-logo.png';

export default function HeroPanel() {
    return (
        <div className="w-full h-full min-h-[600px] rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center shadow-sm">

            {/* Abstract Background Overlay */}
            <div className="absolute inset-0 z-0">
                <img src={abstractBg} alt="Abstract Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#e0e7ff]/40 via-[#f3e8ff]/40 to-[#ffedd5]/40 mix-blend-overlay pointer-events-none"></div>
            </div>

            {/* Logo */}
            <Link to="/" className="absolute top-5 left-5 z-20 block cursor-pointer">
                <img src={namedLogo} alt="Productr Logo" className="h-6 w-auto" />
            </Link>

            {/* Center Card */}
            <div className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] aspect-[2/3] bg-gradient-to-t from-[#3A1C14] via-[#cc5c15] to-[#f9a826] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col justify-end p-8 overflow-hidden border border-white/20 relative">
                {/* Silhouette Image */}
                <div className="absolute inset-0 z-0 mix-blend-overlay opacity-80">
                    <img src={runningImg} alt="Running silhouette" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a0e05]/90 via-[#2a0e05]/20 to-transparent z-0 pointer-events-none"></div>

                <h3 className="text-white text-xl font-medium tracking-wide text-center leading-tight relative z-10 drop-shadow-md pb-4">
                    Uplist your<br />product to market
                </h3>
            </div>
        </div>
    );
}