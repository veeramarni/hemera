'use strict'

const Hemera = require('./../../packages/hemera')
const nats = require('nats').connect({
  preserveBuffers: true
})
const HemeraJoi = require('./../../packages/hemera-joi')
const hemera = new Hemera(nats, {
  logLevel: 'debug'
})

hemera.use(HemeraJoi)

hemera.ready(() => {
  let Joi = hemera.joi

  hemera.add(
    {
      topic: 'math',
      cmd: 'add',
      a: Joi.number().required()
    },
    (req, cb) => {
      cb(null, req.a + req.b)
    }
  )

  hemera.act(
    {
      topic: 'math',
      cmd: 'add',
      a: 'ddd'
    },
    function(err, resp) {
      if (err) {
        this.log.error(err)
        return
      }
      this.log.info(resp)
    }
  )
})
