import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { useState } from 'react'
import Managers from './managers'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddManager } from './AddManager'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'

export default function Management() {
  const { data: { data: branches } = {} } = useGetAllBranchesQuery({})
  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const role = useGetRole()
  const handleOpen = () => {
    setIsManagerOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[30px] font-semibold text-[#09090B]">Boshqaruv</h1>
        <div className="flex gap-4">
          {CheckRole(role, ['ceo', 'manager']) && (
            <Button onClick={handleOpen}>
              <Plus />
              Menejer qo’shish
            </Button>
          )}
          <Select
            onValueChange={(value) => {
              setSelectedBranch(value)
            }}
            value={selectedBranch}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Barch Filiallar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barch Filiallar</SelectItem>
              {branches?.map((branch) => (
                <SelectItem key={branch._id} value={branch._id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Managers selectedBranch={selectedBranch} />
      </div>
      <AddManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
      />
    </div>
  )
}
