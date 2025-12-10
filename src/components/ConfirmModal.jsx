import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Hintergrund (Backdrop) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel} // Schließen beim Klick daneben
      ></div>

      {/* Die Box */}
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 flex-row-reverse"> {/* flex-row-reverse, damit "Bleiben" rechts ist (üblicher für primäre Aktionen) */}
          
          {/* Button: Bleiben (JETZT PRIMÄR in Brand Color) */}
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-[#453ACF] hover:opacity-90 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-indigo-200 active:scale-95"
          >
            Bleiben
          </button>

          {/* Button: Beenden (JETZT SEKUNDÄR in Grau) */}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm active:scale-95"
          >
            Beenden
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;