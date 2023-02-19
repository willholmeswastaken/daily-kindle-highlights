import { NextApiRequest, NextApiResponse } from "next";
import { serverEnv } from "../../env/schema.mjs";
import { prisma } from "../../server/db";
import { EmailService } from "../../services/EmailService";
import { HighlightsSelectorService } from "../../services/HighlightsSelectorService";

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
      const emailService = new EmailService(serverEnv.SENDGRID_API_KEY!);
      const users = await prisma.user.findMany();
      const tasks = users.map(
        (user) =>
          new Promise<void>(async (res, rej) => {
            const highlightsSelectorService = new HighlightsSelectorService(
              user.id
            );
            const dailyHighlights = await highlightsSelectorService.getRandom();
            emailService.sendEmail({
              to: user.email!,
              from: {
                name: "Rekindled",
                email: serverEnv.EMAIL_USERNAME!,
              },
              subject: `Your daily highlights: ${
                dailyHighlights[0]!.author
              } and more`,
              dailyHighlights,
            });
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
