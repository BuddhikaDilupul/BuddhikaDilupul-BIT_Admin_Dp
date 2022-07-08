import { cilCheck, cilFastfood, cilTruck, cilX, cilLoopCircular, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCol, CRow, CWidgetStatsF } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Orders from './Orders'
import CancelledOrders from './CancelledOrders'
import DeliveredOrders from './DeliveredOrders'
import ProcessingOrders from './ProcessingOrders'
import ShippedOrders from './ShippedOrders'
import LoadingBars from 'src/components/skeleton/Skeleton'
import PendingOrders from './pendingOrders'

//layout of order page
const Layout = () => {
  const [state, setState] = useState(0)
  const [shippedOrders, setShippedOrders] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [deliveredOrders, setDelivered] = useState([])
  const [processingOrders, setProcessingOrders] = useState([])
  const [cancelledOrders, setCancelledOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  //redux
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(true)
  const handleLoadOrders = async () => {
    try {
      const _all = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/order/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      const all = await _all.json()
      setAllOrders(all.orderList)
      for (let i = 0; i < all.orderList.length; i++) {
        if (all.orderList[i].status === 'pending') {
          pendingOrders.push(all.orderList[i])
        } else if (all.orderList[i].status === 'processing') {
          processingOrders.push(all.orderList[i])
        } else if (all.orderList[i].status === 'shipped') {
          shippedOrders.push(all.orderList[i])
        } else if (all.orderList[i].status === 'delivered') {
          deliveredOrders.push(all.orderList[i])
        } else if (all.orderList[i].status === 'cancelled') {
          cancelledOrders.push(all.orderList[i])
        }
      }
      //store data in redux store
      dispatch({ type: 'orders', ordersInfo: allOrders })
      dispatch({ type: 'processingOrders', pendingOrdersInfo: pendingOrders })
      dispatch({ type: 'pendingOrders', processingOrdersInfo: processingOrders })
      dispatch({ type: 'shippedOrders', shippedOrdersInfo: shippedOrders })
      dispatch({ type: 'deliveredOrders', deliveredOrdersInfo: deliveredOrders })
      dispatch({ type: 'cancelledOrders', cancelledOrdersInfo: cancelledOrders })

      setLoader(false)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    handleLoadOrders()
  }, [])
  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            onClick={() => setState(0)}
            style={{ cursor: 'pointer' }}
            className="mb-3"
            icon={<CIcon width={24} icon={cilFastfood} size="xl" />}
            title="All Orders"
            value={allOrders.length}
            color="primary"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            onClick={() => setState(1)}
            style={{ cursor: 'pointer' }}
            className="mb-3"
            icon={<CIcon width={24} icon={cilPlus} size="xl" />}
            title="Pending Orders"
            value={pendingOrders.length}
            color="primary"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            onClick={() => setState(2)}
            style={{ cursor: 'pointer' }}
            className="mb-3"
            icon={<CIcon width={24} icon={cilLoopCircular} size="xl" />}
            title="Processing"
            value={processingOrders.length}
            color="info"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            onClick={() => setState(3)}
            style={{ cursor: 'pointer' }}
            className="mb-3"
            icon={<CIcon width={24} icon={cilTruck} size="xl" />}
            title="Shipped"
            value={shippedOrders.length}
            color="warning"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            onClick={() => setState(4)}
            style={{ cursor: 'pointer' }}
            className="mb-3"
            icon={<CIcon width={24} icon={cilCheck} size="xl" />}
            title="Delivered"
            value={deliveredOrders.length}
            color="success"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            onClick={() => setState(5)}
            style={{ cursor: 'pointer' }}
            className="mb-3"
            icon={<CIcon width={24} icon={cilX} size="xl" />}
            title="Cancelled"
            value={cancelledOrders.length}
            color="danger"
          />
        </CCol>
      </CRow>

      {state == 0 ? <Orders /> : null}
      {state == 1 ? <PendingOrders /> : null}
      {state == 2 ? <ProcessingOrders /> : null}
      {state == 3 ? <ShippedOrders /> : null}
      {state == 4 ? <DeliveredOrders /> : null}
      {state == 5 ? <CancelledOrders /> : null}
    </>
  )
}

export default Layout
