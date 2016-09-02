import assign from 'utils/object/assign'
import equals from 'utils/object/_equals'
import { doc, trace, path, map, placeholder } from 'utils/index'
import partial from 'partial'
import curry from 'curry'
import compose from 'compose'
import arity from 'arity'
import not from 'not'
import * as basics from 'basics'

export default assign(
	{ arity, compose, curry, doc, not, partial, placeholder }
	, basics
	, map(fn => curry.debug(fn), { trace, path, equals, map })
)
