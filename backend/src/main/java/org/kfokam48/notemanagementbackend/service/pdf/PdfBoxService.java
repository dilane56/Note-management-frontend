package org.kfokam48.notemanagementbackend.service.pdf;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfBoxService {

    private static final float MARGIN = 50;
    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();

    public byte[] generateTranscriptPdf(Transcript transcript) {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDPageContentStream content = new PDPageContentStream(document, page);
            
            // Fonts
            PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font headerFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font normalFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            float yPosition = PAGE_HEIGHT - MARGIN;

            // En-tête de l'établissement
            content.setFont(titleFont, 18);
            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("ÉTABLISSEMENT SCOLAIRE");
            content.endText();
            yPosition -= 30;

            content.setFont(normalFont, 12);
            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("Adresse de l'établissement");
            content.endText();
            yPosition -= 15;

            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("Téléphone: +XXX XX XX XX XX");
            content.endText();
            yPosition -= 40;

            // Titre du document
            content.setFont(titleFont, 16);
            content.beginText();
            content.newLineAtOffset((PAGE_WIDTH - 150) / 2, yPosition);
            content.showText("RELEVÉ DE NOTES");
            content.endText();
            yPosition -= 40;

            // Informations de l'étudiant
            content.setFont(headerFont, 12);
            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("INFORMATIONS ÉTUDIANT");
            content.endText();
            yPosition -= 20;

            // Ligne de séparation
            content.setStrokingColor(Color.BLACK);
            content.setLineWidth(1f);
            content.moveTo(MARGIN, yPosition);
            content.lineTo(PAGE_WIDTH - MARGIN, yPosition);
            content.stroke();
            yPosition -= 15;

            content.setFont(normalFont, 11);
            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("Nom: " + transcript.getStudent().getLastName().toUpperCase());
            content.endText();
            yPosition -= 15;

            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("Prénom: " + transcript.getStudent().getFirstName());
            content.endText();
            yPosition -= 15;

            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("Email: " + transcript.getStudent().getEmail());
            content.endText();
            yPosition -= 15;

            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("Année Académique: " + transcript.getEvaluation().getAnneeAcademique());
            content.endText();
            yPosition -= 15;

            if (transcript.getStudent().getStudentClass() != null) {
                content.beginText();
                content.newLineAtOffset(MARGIN, yPosition);
                content.showText("Classe: " + transcript.getStudent().getStudentClass().getClassName());
                content.endText();
                yPosition -= 15;
            }

            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("Date de génération: " + transcript.getGeneratedDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            content.endText();
            yPosition -= 30;

            // Tableau des notes
            content.setFont(headerFont, 12);
            content.beginText();
            content.newLineAtOffset(MARGIN, yPosition);
            content.showText("DÉTAIL DES NOTES");
            content.endText();
            yPosition -= 20;

            // En-tête du tableau
            content.setStrokingColor(Color.BLACK);
            content.setLineWidth(1f);
            content.moveTo(MARGIN, yPosition);
            content.lineTo(PAGE_WIDTH - MARGIN, yPosition);
            content.stroke();
            yPosition -= 15;

            content.setFont(headerFont, 10);
            content.beginText();
            content.newLineAtOffset(MARGIN + 5, yPosition);
            content.showText("MATIÈRE");
            content.endText();

            content.beginText();
            content.newLineAtOffset(MARGIN + 200, yPosition);
            content.showText("NOTE");
            content.endText();

            content.beginText();
            content.newLineAtOffset(MARGIN + 280, yPosition);
            content.showText("APPRÉCIATION");
            content.endText();
            yPosition -= 5;

            content.moveTo(MARGIN, yPosition);
            content.lineTo(PAGE_WIDTH - MARGIN, yPosition);
            content.stroke();
            yPosition -= 10;

            // Lignes du tableau
            content.setFont(normalFont, 10);
            List<Grade> grades = transcript.getGrades();
            
            for (Grade grade : grades) {
                content.beginText();
                content.newLineAtOffset(MARGIN + 5, yPosition);
                content.showText(grade.getSubject().getName());
                content.endText();

                content.beginText();
                content.newLineAtOffset(MARGIN + 200, yPosition);
                content.showText(String.format("%.2f/20", grade.getValue()));
                content.endText();

                content.beginText();
                content.newLineAtOffset(MARGIN + 280, yPosition);
                String appreciation = getAppreciation(grade.getValue());
                content.showText(appreciation);
                content.endText();

                yPosition -= 15;

                // Ligne de séparation
                content.setStrokingColor(Color.LIGHT_GRAY);
                content.setLineWidth(0.5f);
                content.moveTo(MARGIN, yPosition + 5);
                content.lineTo(PAGE_WIDTH - MARGIN, yPosition + 5);
                content.stroke();
            }

            yPosition -= 20;

            // Moyenne générale
            content.setStrokingColor(Color.BLACK);
            content.setLineWidth(1f);
            content.moveTo(MARGIN, yPosition);
            content.lineTo(PAGE_WIDTH - MARGIN, yPosition);
            content.stroke();
            yPosition -= 15;

            content.setFont(headerFont, 12);
            content.beginText();
            content.newLineAtOffset(MARGIN + 5, yPosition);
            content.showText("MOYENNE GÉNÉRALE: " + String.format("%.2f/20", transcript.getAverage()));
            content.endText();

            content.beginText();
            content.newLineAtOffset(MARGIN + 280, yPosition);
            content.showText(getAppreciation(transcript.getAverage()));
            content.endText();
            yPosition -= 30;

            // Pied de page
            content.setFont(normalFont, 9);
            content.beginText();
            content.newLineAtOffset(MARGIN, 80);
            content.showText("Ce document est généré automatiquement et ne nécessite pas de signature.");
            content.endText();

            content.beginText();
            content.newLineAtOffset(MARGIN, 65);
            content.showText("Pour toute réclamation, veuillez contacter l'administration dans les 48h.");
            content.endText();

            // Signature
            content.setFont(headerFont, 10);
            content.beginText();
            content.newLineAtOffset(PAGE_WIDTH - 200, 120);
            content.showText("Le Directeur des Études");
            content.endText();

            content.close();
            document.save(out);
            return out.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    private String getAppreciation(double note) {
        if (note >= 16) return "Très Bien";
        if (note >= 14) return "Bien";
        if (note >= 12) return "Assez Bien";
        if (note >= 10) return "Passable";
        return "Insuffisant";
    }

    public byte[] generateBulkTranscriptsPdf(List<Transcript> transcripts) {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            for (int i = 0; i < transcripts.size(); i++) {
                Transcript transcript = transcripts.get(i);
                
                PDPage page = new PDPage(PDRectangle.A4);
                document.addPage(page);

                PDPageContentStream content = new PDPageContentStream(document, page);
                
                // Fonts
                PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font headerFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font normalFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                float yPosition = PAGE_HEIGHT - MARGIN;

                // En-tête de l'établissement
                content.setFont(titleFont, 18);
                content.beginText();
                content.newLineAtOffset(MARGIN, yPosition);
                content.showText("ÉTABLISSEMENT SCOLAIRE");
                content.endText();
                yPosition -= 30;

                content.setFont(normalFont, 12);
                content.beginText();
                content.newLineAtOffset(MARGIN, yPosition);
                content.showText("Adresse de l'établissement");
                content.endText();
                yPosition -= 40;

                // Titre du document
                content.setFont(titleFont, 16);
                content.beginText();
                content.newLineAtOffset((PAGE_WIDTH - 150) / 2, yPosition);
                content.showText("RELEVÉ DE NOTES");
                content.endText();
                yPosition -= 40;

                // Informations de l'étudiant
                content.setFont(headerFont, 12);
                content.beginText();
                content.newLineAtOffset(MARGIN, yPosition);
                content.showText("INFORMATIONS ÉTUDIANT");
                content.endText();
                yPosition -= 20;

                content.setFont(normalFont, 11);
                content.beginText();
                content.newLineAtOffset(MARGIN, yPosition);
                content.showText("Nom: " + transcript.getStudent().getLastName().toUpperCase());
                content.endText();
                yPosition -= 15;

                content.beginText();
                content.newLineAtOffset(MARGIN, yPosition);
                content.showText("Prénom: " + transcript.getStudent().getFirstName());
                content.endText();
                yPosition -= 15;

                content.beginText();
                content.newLineAtOffset(MARGIN, yPosition);
                content.showText("Année Académique: " + transcript.getEvaluation().getAnneeAcademique());
                content.endText();
                yPosition -= 30;

                // Tableau des notes (version simplifiée pour le lot)
                content.setFont(headerFont, 12);
                content.beginText();
                content.newLineAtOffset(MARGIN, yPosition);
                content.showText("NOTES");
                content.endText();
                yPosition -= 20;

                content.setFont(normalFont, 10);
                List<Grade> grades = transcript.getGrades();
                
                for (Grade grade : grades) {
                    content.beginText();
                    content.newLineAtOffset(MARGIN + 5, yPosition);
                    content.showText(grade.getSubject().getName() + ": " + String.format("%.2f/20", grade.getValue()));
                    content.endText();
                    yPosition -= 15;
                }

                yPosition -= 10;
                content.setFont(headerFont, 11);
                content.beginText();
                content.newLineAtOffset(MARGIN + 5, yPosition);
                content.showText("MOYENNE GÉNÉRALE: " + String.format("%.2f/20", transcript.getAverage()));
                content.endText();

                content.close();
            }

            document.save(out);
            return out.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF en lot", e);
        }
    }
}

