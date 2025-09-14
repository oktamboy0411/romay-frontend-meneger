import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import * as z from 'zod'
import { useAddClientMutation } from '@/store/clients/clients.api'
import { useHandleRequest } from '@/hooks/use-handle-request'
import { useGetUser } from '@/hooks/useGetUser'
import { toast } from 'sonner'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const addClientSchema = z.object({
  username: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak'),
  description: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^\+998\d{9}$/,
      'Telefon raqam +998 bilan 9 ta raqamdan iborat bo‘lishi kerak'
    ),
  profession: z.string().min(2, 'Kasbni kiriting'),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Sana YYYY-MM-DD formatida bo‘lishi kerak'),
  address: z
    .string()
    .min(3, 'Manzil kamida 3 ta belgidan iborat bo‘lishi kerak'),
})

type AddClientValues = z.infer<typeof addClientSchema>

export default function AddClientDialog({ open, setOpen }: Props) {
  const me = useGetUser()
  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      username: '',
      description: '',
      phone: '',
      profession: '',
      birth_date: '',
      address: '',
    },
  })
  const [addClient] = useAddClientMutation()
  const handleRequest = useHandleRequest()

  const onSubmit = async (data: AddClientValues) => {
    console.log('Form yuborildi:', data)
    await handleRequest({
      request: () =>
        addClient({ ...data, branch_id: me?.branch_id._id as string }).unwrap(),
      onSuccess: (data) => {
        toast.success(data.msg)
        setOpen(false)
        form.reset()
      },
      onError: (err) => console.log(err.error.msg),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Mijoz qo'shish</DialogTitle>
          <p className="text-sm text-[#71717A]">
            Mijoz ma'lumotlarini kiriting
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ismi</FormLabel>
                  <FormControl>
                    <Input placeholder="Ali Valiyev" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsif</FormLabel>
                  <FormControl>
                    <Input placeholder="Doimiy mijoz" {...field} />
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
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kasbi</FormLabel>
                  <FormControl>
                    <Input placeholder="Doctor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tug‘ilgan sana</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <Input placeholder="Tashkent, Yunusobod" {...field} />
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
