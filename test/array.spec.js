const {
  arrayReduceAsync
} = require('../array')

describe('array', () => {
  describe('arrayReduceAsync', () => {
    test('takes in a list of items and a reducer function that returns a promise', () => {
      expect.assertions(1)
      const items = ['first', 'second', 'third']
      const reducer = (acc, item, index) => {
        return new Promise(resolve => {
          setTimeout(resolve.bind(null, `${acc}--processed-${index}-${item}`), 50)
        })
      }

      return expect(arrayReduceAsync(items, reducer, 'START'))
        .resolves.toEqual('START--processed-0-first--processed-1-second--processed-2-third')
    })
  })
})
