import { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";
import { serverEnv } from "../../env/schema.mjs";
import { prisma } from "../../server/db";
import { shuffleArray } from "../../utils/shuffleArray";

type DailyHighlight = {
  title: string;
  author: string;
  highlight: string;
  location: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      if (authorization !== `Bearer ${serverEnv.EMAIL_SECRET_KEY}`) {
        res.status(401).send(null);
        return;
      }
      sgMail.setApiKey(serverEnv.SENDGRID_API_KEY!);
      const users = await prisma.user.findMany();
      const tasks = users.map(
        (user) =>
          new Promise<void>(async (res, rej) => {
            console.log("Creating an email for user: ", user.email);
            const dailyHighlights: DailyHighlight[] = [];
            const books = await prisma.book.findMany({
              where: {
                userId: user.id,
              },
            });
            const booksInARandomOrder = shuffleArray(books).splice(0, 5);
            for (const book of booksInARandomOrder) {
              const higlights = await prisma.highlight.findMany({
                where: {
                  bookId: book.id,
                },
              });
              const randomHighlight = shuffleArray(higlights)[0];
              dailyHighlights.push({
                title: book.title,
                author: book.author,
                highlight: randomHighlight!.content,
                location: randomHighlight!.location,
              });
            }
            const msg = {
              to: user.email!,
              from: "info@willholmes.dev",
              subject: `Your daily highlights: ${
                dailyHighlights[0]!.author
              } and more`,
              html: `<html>
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
            ${
              dailyHighlights.length > 0 &&
              dailyHighlights.map(
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
            }
          </table>
        </body>
      </html>`,
            };
            console.log("Sending email for user: ", user.email);
            sgMail.send(msg).then(
              () => {
                console.log("Email sent for user: ", user.email);
              },
              (error) => {
                console.error(
                  "Failed to send email for user: ",
                  user.email,
                  error
                );

                if (error.response) {
                  console.error(error.response.body);
                }
              }
            );
            res();
          })
      );
      await Promise.all(tasks);
      res.status(200).send(null);
    } catch (err) {
      res.status(500).send(null);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
