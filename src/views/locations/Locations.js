import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CBadge,
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
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPen, cilPlus, cilSearch } from '@coreui/icons'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Modal from 'src/components/modal/Modal'
import Alert from './../../components/alert/Alert'

const Locations = () => {
  const history = useHistory()
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  var [responseData, setResponseData] = useState()
  const [searchData, setSearchData] = useState()
  var [display, setDisplay] = useState([])
  const [visible, setVisible] = useState(false)
  const handleClose = () => {
    setVisible(false)
  }
  const [deleteItem, setDeleteItem] = useState()
  const [pagination, setPagination] = useState([])
  const [loader, setLoader] = useState(true)
  const isAdmin = localStorage.getItem('isAdmin')
  const [serverAlert, setServerAlert] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const active = true

  const handleLoadData = async () => {
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delivery/`, {
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
      for (let i = 1; i <= Math.ceil(data.cities.length / 10); i++) {
        pagination.push(i)
      }
      for (let i = 0; i < 10 && i < data.cities.length; i++) {
        display.push(data.cities[i])
      }

      setResponseData(data.cities)
      setLoader(false)
    } catch (err) {
      console.error(err)
    }
  }

  const clearData = () => {
    setActivePage(1)
    display.splice(0, display.length)
    pagination.splice(0, pagination.length)
  }

  function ccyFormat(num) {
    return `${num.toFixed(2)}`
  }
  const search = async () => {
    clearData()
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search/delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ searchData }),
      })

      if (_data.status === 200) {
        const data = await _data.json()
        for (let i = 1; i <= Math.ceil(data.cities.length / 10); i++) {
          pagination.push(i)
        }
        for (let i = 0; i < 10 && i < data.cities.length; i++) {
          display.push(data.cities[i])
        }

        if (data.cities.length > 0) {
          setServerAlert(false)
        }
        setResponseData(data.cities)
        setLoader(false)
      }
      if (_data.status === 404) {
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
        setServerAlert(true)
      }
    } catch (err) {
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
      console.error(err)
    }
  }
  const handleShowData = (page) => {
    setDisplay((prevArray) => [])
    setActivePage(page + 1)

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

      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delivery/delete/` + id, {
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
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
    }
  }
  function refreshPage() {
    window.location.reload()
  }
  useEffect(() => {
    handleLoadData()
  }, [])

  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      {isAdmin === 'true' ? (
        <CButton className="mb-3" color="primary" onClick={() => history.push(`/addlocations`)}>
          <CIcon icon={cilPlus} className="me-2" />
          Add New City
        </CButton>
      ) : undefined}
      <Modal
        open={visible}
        close={setVisible}
        data={handleDeleteData}
        itemID={deleteItem}
        onClick={() => {
          handleClose()
        }}
        titleModal={'Delete City?'}
        descModal={'It will be gone forever'}
        visible={visible}
      />
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>All Deliverable Locations</strong>
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
            <CCardBody>
              <CCol xs={12}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
            </CCardBody>
            {responseData.length > 0 ? (
              <CCardBody>
                <CTable bordered hover>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">City</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Charges</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      {isAdmin === 'true' ? (
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      ) : undefined}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {display.map((item, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.city}</CTableDataCell>
                          <CTableDataCell>LKR {ccyFormat(Number(item.price))}</CTableDataCell>
                          <CTableDataCell>
                            {item.status == 'active' ? (
                              <CBadge color="success">{item.status}</CBadge>
                            ) : (
                              <CBadge color="danger">{item.status}</CBadge>
                            )}
                          </CTableDataCell>
                          {isAdmin === 'true' ? (
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
                                  onClick={() => history.push(`/location/${item._id}`)}
                                >
                                  <CIcon icon={cilPen} className="me-2" />
                                  Edit
                                </CButton>
                              </span>
                            </CTableDataCell>
                          ) : null}
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

export default Locations
