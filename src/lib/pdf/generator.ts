import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { Experience, PrintCardConfig } from '@/types/experience';

// Helper: Hex color to pdf-lib rgb
function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return rgb(isNaN(r) ? 0.9 : r, isNaN(g) ? 0.9 : g, isNaN(b) ? 0.9 : b);
}

export async function generatePrintCardPdf(
  experience: Experience,
  config: Partial<PrintCardConfig> = {},
  baseUrl: string = 'https://qrgift.com'
): Promise<Uint8Array> {
  const format = config.format || 'a6';
  const includeCropMarks = config.includeCropMarks ?? true;
  const instruction = config.customInstruction || 'Escanea aquí con tu celular para descubrir tu experiencia digital';

  // 1 mm = 2.83465 points
  const MM_TO_PT = 2.83465;

  let widthPt: number;
  let heightPt: number;

  if (format === 'square') {
    widthPt = 120 * MM_TO_PT; // ~340.16 pt
    heightPt = 120 * MM_TO_PT;
  } else {
    // A6 (105 x 148 mm)
    widthPt = 105 * MM_TO_PT; // ~297.64 pt
    heightPt = 148 * MM_TO_PT; // ~419.53 pt
  }

  // Create PDF Document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([widthPt, heightPt]);

  // Embed standard fonts
  const fontSerif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontSans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background color
  const theme = experience.theme_config;
  const bgRgb = hexToRgb(theme.backgroundColor || '#fff1f2');
  const primaryRgb = hexToRgb(theme.primaryColor || '#e11d48');
  const textRgb = hexToRgb(theme.textColor || '#1e293b');

  // Draw background fill
  page.drawRectangle({
    x: 0,
    y: 0,
    width: widthPt,
    height: heightPt,
    color: bgRgb,
  });

  // Inner decorative border
  const margin = 20;
  page.drawRectangle({
    x: margin,
    y: margin,
    width: widthPt - margin * 2,
    height: heightPt - margin * 2,
    borderColor: primaryRgb,
    borderWidth: 1.5,
    opacity: 0.4,
  });

  // Generate High-Res QR Code Buffer (High Error Correction)
  const experienceUrl = `${baseUrl}/e/${experience.slug}`;
  const qrBuffer = await QRCode.toBuffer(experienceUrl, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 1,
    width: 600,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  const qrImage = await pdfDoc.embedPng(qrBuffer);

  // Card Header / Title
  const recipient = experience.recipient_name
    ? `Para ${experience.recipient_name}`
    : 'Un Regalo Especial';

  page.drawText(recipient, {
    x: widthPt / 2 - (fontSerif.widthOfTextAtSize(recipient, 16) / 2),
    y: heightPt - 55,
    size: 16,
    font: fontSerif,
    color: primaryRgb,
  });

  // Short Subtitle / Experience Title
  const cardTitle = experience.title.length > 36 
    ? experience.title.substring(0, 34) + '...' 
    : experience.title;

  page.drawText(cardTitle, {
    x: widthPt / 2 - (fontSans.widthOfTextAtSize(cardTitle, 10) / 2),
    y: heightPt - 75,
    size: 10,
    font: fontSans,
    color: textRgb,
  });

  // QR Code Center Container (White rounded badge)
  const qrBoxSize = format === 'square' ? 140 : 155;
  const qrBoxX = (widthPt - qrBoxSize) / 2;
  const qrBoxY = (heightPt - qrBoxSize) / 2 - 10;

  // White background for QR code
  page.drawRectangle({
    x: qrBoxX - 8,
    y: qrBoxY - 8,
    width: qrBoxSize + 16,
    height: qrBoxSize + 16,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 1,
  });

  page.drawImage(qrImage, {
    x: qrBoxX,
    y: qrBoxY,
    width: qrBoxSize,
    height: qrBoxSize,
  });

  // Instruction Text Below QR Code
  const lines = [
    instruction.length > 45 ? instruction.substring(0, 42) + '...' : instruction,
    `qrgift.com/e/${experience.slug}`,
  ];

  page.drawText(lines[0], {
    x: widthPt / 2 - (fontSansBold.widthOfTextAtSize(lines[0], 8.5) / 2),
    y: qrBoxY - 26,
    size: 8.5,
    font: fontSansBold,
    color: textRgb,
  });

  page.drawText(lines[1], {
    x: widthPt / 2 - (fontSans.widthOfTextAtSize(lines[1], 8) / 2),
    y: qrBoxY - 40,
    size: 8,
    font: fontSans,
    color: primaryRgb,
  });

  // Footer Branding
  const footerText = 'Impreso con QRGift • Experiencia Digital Interactiva';
  page.drawText(footerText, {
    x: widthPt / 2 - (fontSans.widthOfTextAtSize(footerText, 6.5) / 2),
    y: margin + 8,
    size: 6.5,
    font: fontSans,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Optional Crop Marks (Bleed ticks)
  if (includeCropMarks) {
    const markLength = 12;
    const offset = 4;
    const cropColor = rgb(0.3, 0.3, 0.3);

    // Top-left
    page.drawLine({ start: { x: offset, y: heightPt - offset }, end: { x: offset + markLength, y: heightPt - offset }, color: cropColor, thickness: 0.5 });
    page.drawLine({ start: { x: offset, y: heightPt - offset }, end: { x: offset, y: heightPt - offset - markLength }, color: cropColor, thickness: 0.5 });

    // Top-right
    page.drawLine({ start: { x: widthPt - offset, y: heightPt - offset }, end: { x: widthPt - offset - markLength, y: heightPt - offset }, color: cropColor, thickness: 0.5 });
    page.drawLine({ start: { x: widthPt - offset, y: heightPt - offset }, end: { x: widthPt - offset, y: heightPt - offset - markLength }, color: cropColor, thickness: 0.5 });

    // Bottom-left
    page.drawLine({ start: { x: offset, y: offset }, end: { x: offset + markLength, y: offset }, color: cropColor, thickness: 0.5 });
    page.drawLine({ start: { x: offset, y: offset }, end: { x: offset, y: offset + markLength }, color: cropColor, thickness: 0.5 });

    // Bottom-right
    page.drawLine({ start: { x: widthPt - offset, y: offset }, end: { x: widthPt - offset - markLength, y: offset }, color: cropColor, thickness: 0.5 });
    page.drawLine({ start: { x: widthPt - offset, y: offset }, end: { x: widthPt - offset, y: offset + markLength }, color: cropColor, thickness: 0.5 });
  }

  return await pdfDoc.save();
}
