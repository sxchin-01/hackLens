import { getCachedScenario } from "./scenario-generator";
import { generateScenarioWithLLM } from "./llm-client";
import { canMakeAIRequest, getCooldownTime } from "./rate-limiter";
import type { Scenario, ScenarioParams } from "./scenario-types";

type ScenarioMode = "demo" | "live";

const DEFAULT_PARAMS: ScenarioParams = {
  type: "phishing",
  difficulty: "easy",
};

const aiCache = new Map<string, Scenario>();

function getAiCacheKey(params: ScenarioParams): string {
  return `${params.type}-${params.difficulty}`;
}

function withMeta(
  scenario: Scenario,
  params: ScenarioParams,
  source: Scenario["meta"]["source"]
): Scenario {
  const mode: Scenario["meta"]["mode"] = params.selectionMode ?? "manual";

  return {
    ...scenario,
    meta: {
      source,
      mode,
      ...(mode === "adaptive" && params.difficultyReason
        ? { difficulty_reason: params.difficultyReason }
        : {}),
    },
  };
}

function resolveScenario(params: ScenarioParams): Scenario {
  const primary = getCachedScenario(params);
  if (primary) {
    return primary;
  }

  const fallback = getCachedScenario(DEFAULT_PARAMS);
  if (fallback) {
    return fallback;
  }

  throw new Error("No scenarios are available in cache.");
}

export async function generateScenario(
  params: ScenarioParams,
  mode: ScenarioMode = "demo"
): Promise<Scenario> {
  if (mode === "demo") {
    return withMeta(resolveScenario(params), params, "cached");
  }

  if (typeof window !== "undefined") {
    console.warn("Live AI generation is server-side only, using cached AI");
    return withMeta(resolveScenario(params), params, "cached");
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn("No API key found, using cached AI");
    return withMeta(resolveScenario(params), params, "cached");
  }

  const cacheKey = getAiCacheKey(params);
  const cachedAiScenario = aiCache.get(cacheKey);
  if (cachedAiScenario) {
    return withMeta(cachedAiScenario, params, "ai");
  }

  if (!canMakeAIRequest()) {
    const cooldown = getCooldownTime();
    console.warn(`Rate limit exceeded, falling back${cooldown > 0 ? ` (${cooldown}s cooldown)` : ""}`);
    return withMeta(resolveScenario(params), params, "cached");
  }

  try {
    const generated = await generateScenarioWithLLM(params);
    aiCache.set(cacheKey, generated);
    return withMeta(generated, params, "ai");
  } catch {
    return withMeta(resolveScenario(params), params, "cached");
  }
}

export type { Scenario, ScenarioParams } from "./scenario-types";
