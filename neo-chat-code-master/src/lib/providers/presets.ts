import { OPENAI_COMPATIBLE_PROVIDER_TYPE } from "./providerTypes";

export interface ProviderPreset {
  id: string;
  name: string;
  type: typeof OPENAI_COMPATIBLE_PROVIDER_TYPE;
  baseUrl: string;
  apiKeyHelpUrl: string;
}

export const PROVIDER_PRESETS: Record<string, ProviderPreset> = {
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    type: OPENAI_COMPATIBLE_PROVIDER_TYPE,
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyHelpUrl: "https://openrouter.ai/keys",
  },
  omniroute: {
    id: "omniroute",
    name: "Omniroute",
    type: OPENAI_COMPATIBLE_PROVIDER_TYPE,
    baseUrl: "http://localhost:20128/v1",
    apiKeyHelpUrl: "https://github.com/diegosouzapw/OmniRoute",
  },
};

export function getProviderPresets(): ProviderPreset[] {
  return Object.values(PROVIDER_PRESETS);
}

export function isProviderPresetId(id: string): boolean {
  return id in PROVIDER_PRESETS;
}
