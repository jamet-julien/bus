# Concept Bus

## idée rapide
L'idée est de chainer des actions via un système d'appel d'évènement déclanchant l'action suivante. Il sera possible d'y inclure des actions de compensation si une action a échoué.

## usage

```js

  const bus = createBus();

  bus.handler( 'calculPriceQuantity', ({ price, quantity }) => {
    return (price * quantity);
  });

  bus.handler( 'saveStore', (message)=>{
    // enregistre en base;
    return message;
  });

   bus.handler( 'resetStore', (message)=>{
    // supprime en base;
    return message;
  });
  
  bus.handler( 'cleanStore',{ valid : true} ,( {product, price} ) => {
    return { product, price, date : Date.now()}
  });

  bus.handler( 'cleanStore', { valid : false} ,( {product, price} ) => {
    return bus.send('resetStore', { product, price});
  });


  bus.handler( 'commandStore',(message) => {

    bus.send( 'saveStore', message);

    let priceCalcul = message.product.reduce((acc, current) => bus.send('calculPriceQuantity', current) + acc, 0);

    bus.send( 'cleanStore', { ...message, valid : ( message.price == priceCalcul)});

  });

  const result = bus.send('commandStore', {
    price  : 14,
    product: [
      { name: 'product 1', price: 2, quantity: 4 },
      { name: 'product 2', price: 3, quantity: 2 },
      { name: 'product 3', price: 2, quantity: 1 }
    ]
  });
```
