import { seedingAddress } from "./seedingAdress";
import { seedingOrganField } from "./seedingOrganField";
import { seedingProcedure } from "./seedingProcedure";
import { seedingUser } from "./seedingUser";

export const seeding = async () => {
  await seedingUser();
  // await seedingAddress();
  // await seedingOrganField();
  // await seedingProcedure();
};
