import {
  transactionReducer,
  transactionStore,
} from './transaction/transaction.reducer';

const reducers = {
  transaction: transactionReducer,
};

interface AppState {
  transaction: transactionStore;
}

export { reducers, AppState };
