import identity from 'functions/identity'

const arrayTransducer = {}
arrayTransducer['@@transducer/init'] = () => []
arrayTransducer['@@transducer/result'] = identity
arrayTransducer['@@transducer/step'] = (array, element) => (array.push(element), array)

export default arrayTransducer
