import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import { DashboardPage } from './pages/dashboard/dashboard'
import Clients from './pages/clients/clients'
import Repairs from './pages/repairs/repairs'
import Masters from './pages/masters/masters'
import Cashiers from './pages/cashiers/cashiers'

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
      <Route path="masters" element={<PrivateRoute />}>
        <Route index element={<Masters />} />
      </Route>
      <Route path="cashiers" element={<PrivateRoute />}>
        <Route index element={<Cashiers />} />
      </Route>

      <Route path="repairs" element={<PrivateRoute />}>
        <Route index element={<Repairs />} />
      </Route>
    </Routes>
  )
}
