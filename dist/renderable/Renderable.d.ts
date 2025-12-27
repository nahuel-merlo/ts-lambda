import type { Either, Left, Right } from "../either/Either.ts";
import type { Maybe, Nothing, Just } from "../maybe/Maybe.ts";
/**
 * Renderable represents a value that has two behaviors (like Either) but also has a neutral value (like Maybe)
 * This type was designed with the idea of ​​representing states
 */
type Renderable<E, A> = Either<E, Maybe<A>>;
declare const empty: <E, A>() => Renderable<E, A>;
declare const error: <E, A>(err: E) => Renderable<E, A>;
declare const success: <E, A>(a: A) => Renderable<E, A>;
declare const isError: <E, A>(r: Renderable<E, A>) => r is Left<E>;
declare const isSuccess: <E, A>(r: Renderable<E, A>) => r is Right<Just<A>>;
declare const isEmpty: <E, A>(r: Renderable<E, A>) => r is Right<Nothing>;
declare const matchRenderable: <E, A, B>(cases: {
    Error: (e: E) => B;
    Empty: () => B;
    Success: (a: A) => B;
}) => (r: Renderable<E, A>) => B;
declare const unpackSuccess: <A>(r: Right<Just<A>>) => A;
export type { Renderable };
export { matchRenderable, empty, error, success, isError, isSuccess, isEmpty, unpackSuccess };
