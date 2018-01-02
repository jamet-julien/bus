const createBus = require('./bus.js');


describe( 'Bus implementation',()=>{

  it( 'handler message', ()=>{
    const bus         = createBus();
    const handlerFunc = jest.fn();
    const params      = {};
    const someTopic   = 'topic';
    
    bus.handler( someTopic, handlerFunc);
    bus.send(someTopic, params);
    expect( handlerFunc).toBeCalledWith( params)
    
  })
  
  
  it( 'filter param', ()=>{
    
    const bus         = createBus();
    const params      = {};
    const handlerFunc = jest.fn();
    const someTopic   = 'topic2';
    
    bus.handler( someTopic, 'hello', handlerFunc);
    bus.send( someTopic, 'world');

    expect( handlerFunc).toBeCalledWith( 'hello','world')
  })

  it('Checked last param', () => {
    const bus = createBus();
    const someTopic = "topic";

    expect(()=>{
      bus.handler(someTopic, {});
    }).toThrowError('The last param would be function');
    
  })

  it('empty handler', () => {

    const bus = createBus();
    const someTopic = "topic";

    expect(() => {
      bus.send(someTopic, 'world');
    }).toThrowError(`Handler:'${someTopic}' not found`)

  })


  it('multiple call', () => {

    const bus         = createBus();
    const params      = {};
    const handlerFuncFirst = jest.fn();
    const handlerFuncSecond = jest.fn();
    const someTopic   = 'topic2';

    bus.handler( someTopic, handlerFuncFirst);
    bus.handler( someTopic, handlerFuncSecond);
    bus.send( someTopic);

    expect( handlerFuncFirst).toBeCalled();
    expect( handlerFuncSecond).toBeCalled();
    
  })

});