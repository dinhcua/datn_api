import { seedingAddress } from "./seedingAdress";
import { seedingOrganField } from "./seedingOrganField";
import { seedingProcedure } from "./seedingProcedure";

export const seeding = async () => {
  await seedingAddress();
  await seedingOrganField();
  // await seedingProcedure();
};
