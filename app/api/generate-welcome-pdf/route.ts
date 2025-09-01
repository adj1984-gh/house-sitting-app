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
        width: 200,
        margin: 2,
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
              padding: 20px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #3b82f6;
              margin-bottom: 10px;
            }
            .welcome {
              font-size: 20px;
              color: #1f2937;
            }
            .stay-info {
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-label {
              font-weight: bold;
              color: #374151;
            }
            .info-value {
              color: #6b7280;
            }
            .qr-section {
              text-align: center;
              margin: 30px 0;
              padding: 20px;
              background-color: #fef3c7;
              border-radius: 8px;
            }
            .qr-title {
              font-size: 18px;
              font-weight: bold;
              color: #92400e;
              margin-bottom: 15px;
            }
            .qr-instructions {
              color: #78350f;
              margin-bottom: 20px;
            }
            .qr-code {
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .emergency {
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .emergency-title {
              color: #dc2626;
              font-weight: bold;
              margin-bottom: 10px;
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
              Scan this QR code with your phone to instantly access the house sitting portal with all the information you need!
            </div>
            <div class="qr-code">
              ${qrCodeDataUrl ? 
                `<img src="${qrCodeDataUrl}" alt="QR Code for ${qrCodeUrl}" style="width: 200px; height: 200px; margin: 0 auto; display: block;" />` :
                `<div style="width: 200px; height: 200px; margin: 0 auto; background-color: #f3f4f6; border: 2px dashed #9ca3af; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                  QR Code<br/>${qrCodeUrl}
                </div>`
              }
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: #6b7280;">
              Or visit: ${qrCodeUrl}
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
