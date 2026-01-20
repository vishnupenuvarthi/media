import React from 'react';

export const NLRLoader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white/50 backdrop-blur-sm rounded-xl">
            <div className="relative">
                {/* Animated Rings */}
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full w-24 h-24"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full w-24 h-24 animate-spin"></div>

                {/* Center Logo/Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif font-bold text-xl text-primary tracking-tighter">NLR</span>
                </div>
            </div>

            {/* Text Animation */}
            <div className="mt-28 text-center space-y-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-widest uppercase animate-pulse">
                    NLR NEWS
                </h3>
                <p className="text-xs font-medium text-gray-500 tracking-[0.2em] uppercase">
                    {text}
                </p>
            </div>
        </div>
    );
};
