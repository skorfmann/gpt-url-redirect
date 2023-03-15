// src/components/Root.tsx
import React, { useState } from 'react';
import config from '../config';

const Root: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const shortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${config.API_ENDPOINT}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl: url }),
    });

    if (response.ok) {
      const { shortUrl } = await response.json();
      setShortenedUrl(shortUrl);
      setErrorMessage('');
    } else {
      const errorResponse = await response.json();
      setErrorMessage(errorResponse.error);
    }
  };

  return (
       <div className="App min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">URL Shortener</h1>
        <form onSubmit={shortenUrl} className="space-y-4">
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white"
            >
              Shorten URL
            </button>
          </div>
        </form>
        {shortenedUrl && (
          <p className="text-indigo-600 font-semibold mt-4">
            Short URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
          </p>
        )}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Root;
