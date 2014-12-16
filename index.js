/*
  There is meant to be a single instance of this module
*/
var redis = require('redis');
var async = require('async');

var subscribeClient, publishClient, subscribers;

module.exports = function( options, callback ){

  if( !options ) options = {};
  if( !options.host ) options.host = 'localhost';
  if( !options.port ) options.port = 6379;

  subscribeClient = redis.createClient(options.port, options.host);
  publishClient = redis.createClient(options.port, options.host);

  if( options.password && options.password.length > 0 ){
    subscribeClient.auth(options.password);
    publishClient.auth(options.password);
  }

  subscribeClient.on("subscribe", function( channel, count ){
    callback( channel );
  });

  subscribeClient.on("message", function( channel, message ){
    if( subscribers[channel] ){
      subscribers[channel].cache = message;

      async.each( Object.keys(subscribers[channel] ), function(key){
        if( key !== 'cache' ){
          var object = subscribers[channel][key].object;
          subscribers[channel][key].callback( channel, key, message, object );
        }
      }, function( err ){
        console.log( err );
      });
      /*
      Object.keys(subscribers[channel]).forEach( function(key){
        if( key !== 'cache' ){
          try{
            var object = subscribers[channel][key].object;
            subscribers[channel][key].callback( channel, key, message, object );
          }catch( e ){
            console.log( "ERR: " + e );
          }
        }
      });
      */
    }
  });

  subscribers = {};
  return module.exports;
};

module.exports.subscribe = function( channel, key, object, cached, callback ){

  if( subscribeClient && channel && key ){
    if( !subscribers[channel] ){
      subscribers[channel] = {};
      subscribeClient.subscribe(channel);
    }

    if( typeof( cached ) === 'function' ){
      callback = cached;
      cached = false;
    }
    subscribers[channel][key] = {};
    subscribers[channel][key].object = object;
    subscribers[channel][key].callback = callback;

    if( cached && subscribers[channel].cache ){
      callback( channel, key, subscribers[channel].cache , object );
    }
  }
};

module.exports.unsubscribe = function( channel, key ){
  if( subscribeClient && channel && key ){
    if( subscribers[channel] && subscribers[channel][key] ){
      subscribeClient.unsubscribe(channel);
      delete subscribers[channel][key];
      if( Object.keys(subscribers[channel]).length === 0 ) delete subscribers[channel];
    }
  }
};

module.exports.publish = function( channel, message ){
  if( publishClient ){
    publishClient.publish( channel, message );
  }
};

module.exports.end = function(){
  if( publishClient ){
    publishClient.quit();
    delete publishClient;
  }
  if( subscribeClient ){
    subscribeClient.quit();
    delete subscribeClient;
  }
};
