import * as e from "../either/Either.js";
import * as m from "../maybe/Maybe.js";
// type Renderable<E, A> = Either<Maybe<E>, A>;
const empty = () => e.right(m.nothing());
const error = (err) => e.left(err);
const success = (a) => e.right(m.just(a));
const isError = (r) => e.isLeft(r);
const isSuccess = (r) => e.isRight(r) && m.isJust(e.unpackR(r));
const isEmpty = (r) => e.isRight(r) && m.isNothing(e.unpackR(r));
const matchRenderable = (cases) => (r) => e.match({
    Left: (e) => cases.Error(e),
    Right: (mb) => m.match({
        Nothing: () => cases.Empty(),
        Just: (a) => cases.Success(a)
    })(mb)
})(r);
const unpackSuccess = (r) => e.unpackR(r).just;
export { matchRenderable, empty, error, success, isError, isSuccess, isEmpty, unpackSuccess };
