import { describe, expect, it } from "vitest";
import {
  PROVIDER_PRESETS,
  getProviderPresets,
  isProviderPresetId,
} from "../lib/providers/presets";
import { OPENAI_COMPATIBLE_PROVIDER_TYPE } from "../lib/providers/providerTypes";

describe("provider presets", () => {
  it("includes OpenRouter and Omniroute presets", async () => {
    const presets = getProviderPresets();
    const ids = presets.map((p) => p.id);

    expect(ids).toContain("openrouter");
    expect(ids).toContain("omniroute");
  });

  it("configures OpenRouter as an OpenAI Compatible provider", () => {
    const preset = PROVIDER_PRESETS.openrouter;

    expect(preset.name).toBe("OpenRouter");
    expect(preset.type).toBe(OPENAI_COMPATIBLE_PROVIDER_TYPE);
    expect(preset.baseUrl).toBe("https://openrouter.ai/api/v1");
    expect(preset.apiKeyHelpUrl).toBe("https://openrouter.ai/keys");
  });

  it("configures Omniroute as an OpenAI Compatible provider", () => {
    const preset = PROVIDER_PRESETS.omniroute;

    expect(preset.name).toBe("Omniroute");
    expect(preset.type).toBe(OPENAI_COMPATIBLE_PROVIDER_TYPE);
    expect(preset.baseUrl).toBe("http://localhost:20128/v1");
    expect(preset.apiKeyHelpUrl).toBe(
      "https://github.com/diegosouzapw/OmniRoute",
    );
  });

  it("identifies known preset IDs", () => {
    expect(isProviderPresetId("openrouter")).toBe(true);
    expect(isProviderPresetId("omniroute")).toBe(true);
    expect(isProviderPresetId("unknown")).toBe(false);
  });
});
