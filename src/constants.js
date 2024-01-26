export const LOGIN_STATUS = {
  PENDING: 'pending',
  NOT_LOGGED_IN: 'notLoggedIn',
  IS_LOGGED_IN: 'loggedIn',
};

export const SERVER = {
  AUTH_MISSING: 'auth-missing',
  AUTH_INSUFFICIENT: 'auth-insufficient',
  REQUIRED_USERNAME: 'required-username',
  REQUIRED_ITEM_INFO: 'required-item-info',
  WRONG_ITEM_INFO: 'wrong-item-info',
  WRONG_TARGET_INFO: 'required-valid-target',
  PAYMENT_MISSING: 'noSuchId',
};

export const CLIENT = {
  NETWORK_ERROR: 'networkError',
  NO_SESSION: 'noSession',
  UNKNOWN_ACTION: 'unknownAction',
};

export const MESSAGES = {
  [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network.  Please try again',
  [SERVER.AUTH_INSUFFICIENT]: 'Your username/password combination does not match any records, please try again.',
  [SERVER.REQUIRED_USERNAME]: 'Please enter a valid (letters and/or numbers) username',
  [SERVER.REQUIRED_ITEM_INFO]: 'Please enter the item name and price',
  [SERVER.WRONG_ITEM_INFO]: 'Please enter the valid item name and price',
  [SERVER.WRONG_TARGET_INFO]: 'Please enter the valid target',
  default: 'Something went wrong.  Please try again',
};

export const ACTIONS = {
  LOG_IN: 'logIn',
  LOG_OUT: 'logOut',
  START_LOADING_ITEMS: 'startLoadingItems',
  REPLACE_ITEMS: 'replaceItems',
  REPORT_ERROR: 'reportError',
  DELETE_ITEM: 'deleteItem',
  ADD_ITEM: 'addItem',
  UPDATE_TOTAL_PRICE: 'updateTotalPrice',
  UPDATE_TARGET_BUDGET: 'updateTargetBudget',
};
