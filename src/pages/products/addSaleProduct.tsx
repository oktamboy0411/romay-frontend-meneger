import { FileUpload } from '@/components/ui/file-upload'
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
import { useCreateSaleProductMutation } from '@/store/product/product.api'
import type { CreateProductRequest } from '@/store/product/types'
import { useGetAllCategoryQuery } from '@/store/category/category.api'
import { useUploadFileMutation } from '@/store/upload/upload.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect } from 'react'
import { useGetSaleProductDetailByBarcodeQuery } from '@/store/product-barcode/product-barcode'
import { toast } from 'sonner'

export default function AddSaleProduct({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { data: getAllCategoriesData } = useGetAllCategoryQuery({})
  const [createProduct] = useCreateSaleProductMutation()
  const [uploadFile] = useUploadFileMutation()
  const branch = useGetBranch()

  const formSchema = z.object({
    name: z.string().min(2, 'Kamida 2 ta belgi kiriting'),
    category: z.string().min(1, 'Kategoriya majburiy'),
    sku: z.string().min(4, 'Bar-kod kamida 4 ta belgi'),
    price: z
      .union([z.string(), z.number()])
      .transform((v) => Number(String(v).replace(/[^0-9.]/g, '')))
      .refine((v) => v > 0, "Narxi 0 dan katta bo'lishi kerak"),
    minQty: z
      .union([z.string(), z.number()])
      .transform((v) => Number(String(v).replace(/[^0-9]/g, ''))),
    image: z.any().optional(),
    subtitle: z.string().optional(),
    currency: z.string().default('UZS'),
    status: z.string().default('Active'),
    note: z.string().min(1, 'Izoh majburiy'),
  })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: '',
      name: '',
      category: '',
      price: 0,
      minQty: 0,
      image: undefined,
      subtitle: '',
      currency: 'UZS',
      status: 'Active',
      note: '',
    },
  })

  const sku = form.watch('sku')

  // barcode bo‘yicha ma’lumot olish
  const { data: saleProductData } = useGetSaleProductDetailByBarcodeQuery(sku, {
    skip: !sku || sku.length < 4,
  })

  // barcode o‘zgarganda formni tozalash va yangi kelgan malumotni joylash
  useEffect(() => {
    if (saleProductData?.data) {
      const product = saleProductData.data
      form.setValue('name', product.name || '')
      form.setValue('category', product.category_id || '')
      form.setValue('price', product.price || 0)
      form.setValue('note', product.description || '')
      form.setValue('currency', product.currency || 'UZS')
      form.setValue('status', product.status || 'Active')
    } else {
      // agar yo‘q bo‘lsa boshqa maydonlarni tozalab qo‘yish
      form.reset({
        sku: sku || '',
        name: '',
        category: '',
        price: 0,
        minQty: 0,
        image: undefined,
        subtitle: '',
        currency: 'UZS',
        status: 'Active',
        note: '',
      })
    }
  }, [saleProductData, sku])

  interface RTKError {
    data: {
      error?: {
        msg?: string
      }
    }
    status?: number
  }

  const onSubmit = async (values: FormValues) => {
    try {
      let imageUrl = ''
      if (values.image && values.image instanceof File) {
        const uploadResponse = await uploadFile(values.image).unwrap()
        imageUrl = uploadResponse.file_path
      }

      const productPayload: CreateProductRequest = {
        branch: branch?._id || '',
        name: values.name,
        description: values.note || 'Mahsulot tavsifi kiritilmagan',
        category_id: values.category,
        price: Number(values.price),
        currency: values.currency,
        images: imageUrl ? [imageUrl] : [],
        barcode: values.sku,
        attributes: [],
        product_count: Number(values.minQty) || 0,
      }

      await createProduct(productPayload).unwrap()

      setOpen(false)
      form.reset()
      toast.success('Mahsulot muvaffaqiyatli yaratildi')
    } catch (error) {
      const err = error as RTKError
      toast.error(
        err?.data?.error?.msg || 'Mahsulotni yaratishda xatolik yuz berdi'
      )
    }
  }

  const isFormDisabled = !sku || sku.length < 4

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mahsulot qo'shish</DialogTitle>
          <DialogDescription>Bu yerda mahsulot qo'sha olasiz</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* BARCODE */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bar-kod</FormLabel>
                  <FormControl>
                    <Input placeholder="020202020202" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <fieldset disabled={isFormDisabled} className="space-y-4">
              {/* IMAGE */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Mahsulot rasmi</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={(field.value as File | null) ?? null}
                        onChange={(file) => field.onChange(file)}
                        accept="image/*,application/pdf"
                        maxSizeMB={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CATEGORY */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoriya</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kategoriya tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAllCategoriesData?.data?.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mahsulot nomi</FormLabel>
                    <FormControl>
                      <Input placeholder="Mahsulot nomi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PRICE */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Narxi</FormLabel>
                    <FormControl>
                      <Input placeholder="10" inputMode="decimal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MIN QTY */}
              <FormField
                control={form.control}
                name="minQty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimal miqdori</FormLabel>
                    <FormControl>
                      <Input placeholder="0" inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NOTE */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Izoh</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mahsulot haqida qisqacha ma'lumot"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Saqlash
              </Button>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
