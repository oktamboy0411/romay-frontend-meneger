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
import { useAddCashierMutation } from '@/store/cashiers/cashiers'
import { useGetBranch } from '@/hooks/use-get-branch'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

// Schema – faqat kerakli maydonlar
const addCashierSchema = z.object({
  username: z.string().min(2, "To'liq ism kiritilishi shart"),
  phone: z
    .string()
    .regex(
      /^\+998\d{9}$/,
      'Telefon raqam +998 bilan 9 ta raqamdan iborat bo‘lishi kerak'
    ),
  password: z.string().min(6, "Parol kamida 6 belgidan iborat bo'lishi kerak"),
  address: z.string().optional(),
  branch_id: z.string().min(1, 'Filial tanlanishi shart'),
  role: z.string().min(1, 'Rol tanlanishi shart'),
})

type AddCashierValues = z.infer<typeof addCashierSchema>

export default function AddCashierDialog({ open, setOpen }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const managerBranch = useGetBranch()

  const [addCashier] = useAddCashierMutation()

  const form = useForm<AddCashierValues>({
    resolver: zodResolver(addCashierSchema),
    defaultValues: {
      username: '',
      phone: '',
      password: '',
      address: '',
      branch_id: managerBranch?._id || '',
      role: '',
    },
  })

  const onSubmit = async (values: AddCashierValues) => {
    try {
      await addCashier(values).unwrap()
      toast.success('Muvaffaqiyat! Kassir muvaffaqiyatli qo‘shildi.')
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error('Xatolik! Kassirni qo‘shishda xatolik yuz berdi.')
      console.error('Xato:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kassir qo'shish</DialogTitle>
          <DialogDescription>Bu yerda kassir qo'shasiz</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To'liq ism</FormLabel>
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
                  <FormLabel>Telefon</FormLabel>
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
                  <FormLabel>Parol</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Parol kiriting"
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
                  <FormLabel>Yashash manzili</FormLabel>
                  <FormControl>
                    <Input placeholder="Toshkent, O'zbekiston" {...field} />
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
                  <FormLabel>Rol</FormLabel>
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
                          Sotuv kassiri
                        </SelectItem>
                        <SelectItem value="rent_cashier">
                          Ijara kassiri
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
