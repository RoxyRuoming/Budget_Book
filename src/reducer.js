import {
  LOGIN_STATUS,
  CLIENT,
  ACTIONS,
} from './constants';

export const initialState = {
  error: '',
  username: '',
  loginStatus: LOGIN_STATUS.PENDING,
  isBudgetPending: false,
  budgets: {},
  totalPrice: 0,
  targetBudget: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOG_IN:
      return {
        ...state,
        error: '',
        loginStatus: LOGIN_STATUS.IS_LOGGED_IN,
        username: action.username,
      };

    case ACTIONS.START_LOADING_ITEMS:
      return {
        ...state,
        error: '',
        isBudgetPending: true,
      };

    case ACTIONS.REPLACE_ITEMS:
      return {
        ...state,
        error: '',
        isBudgetPending: false,
        budgets: action.budgets,
      };

    case ACTIONS.LOG_OUT:
      return {
        ...state,
        error: '',
        isBudgetPending: false,
        budgets: {},
        loginStatus: LOGIN_STATUS.NOT_LOGGED_IN,
        username: '',
        totalPrice: 0,
        targetBudget: 0,
      };

    case ACTIONS.REPORT_ERROR:
      return {
        ...state,
        error: action.error || 'ERROR', // ERROR is just to ensure a truthy value
      };

    case ACTIONS.DELETE_ITEM:
      const budgetsCopy = { ...state.budgets }; // "shallow" copy, but we are only making a shallow change
      delete budgetsCopy[action.id];
      return {
        ...state,
        budgets: budgetsCopy, // No need to copy the copy
      };

    case ACTIONS.ADD_ITEM:
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [action.budget.id]: action.budget,
        },
      };

    case ACTIONS.UPDATE_TOTAL_PRICE:
      return {
        ...state,
        totalPrice: action.totalPrice,
      };

    case ACTIONS.UPDATE_TARGET_BUDGET:
      return {
        ...state,
        targetBudget: action.targetBudget,
      };

    default:
      throw new Error({ error: CLIENT.UNKNOWN_ACTION, detail: action });  // reporting detail for debugging aid, not shown to user
  }
}

export default reducer;
