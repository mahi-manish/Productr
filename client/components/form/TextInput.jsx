export default function TextInput({ label, error, className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-bold text-gray-900 mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={`w-full border rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 shadow-sm bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:opacity-70 ${
                    error 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                        : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20'
                }`}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}
