import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useGetOneCashierQuery,
  useUpdateCashierMutation,
} from '@/store/cashiers/cashiers'
import { useGetBranch } from '@/hooks/use-get-branch'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  id: string
}

// Schema – faqat kerakli maydonlar
const addClientSchema = z.object({
  username: z.string().min(2, 'Ism kiritilishi shart'), // Name is required
  phone: z.string().min(9, 'Telefon raqami kiritilishi shart'), // Phone number is required
  password: z
    .union([
      z
        .string()
        .trim()
        .min(8, 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak'), // Password must be at least 8 characters
      z.literal(''),
      z.undefined(),
    ])
    .optional(),
  address: z.string().optional(), // Address is optional
  branch_id: z.string().min(1, 'Filial tanlanishi shart'), // Branch selection is required
  role: z.string().min(1, 'Rol tanlanishi shart'), // Role selection is required
})

type AddClientValues = z.infer<typeof addClientSchema>

export default function UpdateCashierDialog({ open, setOpen, id }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const managerBranch = useGetBranch()
  const { data: cashierData } = useGetOneCashierQuery(id)

  const [updateCashier] = useUpdateCashierMutation()

  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      username: cashierData?.data.username || '',
      phone: cashierData?.data.phone || '',
      password: '',
      address: cashierData?.data.address || '',
      branch_id: managerBranch?._id || '',
      role: cashierData?.data.role || '',
    },
  })

  useEffect(() => {
    if (cashierData?.data) {
      form.reset({
        username: cashierData?.data.username || '',
        phone: cashierData?.data.phone || '',
        password: '',
        address: cashierData?.data.address || '',
        branch_id: managerBranch?._id || '',
        role: cashierData?.data.role || '',
      })
    }
  }, [cashierData, managerBranch, form])

  const onSubmit = async (values: AddClientValues) => {
    try {
      const sendData = { ...values }
      if (!sendData.password) {
        delete sendData.password
      }

      await updateCashier({ id, body: sendData }).unwrap()
      console.log('Mijoz qo‘shildi:', sendData)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Xato:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kassir yangilash</DialogTitle>
          <DialogDescription>Bu yerda kassirni yangilaysiz</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To‘liq Ism</FormLabel>
                  <FormControl>
                    <Input placeholder="Ism va familiya" {...field} />
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
                    <Input placeholder="+998901234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yangi Parol (ixtiyoriy)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Yangi parolni kiriting"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manzil</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Yashash manzilingizni kiriting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rolni Tanlang</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Rolni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale_cashier">
                          Sotuv Kassiri
                        </SelectItem>
                        <SelectItem value="rent_cashier">
                          Ijara Kassiri
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
      </DialogContent>
    </Dialog>
  )
}
