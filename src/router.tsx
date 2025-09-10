import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import { DashboardPage } from './pages/dashboard/dashboard'
import BirthdayPage from './pages/birthday/birthday'
import Management from './pages/management/management'
import Branches from './pages/branches/branches'
import History from './pages/history/history'
import Clients from './pages/clients/clients'
import Suppliers from './components/suppliers/suppliers'
import SupplierDetails from './components/supplierDetails'
import Repairs from './pages/repairs/repairs'
import RepairDetails from './pages/repairs/repairDetails'
import AddService from './pages/repairs/AddService'
import ProductPage from './pages/products/products'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />} />
      <Route path={'auth'}>
        <Route path={'login'} element={<LoginPage />} />
      </Route>
      <Route path="dashboard" element={<PrivateRoute />}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="birthday" element={<PrivateRoute />}>
        <Route index element={<BirthdayPage />}></Route>
      </Route>
      <Route path="management" element={<PrivateRoute />}>
        <Route index element={<Management />}></Route>
      </Route>
      <Route path="branches" element={<PrivateRoute />}>
        <Route index element={<Branches />} />
      </Route>
      <Route path="history">
        <Route index element={<History />} />
      </Route>
      <Route path="clients">
        <Route index element={<Clients />} />
      </Route>
      <Route path="clients">
        <Route index element={<Clients />} />
      </Route>
      <Route path="suppliers" element={<PrivateRoute />}>
        <Route index element={<Suppliers />}></Route>
      </Route>
      <Route path="suppliers/:id" element={<PrivateRoute />}>
        <Route index element={<SupplierDetails />}></Route>
      </Route>
      <Route path="repairs" element={<PrivateRoute />}>
        <Route index element={<Repairs />} />
      </Route>
      <Route path="new-repair" element={<PrivateRoute />}>
        <Route index element={<AddService />} />
      </Route>
      <Route path="repair-details/:id" element={<PrivateRoute />}>
        <Route index element={<RepairDetails />} />
      </Route>
      <Route path="products" element={<PrivateRoute />}>
        <Route index element={<ProductPage />}></Route>
      </Route>
    </Routes>
  )
}
