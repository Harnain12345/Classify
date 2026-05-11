// Last reviewed: 2025-01-01 — Verify against current law before production use.

import type { Jurisdiction } from "./types";

export const spain: Jurisdiction = {
  slug: "spain",
  name: "Spain",

  legalTest: "Falso autónomo — Estatuto de los Trabajadores indicators of dependent employment",

  legalTestDetail:
    "Spanish law defines an employed worker under Art. 1.1 of the Estatuto de los Trabajadores (ET) as someone who provides services voluntarily, personally, for remuneration, within the organisational scope and under the direction of another person (ajenidad and subordinación). " +
    "Courts apply a multi-factor analysis to detect a 'falso autónomo' (false self-employed person): someone formally registered as self-employed but whose working reality reflects an employment relationship. " +
    "The TRADE (Trabajador Autónomo Económicamente Dependiente) regime under Ley 20/2007 applies to self-employed persons earning at least 75% of income from a single client, granting limited protections but still not full employment rights. " +
    "The Ley Rider (Ley 12/2021) created a legal presumption that riders delivering for digital platforms are employees, reflecting a broader judicial and legislative trend toward recognising platform workers as employees.",

  keyRiskFactors: [
    "Worker performs services personally with no right to substitute or subcontract",
    "Client dictates the schedule, pace, or methodology for performing the work",
    "Worker is economically dependent on one client for 75% or more of their income",
    "Worker uses client-owned tools, platforms, vehicles, or equipment",
    "Worker cannot set their own rates or negotiate fees independently",
    "Worker is integrated into the client's organisational structure and supervised by a manager",
    "Services are provided continuously and indefinitely, not for a defined project or deliverable",
    "Client applies disciplinary measures or performance management to the worker",
    "Worker performs core business activities rather than a peripheral or specialist function",
    "Contract prohibits the worker from providing similar services to other clients",
  ],

  redFlagClauses: [
    "Exclusivity provisions that prevent the contractor from working for any other client",
    "Fixed working hours or shifts assigned by the client unilaterally",
    "Obligation to follow the client's internal protocols, methodologies, or operational manuals",
    "Payment by the hour or day (not by deliverable), with a fixed monthly invoice amount",
    "Client controls how the work is performed, not just the outcome",
    "Requirement to be physically present at the client's premises on a regular basis",
    "No right of substitution — services must be performed personally at all times",
    "Client provides and owns all tools, access systems, and equipment",
    "Disciplinary clause or reference to the company's conduct or performance policies",
    "Automatic renewal clauses with no defined end date or project scope",
  ],

  positiveIndicators: [
    "Contractor has multiple active clients with documented invoicing history",
    "Contract is for a defined deliverable with a fixed fee, not time-based remuneration",
    "Contractor provides their own tools, software, and professional infrastructure",
    "Explicit and operationally real right of substitution with an identified substitute",
    "Contractor assumes financial risk for defective or late work",
    "Contractor sets their own working hours and chooses their place of work freely",
  ],

  consequencesOfMisclassification:
    "The Inspección de Trabajo y Seguridad Social can issue an 'acta de infracción' and order back-payment of Social Security contributions for all periods of misclassification, plus surcharges and interest. " +
    "Workers can file a claim before the Juzgado de lo Social to have their relationship declared an employment contract, triggering entitlement to severance pay (finiquito), back-paid holiday, sick pay, and unfair dismissal compensation. " +
    "Under Art. 22 Ley General de la Seguridad Social, companies face fines of €3,126 to €187,515 for serious and very serious Social Security infractions. " +
    "The Ley Rider (Ley 12/2021) imposes specific obligations and penalties on digital platform companies that fail to comply with the employee presumption for delivery riders.",

  relevantLaw:
    "Estatuto de los Trabajadores, Real Decreto Legislativo 2/2015, Art. 1.1 (definition of employed worker); " +
    "Ley 20/2007, Estatuto del Trabajo Autónomo, Art. 11 (TRADE definition); " +
    "Ley 12/2021, de 28 de septiembre (Ley Rider — platform delivery worker presumption of employment); " +
    "Tribunal Supremo, Sala de lo Social, STS 805/2023 and prior rulings on Glovo riders; " +
    "Ley General de la Seguridad Social, Real Decreto Legislativo 8/2015, Art. 22 (penalties).",

  enforcementBodies: [
    "Inspección de Trabajo y Seguridad Social (ITSS) — investigates labour and Social Security law breaches",
    "Tesorería General de la Seguridad Social (TGSS) — recovers unpaid Social Security contributions",
    "Juzgados de lo Social / Sala de lo Social del Tribunal Supremo — adjudicates employment status disputes",
    "Agencia Tributaria (AEAT) — tax authority; may flag mismatched contractor/employee treatment",
  ],
};
