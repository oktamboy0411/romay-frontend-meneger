import { FileUpload } from '@/components/ui/file-upload'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { toast } from 'sonner'
import { useCreateRentProductMutation } from '@/store/product/product.api'
import type { CreateProductRequest } from '@/store/product/types'
import { useGetBranch } from '@/hooks/use-get-branch'
import { useEffect } from 'react'
import { useGetRentProductDetailByBarcodeQuery } from '@/store/product-barcode/product-barcode'

type AttributeField = {
  key: string
  value: string
}

type FormValues = {
  branch: string
  name: string
  category_id: string
  barcode: string
  product_count: number | string
  product_rent_price: number | string
  description?: string
  images: (File | string | null)[]
  attributes: AttributeField[]
}

interface RTKError {
  data?: {
    error?: {
      msg?: string
    }
  }
  status?: number
}

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
  const [uploadFile] = useUploadFileMutation()
  const [createRentProduct] = useCreateRentProductMutation()
  const branch = useGetBranch()

  const form = useForm<FormValues>({
    defaultValues: {
      branch: branch?._id,
      name: '',
      category_id: '',
      barcode: '',
      product_count: 0,
      product_rent_price: 0,
      description: '',
      images: [],
      attributes: [{ key: '', value: '' }],
    },
  })

  // barcode kuzatish
  const sku = form.watch('barcode')
  const { data: productData } = useGetRentProductDetailByBarcodeQuery(sku, {
    skip: !sku || sku.length < 4,
    refetchOnMountOrArgChange: true,
  })

  // kelgan ma’lumotni forma ichiga to‘ldirish
  useEffect(() => {
    if (productData?.data) {
      const p = productData.data
      form.setValue('name', p?.name || '')
      form.setValue('category_id', p?.category_id || '')
      form.setValue('product_count', 0)
      form.setValue('product_rent_price', 0)
      form.setValue('description', p.description || '')
      form.setValue(
        'attributes',
        p?.attributes?.length ? p.attributes : [{ key: '', value: '' }]
      )
      form.setValue('images', p?.images || [])
    }
  }, [productData, sku])

  useEffect(() => {
    console.log(productData)

    // barcode o'zgarganda boshqa fieldlar tozalanadi
    if (sku) {
      form.reset({
        branch: branch?._id || '',
        barcode: sku, // faqat barcode qoladi
        name: '',
        category_id: '',
        product_count: 0,
        product_rent_price: 0,
        description: '',
        images: [],
        attributes: [{ key: '', value: '' }],
      })
    }
  }, [sku]) // faqat sku o'zgarganda ishlaydi

  // atributlar uchun field array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes',
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const imagePaths: string[] = []
      for (const file of values.images) {
        if (file && file instanceof File) {
          const uploadResponse = await uploadFile(file).unwrap()
          imagePaths.push(uploadResponse.file_path)
        } else if (typeof file === 'string') {
          imagePaths.push(file)
        }
      }

      const body: CreateProductRequest = {
        branch: values.branch,
        name: values.name,
        product_count: Number(values.product_count),
        product_rent_price: Number(values.product_rent_price),
        description: values.description,
        category_id: values.category_id,
        images: imagePaths,
        barcode: values.barcode,
        attributes: values.attributes.filter(
          (a) => a.key.trim() !== '' && a.value.trim() !== ''
        ),
      }

      await createRentProduct(body).unwrap()
      toast.success('Ijaraga mahsulot muvaffaqiyatli qo‘shildi')
      setOpen(false)
      refetch()
    } catch (error) {
      const err = error as RTKError
      toast.error(
        err?.data?.error?.msg || 'Ijaraga mahsulot qo‘shishda xatolik yuz berdi'
      )
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(bool: boolean) => {
        setOpen(bool)
        form.reset()
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
                    {productData ? (
                      <Input
                        value={
                          getAllCategoriesData?.data.find((item) => {
                            return form.watch('category_id') === item._id
                          })?.name
                        }
                        readOnly={true}
                      />
                    ) : (
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
                    )}
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
                      readOnly={productData ? true : false}
                      placeholder="Excavator"
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
                    <Input placeholder="10" inputMode="numeric" {...field} />
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
                      readOnly={productData ? true : false}
                      placeholder="Heavy duty excavator for rent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IMAGES */}
            <FormItem>
              <FormLabel>Rasmlar</FormLabel>
              <div className="space-y-2">
                {form.watch('images').map((file, index) =>
                  typeof file === 'string' ? (
                    <div key={index} className="flex items-center gap-2">
                      <img src={file} alt={`Uploaded ${index + 1}`} />
                    </div>
                  ) : (
                    <div key={index} className="flex items-center gap-2">
                      <FileUpload
                        value={file ?? null}
                        onChange={(newFile) => {
                          const images = [...form.getValues('images')]
                          images[index] = newFile
                          form.setValue('images', images)
                        }}
                        accept="image/*"
                        maxSizeMB={2}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const images = [...form.getValues('images')]
                          images.splice(index, 1)
                          form.setValue('images', images)
                        }}
                      >
                        O‘chirish
                      </Button>
                    </div>
                  )
                )}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    form.setValue('images', [...form.getValues('images'), null])
                  }
                >
                  + Rasm qo‘shish
                </Button>
              </div>
            </FormItem>

            {/* ATTRIBUTES */}
            <div className="space-y-2">
              <FormLabel>Xususiyatlar</FormLabel>
              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-2">
                  <Input
                    placeholder="Key"
                    {...form.register(`attributes.${index}.key` as const)}
                  />
                  <Input
                    placeholder="Value"
                    {...form.register(`attributes.${index}.value` as const)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => append({ key: '', value: '' })}
              >
                + Xususiyat qo‘shish
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Qo‘shish
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
