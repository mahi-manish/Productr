export default function Button({ children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`w-full bg-brand-primary hover:bg-[#071356] text-white text-sm font-medium py-2 rounded-md shadow hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {children}
        </button>
    );
}
