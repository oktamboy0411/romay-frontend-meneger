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
import { useHandleRequest } from '@/hooks/use-handle-request'
import {
  useGetOneClientQuery,
  useUpdateClientMutation,
} from '@/store/clients/clients.api'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useGetBranch } from '@/hooks/use-get-branch'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  id: string
}

const clientSchema = z.object({
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

type ClientValues = z.infer<typeof clientSchema>

export default function UpdateClientDialog({ open, setOpen, id }: Props) {
  const me = useGetBranch()
  const handleRequest = useHandleRequest()
  const { data: clientData, isLoading } = useGetOneClientQuery(id)
  const [updateClient] = useUpdateClientMutation()

  const form = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      username: '',
      description: '',
      phone: '',
      profession: '',
      birth_date: '',
      address: '',
    },
  })

  // client data kelganida formga to‘ldirish
  useEffect(() => {
    if (clientData?.data) {
      const c = clientData.data
      const formattedDate = c.birth_date
        ? new Date(c.birth_date).toISOString().split('T')[0]
        : ''
      form.reset({
        username: c.username || '',
        description: c.description || '',
        phone: c.phone || '',
        profession: c.profession || '',
        birth_date: formattedDate,
        address: c.address || '',
      })
    }
  }, [clientData, form])

  const onSubmit = async (values: ClientValues) => {
    await handleRequest({
      request: () =>
        updateClient({
          id,
          body: {
            ...values,
            branch_id: me?._id,
          },
        }).unwrap(),
      onSuccess: () => {
        toast.success(
          'Muvaffaqiyat! Mijoz maʼlumotlari muvaffaqiyatli yangilandi.'
        )
        setOpen(false)
      },
      onError: () => {
        toast.error('Xatolik! Mijozni yangilashda xatolik yuz berdi.')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Mijoz ma’lumotlarini yangilash</DialogTitle>
          <p className="text-sm text-[#71717A]">
            Mijoz ma'lumotlarini tahrirlashingiz mumkin
          </p>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-4">Ma’lumotlar yuklanmoqda...</p>
        ) : (
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
                Yangilash
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
