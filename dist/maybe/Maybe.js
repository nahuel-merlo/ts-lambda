const nothing = () => ({ _tag: "Nothing" });
const just = (a) => ({ _tag: "Just", just: a });
const isNothing = (m) => m._tag === "Nothing";
const isJust = (m) => m._tag === "Just";
/**
 * pattern matching on Maybe
 * @param onNothing -> function that is applied to Nothing
 * @param onJust    -> function that is applied to Just (receives the value of Just and passes it to the function)
 * @returns         -> the result of onNothin or onJust
 */
const match = (cases) => (m) => isNothing(m) ? cases.Nothing() : cases.Just(m.just);
export { nothing, just, isNothing, isJust, match };
