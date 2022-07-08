import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilRestaurant,
  cilFastfood,
  cilBurger,
  cilGroup,
  cilUserFollow,
  cilLocationPin,
  cilDollar,
  cilFile,
  cilUser,
  cilGraph,
  cilPaperclip,
  cilSend,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _navAdmin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: 'Inventory',
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/categories',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Products Details',
    to: '/products',
    icon: <CIcon icon={cilBurger} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Locations',
  },

  {
    component: CNavItem,
    name: 'Delivery Locations',
    to: '/locations',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Orders',
  },
  {
    component: CNavItem,
    name: 'Orders Management',
    to: '/orders',
    icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Users',
  },
  {
    component: CNavGroup,
    name: 'Users Management',
    to: '/users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Customers Details',
        to: '/customers',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Employees Details',
        to: '/employees',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add Employee',
        to: '/register',
        icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Reports',
  },
  {
    component: CNavItem,
    name: 'Income Management',
    to: '/reports/income',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Location Reports',
    to: '/reports/location',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Customer Loyalty',
    to: '/reports/customers',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Popular Products',
    to: '/reports/popular',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Product Income Reports',
    to: '/reports/product',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Promotions',
  },
  {
    component: CNavItem,
    name: 'Promotions',
    to: '/promo',
    icon: <CIcon icon={cilSend} customClassName="nav-icon" />,
  },
]
export default _navAdmin
