import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public");

function makePdf(filename, title, content) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 72, size: "A4" });
    const stream = createWriteStream(join(outDir, filename));
    doc.pipe(stream);

    const heading = (text) => {
      doc.moveDown(0.8).font("Helvetica-Bold").fontSize(12).text(text)
         .font("Helvetica").fontSize(11).moveDown(0.3);
    };

    const clause = (num, title, text) => {
      doc.font("Helvetica-Bold").fontSize(11).text(`${num}. ${title}`)
         .font("Helvetica").fontSize(11).moveDown(0.2)
         .text(text, { align: "justify", lineGap: 3 }).moveDown(0.6);
    };

    // Title
    doc.font("Helvetica-Bold").fontSize(17)
       .text(title, { align: "center" }).moveDown(0.3);
    doc.font("Helvetica").fontSize(10).fillColor("#666")
       .text("Confidential — For Internal Use", { align: "center" })
       .fillColor("#000").moveDown(1);

    content(heading, clause, doc);

    doc.end();
    stream.on("finish", () => { console.log(`✓ ${filename}`); resolve(); });
  });
}

// ── Contract 1: France (HIGH RISK) ───────────────────────────────────────────
await makePdf("test-contract-france.pdf", "CONTRAT DE PRESTATION DE SERVICES INDÉPENDANT", (heading, clause, doc) => {
  heading("PARTIES");
  doc.font("Helvetica").fontSize(11).text(
    'Ce contrat est conclu entre Acme SAS, société enregistrée en France, 12 Rue de la Paix, 75001 Paris ("Société") ' +
    'et Marie Dupont, consultante indépendante, 8 Avenue Victor Hugo, Lyon 69001 ("Prestataire").', { align: "justify" }
  ).moveDown(0.8);

  clause("1", "Objet et Étendue des Services",
    'Le Prestataire devra fournir des services de développement logiciel conformément aux instructions journalières ' +
    'de la Direction Technique de la Société. La Société se réserve le droit de modifier unilatéralement la portée ' +
    'des missions confiées selon les besoins opérationnels. Le Prestataire intégrera les équipes produit et participera ' +
    'à toutes les réunions d\'équipe, stand-ups quotidiens, et sessions de planification sprint.'
  );

  clause("2", "Exclusivité",
    'Pendant toute la durée du présent contrat, le Prestataire s\'engage à ne fournir aucune prestation de services ' +
    'à un concurrent direct ou indirect de la Société, et à consacrer l\'intégralité de son temps professionnel ' +
    'aux missions confiées par la Société. Toute activité professionnelle extérieure est soumise à l\'accord préalable ' +
    'écrit de la Direction des Ressources Humaines.'
  );

  clause("3", "Horaires et Lieu de Travail",
    'Le Prestataire exercera ses missions du lundi au vendredi de 9h00 à 18h00 depuis les locaux de la Société ' +
    'situés 12 Rue de la Paix, Paris. Toute absence devra être préalablement autorisée par le responsable hiérarchique ' +
    'du Prestataire. Le Prestataire bénéficiera de 25 jours de congés payés annuels fixés en accord avec la Société.'
  );

  clause("4", "Rémunération",
    'La Société versera au Prestataire une rémunération mensuelle fixe de 7 200 € payable le dernier jour ouvré ' +
    'de chaque mois, indépendamment du volume de travail accompli. Le Prestataire s\'engage à émettre une facture ' +
    'mensuelle auprès du service comptabilité de la Société.'
  );

  clause("5", "Moyens Mis à Disposition",
    'La Société mettra à disposition du Prestataire un poste de travail, un ordinateur portable, les accès ' +
    'aux systèmes informatiques, les licences logicielles nécessaires ainsi que tout le matériel requis pour ' +
    'l\'exécution de ses missions. Le Prestataire utilisera exclusivement les équipements fournis par la Société.'
  );

  clause("6", "Substitution",
    'Le Prestataire s\'engage à exécuter personnellement l\'ensemble des prestations prévues au présent contrat. ' +
    'Toute substitution ou sous-traitance est formellement interdite sans accord écrit préalable de la Société, ' +
    'laquelle pourra refuser toute demande à sa seule discrétion.'
  );

  clause("7", "Propriété Intellectuelle",
    'Toutes les créations, développements logiciels, et livrables produits dans le cadre du présent contrat ' +
    'sont la propriété exclusive de la Société dès leur création. Le Prestataire cède tous les droits de ' +
    'propriété intellectuelle y afférents à la Société.'
  );

  clause("8", "Procédures Disciplinaires",
    'Le Prestataire est soumis aux procédures disciplinaires internes de la Société telles que définies dans ' +
    'le Règlement Intérieur et le Guide du Collaborateur de la Société. Tout manquement pourra faire l\'objet ' +
    'd\'un avertissement formel notifié par la Direction des Ressources Humaines.'
  );

  clause("9", "Durée et Résiliation",
    'Le présent contrat est conclu pour une durée indéterminée à compter du 1er janvier 2025. Chacune des parties ' +
    'pourra y mettre fin moyennant un préavis de quatre semaines notifié par lettre recommandée.'
  );

  clause("10", "Droit Applicable",
    'Le présent contrat est soumis au droit français. Tout litige sera porté devant les juridictions compétentes ' +
    'du ressort du Tribunal de Paris.'
  );

  doc.moveDown(1).font("Helvetica-Bold").fontSize(11).text("SIGNATURES");
  doc.moveDown(0.5).font("Helvetica").fontSize(11);
  doc.text("Pour Acme SAS :").moveDown(0.3);
  doc.text("Signature : ______________________    Date : _______________");
  doc.moveDown(0.3).text("Nom : Sophie Martin    Titre : Directrice des Ressources Humaines");
  doc.moveDown(1).text("Prestataire :").moveDown(0.3);
  doc.text("Signature : ______________________    Date : _______________");
  doc.moveDown(0.3).text("Nom : Marie Dupont");
});

// ── Contract 2: Germany (MEDIUM RISK) ────────────────────────────────────────
await makePdf("test-contract-germany.pdf", "FREIER MITARBEITERVERTRAG (WERKVERTRAG)", (heading, clause, doc) => {
  heading("VERTRAGSPARTEIEN");
  doc.font("Helvetica").fontSize(11).text(
    'Dieser Vertrag wird geschlossen zwischen der TechVenture GmbH, eingetragen im Handelsregister des ' +
    'Amtsgerichts München, Maximilianstraße 12, 80539 München ("Auftraggeber") und Stefan Bauer, ' +
    'selbständiger IT-Berater, Schillerstraße 44, 10625 Berlin ("Auftragnehmer").', { align: "justify" }
  ).moveDown(0.8);

  clause("1", "Vertragsgegenstand",
    'Der Auftragnehmer verpflichtet sich, für den Auftraggeber Beratungsleistungen im Bereich Backend-Entwicklung ' +
    'zu erbringen. Der Auftragnehmer erbringt diese Leistungen als freier Mitarbeiter und ist dabei in der ' +
    'Gestaltung seiner Arbeitszeit und seines Arbeitsortes grundsätzlich frei. Der Auftragnehmer ist berechtigt, ' +
    'auch für andere Auftraggeber tätig zu sein, sofern keine Interessenkonflikte entstehen.'
  );

  clause("2", "Leistungsumfang und Weisungsrecht",
    'Der Auftraggeber kann dem Auftragnehmer projektbezogene Weisungen hinsichtlich der Projektziele und ' +
    'Qualitätsanforderungen erteilen. Der Auftragnehmer unterliegt jedoch keinen Weisungen hinsichtlich der ' +
    'Art und Weise der Leistungserbringung. Der Auftragnehmer stimmt seine Arbeitszeiten im Rahmen des Projekts ' +
    'eigenverantwortlich ab, wobei eine Kernpräsenz von 3 Tagen pro Woche in den Büroräumen des Auftraggebers ' +
    'für Abstimmungsmeetings erwartet wird.'
  );

  clause("3", "Vergütung",
    'Der Auftragnehmer erhält ein Tageshonorar von 850 € für nachgewiesene Projekttage. Die Abrechnung erfolgt ' +
    'monatlich auf Basis eines vom Auftragnehmer einzureichenden Stundenberichts. Der Auftraggeber ist berechtigt, ' +
    'Rechnungen bei mangelhafter Leistung zu kürzen.'
  );

  clause("4", "Eigene Betriebsmittel",
    'Der Auftragnehmer erbringt seine Leistungen grundsätzlich mit eigenen Arbeitsmitteln, insbesondere mit ' +
    'eigenem Laptop und eigener Entwicklungsumgebung. Soweit der Auftraggeber dem Auftragnehmer Systemzugänge ' +
    'gewährt, dienen diese ausschließlich der Erfüllung des Vertragsgegenstands.'
  );

  clause("5", "Vertretungsrecht",
    'Der Auftragnehmer ist berechtigt, sich bei Verhinderung durch einen gleichqualifizierten Vertreter zu ersetzen, ' +
    'der zuvor vom Auftraggeber zu genehmigen ist. Der Auftragnehmer haftet für die ordnungsgemäße Leistungserbringung ' +
    'durch den Vertreter wie für eigenes Handeln.'
  );

  clause("6", "Statusfeststellung",
    'Die Parteien sind sich einig, dass dieses Vertragsverhältnis kein Arbeitsverhältnis begründet. Es wird ' +
    'empfohlen, ein Statusfeststellungsverfahren nach § 7a SGB IV bei der Deutschen Rentenversicherung zu ' +
    'beantragen, sofern Unsicherheit über den sozialversicherungsrechtlichen Status besteht.'
  );

  clause("7", "Geheimhaltung",
    'Der Auftragnehmer verpflichtet sich, alle im Rahmen der Tätigkeit erlangten vertraulichen Informationen ' +
    'des Auftraggebers streng vertraulich zu behandeln und Dritten gegenüber nicht offenzulegen.'
  );

  clause("8", "Gewährleistung und Haftung",
    'Der Auftragnehmer gewährleistet, dass die erbrachten Leistungen den vereinbarten Spezifikationen entsprechen. ' +
    'Bei Mängeln ist der Auftragnehmer zur Nachbesserung verpflichtet. Die Haftung des Auftragnehmers ist auf ' +
    'grobe Fahrlässigkeit und Vorsatz beschränkt.'
  );

  clause("9", "Laufzeit und Kündigung",
    'Der Vertrag wird für das Projekt "ERP Migration Phase 2" geschlossen und endet automatisch mit ' +
    'Projektabschluss, voraussichtlich am 31. Dezember 2025. Jede Partei kann den Vertrag mit einer ' +
    'Frist von vier Wochen ordentlich kündigen.'
  );

  clause("10", "Anwendbares Recht",
    'Für diesen Vertrag gilt deutsches Recht. Ausschließlicher Gerichtsstand für alle Streitigkeiten ' +
    'aus diesem Vertrag ist München.'
  );

  doc.moveDown(1).font("Helvetica-Bold").fontSize(11).text("UNTERSCHRIFTEN");
  doc.moveDown(0.5).font("Helvetica").fontSize(11);
  doc.text("Für TechVenture GmbH :").moveDown(0.3);
  doc.text("Unterschrift : ______________________    Datum : _______________");
  doc.moveDown(0.3).text("Name : Dr. Klaus Weber    Funktion : Geschäftsführer");
  doc.moveDown(1).text("Auftragnehmer :").moveDown(0.3);
  doc.text("Unterschrift : ______________________    Datum : _______________");
  doc.moveDown(0.3).text("Name : Stefan Bauer");
});

// ── Contract 3: United States (LOW/MEDIUM RISK) ───────────────────────────────
await makePdf("test-contract-us.pdf", "INDEPENDENT CONTRACTOR AGREEMENT", (heading, clause, doc) => {
  heading("PARTIES");
  doc.font("Helvetica").fontSize(11).text(
    'This Independent Contractor Agreement ("Agreement") is entered into as of March 1, 2025 between ' +
    'Horizon Labs Inc., a Delaware corporation with offices at 340 Pine Street, Suite 800, San Francisco, ' +
    'CA 94104 ("Company") and DataWise Consulting LLC, a California limited liability company operated by ' +
    'Alex Rivera ("Contractor").', { align: "justify" }
  ).moveDown(0.8);

  clause("1", "Independent Contractor Relationship",
    'Contractor is an independent contractor and not an employee, agent, partner, or joint venturer of Company. ' +
    'Contractor retains the right to perform services for other clients during the term of this Agreement, ' +
    'provided such engagements do not create a conflict of interest. Contractor shall have full control over ' +
    'the manner and means by which the services are performed, subject only to Company\'s specification of ' +
    'the desired results.'
  );

  clause("2", "Services",
    'Contractor shall provide data analytics and machine learning consulting services as described in ' +
    'Statement of Work #2025-03 ("SOW"), incorporated herein by reference. The services constitute ' +
    'specialized work outside the usual course of Company\'s core software development business. ' +
    'Contractor shall deliver defined milestones as set forth in the SOW and is not required to ' +
    'perform any services not described therein without a written amendment.'
  );

  clause("3", "Compensation",
    'Company shall pay Contractor a fixed project fee of $48,000 upon completion of each milestone ' +
    'as set forth in the SOW. Contractor invoices Company upon milestone delivery and acceptance. ' +
    'Company shall not withhold income taxes, FICA, or any other amounts from payments to Contractor. ' +
    'Contractor is solely responsible for all taxes on amounts received under this Agreement.'
  );

  clause("4", "Equipment and Tools",
    'Contractor shall provide all equipment, software, and tools necessary to perform the services, ' +
    'including hardware, licensed software, and cloud computing resources, at Contractor\'s own expense. ' +
    'Company shall provide read-only access to specified datasets solely as necessary for the services. ' +
    'Contractor maintains their own professional development environment and toolchain.'
  );

  clause("5", "Substitution and Subcontracting",
    'Contractor may delegate or subcontract any portion of the services to qualified personnel of ' +
    'Contractor\'s choosing, provided that Contractor remains responsible for the quality and timeliness ' +
    'of all deliverables. Contractor shall notify Company of any material subcontracting arrangement ' +
    'within five business days.'
  );

  clause("6", "Intellectual Property",
    'All deliverables, reports, models, and work product created specifically for Company under this ' +
    'Agreement shall be deemed works made for hire. To the extent any deliverables do not qualify as ' +
    'works made for hire, Contractor hereby assigns all intellectual property rights therein to Company. ' +
    'Contractor retains ownership of all pre-existing IP and general methodologies.'
  );

  clause("7", "Benefits and Insurance",
    'As an independent contractor, Contractor is not entitled to and shall not receive any employee ' +
    'benefits from Company, including but not limited to health insurance, retirement benefits, ' +
    'vacation pay, sick leave, or workers\' compensation coverage. Contractor shall maintain their own ' +
    'general liability insurance and professional indemnity insurance during the term.'
  );

  clause("8", "Term and Termination",
    'This Agreement commences on March 1, 2025 and continues until completion of the SOW deliverables, ' +
    'estimated by December 31, 2025. Either party may terminate this Agreement for cause upon 30 days\' ' +
    'written notice if the other party materially breaches and fails to cure within the notice period. ' +
    'Company may terminate for convenience with 60 days\' notice and payment of earned fees through termination.'
  );

  clause("9", "Confidentiality",
    'Contractor shall maintain the confidentiality of all Company proprietary information and shall not ' +
    'disclose such information to third parties without prior written consent. This obligation survives ' +
    'termination of the Agreement for a period of three years.'
  );

  clause("10", "Governing Law",
    'This Agreement shall be governed by the laws of the State of California without regard to its ' +
    'conflict of law provisions. Any disputes shall be resolved by binding arbitration in San Francisco, ' +
    'California under the rules of JAMS.'
  );

  doc.moveDown(1).font("Helvetica-Bold").fontSize(11).text("SIGNATURES");
  doc.moveDown(0.5).font("Helvetica").fontSize(11);
  doc.text("Horizon Labs Inc.:").moveDown(0.3);
  doc.text("Signature: ______________________    Date: _______________");
  doc.moveDown(0.3).text("Name: Jennifer Park    Title: VP Engineering");
  doc.moveDown(1).text("DataWise Consulting LLC:").moveDown(0.3);
  doc.text("Signature: ______________________    Date: _______________");
  doc.moveDown(0.3).text("Name: Alex Rivera    Title: Managing Member");
});

console.log("\nAll 3 test contracts generated in /public/");
console.log("  • test-contract-france.pdf   → HIGH RISK (exclusivity, fixed hours, faisceau d'indices red flags)");
console.log("  • test-contract-germany.pdf  → MEDIUM RISK (some Scheinselbstständigkeit indicators, but cleaner)");
console.log("  • test-contract-us.pdf       → LOW RISK (LLC contractor, milestone-based, own tools, substitution right)");
