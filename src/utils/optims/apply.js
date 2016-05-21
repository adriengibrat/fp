export default function apply (fn, context, args) {
	switch (args.length) {
		case 0:
			return fn.call(context)
		case 1:
			return fn.call(context, args[0])
		case 2:
			return fn.call(context, args[0], args[1])
		case 3:
			return fn.call(context, args[0], args[1], args[2])
		case 4:
			return fn.call(context, args[0], args[1], args[2], args[3])
		case 5:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4])
		case 6:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5])
		case 7:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5], args[6])
		case 8:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
		case 9:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8])
		default:
			return fn.apply(context, args)
	}
}
