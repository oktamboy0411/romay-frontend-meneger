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
import { useAddClientMutation } from '@/store/clients/clients.api'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

// Yangi schema zod bilan
const addClientSchema = z.object({
  username: z.string().min(2, 'Ism kiritilishi shart'),
  description: z.string().optional(),
  phone: z.string().min(9, 'Raqam kiritilishi shart'),
  profession: z.string().optional(),
  birth_date: z.string().optional(),
  branch_id: z.string().min(1, 'Filial tanlanishi shart'),
  address: z.string().optional(),
})

type AddClientValues = z.infer<typeof addClientSchema>

export default function AddClientDialog({ open, setOpen }: Props) {
  const {
    data: { data: branchesData = [] } = {},
    isLoading: isLoadingBranches,
    isError: isErrorBranches,
  } = useGetAllBranchesQuery({})

  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      username: '',
      description: '',
      phone: '',
      profession: '',
      birth_date: '',
      branch_id: '',
      address: '',
    },
  })

  const [addClient] = useAddClientMutation()

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
                    <Input placeholder="Ali Valiyev" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.username?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsif</FormLabel>
                  <FormControl>
                    <Input placeholder="Doimiy mijoz" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.description?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="+998901234567" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.phone?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Profession */}
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kasbi</FormLabel>
                  <FormControl>
                    <Input placeholder="Doctor" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.profession?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Birth Date */}
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tug'ilgan sana</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.birth_date?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Branch */}
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
                        <SelectValue placeholder="Barcha filiallar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Barchasi</SelectItem>
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
                  <FormMessage>
                    {form.formState.errors.branch_id?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manzil</FormLabel>
                  <FormControl>
                    <Input placeholder="Tashkent, Yunusobod" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.address?.message}
                  </FormMessage>
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
