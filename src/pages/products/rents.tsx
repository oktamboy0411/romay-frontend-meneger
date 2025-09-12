import { Search, Plus, Filter, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PaginationComponent } from '@/components/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  useCreateRentProductMutation,
  useGetAllRentProductsQuery,
} from '@/store/product/product.api'
import type { RentProduct, CreateProductRequest } from '@/store/product/types'
import { useGetAllCategoryQuery } from '@/store/category/category.api'
import { useUploadFileMutation } from '@/store/upload/upload.api'
import { Button } from '@/components/ui/button'
import { ProductDetailsModal } from '@/components/product-details-modal'
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { CheckRole } from '@/utils/checkRole'

function RentPage() {
  const [page, setPage] = useState(1)
  const { data: getAllRentsData } = useGetAllRentProductsQuery({ page })
  const { data: getAllCategoriesData } = useGetAllCategoryQuery({})
  const [createProduct] = useCreateRentProductMutation({})
  const [uploadFile] = useUploadFileMutation()

  const role = useGetRole()
  const branch = useGetBranch()

  const formatUsd = (value: string) => {
    const num = Number(String(value).replace(/[^0-9]/g, '')) || 0
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  const [view, setView] = useState<'list' | 'grid'>('list')
  const [open, setOpen] = useState(false)
  // const [products, setProducts] = useState<RentProduct[]>(dummyProducts)
  const [selectedProduct, setSelectedProduct] = useState<RentProduct | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: RentProduct) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const formSchema = z.object({
    name: z.string().min(2, 'Kamida 2 ta belgi kiriting'),
    category: z.string().min(1, 'Kategoriya majburiy'),
    sku: z.string().min(4, 'Bar-kod kamida 4 ta belgi'),
    rentPrice: z
      .union([z.string(), z.number()])
      .transform((v) => Number(String(v).replace(/[^0-9.]/g, '')))
      .refine((v) => v > 0, "Ijara narxi 0 dan katta bo'lishi kerak"),
    minQty: z
      .union([z.string(), z.number()])
      .transform((v) => Number(String(v).replace(/[^0-9]/g, '')))
      .refine((v) => v >= 0, "Minimal miqdor manfiy bo'lmasin"),
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
      name: '',
      category: '',
      sku: '',
      rentPrice: '' as unknown as number,
      minQty: 0 as unknown as number,
      image: undefined,
      subtitle: '',
      currency: 'UZS',
      status: 'Active',
      note: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      let imageUrl = ''

      // Agar fayl tanlangan bo'lsa, avval uni upload qilamiz
      if (values.image && values.image instanceof File) {
        const uploadResponse = await uploadFile(values.image).unwrap()
        imageUrl = uploadResponse.file_path
      }

      const newProduct: CreateProductRequest = {
        // API expects branch and rent-specific field product_rent_price
        branch: branch?._id || '',
        name: values.name,
        description: values.note || 'Mahsulot tavsifi kiritilmagan',
        category_id: values.category,
        product_rent_price: Number(values.rentPrice),
        currency: values.currency,
        images: imageUrl ? [imageUrl] : [],
        barcode: values.sku,
        attributes: [],
        product_count: Number(values.minQty) || 0,
      }

      await createProduct(newProduct).unwrap()
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Mahsulot yaratishda xatolik:', error)
      // Bu yerda error handling qo'shishingiz mumkin
    }
  }
  console.log(getAllRentsData)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9 w-[300px]" placeholder="mahsulotni izlash" />
          </div>
          <Button variant={'outline'} className="gap-2">
            <Filter className="h-4 w-4" /> Filter: Hammasi
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Barcha filiallar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha filiallar</SelectItem>
              <SelectItem value="1">Filial 1</SelectItem>
              <SelectItem value="2">Filial 2</SelectItem>
            </SelectContent>
          </Select>
          {CheckRole(role, ['manager', 'storekeeper']) && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Mahsulot qo'shish
            </Button>
          )}
          <div className="ml-2 flex rounded-md border border-[#E4E4E7] overflow-hidden">
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Nomi</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-center font-medium">Bar-kod</th>
                <th className="px-6 py-3 text-center font-medium">Filial</th>
                <th className="px-6 py-3 text-center font-medium">
                  Ijara narxi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {getAllRentsData?.data?.map((rent) => (
                <tr
                  key={rent._id}
                  className="hover:bg-[#F9F9F9]"
                  onClick={() => handleProductClick(rent)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center overflow-hidden justify-center">
                        {rent.product.images?.[0] ? (
                          <img
                            src={rent.product.images[0]}
                            alt={rent.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">📱</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#18181B]">
                          {rent.product.name || "Noma'lum"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    {rent.product_active_count > 0 ? (
                      <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700">
                        mavjud
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700">
                        qolmagan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                      {rent.product.category_id?.name || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-[#E4E4E7] text-[#18181B]">
                      {rent.product.barcode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                      {rent.branch.name || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatUsd((rent.product_rent_price || 0).toString())}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {getAllRentsData?.data?.map((rent, idx) => (
            <Card
              key={`${rent._id}-${idx}`}
              className="overflow-hidden border border-[#E4E4E7] rounded-xl"
              onClick={() => handleProductClick(rent)}
            >
              <CardContent className="p-3">
                <div className="w-full h-36 flex items-center justify-center">
                  <img
                    src={
                      rent.product.images?.[0] ||
                      'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0='
                    }
                    alt={rent.product.name}
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                    {rent.product.category_id?.name || '—'}
                  </span>
                </div>
                <div className="mt-2 text-base font-semibold leading-5 text-[#18181B] line-clamp-2">
                  {rent.product.name}
                </div>
                <div className="text-sm text-[#71717A] mt-1">
                  {rent.product.description || rent.product.barcode || '—'}
                </div>
                <div className="mt-2 text-xl font-bold text-[#09090B]">
                  {formatUsd((rent.product_rent_price || 0).toString())}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={
          selectedProduct
            ? {
                _id: selectedProduct._id,
                product: selectedProduct.product,
                product_count: selectedProduct.product_active_count,
                branch: selectedProduct.branch._id,
              }
            : null
        }
      />

      <PaginationComponent
        currentPage={page}
        totalPages={getAllRentsData?.page_count ?? 1}
        onPageChange={(p) => setPage(p)}
      />

      {/* Add Product Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mahsulot qo'shish</DialogTitle>
            <DialogDescription>
              Bu yerda mahsulot qo'sha olasiz
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">
                      Mahsulot suratini yuklash
                    </FormLabel>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="grid grid-cols-[1fr_auto] items-end gap-2">
                  <FormField
                    control={form.control}
                    name="rentPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ijara narxi</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10"
                            inputMode="decimal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Valyuta</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[90px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UZS">UZS</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasnifi (ixtiyoriy)</FormLabel>
                    <FormControl>
                      <Input placeholder="Shurupovert" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RentPage
