/**
 * Generate HTML email untuk reminder renewal subscription
 * @param {object} params
 * @param {string} params.userName
 * @param {string} params.subscriptionName
 * @param {number} params.daysLeft
 * @param {Date}   params.renewalDate
 * @param {number} params.price
 * @param {string} params.currency
 * @param {string} params.frequency
 */
export function generateReminderEmail({ userName, subscriptionName, daysLeft, renewalDate, price, currency, frequency }) {
    const formattedDate = new Date(renewalDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const urgencyColor = daysLeft <= 2 ? '#e53e3e' : daysLeft <= 5 ? '#dd6b20' : '#2b6cb0';
    const urgencyLabel = daysLeft === 1 ? 'Besok!' : `${daysLeft} hari lagi`;

    return {
        subject: `⏰ Reminder: ${subscriptionName} akan diperbarui ${urgencyLabel}`,
        html: `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reminder Subscription</title>
</head>
<body style="margin:0;padding:0;background-color:#f7fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a202c;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">SubsTrack</h1>
              <p style="margin:8px 0 0;color:#a0aec0;font-size:13px;">Kelola langgananmu dengan mudah</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;color:#718096;font-size:14px;">Halo, <strong style="color:#2d3748;">${userName}</strong> 👋</p>
              <h2 style="margin:0 0 24px;color:#1a202c;font-size:20px;font-weight:600;">
                Langganan kamu akan segera diperbarui
              </h2>

              <!-- Subscription Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0;color:#718096;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Nama Langganan</p>
                          <p style="margin:4px 0 0;color:#1a202c;font-size:18px;font-weight:700;">${subscriptionName}</p>
                        </td>
                        <td align="right">
                          <span style="display:inline-block;background-color:${urgencyColor};color:#ffffff;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">${urgencyLabel}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="33%">
                          <p style="margin:0;color:#718096;font-size:12px;">Biaya</p>
                          <p style="margin:4px 0 0;color:#2d3748;font-size:15px;font-weight:600;">${currency} ${price.toLocaleString('id-ID')}</p>
                        </td>
                        <td width="33%">
                          <p style="margin:0;color:#718096;font-size:12px;">Frekuensi</p>
                          <p style="margin:4px 0 0;color:#2d3748;font-size:15px;font-weight:600;">${frequency}</p>
                        </td>
                        <td width="33%">
                          <p style="margin:0;color:#718096;font-size:12px;">Tanggal Renewal</p>
                          <p style="margin:4px 0 0;color:#2d3748;font-size:15px;font-weight:600;">${formattedDate}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#4a5568;font-size:14px;line-height:1.6;">
                Pastikan metode pembayaranmu aktif agar langganan tidak terputus. Jika kamu ingin membatalkan, lakukan sebelum tanggal renewal.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f7fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#a0aec0;font-size:12px;">
                Email ini dikirim otomatis oleh SubsTrack. Jangan balas email ini.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim(),
    };
}
