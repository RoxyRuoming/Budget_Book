import Loading from './Loading';
import BudgetItem from './BudgetItem';

function Budgets({
  budgets,
  isBudgetPending,
  onDeleteBudget,
}) {
  const SHOW = {  
    PENDING: 'pending',
    EMPTY: 'empty',
    BUDGETS: 'budgets',
  };

  let show;
  if(isBudgetPending) {
    show = SHOW.PENDING;
  } else if (!Object.keys(budgets).length) {
    show = SHOW.EMPTY;
  } else {
    show = SHOW.BUDGETS;
  }

  return (
    <div className="content">
      { show === SHOW.PENDING && <Loading className="budgets__waiting">Loading Items...</Loading> }
      { show === SHOW.EMPTY && (
        <p>No Items yet, add one!</p>
      )}
      { show === SHOW.BUDGETS && (
        <ul className="budgets">
          { Object.values(budgets).map( budget => (
            <li className="budget" key={budget.id}>
              <BudgetItem 
                item={budget}
                onDeleteBudget={onDeleteBudget} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Budgets;
