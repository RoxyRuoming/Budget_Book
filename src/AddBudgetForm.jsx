import { useState } from 'react';

function AddBudgetForm({ onAddBudget }) {

  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');

  function onSubmit(e) {
    e.preventDefault(); // prevent page reload
    setItem('');
    setPrice('');
    onAddBudget(item, price); 
  }

  function onTypingItem(e) {
    setItem(e.target.value);
  }

  function onTypingPrice(e) {
    setPrice(e.target.value);
  }

  return (
    <form className="add__form" action="#/add" onSubmit={onSubmit}>
      <div className='input-item-price'>
        <input className="add__item" value={item} onChange={onTypingItem} placeholder='input an item'/>
        <input className="add__price" value={price} onChange={onTypingPrice} placeholder='input the price'/>
      </div>

      <button type="submit" className="add__button">Add a new item</button>
    </form>
  );
}

export default AddBudgetForm;
