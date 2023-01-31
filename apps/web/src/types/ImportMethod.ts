import { ImportType } from "@prisma/client";

export type ImportMethod = {
  name: string;
  type: ImportType;
  desc: string;
  lastUpdatedOn: Date | null;
};
