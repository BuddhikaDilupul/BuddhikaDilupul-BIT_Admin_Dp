import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  ordersInfo: {},
  shippedOrdersInfo: {},
  deliveredOrdersInfo: {},
  pendingOrdersInfo: {},
  processingOrdersInfo: {},
  cancelledOrdersInfo: {},
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'orders':
      return { ...state, ...rest }
    case 'shippedOrders':
      return { ...state, ...rest }
    case 'deliveredOrders':
      return { ...state, ...rest }
    case 'pendingOrdersInfo':
      return { ...state, ...rest }
    case 'cancelledOrders':
      return { ...state, ...rest }
    case 'processingOrders':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
