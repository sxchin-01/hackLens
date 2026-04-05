'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateScenario } from '@/lib/ai/scenario-engine';
import { getAdaptiveParams } from '@/lib/ai/adaptive-engine';
import type { Scenario } from '@/lib/ai/scenario-types';
import { logInteraction } from '@/lib/ai/user-tracking';

import { ScenarioControls } from './scenario-controls';
import { ScenarioDisplay } from './scenario-display';
import { ScenarioResult } from './scenario-result';

type ScenarioType = Scenario['type'];
type ScenarioDifficulty = Scenario['difficulty'];
type ScenarioMode = 'demo' | 'live';

export default function SimulateAttack() {
  const [type, setType] = useState<ScenarioType>('phishing');
  const [difficulty, setDifficulty] = useState<ScenarioDifficulty>('medium');
  const [mode, setMode] = useState<ScenarioMode>('demo');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAction, setUserAction] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [adaptiveMode, setAdaptiveMode] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setScenario(null);
    setUserAction(null);
    setShowResult(false);

    try {
      const params = adaptiveMode
        ? getAdaptiveParams()
        : { type, difficulty, selectionMode: 'manual' as const };
      if (adaptiveMode) {
        setType(params.type);
        setDifficulty(params.difficulty);
      }

      const res = await generateScenario(params, mode);
      setScenario(res);
    } finally {
      setLoading(false);
    }
  }

  function handleAction(option: string) {
    setUserAction(option);
    setShowResult(true);

    if (!scenario) {
      return;
    }

    logInteraction({
      scenarioType: scenario.type,
      difficulty: scenario.difficulty,
      isCorrect: option === scenario.correct_action,
      selectedAction: option,
      correctAction: scenario.correct_action,
      redFlags: scenario.red_flags,
      timestamp: Date.now(),
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/70">
        <CardContent className="space-y-3 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Learning Intelligence</p>
            <Button
              type="button"
              variant={adaptiveMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAdaptiveMode((prev) => !prev)}
              disabled={loading}
            >
              {adaptiveMode ? 'Adaptive Mode On' : 'Adaptive Mode Off'}
            </Button>
          </div>

          {adaptiveMode && (
            <p className="text-xs text-muted-foreground">
              🧠 Personalized scenario based on your performance
            </p>
          )}
        </CardContent>
      </Card>

      <ScenarioControls
        type={type}
        setType={setType}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        mode={mode}
        setMode={setMode}
        onGenerate={handleGenerate}
        loading={loading}
      />

      {loading && (
        <Card className="border-border/60 bg-card/70">
          <CardContent className="flex items-center gap-3 py-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="text-sm font-medium text-foreground">🧠 Generating AI scenario...</p>
          </CardContent>
        </Card>
      )}

      {scenario && <ScenarioDisplay scenario={scenario} onAction={handleAction} />}

      {showResult && scenario && userAction && (
        <ScenarioResult scenario={scenario} userAction={userAction} />
      )}
    </div>
  );
}
