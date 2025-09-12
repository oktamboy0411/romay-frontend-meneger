import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RentPage from './rents'
import SalePage from './sales'

export default function Products() {
  const defaultTab = 'products'
  return (
    <Tabs defaultValue={defaultTab}>
      <div className="flex items-center justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-[30px] font-semibold text-[#09090B]">
            Mahsulotlar
          </h1>
        </div>
        <TabsList>
          <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
          <TabsTrigger value="rents">Ijara mahsulotlari</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="products">
        <SalePage />
      </TabsContent>
      <TabsContent value="rents">
        <RentPage />
      </TabsContent>
    </Tabs>
  )
}
