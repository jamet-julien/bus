function rightPattern(message, filter){
  for (var key in filter) {
    if (
      filter.hasOwnProperty(key) &&
      message.hasOwnProperty(key) &&
      message[key] == filter[key]) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}


module.exports = function(){
  const handlerMap = new Map();

  return {
    handler: function ( ...args) {

      const topic        = args.shift();
      const handlerFunc  = ( args.length > 0) ? args.pop() : null;
      const filter       = ( args.length > 0) ? args.shift() : {};
      
      if (!handlerFunc.call){
        throw new Error('The last param would be function');
      }

      let handlers = (handlerMap.get(topic)) ? [...handlerMap.get(topic), { filter, handlerFunc }] : [{filter, handlerFunc}];

      handlerMap.set( topic, handlers);

    },

    send: function ( topic, message) {
      if( handlerMap.get(topic)){
        const handlerCalled = handlerMap.get(topic).filter(({ filter })=> rightPattern.call( null, message, filter));
        let result;

        result = handlerCalled.reduce(( acc, { handlerFunc })=>{
          
          return (acc == undefined)? handlerFunc( message) : handlerFunc( message, acc);

        }, undefined);
        
        return result;
      }else{
        throw new Error(`Handler:'${topic}' not found`);
      }
    }
  };
};
