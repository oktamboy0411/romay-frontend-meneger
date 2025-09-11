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
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { useAddCashierMutation } from '@/store/cashiers/cashiers'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

// Schema – faqat kerakli maydonlar
const addClientSchema = z.object({
  username: z.string().min(2, 'Ism kiritilishi shart'),
  phone: z.string().min(9, 'Telefon kiritilishi shart'),
  password: z.string().min(6, 'Parol kiritilishi shart'),
  address: z.string().optional(),
  branch_id: z.string().min(1, 'Filial tanlanishi shart'),
  role: z.string().min(1, 'Rol tanlanishi shart'),
})

type AddClientValues = z.infer<typeof addClientSchema>

export default function AddClientDialog({ open, setOpen }: Props) {
  const {
    data: { data: branchesData = [] } = {},
    isLoading: isLoadingBranches,
    isError: isErrorBranches,
  } = useGetAllBranchesQuery({})

  const [addClient] = useAddCashierMutation()

  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      username: '',
      phone: '',
      password: '',
      address: '',
      branch_id: '',
      role: '',
    },
  })

  const onSubmit = async (values: AddClientValues) => {
    try {
      await addClient(values).unwrap()
      console.log('Mijoz qo‘shildi:', values)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Xato:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mijoz qo'shish</DialogTitle>
          <p className="text-sm text-gray-500">Bu yerda mijoz qo'shasiz</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Ism */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ismi</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefon */}
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

            {/* Parol */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parol</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Parol kiriting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Manzil */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manzil</FormLabel>
                  <FormControl>
                    <Input placeholder="Tashkent, Uzbekistan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Filial */}
            <FormField
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filiali</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filialni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingBranches ? (
                          <SelectItem disabled value="loading">
                            Yuklanmoqda...
                          </SelectItem>
                        ) : isErrorBranches ? (
                          <SelectItem disabled value="error">
                            Xatolik yuz berdi
                          </SelectItem>
                        ) : (
                          branchesData.map((branch) => (
                            <SelectItem key={branch._id} value={branch._id}>
                              {branch.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rol */}
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
                      <SelectTrigger className="w-[180px]">
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
