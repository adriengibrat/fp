/* global Object: false */

export default Object.is || function is (a, b) {
	return a === b ?
		//+0 !== -0
		a !== 0 || 1 / a === 1 / b :
		// NaN === NaN
		a !== a && b !== b
}
