import { setArity, reverse, reduce } from '@fp/utils'

const composer = (a, b) => function () {
  return b.call(this, a.apply(this, arguments))
}

export default function () {
  const functions = reverse(arguments)
  return setArity(functions[0].length, reduce(composer, functions))
}
