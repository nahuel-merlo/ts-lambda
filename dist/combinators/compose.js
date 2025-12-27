"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = compose;
// generic
function compose(...fns) {
    return (x) => [...fns].reduceRight((acc, fn) => fn(acc), x);
}
