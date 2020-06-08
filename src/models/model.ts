import {Effect, Reducer} from 'umi';
import {addInventory, modifyInventories, queryInventories, removeInventoryItem} from '@/services/service';

import {InventoryModel} from '../pages/inventory.d';

export interface StateType {
  list: InventoryModel;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    query: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'inventory',

  state: {
    list: {totalCost: 0, totalSale: 0, totalProfit: 0, items: [], size: 0}
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryInventories, payload);
      yield put({
        type: 'query',
        payload: response,
      });
    },
    * appendFetch({payload}, {call, put}) {
      const response = yield call(queryInventories, payload);
      yield put({
        type: 'query',
        payload: response,
      });
    },
    * submit({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = payload.sale ? modifyInventories : removeInventoryItem;
      } else {
        callback = addInventory;
      }
      yield call(callback, payload); // post
      const queryResponse = yield call(queryInventories, payload);
      yield put({
        type: 'query',
        payload: queryResponse,
      });
    },
  },

  reducers: {
    query(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

export default Model;
