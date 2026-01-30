import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core"
import {MOCK_WORKOUTS} from '../constants/mock.data'

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord>({ resource }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== 'workouts') return {
      data: [] as TData[],
      total: 0
    }

    return {
      data: MOCK_WORKOUTS as unknown as TData[],
      total: MOCK_WORKOUTS.length
    }
  },

  getOne: async () => { throw new Error('This function is not present in mock') },
  create: async () => { throw new Error('This function is not present in mock') },
  update: async () => { throw new Error('This function is not present in mock') },
  deleteOne: async () => { throw new Error('This function is not present in mock') },

  getApiUrl: () => ''
}