import { Button } from '@/components/ui/button'
import {
  useDebtPaymentMutation,
  useGetAllDebtPaymentsQuery,
  useGetOneSupplierQuery,
  useRentProductsQuery,
  useSaleProductsQuery,
  useUpdateDebtPaymentMutation,
} from '@/store/supplier/supplier.api'
import { Loader2, Edit, CreditCard } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Dummy dataset
// const orders = Array.from({ length: 8 }).map((_, i) => ({
//   id: String(i + 1),
//   date: '02.02.2025',
//   number: '123456',
//   total: 2040500,
//   paid: 1500000,
//   debt: 540500,
//   downloadable: i % 2 === 1,
//   image: '/vite.svg',
// }))

function money(n: number, sign: 'neutral' | 'debt' | 'pos' = 'neutral') {
  const text = n.toLocaleString('uz-UZ')
  const cls =
    sign === 'debt'
      ? 'text-rose-600'
      : sign === 'pos'
        ? 'text-emerald-600'
        : 'text-[#18181B]'
  return <span className={cls}>{text}</span>
}

// Form schemas
const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, 'Miqdor kiritish shart')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "To'g'ri miqdor kiriting",
    }),
})

const editPaymentSchema = z.object({
  amount: z
    .string()
    .min(1, 'Miqdor kiritish shart')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "To'g'ri miqdor kiriting",
    }),
})

type PaymentFormValues = z.infer<typeof paymentSchema>
type EditPaymentFormValues = z.infer<typeof editPaymentSchema>

export default function SupplierDetails() {
  const { id = '' } = useParams()
  const { data: supplier } = useGetOneSupplierQuery({ id })
  const { data: getAllDebtPayments } = useGetAllDebtPaymentsQuery({ id })
  const { data: saleProducts } = useSaleProductsQuery({ id })
  const { data: rentProducts } = useRentProductsQuery({ id })

  const [debtPayment] = useDebtPaymentMutation()
  const [updateDebtPayment] = useUpdateDebtPaymentMutation()

  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<{
    id: string
    supplierId: string
  } | null>(null)

  // Form configurations
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: '',
    },
  })

  const editForm = useForm<EditPaymentFormValues>({
    resolver: zodResolver(editPaymentSchema),
    defaultValues: {
      amount: '',
    },
  })

  // Handle payment submission
  const onPaymentSubmit = async (values: PaymentFormValues) => {
    try {
      await debtPayment({
        id,
        amount: Number(values.amount),
      }).unwrap()

      setPaymentModalOpen(false)
      paymentForm.reset()
      console.log('Payment successful!')
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  // Handle edit payment submission
  const onEditSubmit = async (values: EditPaymentFormValues) => {
    if (!selectedPayment) return

    try {
      await updateDebtPayment({
        id: selectedPayment.supplierId,
        payId: selectedPayment.id,
        amount: Number(values.amount),
      }).unwrap()

      setEditModalOpen(false)
      setSelectedPayment(null)
      editForm.reset()
      console.log('Payment updated successfully!')
    } catch (error) {
      console.error('Payment update failed:', error)
    }
  }

  // Handle edit button click
  const handleEditClick = (paymentId: string, supplierId: string) => {
    setSelectedPayment({ id: paymentId, supplierId })
    editForm.reset({ amount: '' }) // Clear previous values
    setEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-[30px] font-semibold text-[#09090B] mb-4">
        Ta'minotchi haqida
      </h1>
      {supplier ? (
        <>
          <div className="border border-[#E4E4E7] rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                <Info title="Ismi" value={supplier?.data.full_name} />
                <Info
                  title="Kategoriya"
                  value={supplier?.data.supply_category
                    .map((c) => c.name)
                    .join(', ')}
                />
                <Info title="Phone Number" value={supplier?.data.phone} />
                <Info
                  title="Mahsulotlar soni"
                  value={String(supplier?.data.total_product_count)}
                />
              </div>
              <div className="md:col-span-1">
                <div className="rounded-md border border-[#E4E4E7] p-5">
                  <div className="text-sm text-[#71717A]">Bizning balans</div>
                  <div className="flex flex-wrap items-center gap-5">
                    <div className="text-[28px] font-semibold text-rose-600">
                      {money(supplier?.data.total_debt || 0, 'debt')}
                    </div>
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                      onClick={() => setPaymentModalOpen(true)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      To'lov qilish
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="w-fit cursor-pointer">
              <TabsTrigger className="cursor-pointer" value="orders">
                Buyurtmalar
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="debtors">
                Qarzdorlar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              {/* Inner Tabs for Sales and Rent Products */}
              <Tabs defaultValue="sales" className="w-full">
                <TabsList className="w-fit cursor-pointer">
                  <TabsTrigger className="cursor-pointer" value="sales">
                    Sotish
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="rent">
                    Ijara
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sales">
                  <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
                    <div className="px-6 py-3 font-medium text-[#18181B] border-b">
                      Sotish mahsulotlari
                    </div>
                    {saleProducts?.data && saleProducts.data.length > 0 ? (
                      <table className="w-full">
                        <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                          <tr>
                            <th className="px-6 py-3 text-left font-medium">
                              Mahsulot nomi
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                              Miqdor
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                              Narx
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                              Sana
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E4E7]">
                          {saleProducts.data.map((product) => (
                            <tr
                              key={product._id}
                              className="hover:bg-[#F9F9F9]"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#18181B]">
                                  {product.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#18181B]">
                                  {product.quantity}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#18181B]">
                                  {money(product.price)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#18181B]">
                                  {new Date(
                                    product.created_at
                                  ).toLocaleDateString('uz-UZ')}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-6 py-8 text-center text-[#71717A]">
                        Sotish mahsulotlari mavjud emas
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rent">
                  <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
                    <div className="px-6 py-3 font-medium text-[#18181B] border-b">
                      Ijara mahsulotlari
                    </div>
                    {rentProducts?.data && rentProducts.data.length > 0 ? (
                      <table className="w-full">
                        <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                          <tr>
                            <th className="px-6 py-3 text-left font-medium">
                              Mahsulot nomi
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                              Miqdor
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                              Kunlik narx
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                              Sana
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E4E7]">
                          {rentProducts.data.map((product) => (
                            <tr
                              key={product._id}
                              className="hover:bg-[#F9F9F9]"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#18181B]">
                                  {product.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#18181B]">
                                  {product.quantity}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#18181B]">
                                  {money(product.daily_price)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#18181B]">
                                  {new Date(
                                    product.created_at
                                  ).toLocaleDateString('uz-UZ')}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-6 py-8 text-center text-[#71717A]">
                        Ijara mahsulotlari mavjud emas
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="debtors">
              <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
                <div className="px-6 py-3 font-medium text-[#18181B] border-b">
                  Qarzdorlik to'lovlari
                </div>
                {getAllDebtPayments?.data &&
                getAllDebtPayments.data.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium">
                          To'lov sanasi
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          To'langan summa
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Umumiy qarz
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Hodim
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Amallar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E4E7]">
                      {getAllDebtPayments.data.map((payment) => (
                        <tr key={payment._id} className="hover:bg-[#F9F9F9]">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#18181B]">
                              {new Date(payment.created_at).toLocaleDateString(
                                'uz-UZ'
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#18181B]">
                              {money(payment.paid_amount, 'pos')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {money(payment.total_debt, 'debt')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#18181B]">
                              {payment.from_staff}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(payment._id, id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Tahrirlash
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center text-[#71717A]">
                    Qarzdorlik to'lovlari mavjud emas
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Loader2 className="animate-spin mx-auto" />
      )}

      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>To'lov qilish</DialogTitle>
            <DialogDescription>
              Ta'minotchiga to'lov qilish uchun miqdorni kiriting
            </DialogDescription>
          </DialogHeader>
          <Form {...paymentForm}>
            <form
              onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
              className="space-y-4"
            >
              <FormField
                control={paymentForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To'lov miqdori</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Miqdorni kiriting..."
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1"
                >
                  Bekor qilish
                </Button>
                <Button type="submit" className="flex-1">
                  To'lov qilish
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>To'lovni tahrirlash</DialogTitle>
            <DialogDescription>
              To'lov miqdorini o'zgartirish uchun yangi qiymat kiriting
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yangi to'lov miqdori</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Yangi miqdorni kiriting..."
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditModalOpen(false)
                    setSelectedPayment(null)
                    editForm.reset()
                  }}
                  className="flex-1"
                >
                  Bekor qilish
                </Button>
                <Button type="submit" className="flex-1">
                  Saqlash
                </Button>
              </div>
            </form>
          </Form>
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
