import PDFDocument from 'pdfkit';
import { Sentiment, Participant, Topic, CommonWord } from "@shared/schema";
import { createWriteStream } from 'fs';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

interface AnalysisData {
  fileName: string;
  uploadDate: Date;
  totalMessages: number;
  participants: Participant[];
  sentiment: Sentiment;
  topics: Topic;
  commonWords: CommonWord[];
  userName?: string;
}

const whatsappColors = {
  primary: '#25D366',
  secondary: '#128C7E',
  background: '#DCF8C6',
  text: '#075E54',
  lightText: '#34B7F1',
};

async function generateParticipantChart(participants: Participant[]): Promise<Buffer> {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });

  // Sort participants by message count and take top 15
  const topParticipants = [...participants]
    .sort((a, b) => b.messages - a.messages)
    .slice(0, 15);

  const data = {
    labels: topParticipants.map(p => p.name),
    datasets: [{
      label: 'Messages',
      data: topParticipants.map(p => p.messages),
      backgroundColor: whatsappColors.primary,
      borderColor: whatsappColors.secondary,
      borderWidth: 1
    }]
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer({
    type: 'bar',
    data,
    options: {
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        title: {
          display: true,
          text: 'Top 15 Most Active Participants',
          color: whatsappColors.text
        }
      }
    }
  });

  return buffer;
}

export async function generatePDF(data: AnalysisData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      let pageNumber = 1;

      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: 'A4',
        autoFirstPage: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Helper for consistent section headers
      const addSectionHeader = (text: string) => {
        doc.moveDown()
          .fontSize(20)
          .fillColor(whatsappColors.text)
          .font('Helvetica-Bold')
          .text(text, { align: 'left' });
      };

      // Helper to add footer and page number
      const addFooter = () => {
        const bottom = doc.page.height - 50;
        doc.fontSize(8)
          .fillColor(whatsappColors.text)
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
        addFooter();
      });
      

      // Cover page
      doc.rect(0, 0, doc.page.width, doc.page.height)
        .fill(whatsappColors.background);

      doc.fontSize(32)
        .fillColor(whatsappColors.text)
        .font('Helvetica-Bold')
        .text('WhatsApp Chat Analysis', { align: 'center', y: 200 });

      doc.moveDown(2)
        .fontSize(16)
        .fillColor(whatsappColors.secondary)
        .text(`Report generated for: ${data.userName || 'User'}`, { align: 'center' })
        .text(`File: ${data.fileName}`, { align: 'center' })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
      addFooter();


      // Participant Activity Chart
      doc.addPage();
      const chartBuffer = await generateParticipantChart(data.participants);
      doc.image(chartBuffer, {
        fit: [500, 300],
        align: 'center'
      });

      // Summary Statistics
      addSectionHeader('Summary Statistics');
      doc.moveDown()
        .fontSize(12)
        .fillColor(whatsappColors.text)
        .text(`Total Messages: ${data.totalMessages.toLocaleString()}`)
        .text(`Total Participants: ${data.participants.length}`)
        .text(`Average Messages per Participant: ${Math.round(data.totalMessages / data.participants.length)}`);

      // Sentiment Analysis
      addSectionHeader('Sentiment Analysis');
      doc.moveDown()
        .fontSize(12)
        .text(`Positive: ${data.sentiment.positive}%`)
        .text(`Negative: ${data.sentiment.negative}%`)
        .text(`Neutral: ${data.sentiment.neutral}%`);

      // Topic Distribution
      addSectionHeader('Topic Distribution');
      Object.entries(data.topics.distribution)
        .sort(([, a], [, b]) => b - a)
        .forEach(([topic, percentage]) => {
          doc.text(`${topic}: ${percentage}%`);
        });

      // Participant Details Table
      doc.addPage();
      addSectionHeader('Detailed Participant Analysis');

      const sortedParticipants = [...data.participants].sort((a, b) => b.messages - a.messages);

      // Table headers
      const startY = doc.y + 20;
      doc.fontSize(10)
        .fillColor(whatsappColors.text);

      const columns = {
        name: { x: 50, width: 150 },
        messages: { x: 200, width: 80 },
        words: { x: 280, width: 80 },
        sentiment: { x: 360, width: 150 }
      };

      Object.entries(columns).forEach(([header, { x }]) => {
        doc.text(header.charAt(0).toUpperCase() + header.slice(1), x, startY);
      });

      // Table rows
      let y = startY + 20;
      sortedParticipants.forEach((participant, i) => {
        if (y > doc.page.height - 50) {
          doc.addPage();
          y = 50;
        }

        doc.text(participant.name, columns.name.x, y)
          .text(participant.messages.toString(), columns.messages.x, y)
          .text(participant.words.toString(), columns.words.x, y)
          .text(participant.sentiment.overall, columns.sentiment.x, y);

        y += 20;
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}