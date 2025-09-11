import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetSalesQuery } from '@/store/sales/sales.api' // 🔹 SALES API
import { TableSkeleton } from '../../components/ui/table-skeleton'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { PaginationComponent } from '@/components/pagination'
import SaleDetailsDialog from './AddSalesDialog'
import type { Sale } from '@/store/sales/types'
import { useGetCashiersQuery } from '@/store/cashiers/cashiers'

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

function Sales() {
  const [cashier, setCashier] = useState('all')
  const [branch, setBranch] = useState('all')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale>({
    _id: 'string',
    branch_id: { _id: 'string', name: 'string', address: 'string' },
    cashier_id: { _id: 'string', username: 'string', phone: 'string' },
    client_id: { _id: 'string', username: 'string', phone: 'string' },
    items: [],
    status: 'PENDING',
    payments: {
      total_amount: 0,
      paid_amount: 0,
      debt_amount: 0,
      type: '',
      currency: '',
      _id: '',
    },
    created_at: '',
    updated_at: '',
  })

  const queryParams = {
    ...(cashier !== 'all' && { cashier_id: cashier }),
    ...(branch !== 'all' && { branch_id: branch }),
    page,
  }

  const {
    data: { data: salesData = [], pagination } = {},
    isLoading,
    isError,
  } = useGetSalesQuery(queryParams)

  const {
    data: { data: branchesData = [] } = {},
    isLoading: isLoadingBranches,
    isError: isErrorBranches,
  } = useGetAllBranchesQuery({})

  const cashierQueryParams = {
    ...(branch !== 'all' && { branch_id: branch }),
  }

  const {
    data: { data: cashiersData = [] } = {},
    isLoading: isLoadingCashiers,
    isError: isErrorCashiers,
  } = useGetCashiersQuery(cashierQueryParams)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">Savdolar</h1>
        <div className="flex gap-3">
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
          <Select value={cashier} onValueChange={setCashier}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Barcha kassalar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              {isLoadingCashiers ? (
                <SelectItem disabled value="loading">
                  Yuklanmoqda...
                </SelectItem>
              ) : isErrorCashiers ? (
                <SelectItem disabled value="error">
                  Xatolik yuz berdi
                </SelectItem>
              ) : (
                cashiersData.map((cashier) => (
                  <SelectItem key={cashier._id} value={cashier._id}>
                    {cashier.username}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={7} />
      ) : isError ? (
        <div className="border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 text-lg">Xatolik yuz berdi</p>
          <p className="text-gray-600">
            Savdolarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib
            ko'ring.
          </p>
        </div>
      ) : salesData.length === 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">Savdolar topilmadi</p>
          <p className="text-gray-500">
            Hozircha hech qanday savdo mavjud emas
          </p>
        </div>
      ) : (
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Mijoz</th>
                <th className="px-6 py-3 text-left font-medium">Telefon</th>
                <th className="px-6 py-3 text-left font-medium">Kassir</th>
                <th className="px-6 py-3 text-left font-medium">Filial</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Qarz</th>
                <th className="px-6 py-3 text-left font-medium">
                  Umumiy summa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {salesData?.map((s) => (
                <tr key={s._id} className="hover:bg-[#F9F9F9] cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      <b
                        className="hover:underline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSale(s)
                          setOpen(true)
                        }}
                      >
                        {s.client_id?.username || "Noma'lum"}
                      </b>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {s.client_id?.phone || 'Mavjud emas'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {typeof s.cashier_id === 'object'
                        ? s.cashier_id.username
                        : 'Mavjud emas'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {typeof s.branch_id === 'object'
                        ? s.branch_id.name
                        : "Noma'lum"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">{s.status}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <BalanceCell value={s.payments?.debt_amount || 0} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <BalanceCell value={s.payments?.total_amount || 0} />
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

      <SaleDetailsDialog
        open={open}
        setOpen={setOpen}
        saleData={selectedSale}
      />
    </div>
  )
}

export default Sales
