// Last reviewed: 2025-01-01 — Verify against current law before production use.

import type { Jurisdiction } from "./types";

export const france: Jurisdiction = {
  slug: "france",
  name: "France",

  legalTest: "Lien de subordination juridique (faisceau d'indices)",

  legalTestDetail:
    "French courts apply the 'faisceau d'indices' (bundle of indicators) approach to determine whether a lien de subordination juridique (legal subordination link) exists. " +
    "Subordination is established when one party can give orders and instructions, control their execution, and sanction non-compliance by the other. " +
    "No single factor is decisive; courts weigh the totality of the relationship. " +
    "Crucially, the parties' chosen label ('contractor', 'freelance') is disregarded — courts look at the actual working reality (Cour de cassation, Soc., 4 March 2020, n°19-13.316, Uber France).",

  keyRiskFactors: [
    "Client issues instructions specifying how, when, and where work must be performed",
    "Worker is integrated into the client's organisational hierarchy and attends internal meetings",
    "Worker has a fixed schedule set by the client, aligned with client business hours",
    "Worker cannot refuse assignments or choose which tasks to accept",
    "Client provides all or most of the equipment, tools, and software needed",
    "Worker is economically dependent on a single client for substantially all of their income",
    "The client can impose sanctions or terminate the relationship unilaterally for non-performance",
    "Worker performs tasks that are part of the client's core business activity, indistinguishable from employees",
    "Worker has no independent client base and no visible external market presence",
    "Contract automatically renews for an indefinite period with no fixed deliverable scope",
  ],

  redFlagClauses: [
    "Clauses specifying fixed daily or weekly working hours the contractor must observe",
    "Requirements to work exclusively from the client's premises on a regular, ongoing basis",
    "Exclusivity clauses prohibiting any other commercial activity or clients",
    "Client retains the right to unilaterally modify the scope, tasks, or assignment of work",
    "Disciplinary procedures, warnings, or performance improvement plans applicable to the contractor",
    "Mandatory participation in company-wide meetings, team rituals, or training sessions",
    "Fixed monthly retainer paid regardless of deliverables or volume of work completed",
    "No right of substitution — contractor must perform all services personally",
    "Client owns and provides all tools, equipment, and access credentials",
    "Reference to 'hierarchical superiors', 'line managers', or 'reporting lines' in the contract",
  ],

  positiveIndicators: [
    "Contractor bears financial risk: invoices by deliverable, not by time; unpaid if work is not accepted",
    "Contractor has documented multiple other clients and an established independent business",
    "Explicit and genuine right of substitution, exercised in practice",
    "Contractor provides their own equipment and tools at their own expense",
    "Contract is for a defined project with a fixed scope and end date",
    "Contractor sets their own working hours and location without client oversight",
  ],

  consequencesOfMisclassification:
    "Requalification as an employment contract by a tribunal (Conseil de Prud'hommes) entitles the worker to all employee rights retroactively, including unfair dismissal compensation, paid leave, and notice pay. " +
    "URSSAF will issue a back-payment demand for social contributions (cotisations sociales) covering up to 3 years for negligent cases and up to 5 years in cases of fraud, with surcharges of 25–40% on the amounts owed. " +
    "The travail dissimulé (concealed work) offence under Art. L.8221-1 Code du travail carries criminal penalties of up to 3 years' imprisonment and a €45,000 fine for individuals (€225,000 for legal entities), plus a civil indemnity of 6 months' gross salary payable to the worker. " +
    "The company may also be excluded from public procurement and subsidies.",

  relevantLaw:
    "Code du travail Art. L.1221-1 (definition of the employment contract); Art. L.8221-1 to L.8221-6 (travail dissimulé offence and presumption of non-employment for registered traders); " +
    "Cour de cassation, Soc., 4 March 2020, n°19-13.316 (Uber drivers recognised as employees); " +
    "Cour de cassation, Soc., 19 December 2000, n°98-40.572 (foundational faisceau d'indices ruling); " +
    "URSSAF requalification procedure under Code de la sécurité sociale Art. L.311-11.",

  enforcementBodies: [
    "URSSAF (Union de Recouvrement des cotisations de Sécurité Sociale et d'Allocations Familiales) — audits and recovers unpaid social contributions",
    "Inspection du Travail (Labour Inspectorate) — investigates travail dissimulé and labour law breaches",
    "Conseil de Prud'hommes (Industrial Tribunal) — adjudicates worker requalification claims",
    "Cour de cassation (Supreme Court, Social Division) — sets binding precedent on employment status",
  ],
};
