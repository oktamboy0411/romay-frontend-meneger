import { Button } from '@/components/ui/button'
import { SetLocation } from '@/hooks/setLocation'
import { useGetOneClientQuery } from '@/store/clients/clients.api'
import {
  useGetAllSalesQuery,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} from '@/store/sales-client/salesApi'
import { useGetAllProductsQuery } from '@/store/product-client/product.api'
import { format } from 'date-fns'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Plus,
  Minus,
  AlertTriangle,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'sonner'
import { useHandleRequest } from '@/hooks/use-handle-request'
import type { Sale } from '@/store/sales-client/types'

// Fixed money function with proper null checks
function money(
  n: number | undefined | null,
  sign: 'neutral' | 'debt' | 'pos' = 'neutral'
) {
  // Handle null, undefined, or invalid number cases
  if (n === null || n === undefined || isNaN(n)) {
    n = 0
  }

  const text = n.toLocaleString('uz-UZ')
  const cls =
    sign === 'debt'
      ? 'text-rose-600'
      : sign === 'pos'
        ? 'text-emerald-600'
        : 'text-[#18181B]'
  return <span className={cls}>{text}</span>
}

type UpdateSaleSchema = {
  client_id: string
  sales_assistant_id: string
  status: string
  paid_amount: number
  items: Array<{
    product_id: string
    quantity: number
  }>
}

const STATUS_OPTIONS = [
  { value: 'IN_PROGRESS', label: 'Jarayonda' },
  { value: 'COMPLETED', label: 'Tugallangan' },
  { value: 'CANCELLED', label: 'Bekor qilingan' },
]

export default function ClientDetails() {
  const id = useParams<{ id: string }>().id
  const { data } = useGetOneClientQuery(id as string, { skip: !id })
  const { data: client_items, refetch } = useGetAllSalesQuery(
    { client_id: id as string },
    { skip: !id }
  )
  const { data: products } = useGetAllProductsQuery(
    { branch: data?.data?.branch_id._id as string },
    { skip: !id }
  )

  const [updateSale, { isLoading: isUpdating }] = useUpdateSaleMutation()
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation()
  const handleRequest = useHandleRequest()
  const [openPopover, setOpenPopover] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [saleToDelete, setSaleToDelete] = useState<{
    id: string
    orderNumber: string
  } | null>(null)
  const [editData, setEditData] = useState<UpdateSaleSchema>({
    client_id: '',
    sales_assistant_id: '',
    status: '',
    paid_amount: 0,
    items: [],
  })
  const [displayData, setDisplayData] = useState({
    clientUsername: '',
    salesAssistantUsername: '',
  })

  const items =
    client_items?.data
      ?.map((item) => item.items?.map((item) => item))
      ?.flat() || []

  console.log('Items:', items)
  console.log('Products:', products)

  // Helper function to get product by ID
  const getProductById = (productId: string) => {
    return products?.data?.find((product) => product._id === productId)
  }

  // Regex to handle number input without leading zeros
  const handlePaidAmountChange = (value: string) => {
    // Remove any non-digit characters
    let cleanValue = value.replace(/[^\d]/g, '')

    // Remove leading zeros but keep at least one digit
    cleanValue = cleanValue.replace(/^0+/, '') || '0'

    const numericValue = parseInt(cleanValue, 10) || 0

    setEditData((prev) => ({
      ...prev,
      paid_amount: numericValue,
    }))
  }

  const openEditModal = (sale: Sale) => {
    setSelectedSale(sale)
    const paidAmount = sale?.payments?.paid_amount || 0

    setEditData({
      client_id: sale?.client_id?._id || '',
      sales_assistant_id: sale?.sales_assistant_id?._id || '',
      status: sale?.status || '',
      paid_amount: paidAmount,
      items:
        sale?.items?.map((item) => ({
          product_id: item?.product_id?._id || '',
          quantity: item?.quantity || 1,
        })) || [],
    })

    // Set display data for usernames
    setDisplayData({
      clientUsername: sale?.client_id?.username || 'N/A',
      salesAssistantUsername: sale?.sales_assistant_id?.username || 'N/A',
    })

    setIsEditModalOpen(true)
    setOpenPopover(null)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedSale(null)
    setEditData({
      client_id: '',
      sales_assistant_id: '',
      status: '',
      paid_amount: 0,
      items: [],
    })
    setDisplayData({
      clientUsername: '',
      salesAssistantUsername: '',
    })
  }

  const openDeleteModal = (saleId: string, orderNumber: string) => {
    setSaleToDelete({ id: saleId, orderNumber })
    setIsDeleteModalOpen(true)
    setOpenPopover(null)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSaleToDelete(null)
  }

  const handleSaveChanges = async () => {
    if (!selectedSale) return

    // Validation
    if (
      !editData.client_id ||
      !editData.sales_assistant_id ||
      !editData.status
    ) {
      toast.error("Barcha majburiy maydonlarni to'ldiring")
      return
    }

    if (editData.paid_amount < 0) {
      toast.error("To'langan summa manfiy bo'lmasligi kerak")
      return
    }

    if (editData.items.length === 0) {
      toast.error("Kamida bitta mahsulot bo'lishi kerak")
      return
    }

    // Check if all items have valid data
    const hasInvalidItems = editData.items.some(
      (item) => !item.product_id || item.quantity <= 0
    )

    if (hasInvalidItems) {
      toast.error("Barcha mahsulotlar uchun to'g'ri ma'lumot kiriting")
      return
    }

    const updatePayload: UpdateSaleSchema = {
      client_id: editData.client_id,
      sales_assistant_id: editData.sales_assistant_id,
      status: editData.status,
      paid_amount: editData.paid_amount,
      items: editData.items,
    }

    await handleRequest({
      request: () =>
        updateSale({ id: selectedSale._id, data: updatePayload }).unwrap(),
      onSuccess: () => {
        toast.success('Sotuv muvaffaqiyatli yangilandi!')
        refetch()
        closeEditModal()
      },
      onError: (err) => {
        toast.error(err?.message || err?.data?.message || 'Xatolik yuz berdi')
      },
    })
  }

  const confirmDeleteSale = async () => {
    if (!saleToDelete) return

    await handleRequest({
      request: () => deleteSale(saleToDelete.id).unwrap(),
      onSuccess: () => {
        toast.success("Sotuv muvaffaqiyatli o'chirildi!")
        refetch()
      },
      onError: (err) => {
        toast.error(err?.msg || err?.data?.error?.msg || 'Xatolik yuz berdi')
      },
      onFinally: closeDeleteModal,
    })
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return

    setEditData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, quantity } : item
      ),
    }))
  }

  const updateItemProduct = (index: number, productId: string) => {
    setEditData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, product_id: productId } : item
      ),
    }))
  }

  const removeItem = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const addNewItem = () => {
    setEditData((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1 }],
    }))
  }

  SetLocation('Mijozlar > Mijoz haqida')

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-[30px] font-semibold text-[#09090B] mb-4">
        Mijoz haqida
      </h1>
      <div className="border border-[#E4E4E7] rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info title="Ismi" value={data?.data?.username || ''} />
            <Info title="segmenti" value={data?.data?.customer_tier || ''} />
            <Info title="Filial" value={data?.data?.branch_id?.name || ''} />
            <Info title="Phone Number" value={data?.data?.phone || ''} />
            <Info title="Kasbi" value={data?.data?.profession || ''} />
            <Info title="Mijoz Manzili" value={data?.data?.address || ''} />
          </div>
          <div className="md:col-span-1">
            <div className="rounded-md border border-[#E4E4E7] p-5">
              <div className="text-sm text-[#71717A]">Balans</div>
              <div className="text-[28px] font-semibold text-rose-600">
                {money(data?.data?.debt?.amount, 'debt')} so'm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <div className="px-6 py-3 font-medium text-[#18181B] border-b">
          Buyurtmalari
        </div>
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">
                Buyurtma sanasi
              </th>
              <th className="px-6 py-3 text-left font-medium">
                Buyurtma raqami
              </th>
              <th className="px-6 py-3 text-left font-medium">
                Umumiy to'lov summasi
              </th>
              <th className="px-6 py-3 text-left font-medium">
                To'lov qilingan summa
              </th>
              <th className="px-6 py-3 text-left font-medium">Qarzdorlik</th>
              <th className="px-6 py-3 text-center font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {client_items?.data?.map((o) => (
              <tr key={o._id} className="hover:bg-[#F9F9F9]">
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">
                    {o?.created_at
                      ? format(new Date(o.created_at), 'dd.MM.yyyy')
                      : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">
                    {o?.payments?._id || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">
                    {money(o?.payments?.total_amount)} so'm
                  </div>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">
                    {money(o?.payments?.paid_amount)} so'm
                  </div>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="text-sm">
                    {money(o?.payments?.debt_amount, 'debt')} so'm
                  </div>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <Popover
                    open={openPopover === o._id}
                    onOpenChange={(open) => setOpenPopover(open ? o._id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="end">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => openEditModal(o)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Yangilash
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() =>
                            openDeleteModal(o._id, o?.payments?._id || '')
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          O'chirish
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Buyurtmalar topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Sale Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeEditModal()
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Sotuvni tahrirlash</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_username">Mijoz</Label>
                <Input
                  id="client_username"
                  value={displayData.clientUsername}
                  placeholder="Mijoz nomi"
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales_assistant_username">
                  Sotuv assistenti
                </Label>
                <Input
                  id="sales_assistant_username"
                  value={displayData.salesAssistantUsername}
                  placeholder="Sotuv assistenti nomi"
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value) =>
                    setEditData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid_amount">To'langan summa</Label>
                <Input
                  id="paid_amount"
                  type="text"
                  value={editData.paid_amount}
                  onChange={(e) => handlePaidAmountChange(e.target.value)}
                  placeholder="To'langan summa"
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Mahsulotlar</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Mahsulot qo'shish
                </Button>
              </div>

              <div className="space-y-3">
                {editData.items.map((item, index) => {
                  const product = getProductById(item.product_id)
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Mahsulot</Label>
                        <Select
                          value={item.product_id}
                          onValueChange={(value) =>
                            updateItemProduct(index, value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Mahsulot tanlang">
                              {product && (
                                <div className="flex items-center gap-2">
                                  {product.product?.images?.[0] && (
                                    <img
                                      src={product.product.images[0]}
                                      alt={product.product.name}
                                      className="w-6 h-6 rounded object-cover"
                                      onError={(e) => {
                                        const img = e.target as HTMLImageElement
                                        img.style.display = 'none'
                                      }}
                                    />
                                  )}
                                  <span className="truncate">
                                    {product.product?.name || 'N/A'}
                                  </span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {products?.data?.map((productItem) => (
                              <>
                                {productItem.product_count ? (
                                  <SelectItem
                                    key={productItem._id}
                                    value={productItem._id}
                                  >
                                    <div className="flex items-center gap-2">
                                      {productItem.product?.images?.[0] && (
                                        <img
                                          src={productItem.product.images[0]}
                                          alt={productItem.product.name}
                                          className="w-8 h-8 rounded object-cover"
                                          onError={(e) => {
                                            const img =
                                              e.target as HTMLImageElement
                                            img.style.display = 'none'
                                          }}
                                        />
                                      )}
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {productItem.product?.name || 'N/A'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {money(productItem.product?.price)}{' '}
                                          {productItem.product?.currency ||
                                            "so'm"}
                                        </span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ) : (
                                  ''
                                )}
                              </>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-32">
                        <Label className="text-sm font-medium">Miqdor</Label>
                        <div className="flex items-center mt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateItemQuantity(index, item.quantity - 1)
                            }
                            className="h-8 w-8 p-0"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemQuantity(
                                index,
                                Number(e.target.value) || 1
                              )
                            }
                            className="h-8 w-16 mx-1 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateItemQuantity(index, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        disabled={editData.items.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>

              {editData.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Mahsulotlar yo'q</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addNewItem}
                    className="mt-2"
                  >
                    Birinchi mahsulotni qo'shing
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={closeEditModal}>
                Bekor qilish
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saqlanmoqda...' : "O'zgarishlarni saqlash"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Sotuvni o'chirish
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Rostan ham o'chirmoqchimisiz?
              </p>
              <p className="text-sm text-gray-600">
                Buyurtma raqami:{' '}
                <span className="font-medium">{saleToDelete?.orderNumber}</span>
              </p>
              <p className="text-sm text-red-600 mt-2">
                Bu amal bekor qilib bo'lmaydi.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={closeDeleteModal}>
                Yo'q, bekor qilish
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteSale}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-0">
      <div className="text-sm text-[#71717A]">{title}</div>
      <div className="text-[16px] font-semibold text-[#18181B]">{value}</div>
    </div>
  )
}
