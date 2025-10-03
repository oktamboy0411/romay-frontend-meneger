import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'
import {
  useGetRentProductByIdQuery,
  useUpdateRentProductMutation,
} from '@/store/product/product.api'
import type { UpdateProductRequest, RentProduct } from '@/store/product/types'
import { toast } from 'sonner'

type FormValues = {
  product_active_count: number | string
  product_rent_price: number | string
}
const numberFormatter = new Intl.NumberFormat('uz-UZ')
export default function UpdateRentProduct({
  open,
  setOpen,
  id,
  refetch,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  id: string | undefined
  refetch: () => void
}) {
  const [updateProduct] = useUpdateRentProductMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: productData, isFetching } = useGetRentProductByIdQuery(id!, {
    skip: !id,
  })

  const form = useForm<FormValues>({
    defaultValues: {
      product_active_count: 0,
      product_rent_price: 0,
    },
  })

  // Ma’lumot kelganda formni to‘ldirish
  useEffect(() => {
    if (productData?.data) {
      const p: RentProduct = productData.data
      form.reset({
        product_active_count: p.product_active_count ?? 0,
        product_rent_price: p.product_rent_price ?? 0,
      })
    }
  }, [productData, form])

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const body: UpdateProductRequest = {
        product_count: Number(values.product_active_count),
        product_rent_price: Number(values.product_rent_price),
      }

      await updateProduct({ id: id!, body }).unwrap()
      setOpen(false)
      toast.success('Ijaraga mahsulot muvaffaqiyatli yangilandi')
      refetch()
    } catch (error) {
      toast.error('Ijaraga mahsulotni yangilashda xatolik yuz berdi.')
      console.log('xato', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // RentProduct typeni oldik
  const p: RentProduct | undefined = productData?.data

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ijaraga mahsulotni yangilash</DialogTitle>
          <DialogDescription>
            Faqat miqdor va ijara narxini o‘zgartirishingiz mumkin
          </DialogDescription>
        </DialogHeader>
        {isFetching ? (
          <p className="text-center text-sm text-gray-500">Yuklanmoqda...</p>
        ) : (
          p && (
            <div className="space-y-4">
              {/* ——— Faqat ko‘rsatiladigan ma’lumotlar ——— */}
              <div>
                <p className="text-sm text-gray-500">Kategoriya:</p>
                <p className="font-medium">{p.product.category_id.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Mahsulot nomi:</p>
                <p className="font-medium">{p.product.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Bar-kod:</p>
                <p className="font-medium">{p.product.barcode}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Izoh:</p>
                <p className="font-medium">{p.product.description}</p>
              </div>

              {/* Rasmlar */}
              {p.product.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {p.product.images.map((img) => (
                    <img
                      key={img}
                      src={img}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* ——— Faqat form bo‘ladigan qismlar ——— */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Mahsulot miqdori */}
                  <FormField
                    control={form.control}
                    name="product_active_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mahsulot miqdori</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10"
                            type="text"
                            inputMode="numeric"
                            value={numberFormatter.format(
                              Number(field.value) || 0
                            )}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, '')
                              field.onChange(raw)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ijara narxi */}
                  <FormField
                    control={form.control}
                    name="product_rent_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ijara narxi</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10"
                            type="text"
                            inputMode="numeric"
                            value={numberFormatter.format(
                              Number(field.value) || 0
                            )}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, '')
                              field.onChange(raw)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Yangilanmoqda...' : 'Yangilash'}
                  </Button>
                </form>
              </Form>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}
