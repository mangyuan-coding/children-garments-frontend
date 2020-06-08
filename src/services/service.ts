import request from 'umi-request';
import {InventoryModel} from '../pages/inventory.d';

interface ParamsType extends Partial<InventoryModel> {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  remain?: Remain;
}

export enum Remain {
  NULL,
  REMAIN,
  NO_REMAIN,
}

export async function queryInventories(params: ParamsType) {
  const {pageSize, pageIndex, remain, search} = params;
  return request('/api/inventories', {
    params: {
      pageSize: pageSize,
      pageIndex: pageIndex,
      remain: remain === Remain.NULL ? null : remain === Remain.REMAIN,
      search: search,
    }
  });
}

export async function removeInventoryItem(params: string) {
  return request('/api/inventories', {
    method: 'DELETE',
    params: {
      id: params,
    },
  });
}

export async function addInventory(params: ParamsType) {
  const {...restParams} = params;
  return request('/api/inventories', {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function modifyInventories(params: ParamsType) {
  const {...restParams} = params;
  return request('/api/inventories', {
    method: 'PUT',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}
