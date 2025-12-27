"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackSuccess = exports.isEmpty = exports.isSuccess = exports.isError = exports.success = exports.error = exports.empty = exports.matchRenderable = void 0;
const e = __importStar(require("../either/Either"));
const m = __importStar(require("../maybe/Maybe"));
// type Renderable<E, A> = Either<Maybe<E>, A>;
const empty = () => e.right(m.nothing());
exports.empty = empty;
const error = (err) => e.left(err);
exports.error = error;
const success = (a) => e.right(m.just(a));
exports.success = success;
const isError = (r) => e.isLeft(r);
exports.isError = isError;
const isSuccess = (r) => e.isRight(r) && m.isJust(e.unpackR(r));
exports.isSuccess = isSuccess;
const isEmpty = (r) => e.isRight(r) && m.isNothing(e.unpackR(r));
exports.isEmpty = isEmpty;
const matchRenderable = (cases) => (r) => e.match({
    Left: (e) => cases.Error(e),
    Right: (mb) => m.match({
        Nothing: () => cases.Empty(),
        Just: (a) => cases.Success(a)
    })(mb)
})(r);
exports.matchRenderable = matchRenderable;
const unpackSuccess = (r) => e.unpackR(r).just;
exports.unpackSuccess = unpackSuccess;
