import baseApi from '../api.ts'
import type {
  MasterResponse,
  MasterRequest,
  AddMasterResponse,
  AddMasterRequest,
  UpdateMasterRequest,
  UpdateMasterResponse,
  MasterResponseOne,
} from './types'

export const AssistantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssistants: build.query<MasterResponse, MasterRequest>({
      query: (params) => ({
        url: '/sales-assistant/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['assistants'],
    }),
    addAssistant: build.mutation<AddMasterResponse, AddMasterRequest>({
      query: (body) => ({
        url: '/sales-assistant/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['assistants'],
    }),
    updateAssistant: build.mutation<UpdateMasterResponse, UpdateMasterRequest>({
      query: ({ id, body }) => ({
        url: `/sales-assistant/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['assistants'],
    }),
    deleteAssistant: build.mutation<void, string>({
      query: (id) => ({
        url: `/sales-assistant/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['assistants'],
    }),
    getOneAssistant: build.query<MasterResponseOne, string>({
      query: (id) => ({
        url: `/sales-assistant/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['assistants'],
    }),
  }),
})

export const {
  useGetAssistantsQuery,
  useAddAssistantMutation,
  useUpdateAssistantMutation,
  useDeleteAssistantMutation,
  useGetOneAssistantQuery,
} = AssistantApi
