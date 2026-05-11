// Last reviewed: 2025-01-01 — Verify against current law before production use.

import type { Jurisdiction } from "./types";

export const brazil: Jurisdiction = {
  slug: "brazil",
  name: "Brazil",

  legalTest: "CLT Art. 3 subordination test — Pejotização doctrine",

  legalTestDetail:
    "Brazilian labour law defines an employee (empregado) under Art. 3 of the Consolidação das Leis do Trabalho (CLT) as any individual who provides services of a non-eventual nature to an employer, under their dependence (subordinação), for remuneration (onerosidade), and in a personal capacity (pessoalidade). " +
    "All four elements — habitualidade (non-eventuality/regularity), pessoalidade (personal performance), onerosidade (paid work), and subordinação (subordination or dependence) — must be present for an employment relationship to be recognised. " +
    "Pejotização refers to the practice of requiring workers to incorporate a Pessoa Jurídica (PJ — legal entity/company) to be engaged as a contractor, circumventing CLT protections. " +
    "Brazilian courts, including the Tribunal Superior do Trabalho (TST), consistently disregard the formal PJ arrangement and look at the substantive working reality under the principle of primazia da realidade (primacy of reality) over formal documents. " +
    "Even if a worker is engaged through their own company, if the four CLT elements are present in practice, the relationship will be reclassified as employment.",

  keyRiskFactors: [
    "Worker performs services habitually and regularly (not occasionally or for a discrete project)",
    "Worker performs services personally and cannot delegate or substitute another person",
    "Worker is subordinate to and takes direction from the client's management on how to perform tasks",
    "Worker is economically dependent on this single engagement for substantially all income",
    "Client controls the worker's schedule, location, and method of performing services",
    "Client provides the tools, equipment, or infrastructure necessary to perform the services",
    "Worker was an employee of this same client before being required to incorporate a PJ company",
    "Worker performs activities that are part of the client's core business activity",
    "Fixed monthly payment regardless of deliverables or project completion",
    "Client can terminate the arrangement without cause at any time, similar to dismissal",
  ],

  redFlagClauses: [
    "Requirement that the contractor incorporate a Pessoa Jurídica (PJ) as a condition of engagement",
    "Fixed monthly fee paid to the PJ that mirrors a former or comparable employee salary",
    "Client sets working hours, mandatory presence times, or availability requirements",
    "Worker required to perform services personally with no right of substitution",
    "Client provides the workplace, equipment, software, and tools as if the worker were an employee",
    "No defined project scope or deliverable — engagement is of indefinite duration",
    "Client's management gives day-to-day instructions and supervises how work is performed",
    "Exclusivity clause prohibiting services to other clients during the engagement",
    "PJ registration is newly created at the client's suggestion with no prior business history",
    "Worker receives employee-equivalent benefits (transport allowances, meal vouchers, expense reimbursements) through the PJ",
  ],

  positiveIndicators: [
    "Contractor's PJ entity has a documented history of multiple clients and independent business operations",
    "Contract is for a defined deliverable with acceptance criteria and a fixed total fee",
    "Contractor sets their own work schedule and method without client direction",
    "Genuine right of substitution — contractor can engage subcontractors or assistants",
    "Contractor provides their own tools, equipment, and professional infrastructure",
    "Contract has a clear end date linked to project completion, not indefinite engagement",
  ],

  consequencesOfMisclassification:
    "Reclassification as an employment relationship by the Justiça do Trabalho (Labour Court) entitles the worker to the full CLT statutory package retroactively, including: FGTS (Fundo de Garantia por Tempo de Serviço) deposits of 8% of monthly salary for the full period plus a 40% penalty on the FGTS balance on dismissal; INSS (social security) contributions for both employer and employee shares; paid annual leave (férias) with a constitutional one-third bonus; 13th salary (décimo terceiro salário); and overtime payments at a minimum of 50% premium. " +
    "Moral damages (danos morais) may be awarded to the worker for the inconvenience and harm caused by the fraud. " +
    "The TST applies the principle of primazia da realidade consistently, meaning the PJ structure provides no protection when the underlying relationship is one of employment. " +
    "Labour prosecutors (Ministério Público do Trabalho) can investigate and bring collective claims against companies engaging in systematic pejotização.",

  relevantLaw:
    "Consolidação das Leis do Trabalho (CLT), Decreto-Lei 5.452/1943, Art. 3 (definition of empregado) and Art. 9 (nullity of acts that deprive workers of CLT protections); " +
    "Constituição Federal, Art. 7 (fundamental labour rights including FGTS, 13th salary, annual leave); " +
    "TST Súmula 331 (on outsourcing and recognition of employment relationships); " +
    "Lei 6.019/1974 (as amended by Lei 13.429/2017 and Lei 13.467/2017 — Reforma Trabalhista) on temporary work and outsourcing; " +
    "TST jurisprudence on primazia da realidade and pejotização cases.",

  enforcementBodies: [
    "Justiça do Trabalho (Labour Courts) and Tribunal Superior do Trabalho (TST) — adjudicate employment status and CLT rights claims",
    "Ministério do Trabalho e Emprego (MTE) / Auditores Fiscais do Trabalho — labour inspections and enforcement",
    "Ministério Público do Trabalho (MPT) — prosecutes collective violations of labour law",
    "INSS (Instituto Nacional do Seguro Social) — recovers unpaid social security contributions",
    "Receita Federal do Brasil — tax authority; monitors PJ arrangements for evidence of disguised employment",
  ],
};
