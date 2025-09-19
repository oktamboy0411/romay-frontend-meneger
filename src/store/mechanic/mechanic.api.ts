import baseApi from '../api'
import type {
  AddMechanicRequest,
  AddMechanicResponse,
  GetAllMechanicsRequest,
  GetAllMechanicsResponse,
  MechanicResponse, // bitta ustani qaytaradigan response
} from './types'

export const mechanicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- ADD mechanic ---
    addMechanic: builder.mutation<AddMechanicResponse, AddMechanicRequest>({
      query: (body) => ({
        url: '/mechanic/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['mechanics'],
    }),

    // --- UPDATE mechanic ---
    updateMechanic: builder.mutation<
      AddMechanicResponse, // server xuddi Add dagi struktura qaytaradi
      { id: string; body: Partial<AddMechanicRequest> }
    >({
      query: ({ id, body }) => ({
        url: `/mechanic/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['mechanics'],
    }),

    // --- DELETE mechanic ---
    deleteMechanic: builder.mutation<
      { msg?: string; success?: boolean },
      string
    >({
      query: (id) => ({
        url: `/mechanic/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['mechanics'],
    }),

    // — getAllMechanics endpoint (to'g'irlangan)
    getAllMechanics: builder.query<
      GetAllMechanicsResponse,
      GetAllMechanicsRequest | void
    >({
      query: (params?: GetAllMechanicsRequest) => {
        const queryParams: Record<string, string | number> = {}

        if (params?.search) queryParams.search = params.search
        if (params?.work_type) queryParams.work_type = params.work_type
        if (params?.branch_id) queryParams.branch_id = params.branch_id
        // page va limit uchun `!= null` — 0 qiymat ham o‘tadi
        if (params?.page != null) queryParams.page = params.page
        if (params?.limit != null) queryParams.limit = params.limit

        return {
          url: '/mechanic/get-all',
          method: 'GET',
          params: queryParams,
        }
      },
      providesTags: ['mechanics'],
    }),

    // --- GET ONE mechanic ---
    getOneMechanic: builder.query<MechanicResponse, string>({
      query: (id) => ({
        url: `/mechanic/get/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _err, id) => [{ type: 'mechanics', id }],
    }),
  }),
})

export const {
  useAddMechanicMutation,
  useUpdateMechanicMutation,
  useDeleteMechanicMutation,
  useGetAllMechanicsQuery,
  useGetOneMechanicQuery,
} = mechanicApi
