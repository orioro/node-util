const {
  applyMatching
} = require('../fn')

describe('applyMatching(fnSpecs, ...args)', () => {
  describe('Should test each fn spec\'s criteria with the arguments and apply the FIRST MATCHING spec', () => {
    test('Using mingo queries as criteria', () => {
      const FN_SPECS = [
        {
          criteria: {
            format: 'text',
          },
          fn: ({ value }) => {
            return `${value}--format-text`
          }
        },
        {
          criteria: {
            format: 'text',
          },
          fn: ({ value }) => {
            return `${value}--format-text-should-never-result`
          }
        },
        {
          criteria: {
            format: 'number',
          },
          fn: ({ value }) => {
            return `${value}--format-number`
          }
        },
        {
          criteria: {
            format: 'date',
          },
          fn: ({ value }) => {
            return `${value}--format-date`
          }
        },
        {
          criteria: true,
          fn: ({ value }) => {
            return `${value}--format-default`
          }
        }
      ]

      expect(applyMatching(FN_SPECS, {
        format: 'date',
        value: '2018-10-10'
      }))
      .toEqual('2018-10-10--format-date')

      expect(applyMatching(FN_SPECS, {
        format: 'number',
        value: 10
      }))
      .toEqual('10--format-number')

      expect(applyMatching(FN_SPECS, {
        format: 'unspecified',
        value: 12
      }))
      .toEqual('12--format-default')
    })

    test('Using functions as criteria', () => {
      const FN_SPECS = [
        {
          criteria(value) {
            return typeof value === 'number' &&
                   value >= 11 && value <= 20
          },
          fn(value) {
            return `"${value}" is higher than 11, lower than 20`
          }
        },
        {
          criteria(value) {
            return typeof value === 'number' &&
                   value >= 21 && value <= 30
          },
          fn(value) {
            return `"${value}" is higher than 21, lower than 30`
          }
        },
        {
          criteria(value) {
            return typeof value === 'string'
          },
          fn(value) {
            return `"${value}" is a string`
          }
        }
      ]

      expect(applyMatching(FN_SPECS, 15))
        .toEqual('"15" is higher than 11, lower than 20')
      expect(applyMatching(FN_SPECS, 22))
        .toEqual('"22" is higher than 21, lower than 30')
      expect(applyMatching(FN_SPECS, 'Some string'))
        .toEqual('"Some string" is a string')
    })

    test('Should throw error if no matching spec is found', () => {
      const FN_SPECS = [
        {
          criteria: { format: 'text' },
          fn: () => {}
        },
        {
          criteria: { format: 'number' },
          fn: () => {}
        }
      ]

      expect(() => {
        applyMatching(FN_SPECS, { format: 'other-format' })
      }).toThrow('No matching spec')
    })

    test('Should allow complex matching criteria', () => {
      const FN_SPECS = [
        {
          criteria: {
            type: 'number',
            value: {
              $gte: 11,
              $lte: 20,
            }
          },
          fn: ({ value }) => {
            return `11 <= ${value} <= 20`
          }
        },
        {
          criteria: {
            type: 'number',
            value: {
              $gte: 21,
              $lte: 30
            }
          },
          fn: ({ value }) => {
            return `21 <= ${value} <= 30`
          }
        },
      ]

      expect(applyMatching(FN_SPECS, {
        type: 'number',
        value: 25,
        other_properties: ['some', 'other', 'prop'],
      }))
      .toEqual('21 <= 25 <= 30')
    })

    test('Should allow filtering by nested properties', () => {
      const FN_SPECS = [
        {
          criteria: {
            'customAttributes.value': {
              $gte: 11,
              $lte: 20,
            }
          },
          fn: ({ customAttributes: { value } }) => {
            return `11 <= ${value} <= 20`
          }
        },
        {
          criteria: {
            'customAttributes.value': {
              $gte: 21,
              $lte: 30,
            }
          },
          fn: ({ customAttributes: { value } }) => {
            return `21 <= ${value} <= 30`
          }
        },
      ]

      expect(applyMatching(FN_SPECS, {
        customAttributes: { value: 12 }
      }))
      .toEqual('11 <= 12 <= 20')

    })
  })
})
