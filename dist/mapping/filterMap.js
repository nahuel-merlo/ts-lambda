"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterMap = (a, f, ps) => {
    return a.reduce((acc, e) => {
        const passes = ps.every(p => p(e));
        return passes ? [...acc, f(e)] : acc;
    }, []);
};
exports.default = filterMap;
