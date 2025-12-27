import filterMap from "../mapping/filterMap.js";
/**
 * left: constructs a value of type Left
 * @param e -> value of the expected type
 * @returns -> value of the expected type Left
 */
const left = (e) => ({ _tag: "Left", left: e });
/**
 * right: construye un valor de tipo Right
 * @param a -> value of the expected type
 * @returns -> value of the expected type Right
 */
const right = (a) => ({ _tag: "Right", right: a });
/**
 * isLeft: predicate that answers: is this value of type Left?
 * @param e -> value to evaluate
 * @returns -> It returns a boolean representing whether the type is indeed Left, but it also performs type narrowing, providing information to the type checker.
 */
const isLeft = (e) => e._tag === "Left";
/**
 * isRight: predicate that answers: is this value of the type Right?
 * @param e -> value to evaluate
 * @returns -> It returns a boolean representing whether the type is indeed Right, but it also performs type narrowing, providing information to the type checker.
 */
const isRight = (e) => e._tag === "Right";
/**
 * match: simulates pattern matching on Either
 * @param onLeft  -> function that is applied to Left (specifically the value enclosed in Left)
 * @param onRight -> function that is applied to Right (specifically the value wrapped in Right)
 * @returns       -> returns the result of onLeft or onRight depending on the value of Either
 */
const match = (cases) => (eith) => isLeft(eith) ? cases.Left(eith.left) : cases.Right(eith.right);
/**
 * unpackL: returns the contents of Left
 * @param l -> Left
 * @returns -> Left<E>.left
 */
const unpackL = (l) => l.left;
/**
 * unpackR: returns the contents of Right
 * @param r -> Right
 * @returns -> Right<A>.right
 */
const unpackR = (r) => r.right;
/**
 * eitherMapL: returns the contents of all the Left entries in the Either list
 * @param l -> Either list
 * @returns -> List with left values (excluding right values)
 */
const eitherMapL = (l) => filterMap(l, e => unpackL(e), [isLeft]);
/**
 * eitherMapR: returns the contents of all the Right entries in the Either list
 * @param l -> Either list
 * @returns -> list with Right values (excluding left values)
 */
const eitherMapR = (l) => filterMap(l, e => unpackR(e), [isRight]);
/**
 * EitherHashMap: Extend Map by adding secure features like safeGet.
 */
class EitherHashMap extends Map {
    constructor(entries) {
        super(entries);
    }
    /**
     * safeGet: is a secure Map.get()
     * @param key -> key of the element you want to search for
     * @returns   -> If found, return the element wrapped in a right, otherwise return left.
     */
    safeGet(key) {
        const value = super.get(key);
        console.log(`search for ${key}`);
        return value === undefined ? left(Error(`No se encontro el objeto con la key: ${key}`)) : right(value);
    }
}
export { left, right, isLeft, isRight, match, unpackL, unpackR, eitherMapL, eitherMapR, EitherHashMap };
