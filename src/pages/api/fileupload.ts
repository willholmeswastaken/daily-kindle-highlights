import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { getServerAuthSession } from "../../server/auth";
import type { Import } from "@prisma/client";
import { prisma } from "../../server/db";
import { KindleHighlightsService } from "../../services/KindleHighlights";
import type { ApiResponse } from "../../types";
import { logger } from "../../utils/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });
  if (!session) {
    console.error("User not authenticated.");
    res.status(401).json({
      errorMessage: "Unauthenticated user",
      responseCode: "401",
    } as ApiResponse<string>);
    return;
  }
  if (!session.user.id) {
    console.error("User id not found in session.");
    res.status(401).json({
      errorMessage: "User id not found in session",
      responseCode: "401",
    } as ApiResponse<string>);
    return;
  }

  let importLogger = logger;
  importLogger.info("Creating import");

  const highlightsImport: Import = await prisma.import.create({
    data: {
      userId: session.user.id,
      importId: uuid(),
      importType: "Manual",
    },
  });

  importLogger.info({ importId: highlightsImport.importId }, "Import created");
  importLogger = importLogger.child({ importId: highlightsImport.importId });

  try {
    const kindleHighlightsService = new KindleHighlightsService(
      req.body as string,
      session.user.id
    );

    await kindleHighlightsService.saveBooks(highlightsImport.id);
  } catch (e) {
    importLogger.error(e, "Error importing highlights");

    await prisma.import.delete({
      where: {
        id: highlightsImport.id,
      },
    });

    return res.status(500).json({
      errorMessage: "Error importing highlights",
      responseCode: "500",
    } as ApiResponse<string>);
  }

  importLogger.info("Import complete");
  res.status(201).json({
    responseCode: "201",
    data: highlightsImport.id,
  } as ApiResponse<string>);
}
