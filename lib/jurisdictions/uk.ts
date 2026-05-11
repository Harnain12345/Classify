// Last reviewed: 2025-01-01 — Verify against current law before production use.

import type { Jurisdiction } from "./types";

export const uk: Jurisdiction = {
  slug: "uk",
  name: "United Kingdom",

  legalTest: "IR35 / Off-Payroll Working Rules — Employment Status Tests (Ready Mixed Concrete)",

  legalTestDetail:
    "UK employment status law distinguishes three categories: employee, worker, and genuinely self-employed. " +
    "The foundational employment status test comes from Ready Mixed Concrete (South East) Ltd v Minister of Pensions and National Insurance [1968] 2 QB 497, which identified three essential conditions for a contract of service: " +
    "personal service, a wage-work bargain, and the employer having sufficient control. " +
    "The IR35 rules (Chapter 8, Income Tax (Earnings and Pensions) Act 2003) and the off-payroll working rules (Chapter 10 ITEPA 2003, applying to medium/large engagers since April 2021) " +
    "require that if a contractor would be an employee 'but for' their personal service company, income tax and National Insurance are due as if they were employed. " +
    "Key factors assessed by HMRC and courts include: mutuality of obligation, substitution rights, control over how work is performed, financial risk, part-and-parcel integration, and the overall picture of the relationship. " +
    "The Supreme Court in Uber BV v Aslam [2021] UKSC 5 held that Uber drivers were 'workers', emphasising that the written contract is not determinative — courts examine the true nature of the working relationship.",

  keyRiskFactors: [
    "No genuine right of substitution — contractor must perform services personally at all times",
    "Client controls not just the outcome but how and when the work is performed",
    "Strong mutuality of obligation: client must offer work and contractor must accept it",
    "Contractor is integrated into the client's team, uses client email, attends internal meetings",
    "Contractor uses client-provided equipment, IT systems, or access credentials",
    "Fixed daily or monthly rate with no financial risk for defects or cost overruns",
    "Engagement has been continuous for an extended period with no defined project end",
    "Client's organisational structure treats the contractor identically to permanent employees",
    "Contractor has no other clients and derives all income from this engagement",
    "Contract can be terminated at will by the client with little or no notice",
  ],

  redFlagClauses: [
    "Personal service obligation with no practical right of substitution (or substitution requiring client consent)",
    "Fixed working hours or core hours aligned with the client's standard working day",
    "Obligation to work from the client's premises on a regular or continuous basis",
    "Client directs day-to-day tasks and work methodology, not just the overall deliverable",
    "Exclusivity clause prohibiting other clients or employment during the engagement",
    "Fixed monthly or daily rate paid regardless of deliverables achieved",
    "Reference to the client's line management, appraisal, or disciplinary processes",
    "Continuous engagement with automatic renewal and no fixed project scope or end date",
    "Client owns and provides all tools, equipment, and technology required",
    "Termination on notice identical to or shorter than the client's employee notice periods",
  ],

  positiveIndicators: [
    "Genuine and contractually unfettered right of substitution exercised in practice",
    "Contractor bears financial risk: liable for cost of fixing defects or cost overruns",
    "Engagement is for a defined project with a fixed fee, end date, and acceptance criteria",
    "Contractor has multiple other clients and maintains an independent business presence",
    "Contractor provides their own equipment and tools at their own expense",
    "Contractor can set their own hours and working location without client direction",
  ],

  consequencesOfMisclassification:
    "If HMRC determines that IR35 or the off-payroll working rules apply, unpaid income tax (PAYE) and employer's and employee's National Insurance Contributions (NICs) become due for the full period of misclassification. " +
    "Interest accrues on unpaid amounts. Penalties range from 0% (prompted disclosure, reasonable care) to 100% of the unpaid tax for deliberate concealment. " +
    "Since April 2021, medium and large private sector engagers (not the contractor) bear the liability for incorrect IR35 determinations. " +
    "Employment tribunal claims for worker or employee rights — paid holidays, national minimum wage, unfair dismissal — are separate liabilities arising under employment law. " +
    "The reputational and financial exposure is particularly significant for large contractors with multiple off-payroll workers.",

  relevantLaw:
    "Income Tax (Earnings and Pensions) Act 2003 (ITEPA), Chapter 8 (personal service companies) and Chapter 10 (off-payroll working rules, medium/large engagers); " +
    "Ready Mixed Concrete (South East) Ltd v Minister of Pensions and National Insurance [1968] 2 QB 497 (foundational employment status test); " +
    "Uber BV v Aslam [2021] UKSC 5 (Supreme Court — worker status; written contract not determinative); " +
    "Employment Rights Act 1996 (employee rights); " +
    "HMRC Employment Status Manual (ESM) and CEST (Check Employment Status for Tax) online tool.",

  enforcementBodies: [
    "HMRC (His Majesty's Revenue and Customs) — enforces IR35, off-payroll working rules, PAYE, and NICs",
    "Employment Tribunals — adjudicate worker/employee status claims and associated employment rights",
    "Employment Appeal Tribunal and higher courts — set binding precedent on employment status",
  ],
};
