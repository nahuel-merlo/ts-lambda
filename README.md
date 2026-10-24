# ts-lambda

Lightweight, zero-dependency functional toolkit for TypeScript, inspired by Haskell and pure functional programming.

`ts-lambda` brings a small set of algebraic data types and combinators to TypeScript, designed to make absence, failure and state explicit in the type system instead of hiding them behind `null`, `undefined` or thrown exceptions:

- **`Maybe<A>`** — a value that may or may not be present.
- **`Either<E, A>`** — a computation that can fail (`Left`) or succeed (`Right`).
- **`Renderable<E, A>`** — a value that can be an error, empty, or a success. Built for modeling UI and request states.
- **`compose`** — type-safe right-to-left function composition.
- **Validators** — runtime validation of `unknown` input that returns `Either` instead of throwing.

All types are plain, immutable, tagged objects (`_tag`), so they serialize cleanly, work with TypeScript's narrowing, and carry no runtime magic.

## Installation

```bash
npm install github:nahuel-merlo/ts-lambda
```

```ts
// Everything from the root
import { M, E, R, compose, stringValidator } from "ts-lambda";
import type { Maybe, Either, Renderable } from "ts-lambda";

// Or per module
import * as M from "ts-lambda/Maybe";
import * as E from "ts-lambda/Either";
import * as R from "ts-lambda/Renderable";
import { compose } from "ts-lambda/compose";
import { objectValidator } from "ts-lambda/validator";
```

---

## Highlights

### Pattern matching

TypeScript has no native pattern matching, so every type in `ts-lambda` ships with a `match` function that takes **one handler per constructor**. Because the cases are an object with required keys, forgetting a case is a compile-time error. It's the closest thing to Haskell's `case ... of` with exhaustiveness checking.

```haskell
-- Haskell
describe :: Maybe Int -> String
describe m = case m of
  Nothing -> "no value"
  Just n  -> "value: " ++ show n
```

```ts
// ts-lambda
import * as M from "ts-lambda/Maybe";

const describe = M.match<number, string>({
  Nothing: () => "no value",
  Just: (n) => `value: ${n}`,
});

describe(M.just(42));    // "value: 42"
describe(M.nothing());   // "no value"
```

`match` is curried: you pass the cases first and get back a function that consumes the value. That makes it composable and reusable:

```ts
import * as E from "ts-lambda/Either";
import { compose } from "ts-lambda/compose";

const toMessage = E.match<Error, number, string>({
  Left: (err) => `Error: ${err.message}`,
  Right: (n) => `Result: ${n}`,
});

const safeDivide = (a: number) => (b: number): E.Either<Error, number> =>
  b === 0 ? E.left(new Error("division by zero")) : E.right(a / b);

const divideTenBy = compose(toMessage, safeDivide(10));

divideTenBy(2); // "Result: 5"
divideTenBy(0); // "Error: division by zero"
```

Alongside `match`, every module exposes **type guards** (`isJust`, `isLeft`, `isSuccess`, …) that narrow the type, so you can also branch with plain `if` statements when that reads better.

### Renderable

Most UI code ends up juggling three states for the same piece of data: *something went wrong*, *there's nothing to show*, and *here's the data*. These are usually encoded with a mix of `null`, empty arrays, `error` flags and optional fields, which makes impossible states representable.

`Renderable<E, A>` encodes exactly those three states, and nothing else:

```ts
type Renderable<E, A> = Either<E, Maybe<A>>;
```

| State     | Constructor     | Underlying value          |
|-----------|-----------------|---------------------------|
| Error     | `error(e)`      | `Left(e)`                 |
| Empty     | `empty()`       | `Right(Nothing)`          |
| Success   | `success(a)`    | `Right(Just(a))`          |

Since it's built by composing `Either` and `Maybe`, it inherits their semantics for free, while `matchRenderable` flattens the nesting into a single three-way match:

```ts
import * as R from "ts-lambda/Renderable";

type User = { name: string };

const renderUsers = R.matchRenderable<Error, User[], string>({
  Error: (e) => `<p class="error">${e.message}</p>`,
  Empty: () => `<p>No users yet.</p>`,
  Success: (users) => `<ul>${users.map((u) => `<li>${u.name}</li>`).join("")}</ul>`,
});

const fromResponse = (res: { ok: boolean; data: User[] }): R.Renderable<Error, User[]> =>
  !res.ok ? R.error(new Error("Request failed"))
  : res.data.length === 0 ? R.empty()
  : R.success(res.data);

renderUsers(fromResponse({ ok: true, data: [{ name: "Ada" }] }));
// "<ul><li>Ada</li></ul>"
```

The same handler shape works in any view layer. In React, for example, `matchRenderable` can return JSX directly, so a component never has to check `loading && !error && data?.length` again.

---

## Modules

### `Maybe`

Represents an optional value: `Nothing` or `Just<A>`.

| Function       | Signature                                                     | Description                               |
|----------------|---------------------------------------------------------------|-------------------------------------------|
| `nothing`      | `<A>() => Maybe<A>`                                           | Builds an empty value.                    |
| `just`         | `<A>(a: A) => Maybe<A>`                                       | Wraps a present value.                    |
| `isNothing`    | `<A>(m: Maybe<A>) => m is Nothing`                            | Type guard for `Nothing`.                 |
| `isJust`       | `<A>(m: Maybe<A>) => m is Just<A>`                            | Type guard for `Just`.                    |
| `match`        | `<A, B>(cases: { Nothing, Just }) => (m: Maybe<A>) => B`      | Pattern matching on `Maybe`.              |

```ts
import * as M from "ts-lambda/Maybe";

const head = <A>(xs: A[]): M.Maybe<A> => (xs.length > 0 ? M.just(xs[0]) : M.nothing());

const m = head([1, 2, 3]);
if (M.isJust(m)) console.log(m.just); // 1
```

### `Either`

Represents a result that is either a `Left<E>` (failure / special case) or a `Right<A>` (expected value).

| Function       | Signature                                                       | Description                                         |
|----------------|-----------------------------------------------------------------|-----------------------------------------------------|
| `left`         | `<E, A>(e: E) => Either<E, A>`                                  | Builds a `Left`.                                    |
| `right`        | `<E, A>(a: A) => Either<E, A>`                                  | Builds a `Right`.                                   |
| `isLeft`       | `<E, A>(e: Either<E, A>) => e is Left<E>`                       | Type guard for `Left`.                              |
| `isRight`      | `<E, A>(e: Either<E, A>) => e is Right<A>`                      | Type guard for `Right`.                             |
| `match`        | `<E, A, B>(cases: { Left, Right }) => (e: Either<E, A>) => B`   | Pattern matching on `Either`.                       |
| `unpackL`      | `<E>(l: Left<E>) => E`                                          | Extracts the value of a `Left`.                     |
| `unpackR`      | `<A>(r: Right<A>) => A`                                         | Extracts the value of a `Right`.                    |
| `eitherMapL`   | `<E, A>(xs: Either<E, A>[]) => E[]`                             | Collects every `Left` value (Haskell's `lefts`).    |
| `eitherMapR`   | `<E, A>(xs: Either<E, A>[]) => A[]`                             | Collects every `Right` value (Haskell's `rights`).  |

```ts
import * as E from "ts-lambda/Either";

const results: E.Either<string, number>[] = [E.right(1), E.left("oops"), E.right(3)];

E.eitherMapR(results); // [1, 3]
E.eitherMapL(results); // ["oops"]
```

#### `EitherHashMap`

A `Map` subclass with a safe lookup that never returns `undefined`:

```ts
import { E } from "ts-lambda";

const users = new E.EitherHashMap<number, string>([[1, "Ada"], [2, "Alan"]]);

users.safeGet(1);  // Right("Ada")
users.safeGet(99); // Left(Error)
```

### `Renderable`

Represents a value that can be an error, empty, or a success. See [Renderable](#renderable) above for the motivation.

| Function           | Signature                                                                  | Description                                      |
|--------------------|----------------------------------------------------------------------------|--------------------------------------------------|
| `error`            | `<E, A>(err: E) => Renderable<E, A>`                                       | Builds the error state.                          |
| `empty`            | `<E, A>() => Renderable<E, A>`                                             | Builds the empty state.                          |
| `success`          | `<E, A>(a: A) => Renderable<E, A>`                                         | Builds the success state.                        |
| `isError`          | `<E, A>(r: Renderable<E, A>) => r is Left<E>`                              | Type guard for the error state.                  |
| `isEmpty`          | `<E, A>(r: Renderable<E, A>) => r is Right<Nothing>`                       | Type guard for the empty state.                  |
| `isSuccess`        | `<E, A>(r: Renderable<E, A>) => r is Right<Just<A>>`                       | Type guard for the success state.                |
| `matchRenderable`  | `<E, A, B>(cases: { Error, Empty, Success }) => (r: Renderable<E, A>) => B`| Three-way pattern matching.                      |
| `unpackSuccess`    | `<A>(r: Right<Just<A>>) => A`                                              | Extracts the value of a success.                 |

```ts
import * as R from "ts-lambda/Renderable";

const r = R.success([1, 2, 3]);

if (R.isSuccess(r)) {
  R.unpackSuccess(r); // [1, 2, 3]
}
```

### `compose`

Right-to-left function composition, like Haskell's `(.)`. It's typed with overloads for up to 10 functions, so the input and output types of the resulting function are fully inferred, and a mismatch between two adjacent functions is a compile-time error.

```ts
import { compose } from "ts-lambda/compose";

const trim = (s: string) => s.trim();
const length = (s: string) => s.length;
const isEven = (n: number) => n % 2 === 0;

const hasEvenLength = compose(isEven, length, trim); // (a: string) => boolean

hasEvenLength("  ab  "); // true
```

### Validators

Runtime validation for `unknown` data (API responses, JSON, form input). A validator never throws: it returns `Either<Error, T>`.

```ts
type Validator<T> = (input: unknown) => Either<Error, T>;
```

**Primitives:** `stringValidator`, `numberValidator`, `booleanValidator`, `bigintValidator`, `symbolValidator`, `nullValidator`, `undefinedValidator`.

**Combinators:**

| Function             | Description                                                                                  |
|----------------------|----------------------------------------------------------------------------------------------|
| `optionalValidator`  | Turns a `Validator<T>` into a `Validator<Maybe<T>>`: `null`/`undefined` become `Nothing`.    |
| `unionValidator`     | Accepts the input if any of the given validators accepts it.                                 |
| `objectValidator`    | Validates an object against a schema of validators, one per key.                             |

```ts
import { E, objectValidator, stringValidator, numberValidator, optionalValidator } from "ts-lambda";

const validateUser = objectValidator({
  name: stringValidator,
  age: numberValidator,
  nickname: optionalValidator(stringValidator),
});

const result = validateUser(JSON.parse(rawBody));

E.match({
  Left: (err: Error) => console.error(err.message), // e.g. "Parametro invalido: age"
  Right: (user) => console.log(user.name),
})(result);
```

---

## License

ISC
