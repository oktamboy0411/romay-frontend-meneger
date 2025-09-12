import { Link } from 'react-router-dom'
import { TableSkeleton } from '../../components/ui/table-skeleton'
import { AlertCircle, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import AddClientDialog from './AddCashierDialog'
import { Input } from '@/components/ui/input'
import { PaginationComponent } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { useGetCashiersQuery } from '@/store/cashiers/cashiers'
import { format } from 'date-fns'

function Cashiers() {
  const [searchFilter, setSearchFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('sale_cashier')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)

  const queryParams = {
    search: searchFilter,
    ...(roleFilter !== 'all' && { role: roleFilter }),
    page,
  }

  const {
    data: { data: clientsData = [], pagination } = {},
    isLoading,
    isError,
  } = useGetCashiersQuery(queryParams)

  console.log(clientsData)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 justify-between items-center">
          <h1 className="text-[30px] font-semibold text-[#09090B]">
            Kasserlar
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
              placeholder="kasserni izlash"
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
            Yangi kasser qo'shish
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
            Mijozlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib
            ko'ring.
          </p>
        </div>
      ) : clientsData.length === 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">Mijozlar topilmadi</p>
          <p className="text-gray-500">
            Hozircha hech qanday mijoz mavjud emas
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
                <th className="px-6 py-3 text-left font-medium">Boshqaruv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {clientsData?.map((c) => (
                <tr key={c._id} className="hover:bg-[#F9F9F9] cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      <Link
                        to={`/clients/${c._id}`}
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {c.username}
                      </Link>
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
                  <td>
                    <div className="flex gap-2">
                      <Button variant="outline">edit</Button>
                      <Button variant="destructive">delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationComponent
        currentPage={page}
        onPageChange={setPage}
        totalPages={pagination?.total_pages || 1}
      />

      <AddClientDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Cashiers
