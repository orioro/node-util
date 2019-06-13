const arrayReduceAsync = (arr, fn, initial) => {
  return arr.reduce((previousPromise, item, index) => {
    return previousPromise.then(acc => {
      return Promise.resolve(fn(acc, item, index, arr))
    })
  }, Promise.resolve(initial))
}

module.exports = {
  arrayReduceAsync
}
