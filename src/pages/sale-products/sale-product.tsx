import { Link } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import { TableSkeleton } from '../../components/ui/table-skeleton'
import { AlertCircle, Search } from 'lucide-react'
import { useState } from 'react'
import AddClientDialog from './AddSaleProductDialog'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { Input } from '@/components/ui/input'
import { PaginationComponent } from '@/components/pagination'
import { Button } from '@/components/ui/button'

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

function SaleProduct() {
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('all')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)

  const queryParams = {
    search,
    ...(branch !== 'all' && { branch_id: branch }),
    page,
  }

  const {
    data: { data: clientsData = [], pagination } = {},
    isLoading,
    isError,
  } = useGetClientsQuery(queryParams)

  const {
    data: { data: branchesData = [] } = {},
    isLoading: isLoadingBranches,
    isError: isErrorBranches,
  } = useGetAllBranchesQuery({})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">Mijozlar</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="mijozni izlash"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Barcha filiallar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              {isLoadingBranches ? (
                <SelectItem disabled value="loading">
                  Yuklanmoqda...
                </SelectItem>
              ) : isErrorBranches ? (
                <SelectItem disabled value="error">
                  Xatolik yuz berdi
                </SelectItem>
              ) : (
                branchesData.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button onClick={() => setOpen(true)} className="py-5">
            Yangi mijoz qo'shish
          </Button>
        </div>
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
                <th className="px-6 py-3 text-left font-medium">Segment</th>
                <th className="px-6 py-3 text-left font-medium">Qarz</th>
                <th className="px-6 py-3 text-center font-medium">
                  mijoz toifasi
                </th>
                <th className="px-6 py-3 text-center font-medium">Filial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {clientsData?.map((c) => (
                <tr key={c.id} className="hover:bg-[#F9F9F9] cursor-pointer">
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
                      {c.profession || 'Mavjud emas'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <BalanceCell value={c.debt.amount || 0} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {c.customer_tier || "Noma'lum"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {c.branch_id?.name || "Noma'lum"}
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

export default SaleProduct
