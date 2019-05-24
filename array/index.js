const reduceAsync = (arr, fn, initial) => {
  return arr.reduce((previousPromise, item) => {
    return previousPromise.then(acc => {
      return Promise.resolve(fn(acc, item, arr))
    })
  }, Promise.resolve(initial))
}

module.exports = {
  reduceAsync
}
