import { Link } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableSkeleton } from '../../components/ui/table-skeleton'
import { AlertCircle, Search } from 'lucide-react'
import { useState } from 'react'
import AddClientDialog from './addAsistantDialog'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { Input } from '@/components/ui/input'
import { PaginationComponent } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { useGetAssistantsQuery } from '@/store/asistant/asistant.api'
import type { Master } from '@/store/asistant/types'

function Assistants() {
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
    data: assistantsResponse,
    isLoading,
    isError,
  } = useGetAssistantsQuery(queryParams)

  const {
    data: { data: branchesData = [] } = {},
    isLoading: isLoadingBranches,
    isError: isErrorBranches,
  } = useGetAllBranchesQuery({})

  // ⚡ API’dan kelgan ma’lumot
  const assistantsData = assistantsResponse?.data || []
  const totalPages = assistantsResponse?.pagination?.total_pages || 1

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
                <th className="px-6 py-3 text-left font-medium">Filial</th>
                <th className="px-6 py-3 text-left font-medium">
                  Umumiy sotuv
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {assistantsData.map((a: Master) => (
                <tr key={a._id} className="hover:bg-[#F9F9F9] cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/assistants/${a._id}`}
                      className="text-sm font-medium text-[#18181B] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {a.username}
                    </Link>
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
                    <div className="text-sm text-[#18181B]">{a.branch_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {a.total_sales?.amount} {a.total_sales?.currency}
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
        totalPages={totalPages}
      />

      <AddClientDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Assistants
