function calculateFinalPrice (originalPrice , discountPercentage) {
    // 1. Calculate the price after the discount
    let discountedPrice = originalPrice - (originalPrice*(discountPercentage/100))
  // 2. Add 8% tax to that new discounted price
  let finalAmount = discountedPrice + discountedPrice * (8/100)
  // 3. Return the final amount
    return finalAmount.toFixed(2);
}

console.log(calculateFinalPrice(100,20));
console.log(calculateFinalPrice(50,0));
