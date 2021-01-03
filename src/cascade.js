import mingo from 'mingo'

const switchType = (value, fns) => {
  if (Array.isArray(value)) {
    return fns.array ? fns.array() : fns.default()
  } else if (value instanceof RegExp) {
    return fns.regexp ? fns.regexp() : fns.default()
  } else {
    switch (typeof value) {
      case 'function':
        return fns.function ? fns.function() : fns.default()
      case 'boolean':
        return fns.boolean ? fns.boolean() : fns.default()
      case 'string':
        return fns.string ? fns.string() : fns.default()
      case 'number':
        return fns.number ? fns.number() : fns.default()
      case 'object':
        return fns.object ? fns.object() : fns.default()
      default:
        return fns.default()
    }
  }
}

export const testCriteria = (criteria, ...args) => {
  return switchType(criteria, {
    array: () => {
      return criteria.every((crit, index) => testCriteria(crit, args[index]))
    },
    regexp: () => {
      return typeof args[0] === 'string' && criteria.test(args[0])
    },
    object: () => {
      return (new mingo.Query(criteria)).test(args[0])
    },
    function: () => {
      return criteria(...args)
    },
    boolean: () => {
      return criteria
    },
    default: () => {
      return criteria === args[0]
    }
  })
}

// export const testCriteria = (criteria, ...args) => {
//   if (Array.isArray(criteria)) {
//     // Criteria established for each of the arguments
//     return criteria.every((crit, index) => testCriteria(crit, args[index]))
//   } else if (criteria instanceof RegExp) {
//     return typeof args[0] === 'string' && criteria.test(args[0])
//   } else if (typeof criteria === 'object') {
//     const query = new mingo.Query(criteria)
//     return query.test(args[0])
//   } else if (typeof criteria === 'function') {
//     return criteria(...args)
//   } else if (typeof criteria === 'boolean') {
//     return criteria
//   } else {
//     return criteria === args[0]
//   }
// }

export const findMatching = (options, ...args) => {
  const matching = options.find(option => testCriteria(option.criteria, ...args))

  return matching ? matching.value : undefined
}

export const filterMatching = (options, ...args) => {
  return options.reduce((matching, option) => {
    return testCriteria(option.criteria, ...args) ? [...matching, option.value] : matching
  }, [])
}

export const reduceMatching = (options, reducer, start, ...injectedArgs) => {
  return options.reduce((acc, option) => {
    return testCriteria(option.criteria, start, ...injectedArgs) ?
      reducer(option.value, acc, ...injectedArgs) :
      acc
  }, start)
}

// const ExecuteMatching
// const ExecuteMatchingReduce
// const findMatching
// const filterMatching
// const reduceMatching
