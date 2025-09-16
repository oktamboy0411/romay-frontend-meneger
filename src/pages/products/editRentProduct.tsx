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
  useGetRentProductByIdQuery,
  useUpdateRentProductMutation,
} from '@/store/product/product.api'
import type { UpdateProductRequest } from '@/store/product/types'
import { useGetAllCategoryQuery } from '@/store/category/category.api'
import { useUploadFileMutation } from '@/store/upload/upload.api'
import { toast } from 'sonner'

type FormValues = {
  name: string
  category_id: string
  barcode: string
  product_count: number | string
  product_rent_price: number | string
  description?: string
  image?: File | null
}

export default function UpdateRentProduct({
  open,
  setOpen,
  id,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  id: string | undefined
}) {
  const { data: getAllCategoriesData } = useGetAllCategoryQuery({})
  const [updateProduct] = useUpdateRentProductMutation()
  const [uploadFile] = useUploadFileMutation()

  const { data: productData, isFetching } = useGetRentProductByIdQuery(id!, {
    skip: !id,
  })

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      category_id: '',
      barcode: '',
      product_count: 0,
      product_rent_price: 0,
      description: '',
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
        product_count: p.product_count ?? 0,
        product_rent_price: p.product.price ?? 0,
        description: p.product.description ?? '',
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

      // Yangi rasm yuklangan bo‘lsa
      if (values.image && values.image instanceof File) {
        const uploadResponse = await uploadFile(values.image).unwrap()
        images = [uploadResponse.file_path] // faqat yangi rasm
      }

      const body: UpdateProductRequest = {
        name: values.name,
        category_id: values.category_id,
        barcode: values.barcode,
        product_count: Number(values.product_count),
        product_rent_price: Number(values.product_rent_price),
        description: values.description,
        images,
        attributes: [], // hozircha bo‘sh jo‘natilyapti
      }

      await updateProduct({ id: id!, body }).unwrap()
      setOpen(false)
      toast.success('Ijaraga mahsulot muvaffaqiyatli yangilandi')
    } catch (error) {
      const err = error as RTKError
      toast.error(
        err?.data?.error?.msg ||
          'Ijaraga mahsulotni yangilashda xatolik yuz berdi'
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ijaraga mahsulotni yangilash</DialogTitle>
          <DialogDescription>
            Bu yerda mavjud ijaraga mahsulotni tahrirlay olasiz
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

              {/* PRODUCT COUNT */}
              <FormField
                control={form.control}
                name="product_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mahsulot miqdori</FormLabel>
                    <FormControl>
                      <Input placeholder="0" inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* RENT PRICE */}
              <FormField
                control={form.control}
                name="product_rent_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ijara narxi</FormLabel>
                    <FormControl>
                      <Input placeholder="500" inputMode="decimal" {...field} />
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
