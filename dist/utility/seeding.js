"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seeding = void 0;
const seedingAdress_1 = require("./seedingAdress");
const seedingOrganField_1 = require("./seedingOrganField");
const seeding = async () => {
    await (0, seedingAdress_1.seedingAddress)();
    await (0, seedingOrganField_1.seedingOrganField)();
    // await seedingProcedure();
};
exports.seeding = seeding;
