import { signature } from 'symbols'
import Left from 'monads/either.left'
import Right from 'monads/either.right'

either.Left = Left
either.Right = Right

either[signature] = 'either :: (α → λ) → (β → λ) → Either α β → λ'

export default function either (left, right, either) {
	if (either instanceof Left)
		return left(either.valueOf())
	if (either instanceof Right)
		return right(either.valueOf())
	throw TypeError(`${ either } must be instance of Right or Left`)
}

export { Right, Left }
