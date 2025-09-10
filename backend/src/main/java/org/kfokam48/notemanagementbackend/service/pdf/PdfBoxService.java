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
import java.io.ByteArrayOutputStream;

@Service
public class PdfBoxService {

    public byte[] generateTranscriptPdf(Transcript transcript) {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDPageContentStream content = new PDPageContentStream(document, page);
            PDType1Font  myFont = new PDType1Font( Standard14Fonts.FontName.HELVETICA_BOLD);
            content.setFont(myFont, 12);
            content.beginText();
            content.newLineAtOffset(100, 700);

            content.showText("Relevé de Notes");
            content.newLineAtOffset(0, -20);
            content.showText("Nom : " + transcript.getStudent().getFirstName() + " " + transcript.getStudent().getLastName());
            content.newLineAtOffset(0, -20);
            content.showText("Année Académique : " + transcript.getAcademicYear());

            for (Grade grade : transcript.getGrades()) {
                content.newLineAtOffset(0, -20);
                content.showText(grade.getSubject().getName() + " - " + grade.getValue());
            }

            content.endText();
            content.close();

            document.save(out);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }
}

