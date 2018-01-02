# Concept Bus

## idée rapide
En utilisant le principe d'evenement, l'idée est de faire un ensemble 
d'action sur un object via des fonctions pures.


## usage

```js

  const bus = createBus();

  // calcule quantité
  bus.handler( 'calculPriceQuantity', ({ price, quantity }) => {
    return (price * quantity);
  });

  //calcul du panier si evenement = 'calculShop'
  bus.handler( 'calculShop', ({ product }) => {
    return product.reduce((acc, current) => bus.send('calculPriceQuantity', current) + acc, 0);
  });

  //ajoute reduction si plus de 2 produits et si evenement = 'calculShop'
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
  // result : 8

   const result2 = bus.send('calculShop', {
    product: [
      { name: 'product 1', price: 2, quantity: 4 },
      { name: 'product 2', price: 3, quantity: 2 }
    ]
  });
  // result2 : 14

```