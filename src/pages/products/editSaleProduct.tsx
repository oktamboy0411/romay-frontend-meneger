import { FileUpload } from '@/components/ui/file-upload'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect } from 'react'

import {
  useGetSaleProductByIdQuery,
  useUpdateSaleProductMutation,
} from '@/store/product/product.api'
import type { UpdateProductRequest } from '@/store/product/types'
import { useGetAllCategoryQuery } from '@/store/category/category.api'
import { useUploadFileMutation } from '@/store/upload/upload.api'
import { toast } from 'sonner'

type FormValues = {
  name: string
  category_id: string
  barcode: string
  price: number | string
  product_count: number | string
  description?: string
  currency: string
  image?: File | null
}

export default function UpdateSaleProduct({
  open,
  setOpen,
  id,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  id: string | undefined
}) {
  const { data: getAllCategoriesData } = useGetAllCategoryQuery({})
  const [updateProduct] = useUpdateSaleProductMutation()
  const [uploadFile] = useUploadFileMutation()

  const { data: productData, isFetching } = useGetSaleProductByIdQuery(id!, {
    skip: !id,
  })

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      category_id: '',
      barcode: '',
      price: 0,
      product_count: 0,
      description: '',
      currency: 'UZS',
      image: null,
    },
  })

  // Ma’lumot kelganda formni to‘ldirish
  useEffect(() => {
    if (productData?.data) {
      const p = productData.data
      form.reset({
        name: p.product.name,
        category_id:
          typeof p.product.category_id === 'string'
            ? p.product.category_id
            : p.product.category_id?._id,
        barcode: p.product.barcode,
        price: p.product.price ?? 0,
        product_count: p.product_count,
        description: p.product.description ?? '',
        currency: p.product.currency ?? 'UZS',
        image: null,
      })
    }
  }, [productData])

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
      let images: string[] = productData?.data?.product?.images || []

      if (values.image && values.image instanceof File) {
        const uploadResponse = await uploadFile(values.image).unwrap()
        images = [uploadResponse.file_path] // faqat yangi rasm
      }

      const body: UpdateProductRequest = {
        name: values.name,
        category_id: values.category_id,
        barcode: values.barcode,
        price: Number(values.price),
        product_count: Number(values.product_count),
        description: values.description,
        currency: values.currency,
        images,
        attributes: [], // bo‘sh object jo‘natish
      }

      await updateProduct({ id: id!, body }).unwrap()
      setOpen(false)
      toast.success('Mahsulot muvaffaqiyatli yangilandi')
    } catch (error) {
      const err = error as RTKError
      toast.error(
        err?.data?.error?.msg || 'Mahsulotni yangilashda xatolik yuz berdi'
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mahsulotni yangilash</DialogTitle>
          <DialogDescription>
            Bu yerda mavjud mahsulotni tahrirlay olasiz
          </DialogDescription>
        </DialogHeader>
        {isFetching ? (
          <p className="text-center text-sm text-gray-500">Yuklanmoqda...</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoriya</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
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

              {/* BARCODE */}
              <FormField
                control={form.control}
                name="barcode"
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

              {/* COUNT */}
              <FormField
                control={form.control}
                name="product_count"
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

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
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
                Yangilash
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
