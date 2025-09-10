import baseApi from '../api'
import type {
  MasterResponse,
  MasterRequest,
  AddMasterResponse,
  AddMasterRequest,
  UpdateMasterRequest,
  UpdateMasterResponse,
} from './types.d.ts'

export const MastersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMasters: build.query<MasterResponse, MasterRequest>({
      query: (params) => ({
        url: '/mechanic/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['masters'],
    }),
    addMaster: build.mutation<AddMasterResponse, AddMasterRequest>({
      query: (body) => ({
        url: '/mechanic/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['masters'],
    }),
    updateMaster: build.mutation<UpdateMasterResponse, UpdateMasterRequest>({
      query: ({ id, body }) => ({
        url: `/mechanic/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['masters'],
    }),
    deleteMaster: build.mutation<void, string>({
      query: (id) => ({
        url: `/mechanic/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['masters'],
    }),
    getOneMaster: build.query<MasterResponse, string>({
      query: (id) => ({
        url: `/mechanic/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['masters'],
    }),
  }),
})

export const {
  useGetMastersQuery,
  useAddMasterMutation,
  useUpdateMasterMutation,
  useDeleteMasterMutation,
  useGetOneMasterQuery,
} = MastersApi
