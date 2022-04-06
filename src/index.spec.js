
const diff = require('./index')

describe('diff()', () => {
  it.each([
    [
      'Identical when compared as JSON',
      { before: { firstname: 'Joakim' }, after: { firstname: 'Joakim' } },
      { before: undefined, after: undefined },
    ],
    [
      'Property order doesnt matter',
      { before: { firstname: 'Joakim', lastname: 'Hedlund' }, after: { lastname: 'Hedlund', firstname: 'Joakim' } },
      { before: undefined, after: undefined },
    ],
    [
      'Primitive type changed',
      { before: 1337, after: null },
      { before: 1337, after: null },
    ],
    [
      'Text changed',
      { before: 'Hello friend!', after: 'Woop woop' },
      { before: 'Hello friend!', after: 'Woop woop' },
    ],
    [
      'Text unchanged',
      { before: 'Woop', after: 'Woop' },
      { before: undefined, after: undefined },
    ],
    [
      'Number changed',
      { before: 13, after: 37 },
      { before: 13, after: 37 },
    ],
    [
      'Number unchanged',
      { before: 42, after: 42 },
      { before: undefined, after: undefined },
    ],
    [
      'Boolean changed',
      { before: true, after: false },
      { before: true, after: false },
    ],
    [
      'Boolean unchanged',
      { before: false, after: false },
      { before: undefined, after: undefined },
    ],
    [
      'null changed',
      { before: true, after: null },
      { before: true, after: null },
    ],
    [
      'null unchanged',
      { before: null, after: null },
      { before: undefined, after: undefined },
    ],
    [
      'Property added',
      { before: {}, after: { foo: 'bar' } },
      { before: { foo: undefined }, after: { foo: 'bar' } },
    ],
    [
      'Property changed',
      { before: { foo: 'bar' }, after: { foo: 'baz' } },
      { before: { foo: 'bar' }, after: { foo: 'baz' } },
    ],
    [
      'Property removed',
      {
        before: { foo: 'bar', hasntChanged: true },
        after: { hasntChanged: true },
      },
      {
        before: { foo: 'bar' },
        after: { foo: undefined },
      },
    ],
    [
      'Nested object prop changed',
      {
        before: {
          user: {
            name: 'Joakim',
            location: { country: 'Narnia', ruler: { name: 'Kim' } },
          },
          comment: 'hello world',
        },
        after: {
          user: {
            name: 'Joakim',
            location: { country: 'Westeros', ruler: { name: 'Kim' } },
          },
          comment: 'hello world',
        },
      },
      { before: { user: { location: { country: 'Narnia' } } }, after: { user: { location: { country: 'Westeros' } } } },
    ],
    [
      'Nested object was added',
      {
        before: { city: { name: 'Stockholm' } },
        after: { city: { name: 'Stockholm', country: { name: 'Sweden' } } },
      },
      {
        before: { city: { country: undefined } },
        after: { city: { country: { name: 'Sweden' } } },
      },
    ],
    [
      'Nested object was removed',
      {
        before: { city: { name: 'Stockholm', country: { name: 'Sweden' } } },
        after: { city: { name: 'Stockholm' } },
      },
      {
        before: { city: { country: { name: 'Sweden' } } },
        after: { city: { country: undefined } },
      },
    ],
    [
      'Array entry changed',
      {
        before: ['Hello', 'friend'],
        after: ['Hello', 'darling'],
      },
      { before: [, 'friend'], after: [, 'darling'] },
    ],
    [
      'Array entry was removed - order changed',
      {
        before: ['Hello', 'my', 'friend'],
        after: ['Hello', 'friend'],
      },
      { before: [, 'my', 'friend'], after: [, 'friend', undefined] },
    ],
    [
      'Prop in array entry changed',
      {
        before: [{ username: 'JohnSnow' }, { username: 'Sleavely' }],
        after: [{ username: 'JohnSnow' }, { username: 'Hackerman' }],
      },
      { before: [, { username: 'Sleavely' }], after: [, { username: 'Hackerman' }] },
    ],
    [
      'Nested obj key order should not show as changed',
      {
        before: [{ value: { 'sv-SE': 'Halloj', 'en-GB': 'Howdy' } }],
        after: [{ value: { 'en-GB': 'Howdy', 'sv-SE': 'Halloj' } }],
      },
      { before: undefined, after: undefined },
    ],
    [
      'Real life example: Item quantity in a cart was changed',
      {
        before: { cartId: 'myCart', lineItems: [{ someItem: 'didnt change' }, { lineId: 'myLine', qty: 1 }], lastModifiedAt: '2020-09-20T09:11:58.637Z' },
        after: { cartId: 'myCart', lineItems: [{ someItem: 'didnt change' }, { lineId: 'myLine', qty: 2 }], lastModifiedAt: '2020-09-20T09:13:41.473Z' },
      },
      {
        before: { lineItems: [, { qty: 1 }], lastModifiedAt: '2020-09-20T09:11:58.637Z' },
        after: { lineItems: [, { qty: 2 }], lastModifiedAt: '2020-09-20T09:13:41.473Z' },
      },
    ],
    [
      'README example 2',
      {
        before: { nestedObj: {} },
        after: { nestedObj: { evenMoreNestedObject: { thisPropIsNew: 'Hello, new property!' } } },
      },
      {
        before: { nestedObj: { evenMoreNestedObject: undefined } },
        after: {
          nestedObj: {
            evenMoreNestedObject: {
              thisPropIsNew: 'Hello, new property!',
            },
          },
        },
      },
    ],
  ])('%s', (_, input, expected) => {
    expect(diff(input)).toStrictEqual(expected)
  })
})
