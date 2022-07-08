import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilStar,
  cilRestaurant,
  cilFastfood,
  cilBurger,
  cilLocationPin,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
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
    component: CNavItem,
    name: 'Categories',
    to: '/categories',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'products',
    to: '/products',
    icon: <CIcon icon={cilBurger} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Delivery Locations',
    to: '/locations',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Orders Management',
    to: '/orders',
    icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
  },
]

export default _nav
