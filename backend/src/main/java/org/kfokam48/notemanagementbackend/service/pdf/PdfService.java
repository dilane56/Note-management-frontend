package org.kfokam48.notemanagementbackend.service.pdf;


import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
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
      //  PdfDocument pdf = new PdfDocument(writer);


        document.add(new Paragraph("Relevé de Notes"));
        document.add(new Paragraph("Nom : " + transcript.getStudent().getFirstName() + " " + transcript.getStudent().getLastName()));
        document.add(new Paragraph("Année Académique : " + transcript.getAcademicYear()));

        transcript.getGrades().forEach(grade -> {
            try {
                document.add(new Paragraph(grade.getSubject().getName() + " - " + grade.getValue()));
            } catch (DocumentException e) {
                throw new RuntimeException(e);
            }
        });

        document.close();
        return outputStream.toByteArray();
    }

    public byte[] generateBulkTranscripts(List<Long> studentIds) throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter pdfWriter = PdfWriter.getInstance(document, out);
       // PdfDocument pdf = new PdfDocument(writer);


        document.add(new Paragraph("Relevés de Notes - Génération en masse"));

        for (Long studentId : studentIds) {
            Transcript transcript = transcriptRepository.findByStudentId(studentId)
                    .orElseThrow(() -> new RessourceNotFoundException("Transcript not found"));

            document.add(new Paragraph("Nom : " + transcript.getStudent().getFirstName() + " " + transcript.getStudent().getLastName()));
            document.add(new Paragraph("Année Académique : " + transcript.getAcademicYear()));

            for (Grade grade : transcript.getGrades()) {
                document.add(new Paragraph(grade.getSubject().getName() + " - " + grade.getValue()));
            }

            document.add(new Paragraph("--------------------------------------------"));
        }

        document.close();
        return out.toByteArray();
    }
}
