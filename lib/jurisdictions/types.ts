export type Jurisdiction = {
  slug: string;
  name: string;
  legalTest: string;
  legalTestDetail: string;
  keyRiskFactors: string[];
  redFlagClauses: string[];
  positiveIndicators: string[];
  consequencesOfMisclassification: string;
  relevantLaw: string;
  enforcementBodies: string[];
};
