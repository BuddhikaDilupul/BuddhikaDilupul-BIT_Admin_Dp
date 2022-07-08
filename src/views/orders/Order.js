import React, { useState, useEffect } from 'react'
import LoadingBars from 'src/components/skeleton/Skeleton'
import { useParams } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CFormLabel,
  CTableHead,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CButton,
  CSpinner,
  CBadge,
} from '@coreui/react'
import Alert from 'src/components/alert/Alert'
import DownloadPage from 'src/components/downloadPage/DownloadPage'
import Modal from '../../components/modal/Modal'
import CIcon from '@coreui/icons-react'
import {
  cilCheckCircle,
  cilChevronCircleRightAlt,
  cilPaperPlane,
  cilX,
  cilXCircle,
} from '@coreui/icons'
function ccyFormat(num) {
  return `${num.toFixed(2)}`
}

const Order = () => {
  const [orderData, setOrderData] = useState()
  const [response, setResponse] = useState(200)
  const [loader, setLoader] = useState(true)
  const [serverAlert, setServerAlert] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [status, setStatus] = useState('processing')
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [visible, setVisible] = useState(false)
  const params = useParams()
  let price = 0

  //loading data
  const handleLoadOrder = async () => {
    const id = params.id
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/order/view/` + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status !== 200) {
        throw new Error()
      }

      const data = await _data.json()
      setOrderData(data.order)
      setLoader(false)
    } catch (err) {
      console.error(err)
      setServerAlert(true)
    }
  }

  //updating orders statuses=>shipped ==> delivered
  const handleStatus = async (props) => {
    setLoader(true)
    let status = props
    const id = orderData._id
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/order/` + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ status }),
      })

      if (_data.status === 200) {
        const data = await _data.json()
        setResponse(data)
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Updated successfully!', color: 'success' })
      }
      setLoader(false)
    } catch (err) {
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
      setLoadingButton(false)
      console.error(err)
    }
  }
  const handleClose = () => {
    setVisible(false)
  }
  useEffect(() => {
    handleLoadOrder()
  }, [response])
  //loader
  if (loader) {
    return <LoadingBars />
  }

  return (
    <div>
      <Modal
        open={visible}
        close={setVisible}
        data={handleStatus}
        itemID={status}
        onClick={() => {
          handleClose()
        }}
        titleModal={'Change status of Order?'}
        descModal={'It will update permanently and will sent an email to the client'}
        visible={visible}
      />
      <CRow>
        <CCol xs={5} sm={7}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Billing Details</strong>
            </CCardHeader>

            <CCardBody>
              <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Ordered By
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    {orderData.orderedUser.firstName}
                  </CFormLabel>
                </div>
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Email Address
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-6 col-form-label">
                    {orderData.orderedUser.email}
                  </CFormLabel>
                </div>
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Telephone
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-6 col-form-label">
                    {orderData.orderedUser.phoneNumber}
                  </CFormLabel>
                </div>
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Date
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-6 col-form-label">
                    {orderData.dateOrder.slice(0, 10)}
                  </CFormLabel>
                </div>
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Status
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-6 col-form-label">
                    {orderData.status === 'pending' ? (
                      <CBadge color="primary">{orderData.status}</CBadge>
                    ) : null}
                    {orderData.status === 'processing' ? (
                      <CBadge color="info">{orderData.status}</CBadge>
                    ) : null}
                    {orderData.status === 'shipped' ? (
                      <CBadge color="warning">{orderData.status}</CBadge>
                    ) : null}
                    {orderData.status === 'delivered' ? (
                      <CBadge color="success">{orderData.status}</CBadge>
                    ) : null}
                    {orderData.status === 'cancelled' ? (
                      <CBadge color="danger">{orderData.status}</CBadge>
                    ) : null}
                  </CFormLabel>
                </div>
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Total
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-6 col-form-label">
                    LKR {ccyFormat(orderData.subTotalPrice + orderData.city.price)}
                  </CFormLabel>
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        {orderData.status !== 'cancelled' && orderData.status !== 'delivered' ? (
          <CCol xs={4}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Update status</strong>
              </CCardHeader>

              <CCardBody>
                <CCol xs={12}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
                {/* <CFormSelect
                  onChange={(e) => {
                    setStatus(e.target.value)
                  }}
                  aria-label="Default select example"
                >
                  <option value="processing">processing</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </CFormSelect> */}
                <span>
                  <CButton
                    color="danger"
                    size="sm"
                    className="px-4"
                    onClick={() => {
                      setVisible(true)
                      setStatus('cancelled')
                    }}
                  >
                    {loadingButton ? (
                      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                    ) : (
                      <CIcon icon={cilXCircle} className="me-2" />
                    )}
                    {loadingButton ? 'Loading' : 'Cancel'}
                  </CButton>
                </span>{' '}
                {orderData.status === 'pending' ? (
                  <span>
                    <CButton
                      color="info"
                      size="sm"
                      className="px-4"
                      onClick={() => {
                        setVisible(true)
                        setStatus('processing')
                      }}
                    >
                      {loadingButton ? (
                        <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                      ) : (
                        <CIcon icon={cilChevronCircleRightAlt} className="me-2" />
                      )}
                      {loadingButton ? 'Loading' : 'Processing'}
                    </CButton>
                  </span>
                ) : null}
                {orderData.status === 'processing' ? (
                  <span>
                    <CButton
                      color="warning"
                      size="sm"
                      className="px-4"
                      onClick={() => {
                        setVisible(true)
                        setStatus('shipped')
                      }}
                    >
                      {loadingButton ? (
                        <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                      ) : (
                        <CIcon icon={cilPaperPlane} className="me-2" />
                      )}
                      {loadingButton ? 'Loading' : 'Shipped'}
                    </CButton>
                  </span>
                ) : null}
                {orderData.status === 'shipped' ? (
                  <span>
                    <CButton
                      color="success"
                      size="sm"
                      className="px-4"
                      onClick={() => {
                        setVisible(true)
                        setStatus('delivered')
                      }}
                    >
                      {loadingButton ? (
                        <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                      ) : (
                        <CIcon icon={cilCheckCircle} className="me-2" />
                      )}
                      {loadingButton ? 'Loading' : 'Delivered'}
                    </CButton>
                  </span>
                ) : null}
              </CCardBody>
            </CCard>
          </CCol>
        ) : undefined}
      </CRow>
      <div id="pageToDownload">
        <CRow>
          <CCol xs={6} sm={7}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Shipping Details</strong>
              </CCardHeader>

              <CCardBody>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    Receiver Name
                  </CFormLabel>
                  <div className="col-sm-10">
                    <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                      {orderData.receiverName}
                    </CFormLabel>
                  </div>
                  <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    Telephone
                  </CFormLabel>
                  <div className="col-sm-10">
                    <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                      {orderData.phoneNumber}
                    </CFormLabel>
                  </div>
                  <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    Address
                  </CFormLabel>
                  <div className="col-sm-10">
                    <CFormLabel htmlFor="staticEmail" className="col-sm-6 col-form-label">
                      {orderData.shippingAddress}
                    </CFormLabel>
                  </div>
                  <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    City
                  </CFormLabel>
                  <div className="col-sm-10">
                    <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                      {orderData.city.city}
                    </CFormLabel>
                  </div>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={8} sm={7}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Order Details</strong>
              </CCardHeader>
              <CCardBody>
                <CCol xs={12}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <strong>Order Details Table</strong>{' '}
                      <small>Order ID : {orderData.orderNumber}</small>
                    </CCardHeader>

                    <CTable bordered>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">#</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Product Total</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {orderData.orderItem.map((item, index) => {
                          price = item.quantity * item.product.price
                          return (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{item.product.productName}</CTableDataCell>
                              <CTableDataCell>{item.quantity}</CTableDataCell>
                              <CTableDataCell>LKR {ccyFormat(price)}</CTableDataCell>
                            </CTableRow>
                          )
                        })}
                        <CTableRow>
                          <CTableDataCell></CTableDataCell>
                          <CTableHeaderCell colSpan="2">Sub Total</CTableHeaderCell>
                          <CTableDataCell>LKR {ccyFormat(orderData.subTotalPrice)}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell></CTableDataCell>
                          <CTableHeaderCell colSpan="2">Delivery Charges</CTableHeaderCell>
                          <CTableDataCell>LKR {ccyFormat(orderData.city.price)}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell></CTableDataCell>
                          <CTableHeaderCell colSpan="2">Total Price</CTableHeaderCell>
                          <CTableDataCell>
                            LKR {ccyFormat(orderData.subTotalPrice + orderData.city.price)}
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCard>
                </CCol>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
      <DownloadPage rootElementID="pageToDownload" downloadFileName={orderData._id} />
    </div>
  )
}

export default Order
