"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertData = void 0;
const convertData = (seedingData, field1, field2, field3, field4) => {
    return seedingData.map((data) => {
        if (field1 && field2 && field3 && field4) {
            return {
                ...data,
                [field1]: Number.parseInt(data[field1]),
                [field2]: data[field2] === "" ? 0 : Number.parseInt(data[field2]),
                [field3]: data[field3] === "" ? 0 : Number.parseInt(data[field3]),
                [field4]: data[field4] === "" ? 0 : Number.parseInt(data[field4]),
                id: Number.parseInt(data.id),
            };
        }
        else if (field1 && field2 && field3) {
            return {
                ...data,
                [field1]: Number.parseInt(data[field1]),
                [field2]: data[field2] === "" ? 0 : Number.parseInt(data[field2]),
                [field3]: data[field3] === "" ? 0 : Number.parseInt(data[field3]),
                id: Number.parseInt(data.id),
            };
        }
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
exports.convertData = convertData;
