import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from '@/store/employee/employee'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertModal } from '@/components/alertModal/alertModal'
import { useHandleRequest } from '@/hooks/use-handle-request'
import { toast } from 'sonner'
import { EditManager } from './EditManager'

export default function Managers({
  selectedBranch,
}: {
  selectedBranch: string
}) {
  const limit = 10
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const { data, isLoading, isError } = useGetEmployeesQuery(
    {
      limit,
      branch: selectedBranch === 'all' ? undefined : selectedBranch,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation()
  const handleRequest = useHandleRequest()

  const handleDelete = async () => {
    await handleRequest({
      request: async () => {
        const result = await deleteEmployee(deleteId || '')
        return result
      },
      onSuccess: () => {
        toast.success('Menejer muvaffaqiyatli o‘chirildi')
      },
      onError: () => {
        toast.error('Menejer o‘chirilmadi')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <div>Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.</div>
  }

  const employees = data?.data || []

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                #
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Ism Familiya
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Telefon
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Filial
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {employees.map((employee, index) => (
              <tr
                key={employee._id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle">{index + 1}</td>
                <td className="p-4 align-middle font-medium">
                  {employee.username}
                </td>
                <td className="p-4 align-middle">{employee.phone}</td>
                <td className="p-4 align-middle">
                  {employee.branch_id?.name || "Noma'lum"}
                </td>

                <td className="p-4 align-middle text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => setEditId(employee._id)}
                      variant="ghost"
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteId(employee._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        action={handleDelete}
        title="Menejer o‘chirish"
        description="Menejer o‘chirishni taqdim etishni hohlaysizmi?"
        actionText="O‘chirish"
        isLoading={isDeleting}
      />
      <EditManager
        isOpen={!!editId}
        onClose={() => setEditId(null)}
        managerId={editId}
      />
    </div>
  )
}
