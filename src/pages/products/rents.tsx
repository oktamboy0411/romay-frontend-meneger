import { Search, Plus, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  useDeleteRentProductMutation,
  useGetAllRentProductsQuery,
} from '@/store/product/product.api'
import type { RentProduct } from '@/store/product/types'
import { Button } from '@/components/ui/button'
import CreateRentProduct from './addRentProduct'
import { useGetBranch } from '@/hooks/use-get-branch'
import EditAndDeletePopover from '@/components/editAndDeletePopover/edit-and-delete-popover'
import { toast } from 'sonner'
import { TablePagination } from '@/components/TablePagination'
import UpdateRentProduct from './editRentProduct'
import ViewRentProductModal from './viewRentProduct'

function RentPage() {
  const [page, setPage] = useState(1)
  const branch = useGetBranch()
  const [openPopover, setOpenPopover] = useState<string>('')
  const [deleteRentProduct] = useDeleteRentProductMutation()
  const [selectedId, setSelectedID] = useState<string>('')
  const [limit, setLimit] = useState(10)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: getAllRentsData, refetch } = useGetAllRentProductsQuery({
    page,
    limit,
    branch: branch?._id,
    search: searchTerm,
  })

  const formatUzs = (value: string) => {
    const num = Number(String(value).replace(/[^0-9]/g, '')) || 0
    const formattedNumber = num.toLocaleString('uz-UZ')
    return `${formattedNumber} UZS`
  }

  const [view, setView] = useState<'list' | 'grid'>('list')
  const [openAdd, setOpenAdd] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<RentProduct | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: RentProduct) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteRentProduct = async (id: string) => {
    try {
      await deleteRentProduct(id).unwrap()
      toast.success('Mahsulot muvaffaqiyatli o‘chirildi.')
    } catch (error) {
      toast.error('Xatolik! Mahsulotni o‘chirishda xatolik yuz berdi.')
      console.log('Xato', error)
    }
  }

  const totalPages = getAllRentsData?.page_count || 1
  const totalItems = getAllRentsData?.after_filtering_count || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="mahsulotni izlash"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpenAdd(true)}>
            <Plus className="mr-2 h-4 w-4" /> Mahsulot qo'shish
          </Button>
          <div className="ml-2 flex rounded-md border border-[#E4E4E7] overflow-hidden">
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Photo</th>
                <th className="px-6 py-3 text-left font-medium">Nomi</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-center font-medium">Bar-kod</th>
                <th className="px-6 py-3 text-center font-medium">
                  Rent Price
                </th>
                <th className="px-6 py-3 text-center font-medium">soni</th>
                <th className="px-6 py-3 text-center font-medium">
                  Ijara narxi
                </th>
                <th className="px-6 py-3 text-center font-medium">Ammallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {getAllRentsData?.data?.map((rent) => (
                <tr key={rent._id} className="hover:bg-[#F9F9F9]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
                      {rent.product.images?.[0] ? (
                        <img
                          src={rent.product.images[0]}
                          alt={rent.product.name}
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">📱</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div
                      onClick={() => handleProductClick(rent)}
                      className="text-sm font-medium text-[#18181B] underline cursor-pointer"
                    >
                      {rent.product.name || "Noma'lum"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    {rent.product.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                      {rent.product.category_id?.name || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-[#E4E4E7] text-[#18181B]">
                      {rent.product.barcode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {formatUzs((rent.product_rent_price ?? '').toString())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                      {rent.product_active_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatUzs((rent.product_rent_price || 0).toString())}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <EditAndDeletePopover
                      id={rent._id}
                      openPopover={openPopover}
                      setOpenPopover={setOpenPopover}
                      onClickUpdate={() => {
                        setSelectedID(rent._id)
                        setOpenUpdate(true)
                      }}
                      onClickDelete={() => handleDeleteRentProduct(rent._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {getAllRentsData?.data?.map((rent, idx) => (
            <Card
              key={`${rent._id}-${idx}`}
              className="overflow-hidden border border-[#E4E4E7] rounded-xl"
            >
              <CardContent className="p-3">
                <div className="w-full h-36 flex items-center justify-center">
                  <img
                    src={
                      rent.product.images?.[0] ||
                      'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0='
                    }
                    alt={rent.product.name}
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                    {rent.product.category_id?.name || '—'}
                  </span>
                  <span
                    className={
                      ' inline-flex items-center border px-2.5 py-1 text-xs rounded-md ' +
                      (rent.product.status === 'active'
                        ? ' text-green-700 bg-green-50 border-green-100 *:'
                        : ' text-red-700 bg-red-50 border-red-100 ')
                    }
                  >
                    {rent.product.status || '—'}
                  </span>
                </div>
                <div className="mt-2 text-base font-semibold leading-5 text-[#18181B] line-clamp-2 flex items-center justify-between">
                  <span>{rent.product.name}</span>
                  <span>
                    {rent.product_active_count}/{rent.product_total_count}
                  </span>
                </div>
                <div className="text-sm text-[#71717A] mt-1">
                  {rent.product.description || rent.product.barcode || '—'}
                </div>
                <div className="mt-2 text-xl font-bold text-[#09090B]">
                  {formatUzs((rent.product_rent_price || 0).toString())}
                </div>
                <div className="mt-2">
                  <div className="flex gap-2 items-center justify-between">
                    <Button
                      onClick={() => handleProductClick(rent)}
                      variant="outline"
                    >
                      view
                    </Button>
                    <EditAndDeletePopover
                      id={rent._id}
                      openPopover={openPopover}
                      setOpenPopover={setOpenPopover}
                      onClickUpdate={() => {
                        setSelectedID(rent._id)
                        setOpenUpdate(true)
                      }}
                      onClickDelete={() => handleDeleteRentProduct(rent._id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ViewRentProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />

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

      <UpdateRentProduct
        open={openUpdate}
        setOpen={setOpenUpdate}
        id={selectedId}
        refetch={() => refetch()}
      />

      <CreateRentProduct
        open={openAdd}
        setOpen={setOpenAdd}
        refetch={() => refetch()}
      />
    </div>
  )
}

export default RentPage
