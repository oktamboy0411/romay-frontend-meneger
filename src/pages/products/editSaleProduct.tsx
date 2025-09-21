import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  useGetSaleProductByIdQuery,
  useUpdateSaleProductMutation,
} from '@/store/product/product.api'
import { toast } from 'sonner'
import { useEffect } from 'react'

// faqat sonni qabul qiladigan schema
const formSchema = z.object({
  product_count: z
    .union([z.string(), z.number()])
    .transform((v) => Number(String(v).replace(/[^0-9]/g, '')))
    .refine((v) => v >= 0, "Miqdor 0 dan kichik bo'lmasligi kerak"),
})

type FormValues = z.infer<typeof formSchema>

export default function UpdateProductCount({
  open,
  setOpen,
  id,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  id: string
}) {
  // productni olish
  const { data, isLoading } = useGetSaleProductByIdQuery(id)
  const [updateProduct] = useUpdateSaleProductMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_count: 0,
    },
  })

  // kelgan product_countni formga set qilish
  useEffect(() => {
    if (data?.data) {
      form.setValue('product_count', data.data.product_count || 0)
    }
  }, [data])

  const product = data?.data?.product // BaseProduct
  const productCount = data?.data?.product_count

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProduct({
        id,
        body: {
          product_count: values.product_count,
          category_id: product?.category_id?._id || '',
        },
      }).unwrap()

      toast.success('Mahsulot soni yangilandi')
      setOpen(false)
    } catch (error) {
      toast.error('Xatolik! Mahsulot sonini yangilashda xatolik yuz berdi.')
      console.log('Xato', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mahsulot sonini yangilash</DialogTitle>
          <DialogDescription>
            Bu yerda faqat mahsulot miqdorini yangilashingiz mumkin
          </DialogDescription>
        </DialogHeader>

        {isLoading && <p>Yuklanmoqda...</p>}

        {product && (
          <div className="space-y-2 mb-4">
            <p>
              <strong>Nomi:</strong> {product.name}
            </p>
            <p>
              <strong>Kategoriya:</strong> {product.category_id?.name}
            </p>
            <p>
              <strong>Barcode:</strong> {product.barcode}
            </p>
            <p>
              <strong>Hozirgi soni:</strong> {productCount}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yangi miqdor</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Saqlash
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
