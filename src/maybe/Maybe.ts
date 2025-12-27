/**
 * Maybe represents a value with a neutral or empty state
 */
type Maybe<A> = Nothing | Just<A>;

interface Nothing {
    readonly _tag: "Nothing",
}

interface Just<A> {
    readonly _tag: "Just",
    readonly just: A,
}

const nothing = <A>(): Maybe<A> => ({_tag: "Nothing"});
const just = <A>(a: A): Maybe<A> => ({_tag: "Just", just: a});

const isNothing = <A>(m: Maybe<A>): m is Nothing => m._tag === "Nothing";
const isJust = <A>(m: Maybe<A>): m is Just<A> => m._tag === "Just";

/**
 * pattern matching on Maybe 
 * @param onNothing -> function that is applied to Nothing
 * @param onJust    -> function that is applied to Just (receives the value of Just and passes it to the function)
 * @returns         -> the result of onNothin or onJust
 */
const match = <A, B>(cases: {
    Nothing: () => B,
    Just: (a: A) => B,
}) => (m: Maybe<A>): B => isNothing(m) ? cases.Nothing() : cases.Just(m.just); 

export type {Maybe, Nothing, Just};
export {nothing, just, isNothing, isJust, match};