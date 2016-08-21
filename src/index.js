import { version } from '../package.json'
import assign from 'utils/object/assign'
import equals from 'utils/object/_equals'
import doc from 'utils/doc'
import trace from 'utils/trace'
import path from 'utils/path'
import map from 'utils/map'
import { placeholder } from 'symbols'
import partial from 'partial'
import curry from 'curry'
import compose from 'compose'
import arity from 'arity'
import not from 'not'
import * as functions from 'functions'

import collection, {filters} from './collection'

export default assign(
	collection
	, {
		version
		, f: filters
		, placeholder
		, doc
		, partial, curry, compose, arity, not
	}
	, functions
	, map((fn) => curry.debug(fn), { trace, path, equals, map })
)
