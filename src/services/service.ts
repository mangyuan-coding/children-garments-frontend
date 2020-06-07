import request from 'umi-request';
import { InventoryModel } from '../pages/inventory.d';

interface ParamsType extends Partial<InventoryModel> {
  count?: number;
}

export async function queryInventories(params: ParamsType) {
  return request('/api/inventories', {
    params,
  });
}

export async function removeInventoryItem(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/inventories', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addInventory(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/inventories', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function modifyInventories(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/inventories', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'update',
    },
  });
}
