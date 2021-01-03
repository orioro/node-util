import { criteriaTest } from './criteria'

const _fnApply = (fnSpec, ...args) => {
  return typeof fnSpec === 'function' ? fnSpec(...args) : fnSpec.fn(...args)
}

export const fnApplyMatching = (fnSpecList, ...args) => {
  const matching = fnSpecList.find(fnSpec => {
    return criteriaTest(fnSpec.criteria, ...args)
  })

  if (matching) {
    return _fnApply(matching, ...args)
  } else {
    throw new Error('No matching spec')
  }
}

export const fnApplyMatchingReduce = (fnSpecList, arg, injectArgs = []) => {
  return fnSpecList.reduce((acc, fnSpec) => {
    return criteriaTest(fnSpec.criteria, acc) ? _fnApply(fnSpec, acc, ...injectArgs) : acc
  }, arg)
}

export const fnApplyMatchingReduceAsync = (fnSpecList, arg, injectArgs = []) => {
  return fnSpecList.reduce((previous, fnSpec) => {
    return previous.then(res => {
      return criteriaTest(fnSpec.criteria, res) ?
        Promise.resolve(_fnApply(fnSpec, res, ...injectArgs)) :
        Promise.resolve(res)
    })
  }, Promise.resolve(arg))
}
