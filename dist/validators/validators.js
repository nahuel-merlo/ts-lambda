import * as e from "../either/Either.js";
import { just, nothing } from "../maybe/Maybe.js";
// Primitives
const stringValidator = (input) => (typeof input === "string" ? e.right(input) : e.left(Error("No es un string")));
const numberValidator = (input) => (typeof input === "number" ? e.right(input) : e.left(Error("No es un number")));
const booleanValidator = (input) => (typeof input === "boolean" ? e.right(input) : e.left(Error("No es un boolean")));
const bigintValidator = (input) => (typeof input === "bigint" ? e.right(input) : e.left(Error("No es un bigInt")));
const symbolValidator = (input) => (typeof input === "symbol" ? e.right(input) : e.left(Error("no es un symbol")));
// Espero que nunca los uses
const nullValidator = (input) => (typeof input === null ? e.right(input) : e.left(Error("No es null")));
const undefinedValidator = (input) => (typeof input === undefined ? e.right(input) : e.left(Error("No es undefined")));
// Combinators
const optionalValidator = (validator) => (input) => {
    if (input === undefined || input === null)
        return e.right(nothing());
    return e.match({
        Left: (l) => e.left(Error("No es del tipo esperado")),
        Right: (r) => e.right(just(r)),
    })(validator(input));
};
const unionValidator = (...validators) => (input) => {
    validators.forEach(validator => {
        const validated = validator(input);
        if (e.isRight(validated))
            return validated;
    });
    return e.left(Error("No es parte de la union"));
};
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
export { stringValidator, numberValidator, booleanValidator, bigintValidator, symbolValidator, nullValidator, undefinedValidator, optionalValidator, unionValidator, objectValidator };
