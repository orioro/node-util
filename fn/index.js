const mingo = require('mingo')
const {reduceAsync} = require('../array')

const _test = (criteria, ...args) => {
  if (typeof criteria === 'object') {
    const query = new mingo.Query(criteria)
    return query.test(args[0])
  } else if (typeof criteria === 'function') {
    return criteria(...args)
  } else {
    return criteria
  }
}

const applyMatching = (fnSpecList, ...args) => {
  const matching = fnSpecList.find(fnSpec => {
    return _test(fnSpec.criteria, ...args)
  })

  if (matching) {
    return typeof matching === 'function' ?
      matching(...args) : matching.fn(...args)
  } else {
    throw new Error('No matching spec')
  }
}

const applyMatchingAll = (fnSpecList, ...args) => {
  return fnSpecList
    .filter(fnSpec => {
      return _test(fnSpec.criteria, ...args)
    })
    .map(fnSpec => {
      return typeof matching === 'function' ? fnSpec(...args) : fnSpec.fn(...args)
    })
}

// const applySequence = fns => {
//   return reduceAsync(fns, (acc, fn) => {
//     return fn(acc)
//   })
// }

// const applyMatchingSequence = (fnSpecList, criteria) => {
//   const query = new mingo.Query(criteria)

//   const matching = fnSpecList.filter(fnSpec => {
//     return typeof fnSpec.criteria === 'function' ?
//       fnSpec.criteria() : query.test(criteria)
//   })

//   return reduceAsync(matching, (acc, fnSpec) => {
//     return fnSpec.fn(acc)
//   })
// }

module.exports = {
  applyMatching,
  applyMatchingAll
}
