import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetAllServicesQuery } from '@/store/service/service.api'
import type { ServiceStatus } from '@/store/service/types'
import { TablePagination } from '@/components/TablePagination'
import { useGetBranch } from '@/hooks/use-get-branch'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

export default function Repairs() {
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const branch = useGetBranch()

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useGetAllServicesQuery({
    status: (selectedStatus.trim() as ServiceStatus) || undefined,
    page: currentPage,
    limit: limit,
    branch: branch?._id,
    search,
  })

  const services = servicesData?.data || []

  const handleStatusChange = (value: ServiceStatus | '') => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">Yuklanmoqda...</div>
      </div>
    )
  }

  if (servicesError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-red-500">Xatolik yuz berdi</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Ta'mirlash Xizmatlari
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="Qidirish"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Holatni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Barcha holatlar</SelectItem>
              <SelectItem value="IN_PROGRESS">Jarayonda</SelectItem>
              <SelectItem value="COMPLETED">Tugallangan</SelectItem>
              <SelectItem value="CANCELLED">Bekor qilingan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Mijoz ismi</th>
              <th className="px-6 py-3 text-left font-medium">Telefon raqam</th>
              <th className="px-6 py-3 text-center font-medium">
                Xizmat narxi
              </th>
              <th className="px-6 py-3 text-center font-medium">Holat</th>
              <th className="px-6 py-3 text-center font-medium">
                Qabul sanasi
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Yetkazish sanasi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Xizmatlar topilmadi
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr
                  key={service._id}
                  className={`hover:bg-[#F8F9FA] transition-colors cursor-pointer ${
                    service._id ? 'border-l-4 border-l-transparent' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      {service.client_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {service.client_phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatPrice(service.totalAmount)} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : service.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service.status === 'COMPLETED'
                        ? 'Tugallangan'
                        : service.status === 'IN_PROGRESS'
                          ? 'Jarayonda'
                          : 'Bekor qilingan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(service.received_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(service.delivery_date)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={servicesData?.page_count || 1}
        totalItems={servicesData?.after_filtering_count || 0}
        itemsPerPage={limit || 10}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(newLimit) => setLimit(newLimit)}
      />
    </div>
  )
}
