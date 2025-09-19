import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  useUpdateMechanicMutation,
  useGetOneMechanicQuery,
} from '@/store/mechanic/mechanic.api'

// --- validation schema ---
const mechanicSchema = z.object({
  fullName: z
    .string({ required_error: "To'liq ismni kiriting" })
    .min(2, "To'liq ism kamida 2 ta belgi"),
  phone: z
    .string({ required_error: 'Telefon raqamini kiriting' })
    .regex(
      /^\+998\d{9}$/,
      'Telefon raqam +998 bilan boshlanishi va 9 ta raqamdan iborat bo‘lishi kerak'
    ),
  work_type: z.enum(['SERVICE', 'FIELD_SERVICE'], {
    required_error: 'Ish turini tanlang',
  }),
  branch_id: z.string().optional(),
})

type MechanicFormValues = z.infer<typeof mechanicSchema>

interface UpdateMechanicDialogProps {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}

export default function UpdateMechanicDialog({
  id,
  open,
  setOpen,
}: UpdateMechanicDialogProps) {
  const [updateMechanic, { isLoading }] = useUpdateMechanicMutation()

  // --- get mechanic by id ---
  const { data: mechanicData, isFetching } = useGetOneMechanicQuery(id, {
    skip: !id,
  })

  const form = useForm<MechanicFormValues>({
    resolver: zodResolver(mechanicSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      work_type: 'SERVICE',
      branch_id: '',
    },
  })

  // mechanicData kelganda formni to'ldirish
  useEffect(() => {
    if (mechanicData?.data) {
      const m = mechanicData.data
      form.reset({
        fullName: m.fullName,
        phone: m.phone,
        work_type: m.work_type,
        branch_id: m.branch_id || '',
      })
    }
  }, [mechanicData, form])

  const onSubmit = async (values: MechanicFormValues) => {
    try {
      const result = await updateMechanic({
        id,
        body: values,
      }).unwrap()
      if (result.success) {
        toast.success('Ustala muvaffaqiyatli yangilandi!')
        setOpen(false)
      } else {
        toast.error(result.message || 'Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Update mechanic error:', error)
      toast.error('Xatolik yuz berdi')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ustala ma'lumotlarini yangilash</DialogTitle>
          <DialogDescription>
            {isFetching
              ? 'Maʼlumotlar yuklanmoqda...'
              : "Ustala ma'lumotlarini o'zgartiring va saqlang."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              if (errors.phone) toast.error(errors.phone.message)
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To'liq ism</FormLabel>
                  <FormControl>
                    <Input placeholder="To'liq ismni kiriting" {...field} />
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
                  <FormLabel>Telefon raqam</FormLabel>
                  <FormControl>
                    <Input placeholder="+998 90 123 45 67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ish turi</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ish turini tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SERVICE">Xizmat</SelectItem>
                        <SelectItem value="FIELD_SERVICE">
                          Tashqi xizmat
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isLoading || isFetching}>
                {isLoading ? 'Yangilanmoqda...' : 'Yangilash'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
