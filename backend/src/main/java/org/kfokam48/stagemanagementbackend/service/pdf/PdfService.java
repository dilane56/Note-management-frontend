package org.kfokam48.stagemanagementbackend.service.pdf;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import org.kfokam48.stagemanagementbackend.model.ConventionStage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {
    private final Font title_Font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 30, BaseColor.BLUE);
    private final Font subTitle_Font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.BLUE);
    private final Font text_Font = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);
    private final Font text_Font2 = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);

    public ByteArrayOutputStream generateConventionPdf(ConventionStage convention) throws DocumentException {
        Document document = new Document(PageSize.A4, 50, 50, 80, 50);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);
        document.open();

        // En-tête
        addConventionHeader(document);
        
        // Titre principal
        Paragraph title = new Paragraph("CONVENTION DE STAGE", title_Font);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Informations de la convention
        addConventionInfo(document, convention);
        
        // Informations de l'étudiant
        addStudentInfo(document, convention);
        
        // Informations de l'entreprise
        addCompanyInfo(document, convention);
        
        // Informations du stage
        addInternshipInfo(document, convention);
        
        // Conditions du stage
        addInternshipConditions(document);
        
        // Signatures
        addSignatureSection(document, convention);
        
        // Pied de page
        addConventionFooter(document);

        document.close();
        return outputStream;
    }

    private void addConventionHeader(Document document) throws DocumentException {
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{1f, 1f});
        
        // Informations université (côté gauche)
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);
        leftCell.setVerticalAlignment(Element.ALIGN_TOP);
        
        Paragraph universityInfo = new Paragraph();
        universityInfo.add(new Chunk("UNIVERSITÉ\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.DARK_GRAY)));
        universityInfo.add(new Chunk("Service des Stages\n", text_Font));
        universityInfo.add(new Chunk("Tél: +237 XXX XXX XXX\n", text_Font));
        universityInfo.add(new Chunk("Email: stages@universite.com\n", text_Font));
        leftCell.addElement(universityInfo);
        
        // Informations convention (côté droit)
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setVerticalAlignment(Element.ALIGN_TOP);
        rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        
        Paragraph conventionInfo = new Paragraph();
        conventionInfo.add(new Chunk("CONVENTION N°\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLUE)));
        conventionInfo.add(new Chunk("Date: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n", text_Font));
        rightCell.addElement(conventionInfo);
        
        headerTable.addCell(leftCell);
        headerTable.addCell(rightCell);
        document.add(headerTable);
        
        LineSeparator separator = new LineSeparator();
        separator.setLineWidth(1);
        separator.setLineColor(BaseColor.GRAY);
        document.add(separator);
        document.add(new Paragraph(" "));
    }

    private void addConventionInfo(Document document, ConventionStage convention) throws DocumentException {
        PdfPTable conventionInfoTable = new PdfPTable(2);
        conventionInfoTable.setWidthPercentage(100);
        conventionInfoTable.setWidths(new float[]{0.3f, 0.7f});
        
        conventionInfoTable.addCell(createLabelCell("Numéro de Convention:"));
        conventionInfoTable.addCell(createValueCell("CONV-" + String.format("%06d", convention.getId())));
        
        conventionInfoTable.addCell(createLabelCell("Date de Création:"));
        conventionInfoTable.addCell(createValueCell(convention.getDateCreation().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
        
        conventionInfoTable.addCell(createLabelCell("Statut:"));
        PdfPCell statusCell = createValueCell(convention.getStatutConvention().toString());
        switch (convention.getStatutConvention()) {
            case APPROUVE -> statusCell.setBackgroundColor(BaseColor.GREEN);
            case VALIDE -> statusCell.setBackgroundColor(BaseColor.YELLOW);
            case EN_ATTENTE -> statusCell.setBackgroundColor(BaseColor.ORANGE);
            case REFUSE -> statusCell.setBackgroundColor(BaseColor.RED);
        }
        conventionInfoTable.addCell(statusCell);
        
        document.add(conventionInfoTable);
        document.add(new Paragraph(" "));
    }

    private void addStudentInfo(Document document, ConventionStage convention) throws DocumentException {
        Paragraph studentTitle = new Paragraph("INFORMATIONS DE L'ÉTUDIANT", subTitle_Font);
        studentTitle.setSpacingBefore(10);
        studentTitle.setSpacingAfter(5);
        document.add(studentTitle);
        
        PdfPTable studentTable = new PdfPTable(2);
        studentTable.setWidthPercentage(100);
        studentTable.setWidths(new float[]{0.3f, 0.7f});
        
        var etudiant = convention.getCandidature().getEtudiant();
        
        studentTable.addCell(createLabelCell("Nom et Prénom:"));
        studentTable.addCell(createValueCell(etudiant.getFullName()));
        
        studentTable.addCell(createLabelCell("Email:"));
        studentTable.addCell(createValueCell(etudiant.getEmail()));
        
        studentTable.addCell(createLabelCell("Téléphone:"));
        studentTable.addCell(createValueCell(etudiant.getTelephone()));
        
        studentTable.addCell(createLabelCell("Filière:"));
        studentTable.addCell(createValueCell(etudiant.getFiliere()));
        
        studentTable.addCell(createLabelCell("Niveau:"));
        studentTable.addCell(createValueCell(etudiant.getNiveau()));
        
        studentTable.addCell(createLabelCell("Université:"));
        studentTable.addCell(createValueCell(etudiant.getUniversite()));
        
        studentTable.addCell(createLabelCell("Année Scolaire:"));
        studentTable.addCell(createValueCell(etudiant.getAnneeScolaire()));
        
        document.add(studentTable);
        document.add(new Paragraph(" "));
    }

    private void addCompanyInfo(Document document, ConventionStage convention) throws DocumentException {
        Paragraph companyTitle = new Paragraph("INFORMATIONS DE L'ENTREPRISE", subTitle_Font);
        companyTitle.setSpacingBefore(10);
        companyTitle.setSpacingAfter(5);
        document.add(companyTitle);
        
        PdfPTable companyTable = new PdfPTable(2);
        companyTable.setWidthPercentage(100);
        companyTable.setWidths(new float[]{0.3f, 0.7f});
        
        var entreprise = convention.getCandidature().getOffreStage().getEntreprise();
        
        companyTable.addCell(createLabelCell("Nom de l'Entreprise:"));
        companyTable.addCell(createValueCell(entreprise.getFullName()));
        
        companyTable.addCell(createLabelCell("Email:"));
        companyTable.addCell(createValueCell(entreprise.getEmail()));
        
        companyTable.addCell(createLabelCell("Téléphone:"));
        companyTable.addCell(createValueCell(entreprise.getTelephone()));
        
        companyTable.addCell(createLabelCell("Domaine d'Activité:"));
        companyTable.addCell(createValueCell(entreprise.getDomaineActivite()));
        
        if (entreprise.getSiteWeb() != null) {
            companyTable.addCell(createLabelCell("Site Web:"));
            companyTable.addCell(createValueCell(entreprise.getSiteWeb()));
        }
        
        if (entreprise.getDescription() != null) {
            companyTable.addCell(createLabelCell("Description:"));
            companyTable.addCell(createValueCell(entreprise.getDescription()));
        }
        
        document.add(companyTable);
        document.add(new Paragraph(" "));
    }

    private void addInternshipInfo(Document document, ConventionStage convention) throws DocumentException {
        Paragraph internshipTitle = new Paragraph("INFORMATIONS DU STAGE", subTitle_Font);
        internshipTitle.setSpacingBefore(10);
        internshipTitle.setSpacingAfter(5);
        document.add(internshipTitle);
        
        PdfPTable internshipTable = new PdfPTable(2);
        internshipTable.setWidthPercentage(100);
        internshipTable.setWidths(new float[]{0.3f, 0.7f});
        
        var offreStage = convention.getCandidature().getOffreStage();
        
        internshipTable.addCell(createLabelCell("Intitulé du Stage:"));
        internshipTable.addCell(createValueCell(offreStage.getIntitule()));
        
        internshipTable.addCell(createLabelCell("Description:"));
        internshipTable.addCell(createValueCell(offreStage.getDescription()));
        
        internshipTable.addCell(createLabelCell("Durée:"));
        internshipTable.addCell(createValueCell(offreStage.getDureeStage() + " mois"));
        
        internshipTable.addCell(createLabelCell("Localisation:"));
        internshipTable.addCell(createValueCell(offreStage.getLocalisation()));
        
        internshipTable.addCell(createLabelCell("Date de Début:"));
        internshipTable.addCell(createValueCell(convention.getDateDebut().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
        
        internshipTable.addCell(createLabelCell("Date de Fin:"));
        internshipTable.addCell(createValueCell(convention.getDateFin().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
        
        if (offreStage.getCompetences() != null && !offreStage.getCompetences().isEmpty()) {
            internshipTable.addCell(createLabelCell("Compétences:"));
            internshipTable.addCell(createValueCell(String.join(", ", offreStage.getCompetences())));
        }
        
        document.add(internshipTable);
        document.add(new Paragraph(" "));
    }

    private void addInternshipConditions(Document document) throws DocumentException {
        Paragraph conditionsTitle = new Paragraph("CONDITIONS DU STAGE", subTitle_Font);
        conditionsTitle.setSpacingBefore(10);
        conditionsTitle.setSpacingAfter(5);
        document.add(conditionsTitle);
        
        PdfPTable conditionsTable = new PdfPTable(1);
        conditionsTable.setWidthPercentage(100);
        
        String[] conditions = {
            "• L'étudiant s'engage à respecter le règlement intérieur de l'entreprise",
            "• L'entreprise s'engage à fournir un encadrement approprié",
            "• La durée hebdomadaire de présence ne peut excéder 35 heures",
            "• L'étudiant doit tenir un rapport de stage",
            "• Une évaluation sera effectuée à la fin du stage",
            "• L'étudiant est couvert par l'assurance de l'université",
            "• Toute absence doit être justifiée et signalée"
        };
        
        for (String condition : conditions) {
            PdfPCell cell = new PdfPCell(new Phrase(condition, text_Font));
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setPadding(2);
            conditionsTable.addCell(cell);
        }
        
        document.add(conditionsTable);
        document.add(new Paragraph(" "));
    }

    private void addSignatureSection(Document document, ConventionStage convention) throws DocumentException {
        PdfPTable signatureTable = new PdfPTable(3);
        signatureTable.setWidthPercentage(100);
        signatureTable.setWidths(new float[]{0.33f, 0.33f, 0.34f});
        
        // Signature étudiant
        PdfPCell studentSignatureCell = new PdfPCell();
        studentSignatureCell.setBorder(Rectangle.NO_BORDER);
        studentSignatureCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Paragraph studentSignature = new Paragraph();
        studentSignature.add(new Chunk("Signature de l'Étudiant\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK)));
        studentSignature.add(new Chunk("_________________________\n", text_Font));
        studentSignature.add(new Chunk(convention.getCandidature().getEtudiant().getFullName() + "\n", text_Font));
        studentSignature.add(new Chunk("Date: _________________\n", text_Font));
        studentSignatureCell.addElement(studentSignature);
        
        // Signature entreprise
        PdfPCell companySignatureCell = new PdfPCell();
        companySignatureCell.setBorder(Rectangle.NO_BORDER);
        companySignatureCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Paragraph companySignature = new Paragraph();
        companySignature.add(new Chunk("Signature de l'Entreprise\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK)));
        companySignature.add(new Chunk("_________________________\n", text_Font));
        companySignature.add(new Chunk(convention.getCandidature().getOffreStage().getEntreprise().getFullName() + "\n", text_Font));
        companySignature.add(new Chunk("Date: _________________\n", text_Font));
        companySignatureCell.addElement(companySignature);
        
        // Cachet université
        PdfPCell universityStampCell = new PdfPCell();
        universityStampCell.setBorder(Rectangle.NO_BORDER);
        universityStampCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Paragraph universityStamp = new Paragraph();
        universityStamp.add(new Chunk("Cachet de l'Université\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK)));
        universityStamp.add(new Chunk("_________________________\n", text_Font));
        universityStamp.add(new Chunk("Service des Stages\n", text_Font));
        universityStamp.add(new Chunk("Date: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), text_Font));
        universityStampCell.addElement(universityStamp);
        
        signatureTable.addCell(studentSignatureCell);
        signatureTable.addCell(companySignatureCell);
        signatureTable.addCell(universityStampCell);
        
        document.add(signatureTable);
    }

    private void addConventionFooter(Document document) throws DocumentException {
        document.add(new Paragraph(" "));
        
        LineSeparator footerSeparator = new LineSeparator();
        footerSeparator.setLineWidth(0.5f);
        footerSeparator.setLineColor(BaseColor.GRAY);
        document.add(footerSeparator);
        
        Paragraph footer = new Paragraph();
        footer.add(new Chunk("Cette convention est générée automatiquement par le système de gestion des stages.\n", 
                FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.GRAY)));
        footer.add(new Chunk("Pour toute question, contactez le service des stages de l'université.", 
                FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.GRAY)));
        footer.setAlignment(Element.ALIGN_CENTER);
        
        document.add(footer);
    }

    // Méthodes utilitaires
    private PdfPCell createLabelCell(String label) {
        PdfPCell cell = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK)));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell.setPadding(5);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    private PdfPCell createValueCell(String value) {
        PdfPCell cell = new PdfPCell(new Phrase(value != null ? value : "N/A", text_Font));
        cell.setPadding(5);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }
}