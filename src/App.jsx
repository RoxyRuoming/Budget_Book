import { useState, useEffect, useReducer } from 'react';

import './App.css';
import reducer, { initialState } from './reducer';
import {
  LOGIN_STATUS,
  CLIENT,
  SERVER,
  ACTIONS,
} from './constants';
import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchBudgets,
  fetchDeleteBudget,
  fetchAddBudget,
  fetchTotalPrice,

  fetchTarget,
  fetchAddTarget,
} from './services';

import LoginForm from './LoginForm';
import Budgets from './Budgets';
import Loading from './Loading';
import Controls from './Controls';
import Status from './Status';
import AddBudgetForm from './AddBudgetForm';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputTarget, setInputTarget] = useState('');

  function onSubmitTarget(e) {
    e.preventDefault();

    setInputTarget(''); // Clear the target
    onUpdateTarget(inputTarget);
  };

  function onTypingTarget(e) {
    setInputTarget(e.target.value);
  };

  function onLogin(username) {
    dispatch({ type: ACTIONS.START_LOADING_ITEMS });
    fetchLogin(username)
      .then(fetchedBudgets => {
        dispatch({ type: ACTIONS.LOG_IN, username });
        dispatch({ type: ACTIONS.REPLACE_ITEMS, budgets: fetchedBudgets });
        return fetchTotalPrice();  // Fetch the total price after logging in and fetching all budgets
      })
      .then(totalPrice => {
        dispatch({ type: ACTIONS.UPDATE_TOTAL_PRICE, totalPrice });  // Update the total price in the state
        return fetchTarget();  // Fetch the target after logging in and fetching all budgets
      })
      .then(fetchedtarget => {
        dispatch({ type: ACTIONS.UPDATE_TARGET_BUDGET, targetBudget: fetchedtarget });  // Update the target in the state
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err?.error })
      });
  };

  function onLogout() {
    dispatch({ type: ACTIONS.LOG_OUT });
    // setTarget(0); // Clear the target
    fetchLogout()
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err?.error })
      });
  };

  function onRefresh() {
    dispatch({ type: ACTIONS.START_LOADING_ITEMS });
    fetchBudgets()
      .then(fetchedBudgets => {
        // dispatch({ type: ACTIONS.REPLACE_ITEMS, budgets });
        dispatch({ type: ACTIONS.REPLACE_ITEMS, budgets: fetchedBudgets });
        return fetchTotalPrice();  // Fetch the total price after fetching all budgets
      })
      .then(totalPrice => {
        dispatch({ type: ACTIONS.UPDATE_TOTAL_PRICE, totalPrice });  // Update the total price in the state
        return fetchTarget();  // Fetch the target after logging in and fetching all budgets
      })
      .then(fetchedtarget => {
        dispatch({ type: ACTIONS.UPDATE_TARGET_BUDGET, targetBudget: fetchedtarget });   // Update the target in the state
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err?.error })
      });
  };

  function onDeleteBudget(id) {
    fetchDeleteBudget(id)
      .then(() => {
        dispatch({ type: ACTIONS.DELETE_ITEM, id });
        return fetchTotalPrice();  // Fetch the total price after deleting the item
      })
      .then(totalPrice => {
        dispatch({ type: ACTIONS.UPDATE_TOTAL_PRICE, totalPrice });  // Update the total price in the state
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err?.error })
      });
  };

  function onAddBudget(item, price) {
    fetchAddBudget(item, price)
      .then(budget => {
        dispatch({ type: ACTIONS.ADD_ITEM, budget });
        return fetchTotalPrice();  // Fetch the total price after adding the item
      })
      .then(totalPrice => {
        dispatch({ type: ACTIONS.UPDATE_TOTAL_PRICE, totalPrice });  // Update the total price in the state
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err?.error })
      });
  };

  // Update the target budget
  function onUpdateTarget(target) {
    fetchAddTarget(target)
      .then(fetchedtarget => {
        dispatch({ type: ACTIONS.UPDATE_TARGET_BUDGET, targetBudget: fetchedtarget });  // Update the target in the state
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err?.error })
      });
  };
  
  function checkForSession() {
    fetchSession()
      .then(session => { // The returned object from the service call
        dispatch({ type: ACTIONS.LOG_IN, username: session.username });
        return fetchBudgets(); 
      })
      .catch(err => {
        console.error("Error during session check:", err);
        if (err?.error === SERVER.AUTH_MISSING) {
          return Promise.reject({ error: CLIENT.NO_SESSION }) // Expected, not a problem
        }
        return Promise.reject(err); // Pass any other error unchanged
      })
      .then(fetchedBudgets => {
        dispatch({ type: ACTIONS.REPLACE_ITEMS, budgets: fetchedBudgets });
      })
      .catch(err => {
        if (err?.error === CLIENT.NO_SESSION) { // expected "error"
          dispatch({ type: ACTIONS.LOG_OUT });
          return;
        }
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err?.error })
      }
      );
  }

  // check session on first render
  useEffect(
    () => {
      checkForSession();
    },
    []
  );

  //polling
  useEffect(() => {
    let intervalId;
    if (state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN) {
      intervalId = setInterval(onRefresh, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.loginStatus]);

  return (
    <div className="app">
      <main className="main">
        {state.error && <Status error={state.error} />}
        {state.loginStatus === LOGIN_STATUS.PENDING && <Loading className="login__waiting">Loading user...</Loading>}
        {state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && <LoginForm onLogin={onLogin} />}
        {state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <div className="content" >
            <p className='welcome-text'>  <span className='username'>{state.username}</span> - Budget Plan </p>

            <form className="target-area" action="#/target-budget" onSubmit={onSubmitTarget}>
              <span>Current budget: {state.targetBudget}$ 
              <p className='balance'>Current Balance: {state.targetBudget - state.totalPrice}$</p></span>
              
              <div className='update-target'>
                <button className="target__button" type="submit">Update Budget </button>
                <label>
                  <input className="input__target" value={inputTarget} onChange={onTypingTarget} />
                </label>
              </div>

            </form>

            

            <p>Total Price: {state.totalPrice}$</p>
            <Budgets
              isBudgetPending={state.isBudgetPending}
              budgets={state.budgets}
              onDeleteBudget={onDeleteBudget}

            />
            <AddBudgetForm onAddBudget={onAddBudget} />
            <Controls onLogout={onLogout} onRefresh={onRefresh} />

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
