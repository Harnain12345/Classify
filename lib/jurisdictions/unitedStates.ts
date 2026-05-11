// Last reviewed: 2025-01-01 — Verify against current law before production use.

import type { Jurisdiction } from "./types";

export const unitedStates: Jurisdiction = {
  slug: "unitedStates",
  name: "United States",

  legalTest: "ABC Test (California AB5 / Dynamex) and IRS Common-Law / DOL Economic Realities Test",

  legalTestDetail:
    "The United States has no single federal employment classification test; the applicable test depends on the legal context (tax, wage law, benefits) and the state of engagement. " +
    "For federal tax purposes, the IRS applies a common-law control test examining behavioral control, financial control, and the type of relationship (permanency, employee-type benefits, integral work). " +
    "Under the FLSA, the Department of Labor applies an 'economic realities' test focused on whether the worker is economically dependent on the putative employer, using factors including permanency, investment, opportunity for profit/loss, and integration into the business. " +
    "California (under Dynamex Operations West, Inc. v. Superior Court, 4 Cal.5th 903 (2018) and AB5, codified at California Labor Code §2775 et seq.) applies the strict ABC test: a worker is an employee unless the hiring entity proves (A) the worker is free from control and direction in performing the work, (B) the work is outside the usual course of the hiring entity's business, and (C) the worker is customarily engaged in an independently established trade or business. " +
    "Many other states (Massachusetts, New Jersey, Vermont, and others) have adopted similar ABC tests. Always verify the specific state rules for the jurisdiction of performance.",

  keyRiskFactors: [
    "Client controls not just the result but the means, manner, and method of performing the work",
    "Worker performs work that is within the usual course of the client's business (fails ABC Test prong B)",
    "Worker is not independently established in their trade — no other clients, no business infrastructure",
    "Worker is economically dependent on this single engagement for substantially all income",
    "Engagement is indefinite with no fixed project scope, effectively permanent",
    "Client sets the worker's schedule, location, and working hours",
    "Client provides all tools, equipment, and materials necessary to perform the work",
    "Worker receives employee-type benefits or reimbursements (health, expenses, paid leave)",
    "No meaningful right of substitution — worker must perform services personally",
    "Worker has no opportunity for profit or loss based on their own business decisions",
  ],

  redFlagClauses: [
    "Client sets daily or weekly schedules or minimum hour requirements",
    "Worker must follow client's operational procedures, training, or internal methodology",
    "Work performed is the same as work performed by the client's employees",
    "No right to work for other clients, particularly competitors (exclusivity clause)",
    "Client provides all tools, equipment, IT systems, and access credentials",
    "Fixed monthly or weekly payment regardless of deliverables or output",
    "Automatic renewal with no defined project scope or end date",
    "Client retains the right to assign additional tasks at its discretion",
    "No right of substitution, or substitution requiring prior written approval",
    "Employee-equivalent termination notice, performance reviews, or disciplinary procedures",
  ],

  positiveIndicators: [
    "Contractor operates an independently established business with multiple clients (satisfies ABC prong C)",
    "Work is outside the client's usual course of business — specialist or ancillary function (ABC prong B)",
    "Contractor sets their own hours, location, and work methods without client direction (ABC prong A)",
    "Contractor provides their own tools, equipment, and professional infrastructure",
    "Contract is for a defined project with a fixed fee; contractor bears risk of loss or rework",
    "Contractor has their own business entity (LLC or S-Corp), insurance, and independently files taxes",
  ],

  consequencesOfMisclassification:
    "Federal exposure includes back-payment of the employer's share of FICA taxes (Social Security and Medicare) and income tax withholding, plus IRS penalties and interest. " +
    "Under the FLSA, misclassified workers can recover unpaid minimum wages and overtime, liquidated damages equal to the unpaid amount, and attorneys' fees. " +
    "California exposure is particularly severe: AB5 violations subject employers to wage and hour claims under California Labor Code, including waiting time penalties, meal/rest break premiums, and PAGA (Private Attorneys General Act) representative actions, which can aggregate into very large liability. " +
    "State unemployment insurance and workers' compensation contributions may be owed retroactively. " +
    "Note: state laws vary significantly — Massachusetts, New Jersey, and several other states also apply strict ABC tests with comparable exposure. Always assess liability under both the state of the worker's performance and the state of the business entity.",

  relevantLaw:
    "IRS Revenue Ruling 87-41 (twenty factors for employment status under federal tax law); " +
    "Fair Labor Standards Act (FLSA) 29 U.S.C. § 201 et seq. (DOL economic realities test); " +
    "Dynamex Operations West, Inc. v. Superior Court, 4 Cal.5th 903 (2018) (California Supreme Court adopts ABC test); " +
    "California Assembly Bill 5 (AB5), codified at California Labor Code §§ 2775–2787 (2020); " +
    "29 CFR Part 795 (DOL final rule on independent contractor classification under FLSA, 2024); " +
    "NLRA (National Labor Relations Act) — separate 'economic realities' test for collective bargaining purposes.",

  enforcementBodies: [
    "IRS (Internal Revenue Service) — federal tax classification, FICA, and withholding enforcement",
    "DOL Wage and Hour Division — FLSA enforcement, economic realities test",
    "California Labor Commissioner (DLSE) — California wage, hour, and AB5 enforcement",
    "California Employment Development Department (EDD) — state unemployment insurance classification",
    "State Attorneys General — many states have active misclassification enforcement programs",
    "Private plaintiffs and class action attorneys — PAGA representative actions, FLSA collective actions",
  ],
};
