import filterMap from "../mapping/filterMap.js";

/**
 * Either: represents values ​​that can have two behaviors (Left being the special behavior and Right the expected one)
 */
type Either<E, A> = Left<E> | Right<A>;

interface Left<E> {
    readonly _tag: "Left";
    readonly left: E;
}

interface Right<A> {
    readonly _tag: "Right";
    readonly right: A;
}

/**
 * left: constructs a value of type Left
 * @param e -> value of the expected type
 * @returns -> value of the expected type Left
 */
const left  = <E, A>(e: E): Either<E, A> => ({_tag: "Left", left: e});
/**
 * right: construye un valor de tipo Right
 * @param a -> value of the expected type
 * @returns -> value of the expected type Right
 */
const right = <E, A>(a: A): Either<E, A> => ({_tag: "Right", right: a});

/**
 * isLeft: predicate that answers: is this value of type Left?
 * @param e -> value to evaluate
 * @returns -> It returns a boolean representing whether the type is indeed Left, but it also performs type narrowing, providing information to the type checker.
 */
const isLeft = <E, A>(e: Either<E, A>): e is Left<E> => e._tag === "Left"; 
/**
 * isRight: predicate that answers: is this value of the type Right?
 * @param e -> value to evaluate
 * @returns -> It returns a boolean representing whether the type is indeed Right, but it also performs type narrowing, providing information to the type checker.
 */
const isRight = <E, A>(e: Either<E, A>): e is Right<A> => e._tag === "Right";

/**
 * match: simulates pattern matching on Either
 * @param onLeft  -> function that is applied to Left (specifically the value enclosed in Left)
 * @param onRight -> function that is applied to Right (specifically the value wrapped in Right)
 * @returns       -> returns the result of onLeft or onRight depending on the value of Either
 */
const match = <E, A, B>(cases: {
    Left:     (l: E) => B, 
    Right:    (r: A) => B,
}) => (eith: Either<E, A>): B => isLeft(eith) ? cases.Left(eith.left) : cases.Right(eith.right); 

/**
 * unpackL: returns the contents of Left
 * @param l -> Left
 * @returns -> Left<E>.left 
 */
const unpackL = <E>(l: Left<E>): E => l.left;

/**
 * unpackR: returns the contents of Right
 * @param r -> Right
 * @returns -> Right<A>.right
 */
const unpackR = <A>(r: Right<A>): A => r.right;

/**
 * eitherMapL: returns the contents of all the Left entries in the Either list
 * @param l -> Either list
 * @returns -> List with left values (excluding right values)
 */
const eitherMapL = <E, A>(l: Array<Either<E, A>>): Array<E> => filterMap(l, e => unpackL(e as Left<E>), [isLeft]); 

/**
 * eitherMapR: returns the contents of all the Right entries in the Either list
 * @param l -> Either list
 * @returns -> list with Right values (excluding left values)
 */
const eitherMapR = <E, A>(l: Array<Either<E, A>>): Array<A> => filterMap(l, e => unpackR(e as Right<A>), [isRight]);

/**
 * EitherHashMap: Extend Map by adding secure features like safeGet.
 */
class EitherHashMap<K, V> extends Map<K, V> {
    constructor(entries?: Iterable<readonly [K, V]>) {
        super(entries);
    }

    /**
     * safeGet: is a secure Map.get()
     * @param key -> key of the element you want to search for
     * @returns   -> If found, return the element wrapped in a right, otherwise return left.
     */
    safeGet(key: K): Either<Error, V> {
        const value = super.get(key);
        console.log(`search for ${key}`);
        return  value === undefined ? left(Error(`No se encontro el objeto con la key: ${key}`)) : right(value);
    }
}

export type { Either, Left, Right };
export { left, right, isLeft, isRight, match, unpackL, unpackR, eitherMapL, eitherMapR, EitherHashMap };
