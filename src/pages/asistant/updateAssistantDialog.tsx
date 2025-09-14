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
import {
  useGetOneAssistantQuery,
  useUpdateAssistantMutation,
} from '@/store/asistant/asistant.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import { useHandleError } from '@/hooks/use-handle-error'
import { useEffect } from 'react'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  id: string
}

const addClientSchema = z.object({
  username: z.string().min(2, 'Ism kiritilishi shart'),
  description: z.string().optional(),
  phone: z.string().min(9, 'Telefon raqam kiritilishi shart'),
  branch_id: z.string().min(1, 'Filial tanlanishi shart'),
  address: z.string().optional(),
})

type AddClientValues = z.infer<typeof addClientSchema>

export default function UpdateAssistantDialog({ open, setOpen, id }: Props) {
  const branch = useGetBranch()
  const msgError = useHandleError()
  const [updateAssistant] = useUpdateAssistantMutation()
  const { data: assistantData } = useGetOneAssistantQuery(id)

  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      username: assistantData?.data.username || '',
      description: assistantData?.data.description || '',
      phone: assistantData?.data.phone || '',
      branch_id: branch?._id,
      address: assistantData?.data.address,
    },
  })

  useEffect(() => {
    if (assistantData?.data) {
      form.reset({
        username: assistantData.data.username || '',
        description: assistantData.data.description || '',
        phone: assistantData.data.phone || '',
        branch_id: branch?._id || '',
        address: assistantData.data.address || '',
      })
    }
  }, [assistantData, branch, form])

  const onSubmit = async (values: AddClientValues) => {
    try {
      await updateAssistant({ id, body: values }).unwrap()
      console.log('Mijoz yangilandi:', values)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Xato:', error)
      msgError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mijoz yangilash</DialogTitle>
          <p className="text-sm text-gray-500">Bu yerda mijozni yangilaysiz</p>
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
                  <Input placeholder="Experienced sales assistant" {...field} />
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
            Yangilash
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
