import { NextRequest, NextResponse } from 'next/server';
import { getStay } from '../../../lib/database';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { stayId } = await request.json();
    
    if (!stayId) {
      return NextResponse.json({ error: 'Stay ID is required' }, { status: 400 });
    }

    // Get stay details from database
    const stay = await getStay(stayId);
    if (!stay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    // Generate QR code URL with auto-login
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://housesit.9441altodrive.com';
    const accessPassword = process.env.NEXT_PUBLIC_SITE_ACCESS_PASSWORD;
    const qrCodeUrl = `${siteUrl}?access=${accessPassword}`;

    // Generate QR code as data URL
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
        width: 150,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to House Sitting</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 15px;
              line-height: 1.4;
              font-size: 14px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 20px;
              font-weight: bold;
              color: #3b82f6;
              margin-bottom: 8px;
            }
            .welcome {
              font-size: 18px;
              color: #1f2937;
            }
            .stay-info {
              background-color: #f8fafc;
              padding: 15px;
              border-radius: 6px;
              margin: 15px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 6px 0;
              padding: 4px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-label {
              font-weight: bold;
              color: #374151;
              font-size: 13px;
            }
            .info-value {
              color: #6b7280;
              font-size: 13px;
            }
            .qr-section {
              text-align: center;
              margin: 15px 0;
              padding: 15px;
              background-color: #fef3c7;
              border-radius: 6px;
            }
            .qr-title {
              font-size: 16px;
              font-weight: bold;
              color: #92400e;
              margin-bottom: 10px;
            }
            .qr-instructions {
              color: #78350f;
              margin-bottom: 15px;
              font-size: 13px;
            }
            .qr-code {
              margin: 15px 0;
            }
            .wifi-section {
              text-align: center;
              margin: 15px 0;
              padding: 15px;
              background-color: #f0f9ff;
              border: 1px solid #0ea5e9;
              border-radius: 6px;
            }
            .wifi-title {
              font-size: 16px;
              font-weight: bold;
              color: #0c4a6e;
              margin-bottom: 10px;
            }
            .wifi-instructions {
              color: #075985;
              margin-bottom: 15px;
              font-size: 13px;
            }
            .wifi-codes {
              display: flex;
              justify-content: space-around;
              margin: 15px 0;
              flex-wrap: wrap;
            }
            .wifi-code {
              text-align: center;
              margin: 8px;
            }
            .wifi-label {
              font-weight: bold;
              margin-bottom: 8px;
              color: #0c4a6e;
              font-size: 13px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            .emergency {
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              padding: 12px;
              border-radius: 6px;
              margin: 15px 0;
            }
            .emergency-title {
              color: #dc2626;
              font-weight: bold;
              margin-bottom: 8px;
              font-size: 14px;
            }
            .emergency p {
              font-size: 13px;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🏠 House Sitting Portal</div>
            <div class="welcome">Welcome, ${stay.sitter_name}!</div>
          </div>

          <div class="stay-info">
            <h3 style="margin-top: 0; color: #1f2937;">Your Stay Details</h3>
            <div class="info-row">
              <span class="info-label">Sitter Name:</span>
              <span class="info-value">${stay.sitter_name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Start Date:</span>
              <span class="info-value">${new Date(stay.start_date).toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">End Date:</span>
              <span class="info-value">${new Date(stay.end_date).toLocaleDateString()}</span>
            </div>
            ${stay.notes ? `
            <div class="info-row">
              <span class="info-label">Notes:</span>
              <span class="info-value">${stay.notes}</span>
            </div>
            ` : ''}
          </div>

          <div class="qr-section">
            <div class="qr-title">📱 Quick Access</div>
            <div class="qr-instructions">
              Scan this QR code with your phone to instantly access the house sitting portal!
            </div>
            <div class="qr-code">
              ${qrCodeDataUrl ? 
                `<img src="${qrCodeDataUrl}" alt="QR Code for ${qrCodeUrl}" style="width: 150px; height: 150px; margin: 0 auto; display: block;" />` :
                `<div style="width: 150px; height: 150px; margin: 0 auto; background-color: #f3f4f6; border: 2px dashed #9ca3af; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px;">
                  QR Code
                </div>`
              }
            </div>
          </div>

          <div class="wifi-section">
            <div class="wifi-title">📶 WiFi Access</div>
            <div class="wifi-instructions">
              Scan these QR codes to connect to the WiFi networks:
            </div>
            <div class="wifi-codes">
              <div class="wifi-code">
                <div class="wifi-label">Frenchie Den</div>
                <img src="https://housesit.9441altodrive.com/wifi_qr_frenchie_den.png" alt="Frenchie Den WiFi QR Code" style="width: 120px; height: 120px; border: 1px solid #e5e7eb;" />
              </div>
              <div class="wifi-code">
                <div class="wifi-label">Frenchie Den2</div>
                <img src="https://housesit.9441altodrive.com/wifi_qr_frenchie_den2.png" alt="Frenchie Den2 WiFi QR Code" style="width: 120px; height: 120px; border: 1px solid #e5e7eb;" />
              </div>
            </div>
            <div style="margin-top: 10px; font-size: 12px; color: #075985;">
              Simply scan with your phone's camera to connect automatically
            </div>
          </div>

          <div class="emergency">
            <div class="emergency-title">🚨 Emergency Contacts</div>
            <p>In case of emergency, please contact the homeowners immediately. All emergency contact information is available in the portal.</p>
          </div>

          <div class="footer">
            <p>This document was generated on ${new Date().toLocaleDateString()}</p>
            <p>For the most up-to-date information, always check the online portal</p>
          </div>
        </body>
      </html>
    `;

    // For now, return the HTML content
    // In a full implementation, you'd use a PDF generation library like Puppeteer
    return NextResponse.json({ 
      success: true, 
      html: htmlContent,
      qrCodeUrl: qrCodeUrl,
      stay: stay
    });

  } catch (error) {
    console.error('Error generating welcome PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
