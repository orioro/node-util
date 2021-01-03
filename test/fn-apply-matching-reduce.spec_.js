import {
  fnApplyMatchingReduce
} from '../src'

describe('fnApplyMatchingReduce(fnSpecs, arg)', () => {
  test('Should apply matching specs in sequence', () => {
    const FN_SPECS = [
      {
        criteria: {
          required: true
        },
        fn: data => {
          return {
            ...data,
            _validate: data._validate ? {
              ...data._validate,
              presence: true,
            } : {
              presence: true
            }
          }
        }
      },
      {
        criteria: {
          type: 'text',
        },
        fn: data => {
          return {
            ...data,
            minLength: 10,
            maxLength: 20
          }
        }
      }
    ]

    // Both changes
    expect(fnApplyMatchingReduce(FN_SPECS, {
      type: 'text',
      required: true,
      value: 'Hello World'
    }))
    .toEqual({
      type: 'text',
      value: 'Hello World',
      required: true,
      _validate: {
        presence: true
      },
      minLength: 10,
      maxLength: 20
    })

    // Only second
    expect(fnApplyMatchingReduce(FN_SPECS, {
      type: 'text',
      required: false,
      value: 'Hello World'
    }))
    .toEqual({
      type: 'text',
      value: 'Hello World',
      required: false,
      minLength: 10,
      maxLength: 20
    })

    // No changes
    expect(fnApplyMatchingReduce(FN_SPECS, {
      type: 'number',
      required: false,
      value: 30
    }))
    .toEqual({
      type: 'number',
      required: false,
      value: 30
    })
  })
})
