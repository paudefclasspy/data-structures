"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const NotificationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const lastDismissed = localStorage.getItem('popupLastDismissed');
    
    if (!lastDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const closePopup = () => {
    setIsVisible(false);
    localStorage.setItem('popupLastDismissed', Date.now().toString());
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-md rounded-xl overflow-hidden bg-gray-900 border border-purple-500/20 shadow-2xl animate-fade-up">
        {/* Gradient top border */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Coming Soon!
            </h3>
            <button 
              onClick={closePopup}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-3 space-y-3">
            <p className="text-white/90">
              We're excited to announce that interactive tutorials are coming to our Data Structures Visualizer!
            </p>
            
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 translate-y-1.5 rounded-full bg-purple-400"></span>
                <span>Step-by-step guided tutorials for each data structure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 translate-y-1.5 rounded-full bg-purple-400"></span>
                <span>Code examples with syntax highlighting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 translate-y-1.5 rounded-full bg-purple-400"></span>
                <span>More interactive visualizations coming soon</span>
              </li>
            </ul>
            
            <button
              onClick={closePopup}
              className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white font-medium transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;