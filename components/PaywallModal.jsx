import React from 'react';

export default function PaywallModal({ open, onClose, onSubscribe, onBuy }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-alien-black border-2 border-alien-green rounded-2xl p-8 max-w-sm w-full shadow-neon text-center">
        <h2 className="alien-title mb-4">Unlock Your Plan</h2>
        <p className="mb-6 text-alien-green">Save or export your full report by becoming a member or purchasing this report.</p>
        <button
          className="alien-btn w-full mb-3"
          onClick={onSubscribe}
        >
          Become a Member
        </button>
        <button
          className="alien-btn w-full mb-3"
          onClick={onBuy}
        >
          Buy This Report – $199
        </button>
        <button
          className="mt-2 text-alien-green underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 