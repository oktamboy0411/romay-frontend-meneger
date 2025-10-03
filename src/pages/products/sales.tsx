import { Search, Plus, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  useDeleteSaleProductMutation,
  useGetAllSaleProductsQuery,
} from '@/store/product/product.api'
import type { Product } from '@/store/product/types'
import { Button } from '@/components/ui/button'
import AddSaleProduct from './addSaleProduct'
import { useGetBranch } from '@/hooks/use-get-branch'
import ViewSaleProductModal from './viewSaleProduct'
import UpdateSaleProduct from './editSaleProduct'
import { toast } from 'sonner'
import EditAndDeletePopover from '@/components/editAndDeletePopover/edit-and-delete-popover'
import { useHandleError } from '@/hooks/use-handle-error'
import { TablePagination } from '@/components/TablePagination'
import { truncateText } from '@/utils/truncateText'
import Tooltip from '@/components/Tooltip'
import GetProductStatus from '@/utils/productStatus'

export default function SalePage() {
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedId, setSelectedID] = useState<string>('')
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [openPopover, setOpenPopover] = useState<string>('')
  const msgError = useHandleError()

  const branch = useGetBranch()
  const { data: getAllProductsData, refetch: refetchSaleProducts } =
    useGetAllSaleProductsQuery({
      page,
      limit,
      branch: (typeof branch === 'string' ? branch : branch?._id) || '',
      search: searchTerm,
    })
  const [deleteSaleProduct] = useDeleteSaleProductMutation()

  const formatUzs = (value: string) => {
    const num = Number(String(value).replace(/[^0-9]/g, '')) || 0
    const formattedNumber = num.toLocaleString('uz-UZ')
    return `${formattedNumber} UZS`
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteSaleProduct(productId).unwrap()
      toast.success('Muvaffaqiyat! Mahsulot muvaffaqiyatli o‘chirildi.')
    } catch (error) {
      msgError(error)
    }
  }

  const totalPages = getAllProductsData?.page_count || 1
  const totalItems = getAllProductsData?.after_filtering_count || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
                <th className="px-6 py-3 text-left font-medium">photo</th>
                <th className="px-6 py-3 text-left font-medium">nomi</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-center font-medium">Miqdori</th>
                <th className="px-6 py-3 text-center font-medium">Bar-kod</th>
                <th className="px-6 py-3 text-center font-medium">Narxi</th>
                <th className="px-6 py-3 text-center font-medium">Boshqaruv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {getAllProductsData?.data?.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => handleProductClick(item)}
                  className="hover:bg-[#F9F9F9] cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">📱</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Tooltip
                      title={item.product.name}
                      position={['top', 'left']}
                    >
                      <span className="text-sm text-[#18181B]">
                        {truncateText(item.product.name, 25)}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <GetProductStatus quantity={item.product_count} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                      {item.product.category_id?.name || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#09090B] hover:bg-gray-100"
                    >
                      {item.product_count || 0}
                    </Button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-[#E4E4E7] text-[#18181B]">
                      {item.product.barcode}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatUzs((item.product.price ?? '').toString())}
                    </div>
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-4 whitespace-nowrap text-center"
                  >
                    <EditAndDeletePopover
                      id={item._id}
                      openPopover={openPopover}
                      setOpenPopover={setOpenPopover}
                      onClickUpdate={() => {
                        setSelectedID(item._id)
                        setOpenUpdate(true)
                      }}
                      onClickDelete={async () => {
                        await handleDeleteProduct(item._id)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {getAllProductsData?.data?.map((item, idx) => (
            <Card
              key={`${item._id}-${idx}`}
              className="overflow-hidden border border-[#E4E4E7] rounded-xl"
            >
              <CardContent className="p-3">
                <div className="w-full h-36 flex items-center justify-center">
                  <img
                    src={
                      item.product.images?.[0] ||
                      'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0='
                    }
                    alt={item.product.name}
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                    {item.product.category_id?.name || '—'}
                  </span>
                  <span
                    className={
                      ' inline-flex items-center border px-2.5 py-1 text-xs rounded-md ' +
                      (item.product.status === 'active'
                        ? ' text-green-700 bg-green-50 border-green-100 *:'
                        : ' text-red-700 bg-red-50 border-red-100 ')
                    }
                  >
                    {item.product.status || '—'}
                  </span>
                </div>
                <div className="mt-2 text-base font-semibold leading-5 text-[#18181B] line-clamp-2 flex items-center justify-between">
                  <span>{item.product.name}</span>
                  <span>x{item.product_count}</span>
                </div>
                <div className="text-sm text-[#71717A] mt-1">
                  {item.product.barcode || '—'}
                </div>
                <div className="mt-2 text-xl font-bold text-[#09090B]">
                  {formatUzs((item.product.price ?? '').toString())}
                </div>
                <div className="mt-2 ">
                  <div className="flex gap-2 items-center justify-between">
                    <Button
                      onClick={() => handleProductClick(item)}
                      variant="outline"
                    >
                      view
                    </Button>
                    <EditAndDeletePopover
                      id={item._id}
                      openPopover={openPopover}
                      setOpenPopover={setOpenPopover}
                      onClickUpdate={() => {
                        setSelectedID(item._id)
                        setOpenUpdate(true)
                      }}
                      onClickDelete={async () => {
                        await handleDeleteProduct(item._id)
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

      <ViewSaleProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct ? selectedProduct : null}
      />

      <AddSaleProduct
        open={openAdd}
        setOpen={setOpenAdd}
        refetch={() => refetchSaleProducts()}
      />
      <UpdateSaleProduct
        open={openUpdate}
        setOpen={setOpenUpdate}
        id={selectedId}
      />
    </div>
  )
}
