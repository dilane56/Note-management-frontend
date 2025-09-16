package org.kfokam48.notemanagementbackend.service.pdf;


import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.time.LocalDate;
import org.kfokam48.notemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.notemanagementbackend.model.Grade;
import org.kfokam48.notemanagementbackend.model.Transcript;
import org.kfokam48.notemanagementbackend.repository.TranscriptRepository;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {
    private final TranscriptRepository transcriptRepository;

    public PdfService(TranscriptRepository transcriptRepository) {
        this.transcriptRepository = transcriptRepository;
    }

    public byte[] generateTranscript(Transcript transcript) throws DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter pdfWriter = PdfWriter.getInstance(document, outputStream);
        document.open();

        // En-tête avec couleur
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.BLUE);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.BLACK);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);

        // Titre principal
        Paragraph title = new Paragraph("RELEVÉ DE NOTES", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Informations étudiant
        document.add(new Paragraph("Nom : " + transcript.getStudent().getLastName(), headerFont));
        document.add(new Paragraph("Prénom : " + transcript.getStudent().getFirstName(), headerFont));
        document.add(new Paragraph("Matricule : " + transcript.getStudent().getMatricule(), normalFont));
        document.add(new Paragraph("Classe : " + transcript.getStudent().getStudentClass().getClassName(), normalFont));
        document.add(new Paragraph("Année Académique : " + transcript.getEvaluation().getAnneeAcademique(), normalFont));
        document.add(new Paragraph("Type d'évaluation : " + transcript.getEvaluation().getType(), normalFont));
        document.add(new Paragraph(" "));

        // Tableau des notes
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        
        // En-têtes du tableau avec couleur
        PdfPCell headerCell1 = new PdfPCell(new Phrase("Matière", headerFont));
        headerCell1.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell1.setPadding(8);
        table.addCell(headerCell1);
        
        PdfPCell headerCell2 = new PdfPCell(new Phrase("Note", headerFont));
        headerCell2.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell2.setPadding(8);
        table.addCell(headerCell2);
        
        PdfPCell headerCell3 = new PdfPCell(new Phrase("Note Max", headerFont));
        headerCell3.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell3.setPadding(8);
        table.addCell(headerCell3);
        
        PdfPCell headerCell4 = new PdfPCell(new Phrase("Coefficient", headerFont));
        headerCell4.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell4.setPadding(8);
        table.addCell(headerCell4);
        
        PdfPCell headerCell5 = new PdfPCell(new Phrase("Commentaire", headerFont));
        headerCell5.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell5.setPadding(8);
        table.addCell(headerCell5);

        // Données du tableau
        for (Grade grade : transcript.getGrades()) {
            table.addCell(new PdfPCell(new Phrase(grade.getSubject().getName(), normalFont)));
            
            // Couleur selon la note
            Font gradeFont = grade.getValue() >= grade.getSubject().getNoteMaximale() * 0.6 ? 
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.GREEN) :
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.RED);
            
            table.addCell(new PdfPCell(new Phrase(String.valueOf(grade.getValue()), gradeFont)));
            table.addCell(new PdfPCell(new Phrase(String.valueOf(grade.getSubject().getNoteMaximale()), normalFont)));
            table.addCell(new PdfPCell(new Phrase(String.valueOf(grade.getSubject().getCoefficient()), normalFont)));
            table.addCell(new PdfPCell(new Phrase(grade.getComment() != null ? grade.getComment() : "RAS", normalFont)));
        }
        
        document.add(table);
        
        // Moyenne générale
        document.add(new Paragraph(" "));
        Font avgFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.BLUE);
        document.add(new Paragraph("Moyenne générale : " + String.format("%.2f", transcript.getAverage()), avgFont));
        
        // Date de génération
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Généré le : " + transcript.getGeneratedDate(), normalFont));

        document.close();
        return outputStream.toByteArray();
    }

    public byte[] generateBulkTranscripts(List<Long> studentIds) throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter pdfWriter = PdfWriter.getInstance(document, out);
        document.open();

        document.add(new Paragraph("Relevés de Notes - Génération en masse"));

        for (Long studentId : studentIds) {
            Transcript transcript = transcriptRepository.findByStudentId(studentId)
                    .orElseThrow(() -> new RessourceNotFoundException("Transcript not found"));

            document.add(new Paragraph("Nom : " + transcript.getStudent().getFirstName() + " " + transcript.getStudent().getLastName()));
            document.add(new Paragraph("Année Académique : " + transcript.getEvaluation().getAnneeAcademique()));

            for (Grade grade : transcript.getGrades()) {
                document.add(new Paragraph(grade.getSubject().getName() + " - " + grade.getValue()));
            }

            document.add(new Paragraph("--------------------------------------------"));
        }

        document.close();
        return out.toByteArray();
    }
}
