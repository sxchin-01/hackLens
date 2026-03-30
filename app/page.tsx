'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { AnalysisForm } from '@/components/analysis-form';
import { AnalysisResult } from '@/components/analysis-result';
import { LoadingState } from '@/components/loading-state';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const handleAnalyze = async (inputUrl: string) => {
    setUrl(inputUrl);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-12">
        {!result ? (
          <>
            {!loading && <Hero />}
            <div className="w-full max-w-2xl mt-8">
              <AnalysisForm onAnalyze={handleAnalyze} disabled={loading} />
            </div>
            {loading && <LoadingState />}
          </>
        ) : (
          <div className="w-full max-w-4xl">
            <button
              onClick={() => setResult(null)}
              className="mb-6 px-4 py-2 text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              ← Analyze Another Site
            </button>
            <AnalysisResult result={result} url={url} />
          </div>
        )}
      </main>
    </div>
  );
}
