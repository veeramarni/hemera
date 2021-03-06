'use strict'

const semver = require('semver')
const console = require('console')
const extractPluginName = require('./stackParser')

function plugin(fn, options = {}) {
  if (typeof fn !== 'function') {
    throw new TypeError(`hemera-plugin expects a function, instead got a '${typeof fn}'`)
  }

  fn[Symbol.for('plugin-scoped')] = true

  if (options && typeof options.scoped === 'boolean') {
    fn[Symbol.for('plugin-scoped')] = options.scoped
  }

  if (typeof options === 'string') {
    checkVersion(options)
    options = {}
  }

  if (typeof options !== 'object' || Array.isArray(options) || options === null) {
    throw new TypeError('The options object should be an object')
  }

  if (!options.name) {
    options.name = checkName(fn)
  }

  if (options.hemera) {
    checkVersion(options.hemera)
    delete options.hemera
  }

  fn[Symbol.for('plugin-meta')] = options

  return fn
}

function checkName(fn) {
  if (fn.name.length > 0) {
    return fn.name
  }

  try {
    throw new Error('anonymous function')
  } catch (e) {
    return extractPluginName(e.stack)
  }
}

function checkVersion(version) {
  if (typeof version !== 'string') {
    throw new TypeError(`hemera-plugin expects a version string, instead got '${typeof version}'`)
  }

  let hemeraVersion
  try {
    // eslint-disable-next-line global-require
    hemeraVersion = require('nats-hemera/package.json').version
  } catch (_) {
    console.info('hemera not found, proceeding anyway')
  }

  if (hemeraVersion && !semver.satisfies(hemeraVersion, version)) {
    throw new Error(`hemera-plugin - expected '${version}' hemera version, '${hemeraVersion}' is installed`)
  }
}

module.exports = plugin
