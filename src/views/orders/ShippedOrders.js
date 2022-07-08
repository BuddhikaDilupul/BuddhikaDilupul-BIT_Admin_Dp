import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTruck, cilCheck, cilFastfood, cilTrash, cilThumbUp, cilZoom } from '@coreui/icons'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Alert from 'src/components/alert/Alert'
import Modal from 'src/components/modal/Modal'

const ShippedOrders = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const orderData = useSelector((state) => state.shippedOrdersInfo)
  var [display, setDisplay] = useState([])
  const [pagination, setPegination] = useState([])
  const [loader, setLoader] = useState(true)
  const [alertMsg, setAlertMessage] = useState('')
  const [serverAlert, setServerAlert] = useState(false)
  const [visible, setVisible] = useState(false)
  const handleClose = () => {
    setVisible(false)
  }
  const [deleteItem, setDeleteItem] = useState()

  const handleLoadOrders = async () => {
    try {
      for (let i = 1; i <= Math.ceil(orderData.length / 10); i++) {
        pagination.push(i)
      }

      for (let i = 0; i < 10 && i < orderData.length; i++) {
        display.push(orderData[i])
      }

      setLoader(false)
    } catch (err) {
      console.error(err)
      setServerAlert(true)
      setAlertMessage('Internal server Error')
    }
  }

  const handleShowData = (page) => {
    setDisplay((prevArray) => [])

    for (let i = page * 10; i < (page + 1) * 10; i++) {
      if (orderData[i] === undefined) {
        break
      }
      setDisplay((prevArray) => [...prevArray, orderData[i]])
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
      <CCol xs={6}>{serverAlert ? <Alert msg={alertMsg} /> : null}</CCol>
      {orderData.length > 0 ? (
        <CRow>
          <CCol xs={12} sm={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>All Shipped Orders</strong>
              </CCardHeader>
              <CCardBody>
                <p className="text-medium-emphasis small">Here the all Orders in your shop.</p>
                <CTable bordered hover>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">Order Id</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Receiver Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Phone Number</CTableHeaderCell>
                      <CTableHeaderCell scope="col">shipping Address</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {display.map((item, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.orderNumber}</CTableDataCell>
                          <CTableDataCell>{item.receiverName}</CTableDataCell>
                          <CTableDataCell>{item.dateOrder.slice(0, 10)}</CTableDataCell>
                          <CTableDataCell>{item.phoneNumber}</CTableDataCell>
                          <CTableDataCell>{item.shippingAddress}</CTableDataCell>
                          <CTableDataCell>Rs.{item.totalPrice} </CTableDataCell>
                          <CTableDataCell>
                            {item.status == 'delivered' ? (
                              <CBadge color="success">{item.status}</CBadge>
                            ) : null}
                            {item.status == 'processing' ? (
                              <CBadge color="info">{item.status}</CBadge>
                            ) : null}
                            {item.status == 'cancelled' || item.status == 'suspended' ? (
                              <CBadge color="danger">{item.status}</CBadge>
                            ) : null}
                            {item.status == 'shipped' ? (
                              <CBadge color="warning">{item.status}</CBadge>
                            ) : null}
                          </CTableDataCell>
                          <CTableDataCell className="d-flex justify-content-evenly">
                            <span>
                              {item.status === 'cancelled' || item.status === 'delivered' ? (
                                <CButton
                                  color="danger"
                                  size="sm"
                                  onClick={() => {
                                    setVisible(true)
                                    setDeleteItem(item._id)
                                  }}
                                >
                                  <CIcon icon={cilTrash} className="me-2" />
                                  Delete
                                </CButton>
                              ) : null}
                              <CButton
                                color="warning"
                                size="sm"
                                onClick={() => history.push(`/order/${item._id}`)}
                              >
                                <CIcon icon={cilZoom} className="me-2" />
                                View
                              </CButton>
                            </span>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
                <CPagination align="center">
                  {pagination.map((item, index) => {
                    return (
                      <CPaginationItem key={index} onClick={() => handleShowData(index)}>
                        {item}
                      </CPaginationItem>
                    )
                  })}
                </CPagination>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ) : null}
    </>
  )
}

export default ShippedOrders
