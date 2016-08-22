export default function Reduced (x) {
	this['@@transducer/reduced'] = true
	this['@@transducer/value'] = x
}
Reduced.of = (x) => new Reduced(x)

export const isReduced = (x) => x && x['@@transducer/reduced']
export const deref = (reduced) => reduced['@@transducer/value']