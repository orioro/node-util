import {
  criteriaTest
} from './criteria'

export const arrayFilterByCriteria = (options, ...args) => {
  return options.reduce((acc, { criteria, value }) => {
    return criteriaTest(criteria, ...args) ? [...acc, value] : acc
  }, [])
}

export const arrayFindByCriteria = (options, ...args) => {
  const matching = options.find(option => criteriaTest(option.criteria, ...args))

  return matching ? matching.value : undefined
}

export const arrayReduceAsync = (arr, fn, initial) => {
  return arr.reduce((previousPromise, item, index) => {
    return previousPromise.then(acc => {
      return Promise.resolve(fn(acc, item, index, arr))
    })
  }, Promise.resolve(initial))
}
