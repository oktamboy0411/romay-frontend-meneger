import { Search, Plus, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PaginationComponent } from '@/components/pagination'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useGetAllRentProductsQuery } from '@/store/product/product.api'
import type { RentProduct } from '@/store/product/types'
import { Button } from '@/components/ui/button'
import { ProductDetailsModal } from '@/components/product-details-modal'
import CreateRentProduct from './addRentProduct'
import { useGetBranch } from '@/hooks/use-get-branch'

function RentPage() {
  const [page, setPage] = useState(1)
  const branch = useGetBranch()
  console.log(branch?._id)

  const { data: getAllRentsData } = useGetAllRentProductsQuery({
    branch2: '123',
    // branch: branch,
  })

  return ''

  console.log('getAllRentsData', getAllRentsData)

  const formatUsd = (value: string) => {
    const num = Number(String(value).replace(/[^0-9]/g, '')) || 0
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  const [view, setView] = useState<'list' | 'grid'>('list')
  const [openAdd, setOpenAdd] = useState(false)
  // const [products, setProducts] = useState<RentProduct[]>(dummyProducts)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9 w-[300px]" placeholder="mahsulotni izlash" />
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
                <th className="px-6 py-3 text-center font-medium">Soni</th>
                <th className="px-6 py-3 text-center font-medium">
                  Ijara narxi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {getAllRentsData?.data?.map((rent) => (
                <tr
                  key={rent._id}
                  className="hover:bg-[#F9F9F9]"
                  onClick={() => handleProductClick(rent)}
                >
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
                    <div className="text-sm font-medium text-[#18181B]">
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
                    {rent.product_rent_price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                      {rent.product_active_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatUsd((rent.product_rent_price || 0).toString())}
                    </div>
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
              onClick={() => handleProductClick(rent)}
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
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                    {rent.product.category_id?.name || '—'}
                  </span>
                </div>
                <div className="mt-2 text-base font-semibold leading-5 text-[#18181B] line-clamp-2">
                  {rent.product.name}
                </div>
                <div className="text-sm text-[#71717A] mt-1">
                  {rent.product.description || rent.product.barcode || '—'}
                </div>
                <div className="mt-2 text-xl font-bold text-[#09090B]">
                  {formatUsd((rent.product_rent_price || 0).toString())}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={
          selectedProduct
            ? {
                _id: selectedProduct._id,
                product: selectedProduct.product,
                product_count: selectedProduct.product_active_count,
                branch: selectedProduct.branch._id,
              }
            : null
        }
      />

      <PaginationComponent
        currentPage={page}
        totalPages={getAllRentsData?.page_count ?? 1}
        onPageChange={(p) => setPage(p)}
      />

      <CreateRentProduct open={openAdd} setOpen={setOpenAdd} />
    </div>
  )
}

export default RentPage
