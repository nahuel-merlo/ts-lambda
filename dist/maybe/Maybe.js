"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = exports.isJust = exports.isNothing = exports.just = exports.nothing = void 0;
const nothing = () => ({ _tag: "Nothing" });
exports.nothing = nothing;
const just = (a) => ({ _tag: "Just", just: a });
exports.just = just;
const isNothing = (m) => m._tag === "Nothing";
exports.isNothing = isNothing;
const isJust = (m) => m._tag === "Just";
exports.isJust = isJust;
/**
 * pattern matching on Maybe
 * @param onNothing -> function that is applied to Nothing
 * @param onJust    -> function that is applied to Just (receives the value of Just and passes it to the function)
 * @returns         -> the result of onNothin or onJust
 */
const match = (cases) => (m) => isNothing(m) ? cases.Nothing() : cases.Just(m.just);
exports.match = match;
