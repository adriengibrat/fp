export function init () {
	return this.transducer['@@transducer/init']()
}

export function result (result) {
	return this.transducer['@@transducer/result'](result)
}
