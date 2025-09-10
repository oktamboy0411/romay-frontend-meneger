import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { MultiSelect } from '../ui/multi-select'
import { Button } from '../ui/button'
import { Loader2, Plus, Filter, X, Search } from 'lucide-react'
import { Input } from '../ui/input'
import {
  useAddSupplierMutation,
  useGetAllSuppliersQuery,
} from '@/store/supplier/supplier.api'
import { useGetAllCategoryQuery } from '@/store/category/category.api'
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
} from '../ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { useState, useMemo } from 'react'
import { CheckRole } from '@/utils/checkRole'
import { useGetRole } from '@/hooks/use-get-role'

type SupplierCategory = string | { _id: string; name: string }

export default function Suppliers() {
  const navigate = useNavigate()
  const { data: suppliers } = useGetAllSuppliersQuery({})
  const [addSupplier] = useAddSupplierMutation()
  const { data: categorys } = useGetAllCategoryQuery({})
  const [open, setOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const role = useGetRole()

  const getCategoryName = (
    category: SupplierCategory,
    categoriesData?: { _id: string; name: string }[]
  ) => {
    if (typeof category === 'string') {
      const found = categoriesData?.find((cat) => cat._id === category)
      return found?.name || 'Unknown Category'
    }
    return category?.name || 'Unknown Category'
  }

  const getCategoryId = (category: SupplierCategory) => {
    if (typeof category === 'string') {
      return category
    }
    return category?._id || ''
  }

  const getSupplyCategories = (supplier: {
    supply_category?: SupplierCategory[] | SupplierCategory
  }) => {
    if (!supplier.supply_category) return []
    if (Array.isArray(supplier.supply_category)) {
      return supplier.supply_category
    }
    return [supplier.supply_category]
  }

  const filteredSuppliers = useMemo(() => {
    if (!suppliers?.data) return []

    return suppliers.data.filter((supplier) => {
      const supplierCategories = getSupplyCategories(supplier)
      const categoryMatch =
        selectedCategory === 'all' ||
        supplierCategories.some(
          (cat: SupplierCategory) => getCategoryId(cat) === selectedCategory
        )

      const typeMatch = selectedType === 'all' || supplier.type === selectedType

      const searchMatch =
        searchTerm === '' ||
        supplier.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm)

      return categoryMatch && typeMatch && searchMatch
    })
  }, [suppliers?.data, selectedCategory, selectedType, searchTerm])

  const resetFilters = () => {
    setSelectedCategory('all')
    setSelectedType('all')
    setSearchTerm('')
  }

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedType !== 'all' || searchTerm !== ''

  const formSchema = z.object({
    full_name: z.string().min(2, 'Kamida 2 ta belgi kiriting'),
    phone: z.string().min(6, "Telefon raqami noto'g'ri"),
    type: z.enum(['PRODUCT_SUPPLIER', 'RENTAL_SUPPLIER'], {
      required_error: 'Turi majburiy',
    }),
    supply_category: z
      .array(z.string())
      .min(1, 'Kamida bir kategoriya tanlang'),
  })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      type: 'PRODUCT_SUPPLIER',
      supply_category: [],
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await addSupplier({
        full_name: values.full_name,
        phone: values.phone,
        type: values.type,
        supply_category: values.supply_category,
      }).unwrap()

      setOpen(false)
      form.reset()
      console.log('Supplier added successfully!')
    } catch (error) {
      console.error('Error adding supplier:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Ta'minotchilar
        </h1>

        {CheckRole(role, ['storekeeper']) && (
          <div className="flex gap-4">
            <Button className="cursor-pointer" onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Ta'minotchi qo'shish
            </Button>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filterlar:</span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Ism yoki telefon bo'yicha qidiruv..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-[250px]"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Kategoriya bo'yicha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha kategoriyalar</SelectItem>
            {categorys?.data?.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Turi bo'yicha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha turlar</SelectItem>
            <SelectItem value="PRODUCT_SUPPLIER">
              Sotuvdagi mahsulotni beradigan
            </SelectItem>
            <SelectItem value="RENTAL_SUPPLIER">
              Ijaraga mahsulot beradigan
            </SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="gap-2"
          >
            <X className="h-3 w-3" />
            Filtrni tozalash
          </Button>
        )}

        <div className="text-sm text-gray-500">
          {filteredSuppliers.length} ta ta'minotchi topildi
        </div>
      </div>

      {suppliers && suppliers.data ? (
        filteredSuppliers.length > 0 ? (
          <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Ismi</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Telefon Raqami
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Balans</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Mahsulotlar soni
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Turi</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Kategoriyalar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/suppliers/${supplier._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#18181B]">
                        {supplier.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#18181B]">
                        {supplier.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${supplier.total_debt < 0 ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {supplier.total_debt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#18181B]">
                        {supplier.total_product_count}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#10b98130] text-[#10b981]">
                        {supplier.type === 'PRODUCT_SUPPLIER'
                          ? 'Sotuv'
                          : 'Ijara'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {getSupplyCategories(supplier).map(
                          (category: SupplierCategory) => (
                            <span
                              key={getCategoryId(category)}
                              className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700"
                            >
                              {getCategoryName(category, categorys?.data)}
                            </span>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Hech qanday ta'minotchi topilmadi
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? "Tanlangan filtrlarga mos ta'minotchi mavjud emas. Filtrlarni o'zgartirib ko'ring."
                : "Hozircha ta'minotchilar mavjud emas."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={resetFilters}>
                Filtrlarni tozalash
              </Button>
            )}
          </div>
        )
      ) : (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin " />
        </div>
      )}

      {/* Add Supplier Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Ta'minotchi qo'shish</DialogTitle>
            <DialogDescription>
              Bu yerda ta'minotchi qo'sha olasiz
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ismi</FormLabel>
                    <FormControl>
                      <Input placeholder="Ism" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon Raqami</FormLabel>
                    <FormControl>
                      <Input placeholder="+998 __ ___ __ __" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turi</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Turni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRODUCT_SUPPLIER">
                            Mahsulot beradigan
                          </SelectItem>
                          <SelectItem value="RENTAL_SUPPLIER">
                            Ijara beradigan
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supply_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoriya</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={
                          categorys?.data?.map((category) => ({
                            value: category._id,
                            label: category.name,
                          })) || []
                        }
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Kategoriya tanlang"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full cursor-pointer">
                <Plus size={16} className="mr-2" /> Ta'minotchini qo'shish
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
