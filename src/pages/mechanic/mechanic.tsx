import AddMechanicDialog from './AddMechanicDialog'
import EditAndDeletePopover from '@/components/editAndDeletePopover/edit-and-delete-popover'
import { useHandleError } from '@/hooks/use-handle-error'
import UpdateMechanicDialog from './UpdateMechanicDialog'
import {
  useDeleteMechanicMutation,
  useGetAllMechanicsQuery,
} from '@/store/mechanic/mechanic.api'
import { useState } from 'react'

import { TablePagination } from '@/components/TablePagination'
import { useGetBranch } from '@/hooks/use-get-branch'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

export default function Mechanics() {
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openPopover, setOpenPopover] = useState<string>('')
  const [updateMechanicId, setUpdateMechanicId] = useState<string>('')
  const [updateOpen, setUpdateOpen] = useState(false)
  const msgError = useHandleError()
  const branch = useGetBranch()

  const [deleteClient] = useDeleteMechanicMutation()

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const {
    data: mechanicsData,
    isLoading: mechanicsLoading,
    error: mechanicsError,
  } = useGetAllMechanicsQuery({
    page: currentPage,
    limit: limit,
    branch_id: branch?._id,
    search,
  })
  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setLimit(itemsPerPage)
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const mechanics = mechanicsData?.data || []

  if (mechanicsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">Yuklanmoqda...</div>
      </div>
    )
  }

  if (mechanicsError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-red-500">Xatolik yuz berdi</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">Mexaniklar</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 w-[400px]"
            placeholder="Mexanikni qidirish"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <AddMechanicDialog />
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">To'liq ism</th>
              <th className="px-6 py-3 text-left font-medium">Telefon raqam</th>
              <th className="px-6 py-3 text-center font-medium">Ish turi</th>
              <th className="px-6 py-3 text-center font-medium">Servislari</th>
              <th className="px-6 py-3 text-center font-medium">
                Yaratilgan sana
              </th>
              <th className="px-6 py-3 text-center font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {mechanics.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Ustalar topilmadi
                </td>
              </tr>
            ) : (
              mechanics.map((mechanic) => (
                <tr
                  key={mechanic._id}
                  className={`hover:bg-[#F8F9FA] transition-colors cursor-pointer ${
                    mechanic._id ? 'border-l-4 border-l-transparent' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      {mechanic.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {mechanic.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mechanic.work_type === 'SERVICE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {mechanic.work_type === 'SERVICE'
                        ? 'Xizmat'
                        : 'Tashqi xizmati'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {mechanic.service_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(mechanic.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <EditAndDeletePopover
                      id={mechanic._id}
                      openPopover={openPopover}
                      setOpenPopover={setOpenPopover}
                      onClickUpdate={() => {
                        setUpdateMechanicId(mechanic._id)
                        setUpdateOpen(true)
                      }}
                      onClickDelete={async () => {
                        try {
                          await deleteClient(mechanic._id).unwrap()
                          console.log('Sotuvchi o‘chirildi:', mechanic._id)
                        } catch (error) {
                          console.error('Xato:', error)
                          msgError(error)
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={mechanicsData?.page_count || 1}
        totalItems={mechanicsData?.after_filtering_count || 0}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <UpdateMechanicDialog
        id={updateMechanicId}
        open={updateOpen}
        setOpen={function (open: boolean): void {
          setUpdateOpen(open)
        }}
      />
    </div>
  )
}
