
/**
 * Shorthand utility
 */
const noDiff = () => ({ before: undefined, after: undefined })

/**
  * Compares two JSON-compatible variables (i.e. RegExp wont work)
  * and returns a before-and-after view of the changed properties.
  *
  * @example
  * diff({ before: 'Foo', after: 'Bar' })
  *
  * @example
  * diff('Foo', 'Bar')
  *
  * @param {*} beforeOrBoth The before-value or an object containing both `before` and `after`.
  * @param {*} [after] If provided, used as the value for `after`
  * @return {BeforeAfterDiff}
  */
const diff = (...args) => {
  // Normalize arguments
  if (args.length > 2) throw new Error('differ() only takes 1 or 2 arguments! Use differ({ before, after}) or differ(before, after).')
  const { before, after } = args.length === 2 ? { before: args[0], after: args[1] } : args[0]
  // Basic equality check
  if (JSON.stringify(before) === JSON.stringify(after)) return noDiff()

  if (typeof before !== typeof after) return { before, after }
  // Now: Same type but not JSON-identical

  // Detect primitives
  if (typeof before !== 'object' || before === null) return { before, after }

  // Keep track of whether anything in the array/object actually differs.
  let hasChanged = false

  if (Array.isArray(before)) {
    const targetLength = Math.max(before.length, after.length)
    const beforeArray = new Array(targetLength)
    const afterArray = new Array(targetLength)

    for (let i = 0; i < targetLength; i++) {
      // Recursion is best ursion
      const { before: beforeItem, after: afterItem } = diff({
        before: before[i],
        after: after[i],
      })
      if (beforeItem !== afterItem) {
        hasChanged = true
        beforeArray[i] = beforeItem
        afterArray[i] = afterItem
      }
    }

    return hasChanged ? { before: beforeArray, after: afterArray } : noDiff()
  }

  // We havent returned by now, so its probably an object. Lets iterate and build an object.
  const outBefore = {}
  const outAfter = {}
  // Merge the list of keys that exist so that we can detect new ones as well as old ones
  const allKeys = [...Object.keys(before), ...Object.keys(after)]
  for (const prop of allKeys) {
    const { before: beforeProp, after: afterProp } = diff({
      before: before[prop],
      after: after[prop],
    })
    if (beforeProp !== afterProp) {
      hasChanged = true
      outBefore[prop] = beforeProp
      outAfter[prop] = afterProp
    }
  }
  return hasChanged ? { before: outBefore, after: outAfter } : noDiff()
}

module.exports = exports = diff
