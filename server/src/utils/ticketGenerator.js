const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Generates a PNG ticket with a QR code
 * @param {Object} ticketData - Data to encode in QR and display on ticket
 * @returns {Promise<string>} - Path to the generated ticket
 */
const generateTicketPNG = async (ticketData) => {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Styling
  ctx.fillStyle = '#b88b5c'; // Theme color from client
  ctx.fillRect(0, 0, 20, height); // Left accent bar

  // Text Info
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('EVENT TICKET', 50, 60);

  ctx.font = '24px Arial';
  ctx.fillText(`Event: ${ticketData.eventTitle}`, 50, 110);
  ctx.fillText(`Attendee: ${ticketData.attendeeName}`, 50, 150);
  ctx.fillText(`Type: ${ticketData.ticketType}`, 50, 190);
  ctx.fillText(`Date: ${new Date(ticketData.eventDate).toLocaleDateString()}`, 50, 230);
  ctx.fillText(`Ref: ${ticketData.reference}`, 50, 270);

  // QR Code Generation
  const qrData = JSON.stringify({
    ref: ticketData.reference,
    attendee: ticketData.attendeeId,
    event: ticketData.eventId
  });
  
  const qrImage = await QRCode.toDataURL(qrData);
  const img = await loadImage(qrImage);
  ctx.drawImage(img, width - 250, 80, 200, 200);

  ctx.font = '14px Arial';
  ctx.fillStyle = '#666';
  ctx.fillText('Scan for validation', width - 200, 300);

  // Save to file
  const directory = path.join(__dirname, '../../public/tickets');
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const fileName = `ticket_${ticketData.reference}.png`;
  const filePath = path.join(directory, fileName);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);

  return `/tickets/${fileName}`;
};

module.exports = { generateTicketPNG };
