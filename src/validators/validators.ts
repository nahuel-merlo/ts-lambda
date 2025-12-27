import * as e from "../either/Either.js";
import type { Either } from "../either/Either.ts";
import { just, Maybe, nothing } from "../maybe/Maybe.js";

type Validator<T> = (input: unknown) => Either<Error, T>;

// Primitives
const stringValidator: Validator<string> = (input) => ( typeof input === "string" ? e.right(input) : e.left(Error("No es un string")) );
const numberValidator: Validator<number> = (input) => ( typeof input === "number" ? e.right(input) : e.left(Error("No es un number")) );
const booleanValidator: Validator<boolean> = (input) => (typeof input === "boolean" ? e.right(input) : e.left(Error("No es un boolean")) );   
const bigintValidator: Validator<bigint> = (input) => (typeof input === "bigint" ? e.right(input) : e.left(Error("No es un bigInt")) );
const symbolValidator: Validator<symbol> = (input) => (typeof input === "symbol" ? e.right(input) : e.left(Error("no es un symbol")) );

// Espero que nunca los uses
const nullValidator: Validator<null> = (input: any) => (typeof input === null ? e.right(input) : e.left(Error("No es null")) );
const undefinedValidator: Validator<undefined> = (input: any) => (typeof input === undefined ? e.right(input) : e.left(Error("No es undefined")) );

// Combinators
const optionalValidator = <T>(validator: Validator<T>): Validator<Maybe<T>> => (input: any) => { 
    if(input === undefined || input === null) return e.right(nothing());

    return e.match({
        Left: (l) => e.left(Error("No es del tipo esperado")),
        Right: (r: T) => e.right(just(r)),
    })(validator(input)) as Either<Error, Maybe<T>>
}

const unionValidator = <T>(...validators: Validator<T>[]): Validator<T> => (input) => {
    validators.forEach(validator => {
        const validated = validator(input);
        if(e.isRight(validated)) return validated;
    });

    return e.left(Error("No es parte de la union"));
}

// General types (ADT's)
const objectValidator = <T>(schema: Record<string, Validator<T>>) => (input: any) => { //TODO: Looking for a better name like: entityValidator, typeValidator, generalValidator ...
    if(typeof input !== "object" || typeof input === null || typeof input === undefined) return e.left(Error("No es un objeto")); // Exaustive check

    const entity = input as Record<string, unknown>;
    const result: any = {}; 

    for(const key in schema ){
        const validator = schema[key];
        const validated = validator(entity[key]);
        if(e.isRight(validated)) result[key] = e.unpackR(validated);
        else return e.left(Error(`Parametro invalido: ${key}`));
    }

    return result;
}

export { stringValidator, numberValidator, booleanValidator, bigintValidator, symbolValidator, nullValidator, undefinedValidator, optionalValidator, unionValidator, objectValidator };