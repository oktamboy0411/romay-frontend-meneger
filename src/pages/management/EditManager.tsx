/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Modal from '@/components/modal/Modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { useHandleRequest } from '@/hooks/use-handle-request'
import {
  useUpdateEmployeeMutation,
  useGetEmployeeQuery,
} from '@/store/employee/employee'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

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
  password: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditManagerProps {
  isOpen: boolean
  onClose: () => void
  managerId: string | null
}

export const EditManager = ({
  isOpen,
  onClose,
  managerId,
}: EditManagerProps) => {
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

  const {
    data: { data: managerData = undefined } = {},
    isLoading: isManagerLoading,
  } = useGetEmployeeQuery(managerId || '', {
    skip: !managerId,
  })

  const { data: { data: branches = [] } = {} } = useGetAllBranchesQuery({})
  const handleRequest = useHandleRequest()
  const [updateEmployee, { isLoading: updateEmployeeLoading }] =
    useUpdateEmployeeMutation()

  useEffect(() => {
    if (managerData && isOpen && managerData?.branch_id?._id) {
      form.reset({
        branch: managerData?.branch_id?._id || '',
        name: managerData?.username || '',
        phone: managerData?.phone || '+998',
        address: managerData?.address || '',
        password: '',
      })
      form.setValue('branch', managerData?.branch_id?._id || '')
    }
  }, [managerData, isOpen, form, managerData?.branch_id?._id])

  const onSubmit = async (values: FormValues) => {
    if (!managerId) return

    await handleRequest({
      request: async () => {
        const updateData: any = {
          username: values.name,
          phone: values.phone,
          branch_id: values.branch,
          address: values.address,
          role: 'manager',
        }

        // Only include password if it's provided
        if (values.password) {
          updateData.password = values.password
        }

        const result = await updateEmployee({
          id: managerId,
          body: updateData,
        })
        return result
      },
      onSuccess: () => {
        toast.success('Manajer muvaffaqiyatli yangilandi')
        onClose()
        form.reset()
      },
      onError: () => {
        toast.error("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.")
      },
    })
  }

  return (
    <Modal
      title="Manajerni tahrirlash"
      description="Manajer ma'lumotlarini tahrirlash uchun quyidagi maydonlarni to'ldiring"
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
        form.reset()
      }}
    >
      {isManagerLoading ? (
        <div className="w-full h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
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
                    <Input
                      placeholder="Ismi"
                      {...field}
                      disabled={updateEmployeeLoading}
                    />
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
                    <Input
                      placeholder="+998901234567"
                      {...field}
                      disabled={updateEmployeeLoading}
                    />
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
                    <Input
                      placeholder="Manzil"
                      {...field}
                      disabled={updateEmployeeLoading}
                    />
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
                  <FormLabel>
                    Yangi parol (agar o'zgartirmoqchi bo'lsangiz)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={updateEmployeeLoading}
                    />
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
                disabled={updateEmployeeLoading}
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={updateEmployeeLoading}
              >
                {updateEmployeeLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Saqlash'
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Modal>
  )
}
