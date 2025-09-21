import { TableSkeleton } from '../../components/ui/table-skeleton'
import { AlertCircle, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  useDeleteCashierMutation,
  useGetCashiersQuery,
} from '@/store/cashiers/cashiers'
import { format } from 'date-fns'
import EditAndDeletePopover from '@/components/editAndDeletePopover/edit-and-delete-popover'
import AddCashierDialog from './AddCashierDialog'
import UpdateCashierDialog from './UpdateCashierDialog'
import { TablePagination } from '@/components/TablePagination'
import { toast } from 'sonner'

function Cashiers() {
  const [searchFilter, setSearchFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('sale_cashier')
  const [openPopover, setOpenPopover] = useState<string>('')
  const [updateCashierId, setUpdateCashierId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [open, setOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteCashier] = useDeleteCashierMutation()

  const queryParams = {
    search: searchFilter,
    ...(roleFilter !== 'all' && { role: roleFilter }),
    page,
    limit,
  }

  const {
    data: { data: cashierData = [], pagination } = {},
    isLoading,
    isError,
  } = useGetCashiersQuery(queryParams)

  const totalPages = pagination?.total_pages || 1
  const totalItems = pagination?.total || 0

  const handleDeleteCashier = async (cashierId: string) => {
    try {
      await deleteCashier(cashierId).unwrap()
      toast.success('Muvaffaqiyat! Kassir muvaffaqiyatli o‘chirildi.')
    } catch (error) {
      toast.error('Xatolik! Kassirni o‘chirishda xatolik yuz berdi.')
      console.error('Xato:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 justify-between items-center">
          <h1 className="text-[30px] font-semibold text-[#09090B]">
            Kassirlar
          </h1>

          <div className="flex justify-center items-center gap-1 border border-gray-300 rounded-md p-1">
            <Button
              onClick={() => setRoleFilter('sale_cashier')}
              variant={roleFilter === 'sale_cashier' ? 'default' : 'ghost'}
            >
              Sotuv kassasi
            </Button>
            <Button
              onClick={() => setRoleFilter('rent_cashier')}
              variant={roleFilter === 'rent_cashier' ? 'default' : 'ghost'}
            >
              Servis kassasi
            </Button>
          </div>
        </div>
        <div className="flex gap-3 justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="Kassirni izlash"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <Button
            variant={'outline'}
            onClick={() => setOpen(true)}
            className="py-5"
          >
            <Plus className="h-4 w-4" />
            Yangi kassir qo'shish
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : isError ? (
        <div className="border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 text-lg">Xatolik yuz berdi</p>
          <p className="text-gray-600">
            Kassirlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib
            ko'ring.
          </p>
        </div>
      ) : cashierData.length === 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">Kassirlar topilmadi</p>
          <p className="text-gray-500">
            Hozircha hech qanday kassir mavjud emas
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
                <th className="px-6 py-3 text-left font-medium">Manzil</th>
                <th className="px-6 py-3 text-left font-medium">Filial</th>
                <th className="px-6 py-3 text-left font-medium">
                  Yaratilgan sana
                </th>
                <th className="px-6 py-3 text-left font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {cashierData?.map((c) => (
                <tr key={c._id} className="hover:bg-[#F9F9F9] cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
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
                      {c.address || 'Mavjud emas'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {c.branch_id?.name || "Noma'lum"}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {c.created_at
                        ? format(new Date(c.created_at), 'dd.MM.yyyy HH:mm')
                        : "Noma'lum"}
                    </div>
                  </td>
                  <td className="flex items-center justify-center px-4 py-2 whitespace-nowrap">
                    <EditAndDeletePopover
                      id={c._id}
                      openPopover={openPopover}
                      setOpenPopover={setOpenPopover}
                      onClickUpdate={() => {
                        setUpdateCashierId(c._id)
                        setUpdateOpen(true)
                      }}
                      onClickDelete={async () => {
                        handleDeleteCashier(c._id)
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

      <AddCashierDialog open={open} setOpen={setOpen} />

      <UpdateCashierDialog
        open={updateOpen}
        setOpen={function (open: boolean): void {
          setUpdateOpen(open)
        }}
        id={updateCashierId}
      />
    </div>
  )
}

export default Cashiers
