"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seeding = void 0;
const seedingProcedure_1 = require("./seedingProcedure");
const convertData = (seedingData, field1, field2) => {
    return seedingData.map((data) => {
        if (field1 && field2) {
            return {
                ...data,
                [field1]: Number.parseInt(data[field1]),
                [field2]: Number.parseInt(data[field2]),
                id: Number.parseInt(data.id),
            };
        }
        else if (field1) {
            return {
                ...data,
                [field1]: Number.parseInt(data[field1]),
                id: Number.parseInt(data.id),
            };
        }
        else {
            return {
                ...data,
                id: Number.parseInt(data.id),
            };
        }
    });
};
const seeding = async () => {
    // await seedingAddress()
    // await seedingOrganField();
    await (0, seedingProcedure_1.seedingProcedure)();
};
exports.seeding = seeding;
