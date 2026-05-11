// Last reviewed: 2025-01-01 — Verify against current law before production use.

import type { Jurisdiction } from "./types";

export const italy: Jurisdiction = {
  slug: "italy",
  name: "Italy",

  legalTest: "Subordinazione — Art. 2094 Codice Civile; extended protections under D.Lgs. 81/2015",

  legalTestDetail:
    "Italian law defines the subordinate employee (lavoratore subordinato) under Art. 2094 of the Codice Civile as a person who performs intellectual or manual work in exchange for remuneration, in the service of the employer and under their direction (alle dipendenze e sotto la direzione dell'imprenditore). " +
    "Courts assess subordinazione through indicators including: personal and continuous performance, integration into the employer's organisation, fixed remuneration, compliance with employer's directives, and the employer's power to exercise disciplinary authority. " +
    "D.Lgs. 81/2015 (Jobs Act) extended employment law protections to collaborazioni coordinate e continuative (co.co.co. / parasubordinati): ongoing, coordinated, predominantly personal collaborations where working methods are organised by the client. Under Art. 2 D.Lgs. 81/2015, these workers receive the same protections as employees unless a specific exclusion applies. " +
    "Courts have applied this framework to platform workers: the Corte d'Appello di Torino in 2019 (Foodora riders) and subsequent rulings established that continuous platform work with client-directed organisation triggers employee or worker protections.",

  keyRiskFactors: [
    "Worker performs services personally and continuously over an extended period",
    "Client organises working methods and schedules, exercising organisational direction (etero-organizzazione)",
    "Worker is integrated into the client's operational structure and follows internal procedures",
    "Worker has no other clients and depends economically on this single engagement",
    "Services are remunerated periodically (monthly) rather than on a per-deliverable basis",
    "Client can direct, supervise, and sanction the worker for non-compliance",
    "Worker has no independent business infrastructure, does not invest their own capital",
    "No genuine right to delegate tasks or substitute another person",
    "Work is of indefinite duration with no defined project scope",
    "Worker performs activities that form part of the client's core organisational activity",
  ],

  redFlagClauses: [
    "Obligation to follow the client's operational instructions, internal manuals, or working procedures",
    "Fixed working hours, shifts, or availability windows set by the client",
    "Requirement to work from the client's premises on a regular basis",
    "Monthly fixed fee unrelated to measurable deliverables or output",
    "No right of substitution — performance must always be personal",
    "Client provides all tools, platforms, software, or uniforms required to perform the services",
    "Disciplinary or performance management clause referencing the company's internal policies",
    "Exclusivity clause or restriction on providing similar services to third parties",
    "Automatic renewal with no fixed end date or project milestone",
    "Client supervises the manner and quality of work on an ongoing basis",
  ],

  positiveIndicators: [
    "Contractor has multiple clients with documented invoices across the same period",
    "Contract is for a defined project with a fixed fee, scope, and acceptance criteria",
    "Contractor uses their own equipment, software, and professional tools",
    "Contractor has autonomy over how, when, and where the services are performed",
    "Contractor bears financial risk for defects, delays, or cost overruns",
    "Contract has a defined end date aligned with project completion",
  ],

  consequencesOfMisclassification:
    "Reclassification as an employment contract by the Tribunale del Lavoro entitles the worker to all employee rights retroactively, including back-paid wages to the national collective bargaining agreement (CCNL) minimum, severance (TFR - Trattamento di Fine Rapporto), and paid annual leave. " +
    "INPS (Istituto Nazionale della Previdenza Sociale) will demand back-payment of social security contributions for the entire period of misclassification, with surcharges and interest. " +
    "INAIL (workplace injury insurance) contributions may also be owed. " +
    "Criminal liability arises for wilful evasion of social contributions under D.Lgs. 146/1997. " +
    "Under D.Lgs. 81/2015, workers whose collaboration is 'etero-organizzata' (client-organised) automatically receive employee-equivalent protections, triggering contribution and rights obligations without formal reclassification.",

  relevantLaw:
    "Codice Civile Art. 2094 (definition of lavoratore subordinato); Art. 2222 (autonomous work contract); " +
    "D.Lgs. 81/2015 (Jobs Act), Art. 2 (extension of employment protections to etero-organizzate collaborations); " +
    "Statuto dei Lavoratori, Legge 300/1970 (workers' rights protections); " +
    "Corte d'Appello di Torino, 4 February 2019 (Foodora riders — worker protections applicable to platform workers); " +
    "D.Lgs. 146/1997 (criminal sanctions for social contribution evasion).",

  enforcementBodies: [
    "INPS (Istituto Nazionale della Previdenza Sociale) — recovers unpaid social security contributions",
    "Ispettorato Nazionale del Lavoro (INL) — investigates labour law violations and misclassification",
    "INAIL (Istituto Nazionale Assicurazione Infortuni sul Lavoro) — workplace injury insurance enforcement",
    "Tribunale del Lavoro (Labour Court) — adjudicates employment status disputes",
    "Corte d'Appello, Sezione Lavoro — hears appeals on employment classification",
  ],
};
