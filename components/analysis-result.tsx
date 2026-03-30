'use client';

import { Card } from '@/components/ui/card';
import { SecurityFinding } from './security-finding';

interface Finding {
  category: string;
  title: string;
  whatINoticed: string;
  howIAttack: string;
  whatCouldHappen: string;
  howToFix: string;
  severity: 'low' | 'medium' | 'high';
}

interface AnalysisResultProps {
  result: any;
  url: string;
}

export function AnalysisResult({ result, url }: AnalysisResultProps) {
  if (result.error) {
    return (
      <Card className="bg-card border border-border p-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-muted-foreground">{result.error}</p>
          <p className="text-sm text-muted-foreground mt-4">
            This might happen if the website is unreachable or blocked from analysis.
          </p>
        </div>
      </Card>
    );
  }

  const findings: Finding[] = result.findings || [];

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border p-6">
        <h2 className="text-2xl font-bold mb-2">Security Analysis Report</h2>
        <p className="text-muted-foreground">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent"
          >
            {url}
          </a>
        </p>
        <div className="mt-4 flex gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Findings</p>
            <p className="text-2xl font-bold text-primary">{findings.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Severity Mix</p>
            <div className="flex gap-2 mt-1">
              {findings.filter((f) => f.severity === 'high').length > 0 && (
                <span className="px-2 py-1 bg-red-900/20 text-red-400 text-xs rounded">
                  High
                </span>
              )}
              {findings.filter((f) => f.severity === 'medium').length > 0 && (
                <span className="px-2 py-1 bg-yellow-900/20 text-yellow-400 text-xs rounded">
                  Medium
                </span>
              )}
              {findings.filter((f) => f.severity === 'low').length > 0 && (
                <span className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded">
                  Low
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {findings.length === 0 ? (
        <Card className="bg-card border border-border p-8 text-center">
          <p className="text-lg font-semibold mb-2">🎉 Looks Pretty Solid!</p>
          <p className="text-muted-foreground">
            This website appears to have good basic security practices. But remember,
            security is never 100% perfect—there&apos;s always room to improve!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Here&apos;s what I found. Click on each finding to learn more.
          </p>
          {findings.map((finding, index) => (
            <SecurityFinding key={index} finding={finding} />
          ))}
        </div>
      )}

      <Card className="bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-3">🤝 Remember</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ Security is a journey, not a destination</li>
          <li>✓ Always test changes in a safe environment first</li>
          <li>✓ Keep learning and stay curious about security</li>
          <li>
            ✓ If you find real vulnerabilities, report them responsibly to the site owner
          </li>
        </ul>
      </Card>
    </div>
  );
}
