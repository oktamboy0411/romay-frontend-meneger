import { TableSkeleton } from '../../components/ui/table-skeleton'
import { AlertCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  useDeleteAssistantMutation,
  useGetAssistantsQuery,
} from '@/store/asistant/asistant.api'
import type { Master } from '@/store/asistant/types'
import { useGetBranch } from '@/hooks/use-get-branch'
import EditAndDeletePopover from '@/components/editAndDeletePopover/edit-and-delete-popover'
import AddAsistantDialog from './addAsistantDialog'
import UpdateAssistantDialog from './updateAssistantDialog'
import { useHandleError } from '@/hooks/use-handle-error'
import { format } from 'date-fns'
import { TablePagination } from '@/components/TablePagination'

function Assistants() {
  const [search, setSearch] = useState('')
  const branch = useGetBranch()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [open, setOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [openPopover, setOpenPopover] = useState<string>('')
  const [updateAssistant, setUpdateAssistant] = useState<string>('')
  const [deleteAssistant] = useDeleteAssistantMutation()
  const msgError = useHandleError()

  const queryParams = {
    search,
    branch_id: branch?._id || undefined,
    page,
    limit,
  }

  const {
    data: assistantsResponse,
    isLoading,
    isError,
  } = useGetAssistantsQuery(queryParams)

  const assistantsData = assistantsResponse?.data || []
  const totalPages = assistantsResponse?.pagination?.total_pages || 1
  const totalItems = assistantsResponse?.pagination?.total || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Sotuvchilar
        </h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="Xodimni izlash"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button onClick={() => setOpen(true)} className="py-5">
            Yangi qo‘shish
          </Button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : isError ? (
        <div className="border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 text-lg">Xatolik yuz berdi</p>
          <p className="text-gray-600">
            Ma’lumotlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib
            ko‘ring.
          </p>
        </div>
      ) : assistantsData.length === 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">Ma’lumot topilmadi</p>
          <p className="text-gray-500">
            Hozircha hech qanday ma’lumot mavjud emas
          </p>
        </div>
      ) : (
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Ismi</th>
                <th className="px-6 py-3 text-left font-medium">Telefon</th>
                <th className="px-6 py-3 text-left font-medium">Tavsif</th>
                <th className="px-6 py-3 text-left font-medium">Manzil</th>
                <th className="px-6 py-3 text-left font-medium">
                  Barcha Sotuvlar
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  Qo'shilgan sana
                </th>
                <th className="px-6 py-3 text-left font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {assistantsData.map((a: Master) => (
                <tr key={a._id} className="hover:bg-[#F9F9F9] cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      {a.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">{a.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {a.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">{a.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {a.total_sales?.amount} {a.total_sales?.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {a.created_at
                        ? format(new Date(a.created_at), 'dd.MM.yyyy HH:mm')
                        : "Noma'lum"}
                    </div>
                  </td>
                  <td className="px-6 py-2 text-center whitespace-nowrap">
                    <EditAndDeletePopover
                      id={a._id}
                      openPopover={openPopover}
                      setOpenPopover={setOpenPopover}
                      onClickUpdate={() => {
                        setUpdateAssistant(a._id)
                        setUpdateOpen(true)
                      }}
                      onClickDelete={async () => {
                        try {
                          await deleteAssistant(a._id).unwrap()
                          console.log('Sotuvchi o‘chirildi:', a._id)
                          setOpen(false)
                        } catch (error) {
                          console.error('Xato:', error)
                          msgError(error)
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
        onPageChange={function (page: number): void {
          setPage(page)
        }}
        onItemsPerPageChange={function (itemsPerPage: number): void {
          setLimit(itemsPerPage)
        }}
      />

      <AddAsistantDialog open={open} setOpen={setOpen} />
      <UpdateAssistantDialog
        id={updateAssistant}
        open={updateOpen}
        setOpen={setUpdateOpen}
      />
    </div>
  )
}

export default Assistants
