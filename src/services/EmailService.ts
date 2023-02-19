import sgMail from "@sendgrid/mail";
import type { DailyHighlight } from "../types/DailyHighlight";
import { logger } from "../utils/logger";

export class EmailService {
  constructor(sendGridApiKey: string) {
    sgMail.setApiKey(sendGridApiKey);
  }

  async sendEmail(email: Email) {
    const emailLogger = logger.child({
      to: email.to,
    });
    try {
      emailLogger.info("Sending email");
      const sgEmail: sgMail.MailDataRequired = {
        to: email.to,
        from: email.from,
        subject: email.subject,
        html: this.getDailyEmailHtml(email.dailyHighlights),
      };
      await sgMail.send(sgEmail);
      emailLogger.info("Sent email");
    } catch (error) {
      emailLogger.error({ error }, "Failed to send email");
    }
  }

  private getDailyEmailHtml(dailyHighlights: DailyHighlight[]): string {
    const highlights = dailyHighlights
      .map(
        (highlight) => `
      <tr>
      <td align="center">
          <!-- Start of quote block -->
          <div class="quote-box">
          <p class="quote-author lg"><span>${highlight.title}</span> by ${highlight.author}</p>
            <p class="quote-text">"${highlight.highlight}"</p>
            <p class="quote-author">Location: ${highlight.location}</p>
          </div>
      </td>
      </tr>`
      )
      .join("");
    return `<html>
        <head>
          <title>Book Quotes</title>
          <style type="text/css">
            h1 {
                color: rgb(239 68 68);
            }
            .subtitle {
                font-style: italic;
                margin-bottom: 20px;
            }
            /* Style for the quote box */
            .quote-box {
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 10px;
              margin-bottom: 20px;
            }
            /* Style for the quote text */
            .quote-text {
              font-size: 16px;
              line-height: 24px;
              margin-bottom: 10px;
            }
            /* Style for the quote author */
            .quote-author {
              font-size: 14px;
              font-style: italic;

              span {
                font-weight: bold;
              }
            }
            .lg {
                font-size: 18px;
            }
          </style>
        </head>
        <body>
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td align="center">
                <h1>Rekindled - Daily Quotes</h1>
              </td>
            </tr>
            <tr>
              <td align="center">
                <p class="subtitle">See your curated quotes below.</p>
              </td>
            </tr>
            ${highlights}
          </table>
        </body>
      </html>`;
  }
}

type Email = {
  to: string;
  from: EmailFrom;
  subject: string;
  dailyHighlights: DailyHighlight[];
};

type EmailFrom = {
  name: string;
  email: string;
};
