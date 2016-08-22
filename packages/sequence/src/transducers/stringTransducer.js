import identity from 'functions/identity'

const stringTransducer = {}
stringTransducer['@@transducer/init'] = () => ''
stringTransducer['@@transducer/result'] = identity
stringTransducer['@@transducer/step'] = (string, tail) => string + tail

export default stringTransducer
