import React from 'react';

export default function GuardianModal({ isOpen, message, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-sanctuary-linen bg-opacity-98 z-[60] overflow-y-auto p-6 transition-all duration-300">
            <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-center py-12 relative">
                <div className="w-full bg-white p-8 md:p-12 shadow-sm border border-sanctuary-stone text-center">
                    <h2 className="font-heading text-3xl mb-6 text-sanctuary-sage">A Moment of Reflection</h2>
                    <p className="text-sm leading-relaxed mb-8 text-sanctuary-ink opacity-80">
                        {message}
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-ink hover:text-sanctuary-linen transition-all duration-300 focus:outline-none"
                        >
                            Reframe Thought
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
