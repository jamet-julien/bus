

module.exports = function(){
  const handlerMap = new Map();

  return {
    handler: function ( ...args) {

      const topic        = args.shift();
      const handlerFunc  = ( args.length > 0) ? args.pop() : null;
      const defaultParam = ( args.length > 0) ? args.shift() : null;

      const handlerFuncReal = (defaultParam === null) ? handlerFunc : handlerFunc.bind(null, defaultParam);
      
      if( !handlerFuncReal.call){
        throw new Error('The last param would be function');
      }

      let handlers = ( handlerMap.get( topic)) ? [...handlerMap.get(topic), handlerFuncReal] : [handlerFuncReal];
      handlerMap.set( topic, handlers);
    },

    send: function ( topic, message) {
      if( handlerMap.get(topic)){
        handlerMap.get(topic).map((handler) => { handler( message)})
      }else{
        throw new Error(`Handler:'${topic}' not found`);
      }
    }
  };
};
