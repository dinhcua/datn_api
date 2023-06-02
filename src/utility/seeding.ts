import { PrismaClient } from "@prisma/client";
import { seedingAddress } from "./seedingAdress";
import { seedingOrganField } from "./seedingOrganField";
import { seedingProcedure } from "./seedingProcedure";

const convertData = (seedingData: any[], field1?: string, field2?: string) => {
  return seedingData.map((data: any) => {
    if (field1 && field2) {
      return {
        ...data,
        [field1]: Number.parseInt(data[field1]),
        [field2]: Number.parseInt(data[field2]),
        id: Number.parseInt(data.id),
      };
    } else if (field1) {
      return {
        ...data,
        [field1]: Number.parseInt(data[field1]),
        id: Number.parseInt(data.id),
      };
    } else {
      return {
        ...data,
        id: Number.parseInt(data.id),
      };
    }
  });
};

export const seeding = async () => {
  // await seedingAddress()
  // await seedingOrganField();
  await seedingProcedure();
};
