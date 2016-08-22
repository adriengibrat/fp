import identity from 'functions/identity'

const objectTransducer = {}
objectTransducer['@@transducer/init'] = () => {}
objectTransducer['@@transducer/result'] = identity
objectTransducer['@@transducer/step'] = (object, entry) => (object[entry[0]] = entry[1], object)

export default objectTransducer
