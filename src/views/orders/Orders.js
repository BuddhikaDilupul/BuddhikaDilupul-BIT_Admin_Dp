import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilZoom } from '@coreui/icons'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Alert from 'src/components/alert/Alert'
import Modal from 'src/components/modal/Modal'

const Orders = () => {
  const history = useHistory()
  const order = useSelector((state) => state.ordersInfo)
  const [ordersData, setOrdersData] = useState({})
  var [display, setDisplay] = useState([])
  const [pagination, setPagination] = useState([])
  const [activePage, setActivePage] = useState(1)
  const active = true

  const [loader, setLoader] = useState(true)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [serverAlert, setServerAlert] = useState(false)
  const [visible, setVisible] = useState(false)
  const [searchData, setSearchData] = useState([])

  const [endDate, setEndDate] = useState()
  const [reset, setReset] = useState(false)
  const [startDate, setStartDate] = useState()
  const handleClose = () => {
    setVisible(false)
  }
  const [deleteItem, setDeleteItem] = useState()

  //handle load data
  const handleLoadOrders = async () => {
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/order/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status === 404) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
      }
      const data = await _data.json()
      for (let i = 1; i <= Math.ceil(data.orderList.length / 10); i++) {
        pagination.push(i)
      }

      for (let i = 0; i < 10 && i < data.orderList.length; i++) {
        display.push(data.orderList[i])
      }

      setOrdersData(data.orderList)
      //dispatch({ type: 'orders', ordersInfo: data.orderList })
      setLoader(false)
    } catch (err) {
      console.error(err)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server error', color: 'danger' })
    }
  }

  //clear data in usestate
  const clearData = async () => {
    setActivePage(1)
    display.splice(0, display.length)
    pagination.splice(0, pagination.length)
  }

  //price format
  function ccyFormat(num) {
    return `${num.toFixed(2)}`
  }

  //search
  const search = async () => {
    clearData()
    setServerAlert(false)
    try {
      let _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ startDate, endDate, searchData }),
      })

      if (_data.status === 404) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
      }
      if (_data.status === 200) {
        const data = await _data.json()
        for (let i = 1; i <= Math.ceil(data.orderList.length / 10); i++) {
          pagination.push(i)
        }

        for (let i = 0; i < 10 && i < data.orderList.length; i++) {
          display.push(data.orderList[i])
        }
        setOrdersData(data.orderList)
      }
    } catch (err) {
      console.error(err)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server error', color: 'danger' })
    }
  }

  //handle show data in table
  const handleShowData = (page) => {
    setActivePage(page + 1)
    setDisplay((prevArray) => [])

    for (let i = page * 10; i < (page + 1) * 10; i++) {
      if (ordersData[i] === undefined) {
        break
      }
      setDisplay((prevArray) => [...prevArray, ordersData[i]])
    }
    setLoader(false)
  }

  //delete
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

      if (_data.status === 200) {
        refreshPage()
      }
    } catch (err) {
      console.error(err)
      setServerAlert(true)
      setAlertDetails('Internal server Error')
    }
  }

  //refresh page
  function refreshPage() {
    window.location.reload()
  }

  useEffect(() => {
    handleLoadOrders()
  }, [reset])

  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
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
      <CRow>
        <CCol xs={12} sm={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>All Orders</strong>
            </CCardHeader>
            {ordersData.length > 0 ? (
              <CCardBody>
                {' '}
                <CForm className="row g-4">
                  <div className="col-auto">From </div>
                  <div className="col-auto">
                    <DatePicker
                      dateFormat="yyyy-MM-dd"
                      onChange={(date) => setStartDate(date)}
                      selected={startDate}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={new Date()}
                      calendarStartDay={1}
                    />
                  </div>
                  <div className="col-auto">To </div>
                  <div className="col-auto">
                    <DatePicker
                      dateFormat="yyyy-MM-dd"
                      onChange={(date) => setEndDate(date)}
                      selected={endDate}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      maxDate={new Date()}
                      calendarStartDay={1}
                    />
                  </div>
                  <br />
                  <div className="col-auto">
                    <CFormInput
                      id="search"
                      name="search"
                      placeholder="Search by Name"
                      onChange={(e) => {
                        setSearchData(e.target.value)
                      }}
                    />
                  </div>
                  <div className="col-auto">
                    <CButton color="primary" onClick={() => search()}>
                      <CIcon icon={cilZoom} className="me-2" />
                      Search
                    </CButton>
                  </div>
                  <CCardBody>
                    <CCol xs={12}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
                  </CCardBody>
                </CForm>
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
                          <CTableDataCell>
                            LKR {ccyFormat(item.subTotalPrice + item.city.price)}
                          </CTableDataCell>
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
                {pagination ? (
                  <CPagination align="center">
                    {pagination.map((item, index) => {
                      return (
                        <CPaginationItem
                          key={index}
                          active={activePage === item ? active : null}
                          onClick={() => handleShowData(index)}
                        >
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
    </>
  )
}

export default Orders
