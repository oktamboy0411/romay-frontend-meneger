import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import { DashboardPage } from './pages/dashboard/dashboard'
import Clients from './pages/clients/clients'
import Repairs from './pages/repairs/repairs'
import Cashiers from './pages/cashiers/cashiers'
import Assistants from './pages/asistant/asistant'
import Sales from './pages/sales/sales'
import Rents from './pages/rents/rents'
import AddRent from './pages/rents/AddRent'
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
      <Route path="clients" element={<PrivateRoute />}>
        <Route index element={<Clients />} />
      </Route>
      <Route path="sellers" element={<PrivateRoute />}>
        <Route index element={<Assistants />} />
      </Route>
      <Route path="cashiers" element={<PrivateRoute />}>
        <Route index element={<Cashiers />} />
      </Route>
      <Route path="sales" element={<PrivateRoute />}>
        <Route index element={<Sales />} />
      </Route>

      <Route path="rents" element={<PrivateRoute />}>
        <Route index element={<Rents />}></Route>
      </Route>
      <Route path="rents/add" element={<PrivateRoute />}>
        <Route index element={<AddRent />}></Route>
      </Route>
      <Route path="repairs" element={<PrivateRoute />}>
        <Route index element={<Repairs />} />
      </Route>
      <Route path="products" element={<PrivateRoute />}>
        <Route index element={<ProductPage />}></Route>
      </Route>
    </Routes>
  )
}
