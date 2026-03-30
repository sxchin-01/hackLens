'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AnalysisFormProps {
  onAnalyze: (url: string) => void;
  disabled?: boolean;
}

export function AnalysisForm({ onAnalyze, disabled }: AnalysisFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic URL validation
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      onAnalyze(urlObj.toString());
    } catch {
      setError('Please enter a valid URL (e.g., example.com)');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-2">
          Website URL
        </label>
        <div className="flex gap-2">
          <Input
            id="url"
            type="text"
            placeholder="example.com or https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={disabled || !url}
            className="bg-primary hover:bg-accent text-primary-foreground"
          >
            {disabled ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        💡 Tip: You can analyze any public website. We&apos;ll fetch basic security info without
        attacking anything.
      </p>
    </form>
  );
}
