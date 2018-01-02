

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
        const called = handlerMap.get(topic).find(({filter})=>{

          for (var key in filter) {
            if (
              filter.hasOwnProperty( key) &&
              message.hasOwnProperty( key) &&
              message[key] == filter[key]) {
                continue;
            }else{
              return false;
            }
          }
          return true;

        });

        return called.handlerFunc( message);
      }else{
        throw new Error(`Handler:'${topic}' not found`);
      }
    }
  };
};
