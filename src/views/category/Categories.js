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
import { cilTrash, cilPen, cilPlus, cilZoom } from '@coreui/icons'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Modal from 'src/components/modal/Modal'
import Alert from './../../components/alert/Alert'

const Categories = () => {
  const history = useHistory()
  const [categoryData, setCategoryData] = useState({})
  var [display, setDisplay] = useState([])
  const [visible, setVisible] = useState(false)
  const handleClose = () => {
    setVisible(false)
  }
  const [deleteItem, setDeleteItem] = useState()
  const [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [pagination, setPagination] = useState([])
  const [loader, setLoader] = useState(true)
  const [searchData, setSearchData] = useState()
  const isAdmin = localStorage.getItem('isAdmin')
  const [activePage, setActivePage] = useState(1)
  const active = true
  const handleLoadCategory = async () => {
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/category/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status === 200) {
        const data = await _data.json()
        for (let i = 1; i <= Math.ceil(data.categories.length / 10); i++) {
          pagination.push(i)
        }
        for (let i = 0; i < 10 && i < data.categories.length; i++) {
          display.push(data.categories[i])
        }
        setCategoryData(data.categories)
        setLoader(false)
      }
      if (_data.status === 404) {
        setLoader(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
      }
    } catch (err) {
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
      console.error(err)
    }
  }
  // clear prev data
  const clearData = () => {
    display.splice(0, display.length)
    setActivePage(1)
    pagination.splice(0, pagination.length)
  }

  //search
  const search = async () => {
    clearData()
    setServerAlert(false)
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ searchData }),
      })

      if (_data.status === 200) {
        const data = await _data.json()
        for (let i = 1; i <= Math.ceil(data.categories.length / 10); i++) {
          pagination.push(i)
        }
        for (let i = 0; i < 10 && i < data.categories.length; i++) {
          display.push(data.categories[i])
        }

        if (data.categories.length === 0) {
          setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
          setServerAlert(true)
          setLoader(false)
        }

        setCategoryData(data.categories)
        setLoader(false)
      }
    } catch (err) {
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
      console.error(err)
    }
  }
  //set pagination wise data
  const handleShowData = (page) => {
    setActivePage(page + 1)
    setDisplay((prevArray) => [])

    for (let i = page * 10; i < (page + 1) * 10; i++) {
      if (categoryData[i] === undefined) {
        break
      }
      setDisplay((prevArray) => [...prevArray, categoryData[i]])
    }
  }

  //delete
  const handleDeleteData = async (props) => {
    setLoader(true)
    try {
      const id = props

      const _data = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/category/delete/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status !== 200) {
        throw new Error()
      }
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
    handleLoadCategory()
  }, [])
  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      {isAdmin === 'true' ? (
        <CButton color="primary" className="mb-3" onClick={() => history.push(`/newcategory`)}>
          <CIcon icon={cilPlus} className="me-2" />
          Add New Category
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
        titleModal={'Delete Category?'}
        descModal={
          'Please note that this will affect to all other products under this category! It will be gone forever'
        }
        visible={visible}
      />

      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>All Categories</strong>
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
                    <CIcon icon={cilZoom} className="me-2" />
                    Search
                  </CButton>
                </div>
              </div>
            </CCardBody>
            <CCardBody>
              <CCol xs={12}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
            </CCardBody>
            {categoryData.length > 0 ? (
              <CCardBody>
                <CTable bordered hover>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                      {isAdmin === 'true' ? (
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      ) : undefined}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {display.map((item, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.categoryName}</CTableDataCell>
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
                                  onClick={() => history.push(`/category/${item._id}`)}
                                >
                                  <CIcon icon={cilPen} className="me-2" />
                                  Edit
                                </CButton>
                              </span>
                            </CTableDataCell>
                          ) : undefined}
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
        </CCol>
      </CRow>
    </>
  )
}

export default Categories
