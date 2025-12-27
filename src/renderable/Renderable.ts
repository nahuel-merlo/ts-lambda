import type { Either, Left, Right } from "../either/Either.ts";
import type { Maybe, Nothing, Just } from "../maybe/Maybe.ts";
import * as e from "../either/Either.js";
import * as m from "../maybe/Maybe.js"; 

/**
 * Renderable represents a value that has two behaviors (like Either) but also has a neutral value (like Maybe)
 * This type was designed with the idea of ​​representing states
 */
type Renderable<E, A> = Either<E, Maybe<A>>;
// type Renderable<E, A> = Either<Maybe<E>, A>;

const empty = <E, A>(): Renderable<E, A> => e.right(m.nothing());
const error = <E, A>(err: E): Renderable<E, A> => e.left(err); 
const success = <E, A>(a: A): Renderable<E, A> => e.right(m.just(a)); 

const isError = <E, A>(r: Renderable<E, A>): r is Left<E> => e.isLeft(r)
const isSuccess = <E, A>(r: Renderable<E, A>): r is Right<Just<A>> => e.isRight(r) && m.isJust(e.unpackR(r)); 
const isEmpty = <E, A>(r: Renderable<E, A>): r is Right<Nothing> => e.isRight(r) && m.isNothing(e.unpackR(r));

const matchRenderable = <E, A, B>(cases: {
    Error: (e: E) => B;
    Empty: () => B;
    Success: (a: A) => B;
}) => (r: Renderable<E, A>): B => e.match({
    Left: (e: E) => cases.Error(e),
    Right: (mb: Maybe<A>) => m.match({
        Nothing: () => cases.Empty(),
        Just: (a: A) => cases.Success(a)
    })(mb)
})(r);

const unpackSuccess = <A>(r: Right<Just<A>>): A => e.unpackR(r).just; 


export type { Renderable };
export { matchRenderable, empty, error, success, isError, isSuccess, isEmpty, unpackSuccess };