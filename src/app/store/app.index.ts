import { settingReducer, settingStore } from './settings/setting.reducer';
import {
  transactionReducer,
  transactionStore,
} from './transaction/transaction.reducer';

const reducers = {
  transaction: transactionReducer,
  setting: settingReducer,
};

interface AppState {
  transaction: transactionStore;
  setting: settingStore;
}

export { reducers, AppState };
