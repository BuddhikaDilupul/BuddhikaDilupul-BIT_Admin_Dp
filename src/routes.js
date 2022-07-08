import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//category
const categories = React.lazy(() => import('./views/category/Categories'))
const category = React.lazy(() => import('./views/category/Category'))
const addCategory = React.lazy(() => import('./views/category/AddCategory'))

//customers
const customers = React.lazy(() => import('./views/customer/Customers'))
const customer = React.lazy(() => import('./views/customer/Customer'))

//employee
const register = React.lazy(() => import('./views/register/Register'))
const employees = React.lazy(() => import('./views/employee/Employees'))
const employee = React.lazy(() => import('./views/employee/Employee'))

//locations
const locations = React.lazy(() => import('./views/locations/Locations'))
const location = React.lazy(() => import('./views/locations/EditLocation'))
const AddLocation = React.lazy(() => import('./views/locations/AddLocation'))

//products
const products = React.lazy(() => import('./views/products/Products'))
const product = React.lazy(() => import('./views/products/Product'))
const addProduct = React.lazy(() => import('./views/products/AddProduct'))
//profile
const profile = React.lazy(() => import('./views/profile/Profile'))

//Reports
const incomeReports = React.lazy(() => import('./views/reports/TotalIncome'))
const popularProductReports = React.lazy(() => import('./views/reports/ProductsReports'))
const locationReports = React.lazy(() => import('./views/reports/LocationReports'))
const productIncomeReports = React.lazy(() => import('./views/reports/ProductIncome'))
const customerReports = React.lazy(() => import('./views/reports/CustomerReport'))

//orders
const orders = React.lazy(() => import('./views/orders/Layout'))
const order = React.lazy(() => import('./views/orders/Order'))

//promo
const promotions = React.lazy(() => import('./views/promotions/Promotions'))

const routes = [
  //main
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  { path: '/categories', exact: true, name: 'Categories', component: categories },
  { path: '/category/:id', exact: true, name: 'Category', component: category },
  { path: '/newcategory', exact: true, name: 'NewCategory', component: addCategory },

  { path: '/products', exact: true, name: 'Products', component: products },
  { path: '/products/:id', exact: true, name: 'Product', component: product },
  { path: '/newproduct', exact: true, name: 'NewProduct', component: addProduct },
  {
    path: '/promo',
    exact: true,
    name: 'Promotions',
    component: promotions,
  },
  { path: '/register', exact: true, name: 'Register', component: register },
  { path: '/employees', exact: true, name: 'Employees', component: employees },
  { path: '/employees/:id', exact: true, name: 'Employee', component: employee },

  { path: '/customers', exact: true, name: 'Customers Details', component: customers },
  { path: '/customers/:id', exact: true, name: 'Customer', component: customer },

  { path: '/orders', exact: true, name: 'Orders', component: orders },
  { path: '/order/:id', exact: true, name: 'Order', component: order },

  { path: '/locations', exact: true, name: 'Locations', component: locations },
  { path: '/location/:id', exact: true, name: 'Location', component: location },
  { path: '/addlocations', exact: true, name: 'AddLocations', component: AddLocation },

  { path: '/profile', exact: true, name: 'Profile', component: profile },
  { path: '/reports/income', exact: true, name: 'Income', component: incomeReports },
  { path: '/reports/popular', exact: true, name: 'Report', component: popularProductReports },
  { path: '/reports/location', exact: true, name: 'Location Reports', component: locationReports },

  {
    path: '/reports/product',
    exact: true,
    name: 'Product Income Reports',
    component: productIncomeReports,
  },
  {
    path: '/reports/customers',
    exact: true,
    name: 'Customers Reports',
    component: customerReports,
  },
]

export default routes
