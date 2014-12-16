var should = require( 'should' );
var assert = require( 'assert' );

var psh;
var obj = { id: 111 };
var callback = function(){};
var second_callback = function(){};

describe('#pub-sub-handler basic tests', function(){

  describe('#init()', function(){
    it('should respond with the channel name on subscribing', function(done){
      psh = require( '../index.js')({},function(channel){
        channel.should.equal('channel-name');
        done();
      });
      psh.subscribe( 'channel-name', 'first-key', obj, function( channel, key, message, object ){
        callback( channel, key, message, object );
      });
      psh.subscribe( 'channel-name', 'second-key', obj, function( channel, key, message, object ){
        second_callback( channel, key, message, object );
      });
    });
  });

  describe('#publish()', function(){
    it('should give the proper data to the subscribe handler on publishing', function(done){
      callback = function( channel, key, message, object ){
        channel.should.equal( 'channel-name' );
        key.should.equal( 'first-key' );
        message.should.equal( 'message' );
        object.id.should.equal( 111 );
        done();
      };
      psh.publish( 'channel-name', 'message' );
    });
  });

  describe('#unsubscribe()', function(){
    it('the original subscribe should not be called and the other should be called', function(done){
      callback = function( channel, key, message, object ){
        assert(false);
      };
      second_callback = function( channel, key, message, object ){
        done();
      };
      psh.unsubscribe( 'channel-name', 'first-key' );
      psh.publish( 'channel-name', 'message' );
    });
  });

  after( function(){
    psh.end();
  });

});

