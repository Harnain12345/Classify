// Last reviewed: 2025-01-01 — Verify against current law before production use.

import type { Jurisdiction } from "./types";

export const netherlands: Jurisdiction = {
  slug: "netherlands",
  name: "Netherlands",

  legalTest: "Gezagsverhouding (authority relationship) — Art. 7:610 BW; Wet DBA enforcement",

  legalTestDetail:
    "Under Dutch law, an employment contract (arbeidsovereenkomst) exists when three elements are present under Art. 7:610 Burgerlijk Wetboek (BW): (1) the worker performs work personally (arbeid), (2) the employer pays remuneration (loon), and (3) there is a relationship of authority (gezagsverhouding) — the employer can give binding instructions on how the work is done. " +
    "The Hoge Raad (Supreme Court) in its Deliveroo ruling (ECLI:NL:HR:2023:443, 24 March 2023) confirmed that all circumstances of the working relationship must be considered holistically, not just the written contract — a so-called 'holistic assessment' using nine factors from the X/Municipality of Amsterdam ruling. " +
    "The Wet DBA (Wet Deregulering Beoordeling Arbeidsrelaties, 2016) replaced the VAR (Verklaring Arbeidsrelatie) system; model agreements approved by the Belastingdienst can provide a safe harbour, but only if the actual working relationship matches the model. " +
    "The Belastingdienst's enforcement moratorium on Wet DBA ended on 1 January 2025; active enforcement of payroll tax obligations is now underway for engagements that qualify as employment.",

  keyRiskFactors: [
    "Client gives binding instructions on how (not just what) the work should be performed",
    "Worker is integrated into the client's team structure and treated as part of the workforce",
    "No genuine right of substitution — worker must perform services personally",
    "Worker depends economically on a single client for substantially all income",
    "Engagement is of indefinite duration with no fixed project scope or end date",
    "Client-set working hours, availability requirements, or shift patterns",
    "Worker uses client-provided equipment, tools, software, or access systems",
    "Work performed is part of the client's regular business activity (not a peripheral project)",
    "Fixed periodic payment regardless of output or project milestones",
    "Worker has no independently established business, clients, or market presence",
  ],

  redFlagClauses: [
    "Instructions on the manner, method, or sequence in which services must be performed",
    "Fixed working hours or core availability windows set by the client",
    "Requirement to work from the client's premises on a regular or full-time basis",
    "Exclusivity clause preventing services to other clients, particularly competitors",
    "No right of substitution, or substitution requiring client approval at its absolute discretion",
    "Client provides all tools, equipment, and access credentials necessary for the work",
    "Fixed monthly or weekly payment unlinked to project milestones or deliverables",
    "Application of the client's internal HR policies, codes of conduct, or disciplinary procedures",
    "Indefinite contract with automatic renewal and no exit linked to project completion",
    "Reference to the worker's line manager, supervisor, or reporting line within the company",
  ],

  positiveIndicators: [
    "Contractor has multiple other clients with documented invoices over the same period",
    "Contract is for a defined deliverable with a fixed fee and clear acceptance criteria",
    "Contractor provides their own equipment and professional infrastructure",
    "Genuine and exercised right of substitution with a named or identifiable substitute",
    "Contractor bears financial risk for quality of output and cost overruns",
    "Engagement was initiated under a Belastingdienst-approved model agreement and actual working conditions match that model",
  ],

  consequencesOfMisclassification:
    "Since 1 January 2025, the Belastingdienst actively enforces Wet DBA and will issue additional payroll tax (loonheffingen) assessments covering the period of misclassification, with potential retroactive effect. " +
    "The client (opdrachtgever) may be required to pay the employer's payroll tax and social contributions (premies werknemersverzekeringen) as if an employment relationship existed. " +
    "The worker gains entitlement to all statutory employee rights retroactively, including minimum wage, holiday pay, and dismissal protection under the Wet werk en zekerheid (Wwz). " +
    "Substantial fines can be imposed for repeated or wilful misclassification. " +
    "The Deliveroo Supreme Court ruling (2023) confirmed that Deliveroo riders were employees, serving as a landmark precedent for platform economy engagements.",

  relevantLaw:
    "Burgerlijk Wetboek (BW) Art. 7:610 (definition of employment contract); Art. 7:611 (good employership obligations); " +
    "Wet Deregulering Beoordeling Arbeidsrelaties (Wet DBA), 2016 (replaces VAR system); " +
    "Hoge Raad, 24 March 2023, ECLI:NL:HR:2023:443 (Deliveroo — riders classified as employees, holistic assessment confirmed); " +
    "Hoge Raad, 6 November 2020, ECLI:NL:HR:2020:1745 (X/Municipality of Amsterdam — nine-factor holistic test); " +
    "Wet minimumloon en minimumvakantiebijslag (WML) — minimum wage obligations applicable on reclassification.",

  enforcementBodies: [
    "Belastingdienst (Dutch Tax and Customs Administration) — enforces Wet DBA, payroll tax (loonheffingen) obligations; enforcement moratorium ended 1 January 2025",
    "Nederlandse Arbeidsinspectie (NLA) — investigates labour law violations, including schijnzelfstandigheid",
    "Rechtbanken (District Courts) and Hoge Raad (Supreme Court) — adjudicate employment status disputes",
    "UWV (Uitvoeringsinstituut Werknemersverzekeringen) — administers employee insurance contributions",
  ],
};
