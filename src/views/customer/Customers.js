import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPen, cilSearch } from '@coreui/icons'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Modal from 'src/components/modal/Modal'
import Alert from './../../components/alert/Alert'

const Customers = () => {
  const history = useHistory()
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  var [responseData, setResponseData] = useState([])
  const [searchData, setSearchData] = useState()
  var [display, setDisplay] = useState([])
  const [pagination, setPagination] = useState([])
  const [loader, setLoader] = useState(true)
  const [serverAlert, setServerAlert] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const active = true

  const handleClose = () => {
    setVisible(false)
  }
  const [deleteItem, setDeleteItem] = useState()

  const handleLoadCustomers = async () => {
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/customer/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status === 200) {
        const data = await _data.json()

        for (let i = 1; i <= Math.ceil(data.customers.length / 10); i++) {
          pagination.push(i)
        }

        for (let i = 0; i < 10 && i < data.customers.length; i++) {
          display.push(data.customers[i])
        }
        setResponseData(data.customers)
        setLoader(false)
      }
      if (_data.status === 404) {
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
        setServerAlert(true)
        setLoader(false)
      }
    } catch (err) {
      console.error(err)
      setServerAlert(true)
      setAlertDetails({
        alertMsg: 'We are encountering an issue! ',
        color: 'warning',
      })
    }
  }

  const clearData = () => {
    setActivePage(1)
    display.splice(0, display.length)
    pagination.splice(0, pagination.length)
  }
  const search = async () => {
    clearData()
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ searchData }),
      })

      if (_data.status === 200) {
        const data = await _data.json()
        for (let i = 1; i <= Math.ceil(data.customers.length / 10); i++) {
          pagination.push(i)
        }
        for (let i = 0; i < 10 && i < data.customers.length; i++) {
          display.push(data.customers[i])
        }

        if (data.customers.length > 0) {
          setServerAlert(false)
        }
        setResponseData(data.customers)
      }

      if (_data.status === 404) {
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
        setServerAlert(true)
      }
      setLoader(false)
    } catch (err) {
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'warning' })
      console.error(err)
    }
  }
  const handleShowData = (page) => {
    setActivePage(page + 1)
    setDisplay((prevArray) => [])

    for (let i = page * 10; i < (page + 1) * 10; i++) {
      if (responseData[i] === undefined) {
        break
      }
      setDisplay((prevArray) => [...prevArray, responseData[i]])
    }
  }

  const handleDeleteData = async (props) => {
    try {
      const id = props

      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/customer/delete/` + id, {
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
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'warning' })
    }
  }
  function refreshPage() {
    window.location.reload()
  }
  useEffect(() => {
    handleLoadCustomers()
  }, [])
  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
      <Modal
        open={visible}
        close={setVisible}
        data={handleDeleteData}
        itemID={deleteItem}
        onClick={() => {
          handleClose()
        }}
        titleModal={'Delete Customer?'}
        descModal={'It will be gone forever'}
        visible={visible}
      />
      <CRow>
        <CCol xs={8}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>All Customers</strong>
            </CCardHeader>
            <CCardBody>
              <div className="row g-3">
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
                    <CIcon icon={cilSearch} className="me-2" />
                    Search
                  </CButton>
                </div>
              </div>
            </CCardBody>
            {responseData.length > 0 ? (
              <CCardBody>
                <p className="text-medium-emphasis small">Here the all Customers of your shop.</p>
                <CTable bordered hover>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">First Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Phone Number</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {display.map((item, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.cusNumber}</CTableDataCell>
                          <CTableDataCell>{item.firstName}</CTableDataCell>
                          <CTableDataCell>{item.lastName}</CTableDataCell>
                          <CTableDataCell>{item.email}</CTableDataCell>
                          <CTableDataCell>{item.phoneNumber}</CTableDataCell>
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
                                onClick={() => history.push(`/customers/${item._id}`)}
                              >
                                <CIcon icon={cilPen} className="me-2" />
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
              </CCardBody>
            ) : null}
          </CCard>
          {/* {serverAlert ? (
          <Alert visible={serverAlert} color="danger" message="We are encountering an issue." />
        ) : null} */}
        </CCol>
      </CRow>
    </>
  )
}

export default Customers
