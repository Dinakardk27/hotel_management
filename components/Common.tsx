import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed tracking-wide shadow-sm hover:shadow-lg active:scale-95";
  
  const variants = {
    // New palette: Dark Slate / Blueish Grey for primary
    primary: "bg-slate-800 text-white hover:bg-slate-900 shadow-slate-300/50 border border-transparent",
    // Clean white with soft border for secondary
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-slate-200/50",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-200/50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:shadow-none shadow-none"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgba(148,163,184,0.1)] border border-white/60 overflow-hidden hover:shadow-[0_15px_40px_rgba(148,163,184,0.2)] transition-all duration-500 ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-50",
    Preparing: "bg-blue-50 text-blue-700 border-blue-100 ring-blue-50",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-50",
    Cancelled: "bg-red-50 text-red-700 border-red-100 ring-red-50",
    // Categories
    "Main Course": "bg-slate-100 text-slate-700 border-slate-200",
    "Starters": "bg-orange-50 text-orange-700 border-orange-100",
    "Dessert": "bg-pink-50 text-pink-700 border-pink-100",
    "Drinks": "bg-cyan-50 text-cyan-700 border-cyan-100",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ring-4 ring-opacity-30 ${styles[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
      {status}
    </span>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-300 border border-white/50 relative overflow-hidden ring-1 ring-slate-100">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-300 to-blue-300"></div>
        <div className="flex justify-between items-center mb-6 mt-2">
          <h3 className="text-2xl font-bold text-slate-800 font-heading">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-700 transition-colors">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};