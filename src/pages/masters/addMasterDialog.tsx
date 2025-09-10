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
import { useAddMasterMutation } from '@/store/masters/masters.api'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

// ✅ yangi schema — siz tashlagan data asosida
const addClientSchema = z.object({
  fullName: z.string().min(2, 'Ism kiritilishi shart'),
  phone: z.string().min(9, 'Telefon raqam kiritilishi shart'),
  work_type: z.string().min(1, 'Ish turi tanlanishi shart'),
  branch_id: z.string().min(1, 'Filial tanlanishi shart'),
})

type AddClientValues = z.infer<typeof addClientSchema>

export default function AddClientDialog({ open, setOpen }: Props) {
  // filiallarni olish
  const {
    data: { data: branchesData = [] } = {},
    isLoading: isLoadingBranches,
    isError: isErrorBranches,
  } = useGetAllBranchesQuery({})

  // addClient mutation
  const [addClient] = useAddMasterMutation()

  // form
  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      work_type: '',
      branch_id: '',
    },
  })

  // submit
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
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ismi</FormLabel>
                  <FormControl>
                    <Input placeholder="Javlon Qodirov" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="+998901112233" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Work Type */}
            <FormField
              control={form.control}
              name="work_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ish turi</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ish turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SERVICE">SERVICE</SelectItem>
                        <SelectItem value="FIELD_SERVICE">
                          FIELD SERVICE
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
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
                      <SelectTrigger className="w-full">
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

            <Button type="submit" className="w-full">
              Saqlash
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
