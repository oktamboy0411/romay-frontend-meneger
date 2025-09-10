import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { useHandleRequest } from '@/hooks/use-handle-request'
import { useAddEmployeeMutation } from '@/store/employee/employee'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Modal from '@/components/modal/Modal'

const formSchema = z.object({
  branch: z.string().min(2, {
    message: 'Filial tanlang',
  }),
  name: z.string().min(2, {
    message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
  }),
  phone: z.string().regex(/^\+998\d{9}$/, {
    message: "Iltimos, to'g'ri telefon raqam kiriting (masalan: +998901234567)",
  }),
  address: z.string().min(2, {
    message: "Manzil kamida 2 ta belgidan iborat bo'lishi kerak",
  }),
  password: z.string().min(8, {
    message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface AddManagerProps {
  isOpen: boolean
  onClose: () => void
}

export const AddManager = ({ isOpen, onClose }: AddManagerProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: '',
      name: '',
      phone: '+998',
      address: '',
      password: '',
    },
  })
  const { data: { data: branches } = {} } = useGetAllBranchesQuery({})
  const handleRequest = useHandleRequest()
  const [addEmployee, { isLoading: addEmployeeLoading }] =
    useAddEmployeeMutation()

  const onSubmit = async (values: FormValues) => {
    await handleRequest({
      request: async () => {
        const result = await addEmployee({
          username: values.name,
          phone: values.phone,
          password: values.password,
          branch_id: values.branch,
          address: values.address,
          role: 'manager',
        })
        return result
      },
      onSuccess: () => {
        toast.success('Manajer qo`shildi')
        onClose()
        form.reset()
      },
      onError: () => {
        toast.error('Manajer qo`shilmadi')
      },
    })
  }

  return (
    <Modal
      title="Manajer qo'shish"
      description="Manajer ma'lumotlarini kiritish uchun quyidagi maydonlarni to'ldiring"
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
        form.reset()
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filial</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Filial tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches?.map((branch) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors[field.name]?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ismi</FormLabel>
                <FormControl>
                  <Input placeholder="Ismi" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors[field.name]?.message}
                </FormMessage>
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
                  <Input placeholder="Manzil" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors[field.name]?.message}
                </FormMessage>
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
                  <Input placeholder="+998901234567" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors[field.name]?.message}
                </FormMessage>
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
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors[field.name]?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose()
                form.reset()
              }}
            >
              Bekor qilish
            </Button>
            <Button
              disabled={addEmployeeLoading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {addEmployeeLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Qo`shish'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  )
}
