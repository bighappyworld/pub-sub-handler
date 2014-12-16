
var psh = require( '../index.js' )({},function(channel){
  psh.publish( 'channel', 'message one' );
});

var object_one = { id: 111, val: 111 };
var object_two = { id: 222, val: 222 }

psh.subscribe( 'channel', 'key one', object_one, function( channel, key, message, object ){
  console.log( "Channel : " + channel );
  console.log( "Key : " + key );
  console.log( "Message : " + message );
  console.log( "Object : " + JSON.stringify( object ) );
});

psh.subscribe( 'channel', 'key two', object_two, false, function( channel, key, message, object ){
  console.log( "Channel : " + channel );
  console.log( "Key : " + key );
  console.log( "Message : " + message );
  console.log( "Object : " + JSON.stringify( object ) );
  psh.end();
});

