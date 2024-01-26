function BudgetItem({
  item,
  onDeleteBudget,
}) {
  return (
    <div className="budget-wrap">
      <label>
        <span
          data-id={item.id}
          className="budget__text"
        >
          <div class="budget-item">{item.item}</div>
          <div className="budget-price">{item.price}$</div>
        </span>

      </label>
      <button
        data-id={item.id}
        className="budget__delete"
        onClick={(e) => {
          const id = e.target.dataset.id;
          onDeleteBudget(id);
        }}
      >
        &#10060;
      </button>
    </div>
  );
}

export default BudgetItem;