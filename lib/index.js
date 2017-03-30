var assert = require('assert'),
    noop = function () {},
    clone = require('clone'),
    superagent = require('superagent'),
    version = require('../package.json').version,
    validate = require('./validate'),
    async = require('async');
module.exports = Analytics

function Analytics (writeKey, options) {
  if (!(this instanceof Analytics)) return new Analytics(writeKey, options)
  assert(writeKey, 'You must pass your Segment project\'s write key.')
  options = options || {}
  this.queue = async.queue(this.makeRequest, 2);
  this.writeKey = writeKey;
  this.host = removeSlash(options.host || 'http://opt-analytics-staging.jelastic.optcentral.com');
  this.debug = require('debug')(options.name || 'opt-analytics');

}

Analytics.prototype.identify = function (contactId,properties, fn) {
  this.enqueue('identify', validate('identify',{contactId:contactId,properties:properties});, fn)
  return this
}

Analytics.prototype.group = function (message, fn) {
  validate(message, 'group')
  this.enqueue('group', message, fn)
  return this
}
Analytics.prototype.group = function (message, fn) {
  validate(message, 'group')
  this.enqueue('group', message, fn)
  return this
}
Analytics.prototype.page = function (message, fn) {
  validate(message, 'page')
  this.enqueue('page', message, fn)
  return this
}
Analytics.prototype.track = function (message, fn) {
  validate(message, 'track')
  this.enqueue('track', message, fn)
  return this
}
Analytics.prototype.enqueue = function (type, message, fn) {
  fn = fn || noop
  message = clone(message)
  message.activity_type = type
  message.context = extend(message.context || {}, {
    library: {
      name: 'analytics-node',
      version: version
    }
  })

  message._metadata = extend(message._metadata || {}, { nodeVersion: process.versions.node })

  if (!message.timestamp) message.timestamp = new Date()
  if (!message.messageId) message.messageId = 'node-' + uid(32)

  debug('%s: %o', type, message)
  this.queue.push(
    message: message,
    callback: fn
  )
}
Analytics.prototype.makeRequest = function (message, callback) {
   var type = message.activity_typ=e;
   var endpoint ;
   if(type == 'identify'){
   	 endpoint = '/identify';
   }else if('track'){
   	 endpoint = '/activities';
   }else if(type == 'group'){
      endpoint = '/groups'
   }
   request
    .post(this.host + endpoint)
    .auth(this.writeKey, '')
    .retry(3)
    .send(message)
    .end(function (err, res) {
      if(typeof callback == 'function' && err) callback(err)
      else if(typeof callback == 'function' && res) callback(null,res.body); 
    })
  
}