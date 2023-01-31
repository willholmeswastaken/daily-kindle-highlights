import { ImportType } from "@prisma/client";
import { prisma } from "../server/db";
import { ImportMethod } from "../types/ImportMethod";

export const getImportMethodsAsync = async (
  userId: string
): Promise<ImportMethod[]> => {
  const imports = await prisma.import.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      importedOn: "desc",
    },
  });
  return [
    {
      name: "Kindle - Online",
      type: ImportType.Online,
      desc: "Import your books from Kindle online",
      lastUpdatedOn:
        imports.find((x) => x.importType === ImportType.Online)?.importedOn ??
        null,
    },
    {
      name: "Kindle - Upload",
      type: ImportType.Online,
      desc: "Import your books from Kindle file upload",
      lastUpdatedOn:
        imports.find((x) => x.importType === ImportType.Manual)?.importedOn ??
        null,
    },
  ];
};
