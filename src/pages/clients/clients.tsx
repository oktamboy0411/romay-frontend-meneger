import { Button } from '@/components/ui/button'
import {
  useDeleteClientMutation,
  useGetClientsQuery,
} from '@/store/clients/clients.api'
import { AlertCircle, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TableSkeleton } from '../../components/ui/table-skeleton'
import AddClientDialog from './AddClientDialog'
import { useGetUser } from '@/hooks/useGetUser'
import { SetLocation } from '@/hooks/setLocation'
import { TablePagination } from '@/components/TablePagination'
import { Input } from '@/components/ui/input'
import EditAndDeletePopover from '@/components/editAndDeletePopover/edit-and-delete-popover'
import UpdateClientDialog from './UpdateClientDilalog'
import { toast } from 'sonner'

function BalanceCell({ value }: { value: number }) {
  const isZero = value === 0
  const isNegative = value < 0
  const formatted =
    (isNegative ? '-' : '') + Math.abs(value).toLocaleString('uz-UZ') + " so'm"
  return (
    <span
      className={
        isZero
          ? 'text-emerald-600'
          : isNegative
            ? 'text-rose-600'
            : 'text-emerald-600'
      }
    >
      {isZero ? "0 so'm" : formatted}
    </span>
  )
}

function Clients() {
  const me = useGetUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openPopover, setOpenPopover] = useState<string>('')
  const [updateClientId, setUpdateClientId] = useState<string>('')
  const [updateOpen, setUpdateOpen] = useState(false)

  const [deleteClient] = useDeleteClientMutation()

  const { data, isLoading, isError } = useGetClientsQuery({
    branch_id: me?.branch_id._id,
    page: currentPage,
    limit: limit,
    search: search,
  })

  const navigate = useNavigate()
  const clientsData = data?.data || []
  const pagination = data?.pagination

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setLimit(itemsPerPage)
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  SetLocation('Mijozlar')
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center space-x-6">
        <h1 className="text-[30px] font-semibold text-[#09090B]">Mijozlar</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 w-[400px]"
            placeholder="Sotuvchi qidirish"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={() => setOpen(true)} variant="default">
          <Plus className="h-4 w-4" />
          Mijoz qo'shish
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : isError ? (
        <div className="border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 text-lg">Xatolik yuz berdi</p>
          <p className="text-gray-600">
            Mijozlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib
            ko'ring.
          </p>
        </div>
      ) : clientsData.length === 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">
            {search ? 'Qidiruv natijasi topilmadi' : 'Mijozlar topilmadi'}
          </p>
          <p className="text-gray-500">
            {search
              ? `"${search}" bo'yicha hech qanday mijoz topilmadi`
              : 'Hozircha hech qanday mijoz mavjud emas'}
          </p>
        </div>
      ) : (
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Ismi</th>
                <th className="px-6 py-3 text-left font-medium">
                  Telefon raqami
                </th>
                <th className="px-6 py-3 text-left font-medium">Segment</th>
                <th className="px-6 py-3 text-left font-medium">Qarz</th>
                <th className="px-6 py-3 text-center font-medium">
                  Buyurtmalar soni
                </th>
                <th className="px-6 py-3 text-center font-medium">Tavsif</th>
                <th className="px-6 py-3 text-center font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {clientsData?.map((c) => (
                <tr
                  onClick={() => navigate(`client/${c._id}`)}
                  key={c._id}
                  className="hover:bg-[#F9F9F9] cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]  ">
                      {c.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {c.phone || 'Mavjud emas'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {c.customer_tier || 'Mavjud emas'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <BalanceCell value={c.debt.total_amount || 0} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {c.sales_count || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {c.description || "Noma'lum"}
                    </div>
                  </td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <EditAndDeletePopover
                      id={c._id}
                      openPopover={openPopover}
                      setOpenPopover={setOpenPopover}
                      onClickUpdate={() => {
                        setUpdateClientId(c._id)
                        setUpdateOpen(true)
                      }}
                      onClickDelete={async () => {
                        try {
                          await deleteClient(c._id).unwrap()
                          toast.success(
                            'Muvaffaqiyat! Mijoz muvaffaqiyatli o‘chirildi.'
                          )
                        } catch (error) {
                          toast.error(
                            'Xatolik! Mijozni o‘chirishda xatolik yuz berdi.'
                          )
                          console.error('Xato:', error)
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
      {pagination && (
        <TablePagination
          currentPage={pagination.page || 1}
          totalPages={pagination.total_pages || 1}
          totalItems={pagination.total || 0}
          itemsPerPage={pagination.limit || 10}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
      <AddClientDialog open={open} setOpen={setOpen} />
      <UpdateClientDialog
        open={updateOpen}
        setOpen={function (open: boolean): void {
          setUpdateOpen(open)
        }}
        id={updateClientId}
      />
    </div>
  )
}

export default Clients
