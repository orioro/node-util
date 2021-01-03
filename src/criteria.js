import mingo from 'mingo'

export const criteriaTest = (criteria, ...args) => {
  if (typeof criteria === 'object') {
    const query = new mingo.Query(criteria)
    return query.test(args[0])
  } else if (typeof criteria === 'function') {
    return criteria(...args)
  } else {
    return Boolean(criteria)
  }
}
