import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { addDays } from 'date-fns'
import { DateRangePicker } from 'react-date-range'
import 'react-datepicker/dist/react-datepicker.css'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CHeader,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
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
import Charts from 'src/components/charts/Charts'

const Orders = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const order = useSelector((state) => state.ordersInfo)
  const [ordersData, setOrdersData] = useState({})
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState([])
  var [display, setDisplay] = useState([])
  const [pagination, setPagination] = useState([])
  const [loader, setLoader] = useState(true)
  const [alertMsg, setAlertMessage] = useState('')
  const [serverAlert, setServerAlert] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [visible, setVisible] = useState(false)
  const [searchData, setSearchData] = useState([])
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: 'selection',
    },
  ])
  const [endDate, setEndDate] = useState()
  const [reset, setReset] = useState(false)
  const handleClose = () => {
    setVisible(false)
  }
  const [deleteItem, setDeleteItem] = useState()
  const id = props.id
  const handleLoadOrders = async () => {
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/` + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status !== 200) {
        setServerAlert(true)
        setAlertMessage('Oops! Something Went Wrong!')
      }

      const data = await _data.json()
      for (let i = 1; i <= Math.ceil(data.orderList.length / 10); i++) {
        pagination.push(i)
      }

      for (let i = 0; i < 10 && i < data.orderList.length; i++) {
        display.push(data.orderList[i])
      }

      setOrdersData(data.orderList)
      setProducts(data.products)
      setCategory(data.category)
      //dispatch({ type: 'orders', ordersInfo: data.orderList })
      setLoader(false)
    } catch (err) {
      console.error(err)
      setServerAlert(true)
      setAlertMessage('Internal server Error')
    }
  }
  const clearData = async () => {
    display.splice(0, display.length)
    pagination.splice(0, pagination.length)
  }
  const search = async () => {
    clearData()
    try {
      let _data

      _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ state, searchData }),
      })

      if (_data.status !== 200) {
        setServerAlert(true)
        setAlertMessage('Oops! Something Went Wrong!')
      }

      const data = await _data.json()
      for (let i = 1; i <= Math.ceil(data.orderList.length / 10); i++) {
        pagination.push(i)
      }

      for (let i = 0; i < 10 && i < data.orderList.length; i++) {
        display.push(data.orderList[i])
      }
      setOrdersData(data.orderList)
    } catch (err) {
      console.error(err)
      setServerAlert(true)
      setAlertMessage('Internal server Error')
    }
  }
  const handleShowData = (page) => {
    setDisplay((prevArray) => [])

    for (let i = page * 10; i < (page + 1) * 10; i++) {
      if (ordersData[i] === undefined) {
        break
      }
      setDisplay((prevArray) => [...prevArray, ordersData[i]])
    }
    setLoader(false)
  }
  const handleDeleteData = async (props) => {
    try {
      const id = props

      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/order/delete/` + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status !== 200) {
        setServerAlert(true)
        setAlertMessage('Oops! Something Went Wrong!')
      }
      if (_data.status === 200) {
        refreshPage()
      }
    } catch (err) {
      console.error(err)
      setServerAlert(true)
      setAlertMessage('Internal server Error')
    }
  }
  function refreshPage() {
    window.location.reload()
  }

  useEffect(() => {
    handleLoadOrders()
  }, [reset])
  // useEffect(() => {}, [search])
  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      {ordersData.length > 0 ? (
        <>
          <CCol xs={12} sm={12}>
            {serverAlert ? <Alert msg={alertMsg} /> : null}
          </CCol>
          <Modal
            open={visible}
            close={setVisible}
            data={handleDeleteData}
            itemID={deleteItem}
            onClick={() => {
              handleClose()
            }}
            titleModal={'Delete Order?'}
            descModal={'It will be gone forever'}
            visible={visible}
          />
          {/* <CRow>
        <CCol xs={12} sm={12}>
          <CCard className="mb-4">
            <CCardHeader>Search Orders</CCardHeader>
            <CCardBody>
              <CForm className="row g-4">
                <div className="col-auto">
                  <DateRangePicker
                    onChange={(item) => setState([item.selection])}
                    showSelectionPreview={false}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={state}
                    direction="horizontal"
                    maxDate={new Date()}
                  />
                </div>
                <div className="col-auto">
                  <CFormInput
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    defaultValue={searchData}
                    onChange={(e) => {
                      setSearchData(e.target.value)
                    }}
                  />
                </div>
                <div className="col-auto">
                  <CButton
                    color="primary"
                    size="sm"
                    className="px-4"
                    onClick={() => {
                      search()
                    }}
                  >
                    {loadingButton ? (
                      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                    ) : undefined}
                    {loadingButton ? 'Loading' : 'Search'}
                  </CButton>
                  <CButton
                    color="warning"
                    size="sm"
                    className="px-4"
                    onClick={() => {
                      refreshPage()
                    }}
                  >
                    Reset
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
          <CRow>
            <CCol xs={12} sm={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Orders History</strong>
                </CCardHeader>
                {ordersData.length > 0 ? (
                  <CCardBody>
                    <p className="text-medium-emphasis small">
                      Here the all Orders of this customer.
                    </p>
                    <CTable bordered hover>
                      <CTableHead color="dark">
                        <CTableRow>
                          <CTableHeaderCell scope="col">Order ID</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Receiver Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Phone Number</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Shipping Address</CTableHeaderCell>
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
                              <CTableDataCell>LKR {item.totalPrice} </CTableDataCell>
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
                                {item.status == 'pending' ? (
                                  <CBadge color="primary">{item.status}</CBadge>
                                ) : null}
                              </CTableDataCell>
                              <CTableDataCell className="d-flex justify-content-evenly">
                                <span>
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
                    {pagination ? (
                      <CPagination align="center">
                        {pagination.map((item, index) => {
                          return (
                            <CPaginationItem key={index} onClick={() => handleShowData(index)}>
                              {item}
                            </CPaginationItem>
                          )
                        })}
                      </CPagination>
                    ) : null}
                  </CCardBody>
                ) : null}
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6} sm={6}>
              <Charts data={products} tittle={'Most ordered Products'} />
            </CCol>
            <CCol xs={6} sm={6}>
              <Charts data={category} tittle="Most ordered Categories" />
            </CCol>
          </CRow>
        </>
      ) : (
        <>
          <CHeader>
            <strong>No Order History Data Found</strong>
          </CHeader>
        </>
      )}
    </>
  )
}

export default Orders
Orders.propTypes = {
  id: PropTypes.string,
}
