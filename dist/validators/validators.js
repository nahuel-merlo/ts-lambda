"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectValidator = exports.unionValidator = exports.optionalValidator = exports.undefinedValidator = exports.nullValidator = exports.symbolValidator = exports.bigintValidator = exports.booleanValidator = exports.numberValidator = exports.stringValidator = void 0;
const e = __importStar(require("../either/Either"));
const Maybe_1 = require("../maybe/Maybe");
// Primitives
const stringValidator = (input) => (typeof input === "string" ? e.right(input) : e.left(Error("No es un string")));
exports.stringValidator = stringValidator;
const numberValidator = (input) => (typeof input === "number" ? e.right(input) : e.left(Error("No es un number")));
exports.numberValidator = numberValidator;
const booleanValidator = (input) => (typeof input === "boolean" ? e.right(input) : e.left(Error("No es un boolean")));
exports.booleanValidator = booleanValidator;
const bigintValidator = (input) => (typeof input === "bigint" ? e.right(input) : e.left(Error("No es un bigInt")));
exports.bigintValidator = bigintValidator;
const symbolValidator = (input) => (typeof input === "symbol" ? e.right(input) : e.left(Error("no es un symbol")));
exports.symbolValidator = symbolValidator;
// Espero que nunca los uses
const nullValidator = (input) => (typeof input === null ? e.right(input) : e.left(Error("No es null")));
exports.nullValidator = nullValidator;
const undefinedValidator = (input) => (typeof input === undefined ? e.right(input) : e.left(Error("No es undefined")));
exports.undefinedValidator = undefinedValidator;
// Combinators
const optionalValidator = (validator) => (input) => {
    if (input === undefined || input === null)
        return e.right((0, Maybe_1.nothing)());
    return e.match({
        Left: (l) => e.left(Error("No es del tipo esperado")),
        Right: (r) => e.right((0, Maybe_1.just)(r)),
    })(validator(input));
};
exports.optionalValidator = optionalValidator;
const unionValidator = (...validators) => (input) => {
    validators.forEach(validator => {
        const validated = validator(input);
        if (e.isRight(validated))
            return validated;
    });
    return e.left(Error("No es parte de la union"));
};
exports.unionValidator = unionValidator;
// General types (ADT's)
const objectValidator = (schema) => (input) => {
    if (typeof input !== "object" || typeof input === null || typeof input === undefined)
        return e.left(Error("No es un objeto")); // Exaustive check
    const entity = input;
    const result = {};
    for (const key in schema) {
        const validator = schema[key];
        const validated = validator(entity[key]);
        if (e.isRight(validated))
            result[key] = e.unpackR(validated);
        else
            return e.left(Error(`Parametro invalido: ${key}`));
    }
    return result;
};
exports.objectValidator = objectValidator;
