import { GAuthStore, gAuthReducer } from './GAuth/gauth.reducer';
import { SettingStore, settingReducer } from './settings/setting.reducer';
import {
  TransactionStore,
  transactionReducer,
} from './transaction/transaction.reducer';

const reducers = {
  transaction: transactionReducer,
  setting: settingReducer,
  gAuth: gAuthReducer,
};

interface AppState {
  transaction: TransactionStore;
  setting: SettingStore;
  gAuth: GAuthStore;
}

export { AppState, reducers };
