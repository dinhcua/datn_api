"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortKey = void 0;
const generateShortKey = (length = 10) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let shortKey = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        shortKey += characters.charAt(randomIndex);
    }
    return shortKey;
};
exports.generateShortKey = generateShortKey;
