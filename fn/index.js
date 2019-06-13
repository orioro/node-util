const mingo = require('mingo')

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

const _fnApply = (fnSpec, ...args) => {
  return typeof fnSpec === 'function' ? fnSpec(...args) : fnSpec.fn(...args)
}

const applyMatching = (fnSpecList, ...args) => {
  const matching = fnSpecList.find(fnSpec => {
    return _test(fnSpec.criteria, ...args)
  })

  if (matching) {
    return _fnApply(matching, ...args)
  } else {
    throw new Error('No matching spec')
  }
}

const applyMatchingReduce = (fnSpecList, arg, injectArgs = []) => {
  return fnSpecList.reduce((acc, fnSpec) => {
    return _test(fnSpec.criteria, acc) ? _fnApply(fnSpec, acc, ...injectArgs) : acc
  }, arg)
}

const applyMatchingReduceAsync = (fnSpecList, arg, injectArgs = []) => {
  return fnSpecList.reduce((previous, fnSpec) => {
    return previous.then(res => {
      return _test(fnSpec.criteria, res) ?
        Promise.resolve(_fnApply(fnSpec, res, ...injectArgs)) :
        Promise.resolve(res)
    })
  }, Promise.resolve(arg))
}

module.exports = {
  applyMatching,
  applyMatchingReduce,
  applyMatchingReduceAsync,
}
