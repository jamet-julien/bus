const createBus = require('./bus.js');


describe( 'Bus implementation',()=>{

  it( 'handler message', ()=>{

    const bus         = createBus();
    const handlerFunc = jest.fn();
    const message     = {};
    const someTopic   = 'topic';
    
    bus.handler( someTopic, handlerFunc);
    bus.send( someTopic, message);

    expect( handlerFunc).toBeCalledWith( message)
    
  })

///////
  it( 'filter param', ()=>{
    
    const bus         = createBus();
    const params      = { type: 'cat' };
    const handlerFunc = jest.fn();
    const someTopic   = 'topic2';
    
    bus.handler( someTopic, {}, handlerFunc);
    bus.send(someTopic, params);

    expect( handlerFunc).toBeCalledWith( params)
  })

///////
  it('Checked last param', () => {
    const bus       = createBus();
    const someTopic = "topic";

    expect(()=>{
      bus.handler( someTopic, {});
    }).toThrowError('The last param would be function');
    
  })

///////
  it('empty handler', () => {

    const bus = createBus();
    const someTopic = "topic";

    expect(() => {
      bus.send(someTopic, 'world');
    }).toThrowError(`Handler:'${someTopic}' not found`)

  })

///////
  it('passe and return value handler', ()=>{

    const bus            = createBus();
    const someTopic      = "topic";
    const returnMessage  = "result";

    bus.handler( someTopic, () =>  returnMessage)

    const returnValue = bus.send( someTopic, {});
    expect(returnValue).toBe(returnMessage);
  });

///////
  it('multiple call filter', () => {

    const bus               = createBus();
    const message           = {type:'cat'};
    const handlerFuncFirst  = jest.fn();
    const handlerFuncSecond = jest.fn();
    const someTopic         = 'topic2';

    bus.handler( someTopic, { type:'cat' },handlerFuncSecond);
    bus.handler( someTopic, { type:'dog' },handlerFuncFirst);

    bus.send( someTopic, message);

    expect( handlerFuncFirst).not.toBeCalled();
    expect( handlerFuncSecond).toBeCalled();
    
  })

  ///////
  it('multiple call filter (example 2)', () => {

    const bus               = createBus();
    const message           = { type: 'cat', value: 'value' };
    const handlerFuncFirst  = jest.fn();
    const handlerFuncSecond = jest.fn();
    const handlerFuncThird  = jest.fn();
    const someTopic         = 'topic2';

    bus.handler(someTopic, { value : 'not-value', type: 'cat' } , handlerFuncThird);
    bus.handler(someTopic, { value : 'value', type: 'cat' }      , handlerFuncSecond);
    bus.handler(someTopic, { value : 'value', type: 'dog' }      , handlerFuncFirst);

    bus.send(someTopic, message);

    expect( handlerFuncFirst).not.toBeCalled();
    expect( handlerFuncThird).not.toBeCalled();
    expect( handlerFuncSecond).toBeCalled();

  })

  ///////
  it('multiple call Cumulate', () => {

    const bus               = createBus();
    const message           = { prenom: 'Alex', nom : 'Dupond'};
    const handlerFuncFirst  = ({prenom}) =>  "#" + prenom;
    const handlerFuncSecond = ({ nom }, acc = '') => acc +' '+ nom;
    const someTopic         = 'topic2';

    bus.handler( someTopic, handlerFuncFirst);
    bus.handler( someTopic, handlerFuncSecond);


    const result = bus.send( someTopic, message);

    expect(result).toBe("#Alex Dupond");

  })

  ///////
  it('multiple call Cumulate with filter', () => {

    const bus = createBus();
    const message = { prenom: 'Alex', nom: 'Dupond' };
    const handlerFuncFirst = ({ prenom }) => "#" + prenom;
    const handlerFuncSecond = ({ nom }, acc = '') => acc + ' ' + nom;
    const someTopic = 'topic2';

    bus.handler(someTopic, { prenom : 'Alex'}, handlerFuncFirst);
    bus.handler(someTopic, { prenom : 'Paul'}, handlerFuncSecond);


    const result = bus.send(someTopic, message);
    expect(result).toBe( "#Alex");

  })

  ///////
  it('Call interne', () => {

    const bus              = createBus();
    
    bus.handler( 'calculPriceQuantity', ({price, quantity})=>{
      return (price * quantity);
    });

    bus.handler( 'calculShop', ({product})=>{
      return product.reduce((acc, current) => bus.send( 'calculPriceQuantity', current) + acc, 0);
    });

    const result = bus.send( 'calculShop', { product : [
      {name : 'product 1', price : 2 , quantity : 4 },
      {name : 'product 2', price : 3 , quantity : 2 }
    ]});

    expect(result).toBe( 14 );

  })

  ///////
  it('Call multiple and interne', () => {

    const bus = createBus();

    bus.handler( 'calculPriceQuantity', ({ price, quantity }) => {
      return (price * quantity);
    });

    bus.handler( 'calculShop', ({ product }) => {
      return product.reduce((acc, current) => bus.send('calculPriceQuantity', current) + acc, 0);
    });

    bus.handler( 'calculShop', ({ product }, total = 0) => {
      return ( product.length > 2 )? total * .5 : total;
    });


    const result = bus.send('calculShop', {
      product: [
        { name: 'product 1', price: 2, quantity: 4 },
        { name: 'product 2', price: 3, quantity: 2 },
        { name: 'product 3', price: 2, quantity: 1 }
      ]
    });

    expect(result).toBe(8);

  })


});