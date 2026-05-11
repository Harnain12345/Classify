import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../public/test-contract.pdf");

const doc = new PDFDocument({ margin: 72, size: "A4" });
doc.pipe(createWriteStream(outPath));

const heading = (text) => {
  doc.moveDown(0.8).font("Helvetica-Bold").fontSize(13).text(text).font("Helvetica").fontSize(11).moveDown(0.3);
};

const body = (text) => {
  doc.font("Helvetica").fontSize(11).text(text, { align: "justify", lineGap: 3 }).moveDown(0.6);
};

const clause = (num, title, text) => {
  doc.font("Helvetica-Bold").fontSize(11).text(`${num}. ${title}`).font("Helvetica").fontSize(11).moveDown(0.2).text(text, { align: "justify", lineGap: 3 }).moveDown(0.6);
};

// Title
doc.font("Helvetica-Bold").fontSize(18).text("INDEPENDENT CONTRACTOR AGREEMENT", { align: "center" }).moveDown(0.3);
doc.font("Helvetica").fontSize(10).fillColor("#666").text("Confidential — For Internal Use", { align: "center" }).fillColor("#000").moveDown(1);

// Parties
heading("PARTIES");
body(
  "This Independent Contractor Agreement (\"Agreement\") is entered into as of 1 January 2025 " +
  "(\"Effective Date\") by and between:\n\n" +
  "Acme Technologies Ltd., a company registered in the United Kingdom, with its principal place " +
  "of business at 10 Canary Wharf, London E14 5AB (\"Company\"); and\n\n" +
  "Jane Smith, an individual residing at 42 High Street, Manchester M1 2AB (\"Contractor\")."
);

// Background
heading("BACKGROUND");
body(
  "The Company wishes to engage the Contractor to provide software development services on the " +
  "terms set out in this Agreement. The parties intend that the Contractor shall perform services " +
  "as an independent contractor and not as an employee of the Company."
);

// Clauses — mix of red flags and clean language for interesting analysis
clause("1", "Services",
  "The Contractor shall provide software engineering services as directed by the Company's " +
  "Head of Engineering from time to time. The Company reserves the right to alter the scope " +
  "of services at its sole discretion and may assign additional tasks to the Contractor as " +
  "business needs require. The Contractor shall attend all team stand-ups, sprint planning " +
  "sessions, and retrospectives as required by the Company."
);

clause("2", "Exclusivity",
  "During the term of this Agreement, the Contractor shall not provide services to any " +
  "competitor of the Company, nor shall the Contractor undertake any other paid employment " +
  "or consultancy work without the prior written consent of the Company. The Contractor " +
  "agrees to devote their full working time and attention exclusively to the Company."
);

clause("3", "Working Hours and Location",
  "The Contractor shall work Monday to Friday, 9:00 AM to 5:30 PM (UK time), from the " +
  "Company's London office unless otherwise agreed in writing. The Contractor shall not " +
  "take holidays without prior approval from their line manager and is entitled to 25 days " +
  "of paid leave per year as determined by the Company."
);

clause("4", "Remuneration",
  "The Company shall pay the Contractor a fixed monthly retainer of £6,500 payable on the " +
  "last business day of each month, regardless of the volume of work completed. The Contractor " +
  "shall submit a monthly invoice to the Company's accounts department."
);

clause("5", "Equipment and Tools",
  "The Company shall provide the Contractor with a laptop, software licences, and all other " +
  "tools necessary to perform the services. The Contractor shall use only Company-provided " +
  "equipment for performing services under this Agreement."
);

clause("6", "Substitution",
  "The Contractor shall perform the services personally and may not substitute or sub-contract " +
  "any part of the services to a third party without the prior written approval of the Company, " +
  "which may be withheld at the Company's absolute discretion."
);

clause("7", "Intellectual Property",
  "All work product, inventions, software, and materials created by the Contractor in connection " +
  "with the services shall be the sole property of the Company and shall be deemed works made " +
  "for hire. The Contractor hereby assigns all intellectual property rights in such materials " +
  "to the Company."
);

clause("8", "Confidentiality",
  "The Contractor shall keep confidential all proprietary information of the Company and shall " +
  "not disclose such information to any third party during or after the term of this Agreement " +
  "without the prior written consent of the Company."
);

clause("9", "Disciplinary Procedures",
  "The Contractor shall be subject to the Company's standard disciplinary and grievance " +
  "procedures as set out in the Company Employee Handbook, a copy of which has been provided " +
  "to the Contractor."
);

clause("10", "Termination",
  "Either party may terminate this Agreement by giving four weeks' written notice to the other. " +
  "The Company may terminate this Agreement immediately for gross misconduct. Upon termination, " +
  "the Contractor shall return all Company property and delete all confidential information."
);

clause("11", "Tax and National Insurance",
  "The Contractor is solely responsible for accounting for and paying all income tax and " +
  "National Insurance contributions due in respect of the fees paid under this Agreement. " +
  "The Company shall have no liability for any taxes or levies payable by the Contractor."
);

clause("12", "Governing Law",
  "This Agreement shall be governed by and construed in accordance with the laws of England " +
  "and Wales. The parties submit to the exclusive jurisdiction of the courts of England and Wales."
);

// Signatures
doc.moveDown(1);
heading("SIGNATURES");
body(
  "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date."
);

doc.moveDown(1);
doc.font("Helvetica").fontSize(11);
doc.text("For and on behalf of Acme Technologies Ltd.", { continued: false });
doc.moveDown(0.3);
doc.text("Signature: _______________________    Date: _______________");
doc.moveDown(0.3);
doc.text("Name: Sarah Johnson    Title: Chief People Officer");
doc.moveDown(1.5);
doc.text("Contractor:");
doc.moveDown(0.3);
doc.text("Signature: _______________________    Date: _______________");
doc.moveDown(0.3);
doc.text("Name: Jane Smith");

doc.end();
console.log(`✓ Test contract written to: ${outPath}`);
