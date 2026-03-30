'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

interface Finding {
  category: string;
  title: string;
  whatINoticed: string;
  howIAttack: string;
  whatCouldHappen: string;
  howToFix: string;
  severity: 'low' | 'medium' | 'high';
}

interface SecurityFindingProps {
  finding: Finding;
}

const severityConfig = {
  high: { bg: 'bg-red-900/20', text: 'text-red-400', label: 'High Risk' },
  medium: { bg: 'bg-yellow-900/20', text: 'text-yellow-400', label: 'Medium Risk' },
  low: { bg: 'bg-blue-900/20', text: 'text-blue-400', label: 'Low Risk' },
};

export function SecurityFinding({ finding }: SecurityFindingProps) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[finding.severity];

  return (
    <Card className="bg-card border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 hover:bg-secondary/20 transition-colors text-left flex items-start justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground">{finding.category}</span>
          </div>
          <h3 className="text-lg font-semibold">{finding.title}</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-border pt-6">
          <div>
            <h4 className="font-semibold text-primary mb-2">🔍 What I Noticed</h4>
            <p className="text-muted-foreground">{finding.whatINoticed}</p>
          </div>

          <div>
            <h4 className="font-semibold text-accent mb-2">😈 How I&apos;d Attack This</h4>
            <p className="text-muted-foreground">{finding.howIAttack}</p>
          </div>

          <div>
            <h4 className="font-semibold text-destructive mb-2">💥 What Could Happen</h4>
            <p className="text-muted-foreground">{finding.whatCouldHappen}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">🛠 How to Fix It</h4>
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-muted-foreground text-sm">{finding.howToFix}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
