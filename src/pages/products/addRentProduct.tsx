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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetAllCategoryQuery } from '@/store/category/category.api'
import { useUploadFileMutation } from '@/store/upload/upload.api'
import { useCreateRentProductMutation } from '@/store/product/product.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { SERVER_URL } from '@/constants/server_url'
import { getAuthToken } from '@/utils/auth'
import type { RentProductDetail } from '@/store/product-barcode/types'

export default function CreateRentProduct({
  open,
  setOpen,
  refetch,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  refetch: () => void
}) {
  const { data: getAllCategoriesData } = useGetAllCategoryQuery({})
  const [createRentProduct] = useCreateRentProductMutation()
  const [uploadFile] = useUploadFileMutation()
  const branch = useGetBranch()
  const [rentProductData, setBarcodeData] = useState<RentProductDetail | null>(
    null
  )
  const [barcodeLoading, setBarcodeLoading] = useState(false)

  // 🔹 Form Schema
  const formSchema = z.object({
    name: z.string().min(2, 'Kamida 2 ta belgi kiriting'),
    category_id: z.string().min(1, 'Kategoriya majburiy'),
    barcode: z.string().min(4, 'Bar-kod kamida 4 ta belgi'),
    product_count: z
      .union([z.string(), z.number()])
      .transform((v) => Number(String(v).replace(/[^0-9]/g, ''))),
    product_rent_price: z
      .union([z.string(), z.number()])
      .transform((v) => Number(String(v).replace(/[^0-9.]/g, '')))
      .refine((v) => v >= 0, 'Ijara narxi 0 dan kichik bo‘lmasligi kerak'),
    image: z.any().optional(),
    description: z.string().optional(),
  })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: '',
      name: '',
      category_id: '',
      product_count: 0,
      product_rent_price: 0,
      image: [],
      description: '',
    },
  })

  const barcode = form.watch('barcode')

  // 🔹 Barcode bo‘yicha fetch
  useEffect(() => {
    const fetchBarcodeData = async (code: string) => {
      if (!code || code.length < 4) return
      setBarcodeLoading(true)
      try {
        const token = getAuthToken()
        const response = await fetch(
          `${SERVER_URL}/product-detail/rent-product/barcode/${code}`,
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
      } catch (err) {
        console.error(err)
        setBarcodeData(null)
      } finally {
        setBarcodeLoading(false)
      }
    }

    if (barcode && barcode.length >= 4) {
      fetchBarcodeData(barcode)
    } else {
      setBarcodeData(null)
    }
  }, [barcode])

  // 🔹 Agar data kelsa formni to‘ldirish, bo‘lmasa tozalash
  useEffect(() => {
    if (rentProductData) {
      const p = rentProductData
      form.setValue('name', p.name || '')
      form.setValue(
        'category_id',
        typeof p.category_id !== 'string'
          ? p.category_id?._id
          : p.category_id || ''
      )
      form.setValue('description', p.description || '')
      form.setValue('product_count', 0)
      form.setValue('product_rent_price', 0)

      if (p.images && p.images.length > 0) {
        form.setValue('image', p.images[0])
      }
    } else {
      form.reset(
        {
          barcode: barcode || '',
          name: '',
          category_id: '',
          product_count: 0,
          product_rent_price: 0,
          image: [],
          description: '',
        },
        {
          keepValues: false,
          keepDefaultValues: false,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentProductData])

  const isReadOnly = barcode.length < 4 || !!rentProductData
  const isFormDisabled = !barcode || barcode.length < 4

  // 🔹 Submit
  const onSubmit = async (values: FormValues) => {
    try {
      let imageUrl = ''
      if (values.image && values.image instanceof File) {
        const uploadResponse = await uploadFile(values.image).unwrap()
        imageUrl = uploadResponse.file_path
      } else if (typeof values.image === 'string') {
        imageUrl = values.image
      }

      await createRentProduct({
        branch: branch?._id || '',
        name: values.name,
        category_id: values.category_id,
        description: values.description,
        product_count: Number(values.product_count),
        product_rent_price: Number(values.product_rent_price),
        images: imageUrl ? [imageUrl] : [],
        barcode: values.barcode,
        attributes: [],
      }).unwrap()

      toast.success('Ijaraga mahsulot muvaffaqiyatli qo‘shildi')
      setOpen(false)
      form.reset()
      refetch()
    } catch (error) {
      toast.error('Xatolik! Ijaraga mahsulot qo‘shishda xatolik yuz berdi.')
      console.error('Xato:', error)
    }
  }

  useEffect(() => {
    if (!open) {
      form.reset()
      setBarcodeData(null)
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ijaraga mahsulot qo‘shish</DialogTitle>
          <DialogDescription>
            Bu yerda yangi ijaraga mahsulot qo‘shishingiz mumkin
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* BARCODE */}
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bar-kod</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210987" {...field} />
                  </FormControl>
                  <div className="text-sm mt-1">
                    {barcodeLoading && (
                      <span className="text-blue-500">
                        Ma'lumot yuklanmoqda...
                      </span>
                    )}
                    {!barcodeLoading &&
                      barcode?.length >= 4 &&
                      rentProductData && (
                        <span className="text-green-500">
                          Ma'lumot topildi ✅
                        </span>
                      )}
                    {!barcodeLoading &&
                      barcode?.length >= 4 &&
                      !rentProductData && (
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
                name="category_id"
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

              {/* COUNT */}
              <FormField
                control={form.control}
                name="product_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miqdori</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={isReadOnly}
                        placeholder="10"
                        inputMode="numeric"
                        {...field}
                      />
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
                      <Input
                        readOnly={isReadOnly}
                        placeholder="500"
                        inputMode="decimal"
                        {...field}
                      />
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
                Qo‘shish
              </Button>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
