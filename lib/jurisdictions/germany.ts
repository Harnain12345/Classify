// Last reviewed: 2025-01-01 — Verify against current law before production use.

import type { Jurisdiction } from "./types";

export const germany: Jurisdiction = {
  slug: "germany",
  name: "Germany",

  legalTest: "Scheinselbstständigkeit — Sozialrechtliche Statusbestimmung under SGB IV § 7",

  legalTestDetail:
    "German law defines employment (Beschäftigung) under § 7(1) SGB IV (Social Code Book IV) as non-independent work performed within an employment relationship, characterised by personal dependence on the instructing party. " +
    "Courts and the Deutsche Rentenversicherung (DRV) assess Scheinselbstständigkeit (bogus self-employment) using a holistic weighing of indicators — no single factor is conclusive. " +
    "§ 7(4) SGB IV sets out a rebuttable presumption of employment if the worker is structurally comparable to employees, works predominantly for one principal, has not employed staff of their own, or performs work typical of an employee. " +
    "Parties may apply for a binding status determination (Statusfeststellungsverfahren) from the DRV Bund before or after the engagement begins; if not applied for and the relationship is later found to be employment, substantial social contribution back-payments become due.",

  keyRiskFactors: [
    "Worker does not employ any staff of their own and operates without a meaningful business infrastructure",
    "Worker derives substantially all income from a single principal over a sustained period",
    "Worker is structurally integrated into the client's team and subject to their organisational directives",
    "Client can issue instructions on how, when, and where the work is performed",
    "Worker uses client-provided equipment, software, or access systems as their primary tools",
    "Worker's work is indistinguishable from that of employees performing the same function",
    "Contract is of indefinite duration with no defined project scope or deliverable",
    "Worker cannot freely delegate tasks or engage subcontractors without client consent",
    "Worker has a fixed monthly payment regardless of deliverables or output",
    "Worker participates in internal management or organisational processes as if an employee",
  ],

  redFlagClauses: [
    "Instructions on the method, sequence, or tools to be used in performing the services",
    "Fixed working hours or core hours that align with the client's standard business hours",
    "Requirement to work exclusively or primarily at the client's premises",
    "Prohibition on working for other clients, especially competitors, during the engagement",
    "Right of the client to unilaterally reassign the contractor to different tasks or projects",
    "No right of substitution — services must be performed by the named contractor personally",
    "Client provides all necessary equipment, software licences, and working materials",
    "Automatic indefinite renewal with no fixed end date or project milestone",
    "Application of the company's internal policies, codes of conduct, or disciplinary procedures",
    "Fixed monthly retainer not linked to deliverables or measurable project milestones",
  ],

  positiveIndicators: [
    "Contractor has multiple clients and documented business infrastructure (own website, marketing, staff or subcontractors)",
    "Contractor provides their own specialised equipment and tools at their own cost",
    "Contract is for a defined project outcome with a fixed fee and acceptance criteria",
    "Explicit and genuinely exercised right of substitution",
    "Contractor bears financial risk: responsible for defects, rework costs, and cost overruns",
    "Contractor has applied for and received a favourable Statusfeststellungsverfahren determination from the DRV",
  ],

  consequencesOfMisclassification:
    "If a relationship is reclassified as employment, both employer and employee social insurance contributions (Rentenversicherung, Krankenversicherung, Pflegeversicherung, Arbeitslosenversicherung) must be paid for the entire period of misclassification, typically covering the past 4 years. " +
    "In cases of intentional or grossly negligent evasion, the limitation period extends to 30 years under § 25(1) SGB IV. " +
    "The principal bears the cost of both the employer's and employee's share of contributions when the employee share can no longer be recovered. " +
    "Additional fines (Bußgelder) can be imposed under Schwarzarbeitsbekämpfungsgesetz (Act against Undeclared Work) for concealed employment. " +
    "The worker gains retroactive entitlement to employee rights including statutory notice, paid leave, and potentially unfair dismissal protection.",

  relevantLaw:
    "Sozialgesetzbuch IV (SGB IV) § 7(1) (definition of employment / Beschäftigung); § 7(4) (rebuttable presumption of employment); § 25(1) (limitation periods); " +
    "Schwarzarbeitsbekämpfungsgesetz (SchwarzArbG) — penalties for undeclared work; " +
    "Bundessozialgericht (BSG) case law on Scheinselbstständigkeit; " +
    "Statusfeststellungsverfahren procedure governed by § 7a SGB IV (voluntary or mandatory clearance procedure through DRV Bund).",

  enforcementBodies: [
    "Deutsche Rentenversicherung (DRV) Bund — conducts Statusfeststellungsverfahren and audits social contributions",
    "Bundeszollverwaltung / Finanzkontrolle Schwarzarbeit (FKS) — investigates undeclared work and Schwarzarbeit",
    "Bundesagentur für Arbeit (BA) — recovers unpaid unemployment insurance contributions",
    "Finanzamt (tax authorities) — income tax implications for reclassified workers",
    "Arbeitsgerichte (Labour Courts) — adjudicates employment status and labour law claims",
  ],
};
