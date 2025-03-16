import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { Participant, Sentiment, Topic, CommonWord } from '@shared/schema';

interface AnalysisData {
  fileName: string;
  uploadDate: Date;
  totalMessages: number;
  participants: Participant[];
  sentiment: Sentiment;
  topics: Topic;
  commonWords: CommonWord[];
}

export async function generatePDF(data: AnalysisData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Track page numbers
      let pageNumber = 1;
      
      // Create a document
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: 'A4',
        autoFirstPage: true,
      });
      
      // Buffer to collect PDF data chunks
      const chunks: Buffer[] = [];
      
      // Collect data chunks
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Helper to add footer and page number
      const addFooter = () => {
        const bottom = doc.page.height - 50;
        doc.fontSize(8)
          .fillColor('#6B7280')
          .text(
            `Page ${pageNumber}`, 
            doc.page.margins.left,
            bottom,
            { width: doc.page.width - doc.page.margins.left - doc.page.margins.right, align: 'center' }
          );
      };

      // Add page event listener to add footer and page number to each page
      doc.on('pageAdded', () => {
        pageNumber++;
      });
      
      // Document title
      doc.fontSize(24)
        .fillColor('#3b82f6')
        .font('Helvetica-Bold')
        .text('WhatsApp Chat Analysis Report', { align: 'center' });
      
      // Document info
      doc.moveDown()
        .fontSize(12)
        .fillColor('#374151')
        .font('Helvetica')
        .text(`File: ${data.fileName}`, { align: 'left' })
        .text(`Date Generated: ${new Date().toLocaleString()}`, { align: 'left' })
        .text(`Total Messages Analyzed: ${data.totalMessages}`, { align: 'left' });
      
      // Summary section
      doc.moveDown(2)
        .fontSize(18)
        .fillColor('#3b82f6')
        .font('Helvetica-Bold')
        .text('Summary', { align: 'left' });
        
      doc.moveDown()
        .fontSize(12)
        .fillColor('#374151')
        .font('Helvetica');
      
      // Create a table for sentiment summary
      doc.text('Sentiment Distribution:', { continued: true })
        .text(`  Positive: ${data.sentiment.positive}%`, { continued: true })
        .text(`  Negative: ${data.sentiment.negative}%`, { continued: true })
        .text(`  Neutral: ${data.sentiment.neutral}%`);
      
      // Participant Analysis section
      doc.moveDown(2)
        .fontSize(18)
        .fillColor('#3b82f6')
        .font('Helvetica-Bold')
        .text('Participant Analysis', { align: 'left' });
      
      doc.moveDown()
        .fontSize(12)
        .fillColor('#374151')
        .font('Helvetica');
      
      // Create a table for participants
      const participantTableTop = doc.y + 15;
      doc.fontSize(10).text('Name', 50, participantTableTop);
      doc.text('Messages', 200, participantTableTop);
      doc.text('Words', 300, participantTableTop);
      doc.text('Sentiment', 400, participantTableTop);
      
      // Draw a line below the headers
      doc.moveTo(50, participantTableTop + 15)
        .lineTo(550, participantTableTop + 15)
        .stroke();
      
      // Add participant data
      let yOffset = participantTableTop + 30;
      
      data.participants.forEach((participant, index) => {
        // Check if we need a new page
        if (yOffset + 20 > doc.page.height - 100) {
          doc.addPage();
          yOffset = 50;
          
          // Add table headers again on the new page
          doc.fontSize(10)
            .text('Name', 50, yOffset)
            .text('Messages', 200, yOffset)
            .text('Words', 300, yOffset)
            .text('Sentiment', 400, yOffset);
          
          // Draw a line below the headers
          doc.moveTo(50, yOffset + 15)
            .lineTo(550, yOffset + 15)
            .stroke();
          
          yOffset += 30;
        }
        
        doc.fontSize(10)
          .text(participant.name, 50, yOffset)
          .text(participant.messages.toString(), 200, yOffset)
          .text(participant.words.toString(), 300, yOffset)
          .text(participant.sentiment.overall, 400, yOffset);
        
        yOffset += 20;
      });
      
      // Topic Analysis section
      doc.moveDown(4)
        .fontSize(18)
        .fillColor('#3b82f6')
        .font('Helvetica-Bold')
        .text('Topic Analysis', { align: 'left' });
      
      doc.moveDown()
        .fontSize(12)
        .fillColor('#374151')
        .font('Helvetica')
        .text('Distribution of conversation topics:');
      
      // Create a table for topics
      const topicTableTop = doc.y + 15;
      doc.fontSize(10).text('Topic', 100, topicTableTop);
      doc.text('Percentage', 300, topicTableTop);
      
      // Draw a line below the headers
      doc.moveTo(100, topicTableTop + 15)
        .lineTo(500, topicTableTop + 15)
        .stroke();
      
      // Add topic data
      let topicYOffset = topicTableTop + 30;
      
      Object.entries(data.topics.distribution).forEach(([topic, percentage], index) => {
        // Check if we need a new page
        if (topicYOffset + 20 > doc.page.height - 100) {
          doc.addPage();
          topicYOffset = 50;
          
          // Add table headers again on the new page
          doc.fontSize(10)
            .text('Topic', 100, topicYOffset)
            .text('Percentage', 300, topicYOffset);
          
          // Draw a line below the headers
          doc.moveTo(100, topicYOffset + 15)
            .lineTo(500, topicYOffset + 15)
            .stroke();
          
          topicYOffset += 30;
        }
        
        doc.fontSize(10)
          .text(topic, 100, topicYOffset)
          .text(`${percentage}%`, 300, topicYOffset);
        
        topicYOffset += 20;
      });
      
      // Common Words section
      doc.addPage()
        .fontSize(18)
        .fillColor('#3b82f6')
        .font('Helvetica-Bold')
        .text('Most Common Words', { align: 'left' });
      
      doc.moveDown()
        .fontSize(12)
        .fillColor('#374151')
        .font('Helvetica')
        .text('Most frequently used words in the conversation:');
      
      // Create a table for common words
      const wordsTableTop = doc.y + 15;
      doc.fontSize(10).text('Word', 100, wordsTableTop);
      doc.text('Frequency', 300, wordsTableTop);
      
      // Draw a line below the headers
      doc.moveTo(100, wordsTableTop + 15)
        .lineTo(500, wordsTableTop + 15)
        .stroke();
      
      // Add common words data
      let wordsYOffset = wordsTableTop + 30;
      
      data.commonWords.slice(0, 20).forEach((word, index) => {
        // Check if we need a new page
        if (wordsYOffset + 20 > doc.page.height - 100) {
          doc.addPage();
          wordsYOffset = 50;
          
          // Add table headers again on the new page
          doc.fontSize(10)
            .text('Word', 100, wordsYOffset)
            .text('Frequency', 300, wordsYOffset);
          
          // Draw a line below the headers
          doc.moveTo(100, wordsYOffset + 15)
            .lineTo(500, wordsYOffset + 15)
            .stroke();
          
          wordsYOffset += 30;
        }
        
        doc.fontSize(10)
          .text(word.text, 100, wordsYOffset)
          .text(word.count.toString(), 300, wordsYOffset);
        
        wordsYOffset += 20;
      });
      
      // Add the footer to the first page (already created)
      addFooter();
      
      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
