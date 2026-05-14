export const getOtpHtml = ({ email, otp }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Authentication App Verification Code</title>
</head>

<body style="margin:0; padding:0; background:#f6f7fb; color:#111; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb; width:100%; border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px; background:#ffffff; border:1px solid #e9ecf3; border-radius:12px; overflow:hidden; border-collapse:collapse;">
          
          <tr>
            <td align="center" style="background:#111827; padding:18px 24px;">
              <span style="color:#ffffff; font-size:16px; font-weight:700; letter-spacing:0.3px;">
                Authentication App
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px; font-size:22px; line-height:1.3; color:#111; font-weight:700;">
                Verify your email - ${email}
              </h1>

              <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#444;">
                Use the verification code below to complete your sign-in to Authentication App.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-collapse:collapse; margin:20px 0;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:10px; padding:14px 18px; font-size:32px; letter-spacing:10px; font-weight:700; color:#111; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px; font-size:14px; line-height:1.6; color:#555;">
                This code will expire in <strong>5 minutes</strong>.
              </p>

              <p style="margin:0; font-size:14px; line-height:1.6; color:#555;">
                If this wasn’t initiated, this email can be safely ignored.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:16px 24px 0; color:#6b7280; font-size:12px; line-height:1.6;">
              © 2025 Authentication App. All rights reserved.
            </td>
          </tr>

          <tr>
            <td height="16" aria-hidden="true"></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const getVerifyEmailHtml = ({ email, token }) => {
  const appName = process.env.APP_NAME || "Authentication App";
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/token/${encodeURIComponent(token)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${appName} Verify Your Account</title>
</head>

<body style="margin:0; padding:0; background:#f6f7fb; color:#111; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb; width:100%; border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px; background:#ffffff; border:1px solid #e9ecf3; border-radius:12px; overflow:hidden; border-collapse:collapse;">
          
          <tr>
            <td align="center" style="background:#111827; padding:18px 24px;">
              <span style="color:#ffffff; font-size:16px; font-weight:700; letter-spacing:0.3px;">
                ${appName}
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px; font-size:22px; line-height:1.3; color:#111; font-weight:700;">
                Verify your account - ${email}
              </h1>

              <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#444;">
                Thanks for registering with ${appName}. Click the button below to verify your account.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 20px;">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" target="_blank" rel="noopener" style="display:inline-block; background:#111827; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:600; font-size:14px;">
                      Verify account
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px; font-size:14px; line-height:1.6; color:#555;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="margin:0 0 12px; font-size:14px; line-height:1.6; color:#555; word-break:break-all;">
                <a href="${verifyUrl}" target="_blank" rel="noopener" style="color:#111827; text-decoration:underline;">
                  ${verifyUrl}
                </a>
              </p>

              <p style="margin:0; font-size:14px; line-height:1.6; color:#555;">
                If this wasn’t you, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:16px 24px 0; color:#6b7280; font-size:12px; line-height:1.6;">
              © ${new Date().getFullYear()} ${appName}. All rights reserved.
            </td>
          </tr>

          <tr>
            <td height="16" aria-hidden="true"></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};