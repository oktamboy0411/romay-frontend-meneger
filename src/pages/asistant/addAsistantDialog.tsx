import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAddAssistantMutation } from '@/store/asistant/asistant.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import { useHandleError } from '@/hooks/use-handle-error'
import { toast } from 'sonner'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

// ✅ Schema yangi JSON ma’lumotga mos
const addClientSchema = z.object({
  username: z.string().min(2, 'Ism kiritilishi shart'),
  description: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^\+998\d{9}$/,
      'Telefon raqam +998 bilan 9 ta raqamdan iborat bo‘lishi kerak'
    ),
  branch_id: z.string().min(1, 'Filial tanlanishi shart'),
  address: z.string().optional(),
})

type AddClientValues = z.infer<typeof addClientSchema>

export default function AddAsistantDialog({ open, setOpen }: Props) {
  const branch = useGetBranch()
  const msgError = useHandleError()
  const [addSaleAssistant] = useAddAssistantMutation()

  // form
  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      username: '',
      description: '',
      phone: '',
      branch_id: branch?._id,
      address: '',
    },
  })

  const onSubmit = async (values: AddClientValues) => {
    try {
      await addSaleAssistant(values).unwrap()
      toast.success('Sotuvchi muvaffaqiyatli qo‘shildi')
      setOpen(false)
      form.reset()
    } catch (error) {
      msgError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sotuvchi qo'shish</DialogTitle>
          <p className="text-sm text-gray-500">Bu yerda sotuvchi qo'shasiz</p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ism</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="Tajribali sotuvchi" {...field} />
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
                  <Input placeholder="+998901234567" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="Tashkent, Chilonzor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Saqlash
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
