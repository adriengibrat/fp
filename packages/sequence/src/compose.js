import { toArray } from 'optims'

export default function composing () {
  const actions = toArray(arguments)
  return (accumulator) => {
    for (let index = actions.length - 1; index >= 0; --index)			{
      accumulator = actions[index](accumulator)
    }
    return accumulator
  }
}
