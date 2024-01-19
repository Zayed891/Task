const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
  
  const products = {
    'Product A': { price: 20, quantity: 0, giftWrap: false },
    'Product B': { price: 40, quantity: 0, giftWrap: false },
    'Product C': { price: 50, quantity: 0, giftWrap: false }
  };
  
  let totalQuantity = 0;
  let subtotal = 0;
  let giftWrapFee = 0;
  let shippingFee = 0;
  
  function ProductDetails(productName) {
    return new Promise((resolve) => {
      readline.question(`Enter the quantity for ${productName}: `, (quantity) => {
        products[productName].quantity = parseInt(quantity);
        totalQuantity += parseInt(quantity);
        readline.question(`Do you want gift wrap for ${productName}? (yes/no): `, (giftWrap) => {
          products[productName].giftWrap = giftWrap.toLowerCase() === 'yes';
          giftWrapFee += products[productName].giftWrap ? parseInt(quantity) : 0;
          resolve();
        });
      });
    });
  }
  
  async function main() {
    for (const product in products) {
        await ProductDetails(product);
        if (products[product].quantity > 0) {
          subtotal += products[product].price * products[product].quantity;
          shippingFee += 5; // Add shipping fee only if product quantity is greater than 0
        }
    }
  
    const discounts = {
      'flat_10_discount': subtotal > 200 ? 10 : 0,
      'bulk_5_discount': Math.max(...Object.values(products).map(p => p.quantity)) > 10 ? subtotal * 0.05 : 0,
      'bulk_10_discount': totalQuantity > 20 ? subtotal * 0.1 : 0,
      'tiered_50_discount': totalQuantity > 30 && Math.max(...Object.values(products).map(p => p.quantity)) > 15 ? subtotal * 0.5 : 0
    };
  
    const maxDiscountName = Object.keys(discounts).reduce((a, b) => discounts[a] > discounts[b] ? a : b);
    const maxDiscountValue = discounts[maxDiscountName];
  
    shippingFee = Math.ceil(totalQuantity / 10) * 5;
  
    const total = subtotal - maxDiscountValue + giftWrapFee + shippingFee;
    

    console.log('Order Summary');
    
    for (const product in products) {
      console.log(`Product: ${product}, Quantity: ${products[product].quantity}, Total: $${products[product].price * products[product].quantity}`);
    }
    console.log(`Subtotal: $${subtotal}`);
    console.log(`Discount: ${maxDiscountName}, Amount: $${maxDiscountValue}`);
    console.log(`Gift Wrap Fee: $${giftWrapFee}`);
    console.log(`Shipping Fee: $${shippingFee}`);
    console.log(`Total: $${total}`);
  
    readline.close();
  }
  
  main();