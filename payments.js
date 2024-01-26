const uuid = require('uuid').v4;

let target;

function makePaymentList() {
  const id1 = uuid();
  const id2 = uuid();
  

  const paymentList = {};
  const payments = {
    [id1]: {
      id: id1,
      item: 'Macbook air',
      price: 2000,
    },
    [id2]: {
      id: id2,
      item: 'Dior perfume',
      price: 100,
    },
  };

  paymentList.contains = function contains(id) {
    return !!payments[id];
  };

  paymentList.getPayments = function getPayments() {
    return payments;
  };

  paymentList.getTotalPrice = function getTotalPrice() {
    let totalPrice = 0;
    for (const id in payments) {
      totalPrice += parseInt(payments[id].price);
    }
    return totalPrice;
  };

  paymentList.addPayment = function addPayment(item, price) {
    const id = uuid();
    payments[id] = {
      id,
      item,
      price,
    };
    return id;
  };

  paymentList.getPayment = function getPayment(id) {
    return payments[id];
  };

  paymentList.updatePayment = function updatePayment(id, payment) {
    payments[id].item = payment.item ?? payments[id].item;
    payments[id].price = payment.price ?? payments[id].price;
  };

  paymentList.deletePayment = function deletePayment(id) {
    delete payments[id];
  };

  // target
  paymentList.getTarget = function getTarget() {
    return target;
  } 

  paymentList.updateTarget = function updateTarget(newTarget) {
    target = newTarget;
    return target;
  }
  return paymentList;
};

  
module.exports = {
  makePaymentList,
};