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
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { SERVER_URL } from '@/constants/server_url'
import { getAuthToken } from '@/utils/auth'
import type { SaleProductDetail } from '@/store/product-barcode/types'

export default function AddSaleProduct({
  open,
  setOpen,
  refetch,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  refetch: () => void
}) {
  const { data: getAllCategoriesData } = useGetAllCategoryQuery({})
  const [createProduct] = useCreateSaleProductMutation()
  const [saleProductData, setBarcodeData] = useState<SaleProductDetail | null>(
    null
  )
  const [barcodeLoading, setBarcodeLoading] = useState<boolean>(false)
  const [uploadFile] = useUploadFileMutation()
  const branch = useGetBranch()

  // 🔹 Form Schema
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
      image: [],
      subtitle: '',
      currency: 'UZS',
      status: 'Active',
      note: '',
    },
  })

  const sku = form.watch('sku')

  // 🔹 Barcode bo‘yicha fetch
  useEffect(() => {
    const fetchBarcodeData = async (barcode: string) => {
      if (!barcode || barcode.length < 4) return
      setBarcodeLoading(true)
      try {
        const token = getAuthToken()
        const response = await fetch(
          `${SERVER_URL}/product-detail/sale-product/barcode/${barcode}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        )
        const data = await response.json()
        if (data?.data) {
          setBarcodeData(data.data)
        } else {
          setBarcodeData(null)
        }
      } catch (error) {
        console.error('Barcode lookup error:', error)
        setBarcodeData(null)
      } finally {
        setBarcodeLoading(false)
      }
    }

    if (sku && sku.length >= 4) {
      fetchBarcodeData(sku)
    } else {
      setBarcodeData(null)
    }
  }, [sku])

  // 🔹 Agar data kelsa formni to‘ldirish, bo‘lmasa tozalash
  useEffect(() => {
    if (saleProductData) {
      const product = saleProductData
      form.setValue('name', product.name || '')
      form.setValue(
        'category',
        typeof product.category_id !== 'string'
          ? product.category_id?._id
          : product.category_id
            ? product.category_id
            : ''
      )
      form.setValue('price', product.price || 0)
      form.setValue('note', product.description || '')
      form.setValue('currency', product.currency || 'UZS')
      form.setValue('status', product.status || 'Active')

      if (product.images && product.images.length > 0) {
        form.setValue('image', product.images[0]) // birinchi rasmni olayapmiz
      }
    } else {
      form.reset(
        {
          sku: sku || '',
          name: '',
          category: '',
          price: undefined,
          minQty: undefined,
          image: [],
          subtitle: '',
          currency: 'UZS',
          status: 'Active',
          note: '',
        },
        {
          keepValues: false,
          keepDefaultValues: false,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleProductData])

  const isReadOnly = sku.length < 4 || !!saleProductData
  const isReadOnlyForNumbers = sku.length < 4

  // 🔹 Submit
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

      toast.success('Mahsulot muvaffaqiyatli yaratildi')
      refetch()
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error('Xatolik! Mahsulotni qo‘shishda xatolik yuz berdi.')
      console.error('Xato:', error)
    }
  }

  useEffect(() => {
    if (!open) {
      // Dialog yopilganda formani tozalash
      form.reset(
        {
          sku: sku || '',
          name: '',
          category: '',
          price: undefined,
          minQty: undefined,
          image: [],
          subtitle: '',
          currency: 'UZS',
          status: 'Active',
          note: '',
        },
        {
          keepValues: false,
          keepDefaultValues: true,
        }
      )
      setBarcodeData(null)
    }
  }, [open])

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

                  {/* 🔹 Barcode xabarlari */}
                  <div className="text-sm mt-1">
                    {barcodeLoading && (
                      <span className="text-blue-500">
                        Ma'lumot yuklanmoqda...
                      </span>
                    )}
                    {!barcodeLoading && sku?.length >= 4 && saleProductData && (
                      <span className="text-green-500">
                        Ma'lumot topildi ✅
                      </span>
                    )}
                    {!barcodeLoading &&
                      sku?.length >= 4 &&
                      !saleProductData && (
                        <span className="text-red-500">
                          Ma'lumot topilmadi ❌
                        </span>
                      )}
                  </div>

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
                      {typeof field.value === 'string' && field.value !== '' ? (
                        <div className="space-y-2">
                          <img
                            src={
                              field.value.startsWith('http')
                                ? field.value
                                : `${SERVER_URL}/${field.value}`
                            }
                            alt="Mahsulot rasmi"
                            className="h-32 w-32 object-cover rounded-md border"
                          />
                        </div>
                      ) : (
                        <FileUpload
                          value={(field.value as File | null) ?? null}
                          onChange={(file) => field.onChange(file)}
                          accept="image/*,application/pdf"
                          maxSizeMB={10}
                          disabled={isReadOnly}
                        />
                      )}
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
                        disabled={isReadOnly}
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
                      <Input
                        disabled={isReadOnly}
                        placeholder="Mahsulot nomi"
                        {...field}
                      />
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
                      <Input
                        readOnly={isReadOnlyForNumbers}
                        placeholder="10"
                        inputMode="decimal"
                        {...field}
                      />
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
                      <Input
                        readOnly={isReadOnlyForNumbers}
                        placeholder="0"
                        inputMode="numeric"
                        {...field}
                      />
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
                        disabled={isReadOnly}
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
