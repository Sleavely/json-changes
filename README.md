# json-changes

Easily compare changes in JSON-like values. This can be especially useful when you want to compare an incoming payload with a counterpart stored in a database.

[ ![npm version](https://img.shields.io/npm/v/json-changes.svg?style=flat) ](https://npmjs.org/package/json-changes "View package")
[ ![CI status](https://github.com/Sleavely/json-changes/actions/workflows/node.js.yml/badge.svg) ](https://github.com/Sleavely/json-changes/actions/workflows/node.js.yml "View workflow")
## Installation

```sh
npm i json-changes
```

## Usage

First, let's define our flags in a file we'll call `permissions.js`:

```js
const diff = require('json-changes')

const before = { hello: 'world', foo: 'bar', thisPropertyNoLongerExists: true }
const after = { hello: 'world', foo: 'not bar' }

const comparison = diff(before, after)
// returns:
{
  before: {
    foo: 'bar',
    thisPropertyNoLongerExists: true
  },
  after: {
    // Only properties that changed are included
    foo: 'not bar',
    // Properties that have been removed have an undefined value;
    thisPropertyNoLongerExists: undefined
  }
}
```

It works recursively in nested objects as well:

```js
const before = { nestedObj: {} }
const after = { nestedObj: { evenMoreNestedObject: { thisPropIsNew: 'Hello, new property!' } } }

const comparison = diff(before, after)
// returns:
{
  before: {
    nestedObj: { evenMoreNestedObject: undefined }
  },
  after: {
    nestedObj: {
      evenMoreNestedObject: {
        thisPropIsNew: 'Hello, new property!'
      }
    }
  }
}
```

### undefined values

Encountering an `undefined` value in the comparison means that the property either did not exist in `before` or was removed in `after`.

_json-changes_ is primarily meant to be used to compare JSON, so `undefined` is assumed to never be used in the payloads being compared.
