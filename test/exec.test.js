import Gun from 'gun/gun'
import test from 'ava'

// import chain from 'chain-gun'
// chain(Gun)

import createExec from '../src'
const gun = Gun();

function shallow(value) {
  let copy = Object.assign({}, value)
  delete copy._
  return copy
}

test.cb('exec', t => {
  let execute = createExec(gun, {
    logging: true
  })

  execute(gun, [{
    get: 'colors'
  }, {
    put: {
      color: 'blue'
    }
  }])

  let cols = execute(gun, {
    get: 'colors'
  })

  let value
  cols.val(v => {

    value = shallow(v)

    console.log('value', value)

    t.deepEqual(value, {
      color: 'blue'
    })
    t.end()
  })
})