import { france } from "./france";
import { spain } from "./spain";
import { germany } from "./germany";
import { uk } from "./uk";
import { italy } from "./italy";
import { netherlands } from "./netherlands";
import { unitedStates } from "./unitedStates";
import { brazil } from "./brazil";
import type { Jurisdiction } from "./types";

export type { Jurisdiction };

export const jurisdictions: Record<string, Jurisdiction> = {
  france,
  spain,
  germany,
  uk,
  italy,
  netherlands,
  unitedStates,
  brazil,
};

export const getJurisdiction = (slug: string): Jurisdiction | null =>
  jurisdictions[slug] ?? null;

export const COUNTRY_OPTIONS = [
  { slug: "brazil",       name: "Brazil",         flag: "🇧🇷" },
  { slug: "france",       name: "France",         flag: "🇫🇷" },
  { slug: "germany",      name: "Germany",        flag: "🇩🇪" },
  { slug: "italy",        name: "Italy",          flag: "🇮🇹" },
  { slug: "netherlands",  name: "Netherlands",    flag: "🇳🇱" },
  { slug: "spain",        name: "Spain",          flag: "🇪🇸" },
  { slug: "uk",           name: "United Kingdom", flag: "🇬🇧" },
  { slug: "unitedStates", name: "United States",  flag: "🇺🇸" },
] as const;
