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

  const cb = (data) => {
    console.log('cb data', shallow(data))
  }

  const cbEnd = (data) => {
    console.log('kris', shallow(data))
    t.end()
  }

  execute(gun, [{
    name: 'get',
    args: 'colors'
  }, {
    name: 'val',
    args: [cb]
  }])

  let cols = execute(gun, {
    get: 'colors'
  })

  cols['val'].apply(cols, [cb])

  let value
  cols.val(v => {

    value = shallow(v)

    t.deepEqual(value, {
      color: 'blue'
    })

    let blue = execute(gun, [{
      get: 'kris'
    }, {
      put: {
        name: 'kris',
        role: 'developer'
      },
    }, {
      get: 'kris',
      root: true
    }, {
      val: cbEnd,
      shallow: true
    }], {
      logging: false
    })
  })
})