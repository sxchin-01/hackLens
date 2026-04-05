'use client';

import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Scenario } from '@/lib/ai/scenario-types';
import { getUserStats } from '@/lib/ai/user-tracking';

interface ScenarioResultProps {
  scenario: Scenario;
  userAction: string;
}

export function ScenarioResult({ scenario, userAction }: ScenarioResultProps) {
  const isCorrect = userAction === scenario.correct_action;
  const stats = useMemo(() => getUserStats(), [scenario.id, userAction]);
  const topMistake = stats.commonMistakes[0] ?? null;

  return (
    <Card
      className={isCorrect ? 'border-green-500/40 bg-green-900/10' : 'border-destructive/40 bg-destructive/10'}
    >
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {isCorrect ? '✅ Correct decision' : '❌ Incorrect decision'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2 rounded-md border border-border/60 bg-background/40 p-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                scenario.meta.source === 'ai'
                  ? 'bg-blue-900/30 text-blue-300 border border-blue-500/30'
                  : 'bg-amber-900/30 text-amber-300 border border-amber-500/30'
              }`}
            >
              {scenario.meta.source === 'ai' ? '🧠 AI Generated' : '⚡ Cached Scenario'}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium border ${
                scenario.meta.mode === 'adaptive'
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-secondary/30 text-muted-foreground border-border/50'
              }`}
            >
              {scenario.meta.mode === 'adaptive' ? '🎯 Adaptive Mode' : 'Manual Mode'}
            </span>
          </div>

          {scenario.meta.difficulty_reason && (
            <p className="text-xs text-muted-foreground">{scenario.meta.difficulty_reason}</p>
          )}
        </div>

        <div
          className={`rounded-md border p-3 ${
            isCorrect
              ? 'border-green-500/30 bg-green-900/20 text-green-300'
              : 'border-destructive/40 bg-destructive/20 text-destructive'
          }`}
        >
          <p className="text-sm font-semibold">
            {isCorrect
              ? "✅ Good job! Here's why your choice was correct"
              : '⚠️ You selected an unsafe action'}
          </p>
        </div>

        <div className="space-y-2 rounded-md border border-border/60 bg-background/40 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your action</p>
          <p className="text-sm text-foreground">{userAction}</p>
        </div>

        <div className="space-y-2 rounded-md border border-border/60 bg-background/40 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Recommended action</p>
          <p className="text-sm font-medium text-foreground">{scenario.correct_action}</p>
        </div>

        <div className="space-y-3 rounded-md border border-border/60 bg-background/40 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Red flags missed</p>
          <ul className="space-y-1 text-sm text-foreground/90">
            {scenario.red_flags.map((flag) => (
              <li key={flag} className="flex gap-2">
                <span className="text-destructive">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-border/60 bg-background/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hacker perspective</p>
            <p className="mt-2 text-sm text-foreground/90">{scenario.explanation.hacker}</p>
          </div>

          <div className="rounded-md border border-border/60 bg-background/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">User perspective</p>
            <p className="mt-2 text-sm text-foreground/90">{scenario.explanation.user}</p>
          </div>

          <div className="rounded-md border border-border/60 bg-background/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Developer perspective</p>
            <p className="mt-2 text-sm text-foreground/90">{scenario.explanation.developer}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-md border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm font-semibold text-primary">🛠️ How to Handle This</p>

          <div className={`rounded-md border p-3 ${isCorrect ? 'border-primary/30 bg-background/50' : 'border-destructive/40 bg-destructive/10'}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Immediate Action</p>
            <p className={`mt-1 text-sm font-medium ${isCorrect ? 'text-foreground' : 'text-destructive'}`}>
              {scenario.solution.immediate_action}
            </p>
          </div>

          <div className="rounded-md border border-border/60 bg-background/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prevention Tips</p>
            <ul className="mt-2 space-y-1 text-sm text-foreground/90">
              {scenario.solution.prevention_tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border/60 bg-background/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Best Practices</p>
            <ul className="mt-2 space-y-1 text-sm text-foreground/90">
              {scenario.solution.best_practices.map((practice) => (
                <li key={practice} className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3 rounded-md border border-border/60 bg-background/40 p-4">
          <p className="text-sm font-semibold text-foreground">🧠 Your Weak Areas</p>
          <p className="text-sm text-muted-foreground">
            Overall accuracy: <span className="font-medium text-foreground">{stats.accuracy}%</span>
            {' '}
            ({stats.correctAttempts}/{stats.totalAttempts})
          </p>

          {stats.weakAreas.length > 0 ? (
            <ul className="space-y-1 text-sm text-foreground/90">
              {stats.weakAreas.map((area) => (
                <li key={area} className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>
                    You struggle with {area} attacks ({stats.byType[area]?.accuracy ?? 0}% accuracy)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/80">
              No major weak area detected yet. Keep practicing to improve consistency.
            </p>
          )}

          {topMistake && (
            <p className="text-sm text-foreground/90">
              Most common mistake: <span className="font-medium">{topMistake}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
