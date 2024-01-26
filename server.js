const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

const payments = require('./payments');
const sessions = require('./sessions');
const users = require('./users');

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());

// Sessions
app.get('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  res.json({ username });
});

app.post('/api/session', (req, res) => {
  const { username } = req.body;

  if(!users.isValid(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }

  if(username === 'dog') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const sid = sessions.addSession(username);
  const existingUserData = users.getUserData(username);

  if(!existingUserData) {
    users.addUserData(username, payments.makePaymentList());
  }

  res.cookie('sid', sid);
  res.json(users.getUserData(username).getPayments());
});

app.delete('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(sid) {
    res.clearCookie('sid');
  }

  if(username) {
    sessions.deleteSession(sid);  // Delete the session, but not the user data
  }

  // Don't report any error if sid or session didn't exist
  res.json({ username });
});

// target
app.get('/api/targets', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  res.json(users.getUserData(username).getTarget());
});

app.post('/api/targets', (req, res) => {  
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const { target } = req.body;
  

  if(!target || !isValidNumber(target)) {
    res.status(400).json({ error: 'required-valid-target' });
    return;
  }
  const returnTarget = users.getUserData(username).updateTarget(target)
  res.json(returnTarget);
});


// Payments
app.get('/api/payments', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  res.json(users.getUserData(username).getPayments());
});

// get the total price of all payments
app.get('/api/payments/total', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  res.json(users.getUserData(username).getTotalPrice());
});

app.post('/api/payments', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const { item, price } = req.body;
  if(!item || !price) {
    res.status(400).json({ error: 'required-item-info' });
    return;
  }

  if (!isValidItem(item) || !isValidNumber(price)) {
    res.status(400).json({ error: 'wrong-item-info' });
    return;
  }

  const paymentList = users.getUserData(username);
  const id = paymentList.addPayment(item, price);
  res.json(paymentList.getPayment(id));
});

app.get('/api/payments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const paymentList = users.getUserData(username);
  const { id } = req.params;
  if(!paymentList.contains(id)) {
    res.status(404).json({ error: `noSuchId`, message: `No payment with id ${id}` });
    return;
  }
  res.json(paymentList.getPayment(id));
});

app.put('/api/payments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const paymentList = users.getUserData(username);
  const { id } = req.params;
  const { item, price } = req.body;
  // Full Replacement required for a PUT
  if(!item || !price) {
    res.status(400).json({ error: 'required-item-info' });
    return;
  }
  if(!paymentList.contains(id)) {
    res.status(404).json({ error: `noSuchId`, message: `No payment with id ${id}` });
    return;
  }
  paymentList.updatePayment(id, { item, price });
  res.json(paymentList.getPayment(id));
});

app.patch('/api/payments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const { id } = req.params;
  const { item, price } = req.body;
  const paymentList = users.getUserData(username);
  if(!paymentList.contains(id)) {
    res.status(404).json({ error: `noSuchId`, message: `No payment with id ${id}` });
    return;
  }
  paymentList.updatePayment(id, { item, price });
  res.json(paymentList.getPayment(id));
});

app.delete('/api/payments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const { id } = req.params;
  const paymentList = users.getUserData(username);
  const exists = paymentList.contains(id);
  if(exists) {
    paymentList.deletePayment(id);
  }
  res.json({ message: exists ? `payment ${id} deleted` : `payment ${id} did not exist` });
});

// validate ite and price
function isValidItem(item) {
  let isValid = true;
  isValid = !!item && item.trim();
  isValid = isValid && item.match(/^[A-Za-z0-9_]+$/);
  return isValid;
}

function isValidNumber(number) {
  // Check if price is a valid number
  const numericPrice = Number(number);
  return !isNaN(numericPrice) && typeof numericPrice === 'number' && numericPrice >= 0;
}

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

