import { SettingStore, settingReducer } from './settings/setting.reducer';
import {
  TransactionStore,
  transactionReducer,
} from './transaction/transaction.reducer';

const reducers = {
  transaction: transactionReducer,
  setting: settingReducer,
};

interface AppState {
  transaction: TransactionStore;
  setting: SettingStore;
}

export { AppState, reducers };
