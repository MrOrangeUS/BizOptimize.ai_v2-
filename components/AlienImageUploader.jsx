import React, { useState } from 'react';

export default function AlienImageUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/did/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        setResult(data);
        // Store the image ID and URL in localStorage for use in avatar generation
        if (typeof window !== 'undefined' && data.id) {
          localStorage.setItem('d-id-image-id', data.id);
        }
        if (typeof window !== 'undefined' && data.url) {
          localStorage.setItem('d-id-image-url', data.url);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/10 p-6 rounded-xl border border-white/20 mt-8">
      <h2 className="text-xl font-bold mb-4 text-white">Upload D-ID Avatar Image</h2>
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}
        className="mb-4 block w-full text-white"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-alien-green text-black font-bold py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div className="mt-4 text-red-400">Error: {error}</div>}
      {result && (
        <div className="mt-4 text-white">
          <div><strong>Image ID:</strong> <span className="font-mono">{result.id}</span></div>
          <div><strong>Image URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-300">View Image</a></div>
        </div>
      )}
    </div>
  );
} 