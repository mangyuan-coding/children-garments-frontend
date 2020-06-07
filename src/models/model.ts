import { Effect, Reducer } from 'umi';
import { addInventory, queryInventories, removeInventoryItem, modifyInventories } from '../services/service';

import { InventoryModel } from '../pages/inventory.d';

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
    list: { totalCost: 0, totalSale: 0, totalProfit: 0, items: [] }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryInventories, payload);
      yield put({
        type: 'query',
        payload: response === null ? response : { totalCost: 0, totalSale: 0, totalProfit: 0, items: [] },
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryInventories, payload);
      yield put({
        type: 'query',
        payload: response === null ? response : { totalCost: 0, totalSale: 0, totalProfit: 0, items: [] },
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeInventoryItem : modifyInventories;
      } else {
        callback = addInventory;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'query',
        payload: response,
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
