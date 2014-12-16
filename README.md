## Pub Sub Handler

This was written to be used with Redis as a Publish/Subscribe handler. It is just a wrapper designed to help with managing sockets.


Setup:

```
var psh = require( 'pub-sub-handler' )( { host: localhost, port: 6379 }, function( channel ){
  // Called when the backend Redis makes a subscription
};
```

Subscribing:

```
psh.subscribe( 'channel-name', 'key', object, function( channel, key, object, message ){
  // Called when a message is published to the specified channel
};
```

Publishing:

```
psh.publish( 'channel-name', 'message' );
```

Unsubscribing:

```
psh.unsubscribe( 'channel-name', 'key' );
```

## Common Use

A typical use would be the key is a user id and the object is a socket. User connects to a web socket, you subscribe to a specified channel with the user id as a key and pass in the socket as the object. Then in your handler, when a message is published to the channel you have the socket to write the message to.
