import HeroPanel from "../../components/HeroPanel";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-brand-lightbg flex justify-center font-eloquia">
            <div className="w-full max-w-[1200px] flex flex-row p-4 lg:p-6 gap-6 items-stretch">
                {/* Left Side (50%) */}
                <div className="hidden md:flex w-1/2 h-[calc(100vh-3rem)] min-h-[600px]">
                    <HeroPanel />
                </div>

                {/* Right Side (50% or 100%) */}
                <div className="w-full md:w-1/2 flex justify-center p-6 sm:p-12 h-[calc(100vh-3rem)] min-h-[600px]">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}