import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
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
import { cilTrash, cilPlus, cilPen, cilZoom } from '@coreui/icons'
import Modal from 'src/components/modal/Modal'
import Alert from 'src/components/alert/Alert'
import LoadingBars from './../../components/skeleton/Skeleton'

const Products = () => {
  const history = useHistory()
  const [responseData, setResponseData] = useState({})
  const [categoryData, setCategoryData] = useState({})
  const [category, setCategory] = useState('all')
  const [deleteProduct, setDeleteProduct] = useState()
  var [display, setDisplay] = useState([])
  const [pagination, setPegination] = useState([])
  const [loader, setLoader] = useState(true)
  const [visible, setVisible] = useState(false)
  const isAdmin = localStorage.getItem('isAdmin')
  const [searchData, setSearchData] = useState()
  const [serverAlert, setServerAlert] = useState(false)
  var [display, setDisplay] = useState([])
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [activePage, setActivePage] = useState(1)
  const active = true
  const handleClose = () => {
    setVisible(false)
  }

  function ccyFormat(num) {
    return `${num.toFixed(2)}`
  }

  const handleLoadProduct = async () => {
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })
      const _dataCategory = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/category/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_dataCategory.status === 200) {
        const data = await _dataCategory.json()
        setCategoryData(data.categories)
        setLoader(false)
      }
      if (_data.status == 200) {
        const data = await _data.json()
        for (let i = 1; i <= Math.ceil(data.products.length / 10); i++) {
          pagination.push(i)
        }

        for (let i = 0; i < 10 && i < data.products.length; i++) {
          display.push(data.products[i])
        }

        setResponseData(data.products)
        setLoader(false)
      }
      if (_data.status == 404) {
        setLoader(false)
        setServerAlert(true)
        setAlertDetails({
          alertMsg: 'No data found ',
          color: 'warning',
        })
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
    setServerAlert(false)
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ searchData, category }),
      })

      if (_data.status === 200) {
        const data = await _data.json()
        for (let i = 1; i <= Math.ceil(data.products.length / 10); i++) {
          pagination.push(i)
        }
        for (let i = 0; i < 10 && i < data.products.length; i++) {
          display.push(data.products[i])
        }

        if (data.products.length > 0) {
          setServerAlert(false)
        }
        setResponseData(data.products)
        setLoader(false)
      }
      if (_data.status === 404) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No product found', color: 'warning' })
      }
    } catch (err) {
      setServerAlert(true)
      setAlertDetails({
        alertMsg: 'We are encountering an issue! ',
        color: 'warning',
      })
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

      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/delete/` + id, {
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
      setAlertDetails({
        alertMsg: 'We are encountering an issue! ',
        color: 'warning',
      })
    }
  }

  function refreshPage() {
    window.location.reload()
  }

  useEffect(() => {
    handleLoadProduct()
  }, [])
  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      {isAdmin === 'true' ? (
        <CButton color="primary" className="mb-3" onClick={() => history.push(`/newproduct`)}>
          <CIcon icon={cilPlus} className="me-2" />
          Add New Product
        </CButton>
      ) : undefined}
      <Modal
        open={visible}
        close={setVisible}
        data={handleDeleteData}
        itemID={deleteProduct}
        onClick={() => {
          handleClose()
        }}
        titleModal={'Delete Product?'}
        descModal={'It will be gone forever'}
        visible={visible}
      />
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>All products</strong>
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
                {categoryData.length > 0 ? (
                  <div className="col-auto">
                    <CFormSelect
                      name="categoryName"
                      aria-label="Default select example"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option
                        value="all"
                        onChange={(e) => {
                          setCategory(e.target.value)
                        }}
                      >
                        All
                      </option>
                      {categoryData.map((item, index) => {
                        return (
                          <option key={index} value={item._id}>
                            {item.categoryName}
                          </option>
                        )
                      })}
                    </CFormSelect>
                  </div>
                ) : null}

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
            {display.length > 0 ? (
              <CCardBody>
                <CTable bordered hover>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">Products</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Stocks</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                      {isAdmin === 'true' ? (
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      ) : null}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {display.map((item, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.productName}</CTableDataCell>
                          <CTableDataCell>{item.inStock}</CTableDataCell>
                          <CTableDataCell>LKR {ccyFormat(item.price)}</CTableDataCell>

                          <CTableDataCell className="d-flex justify-content-evenly">
                            <span>
                              {isAdmin === 'true' ? (
                                <>
                                  <CButton
                                    color="danger"
                                    size="sm"
                                    onClick={() => {
                                      setVisible(true)
                                      setDeleteProduct(item._id)
                                    }}
                                  >
                                    <CIcon icon={cilTrash} className="me-2" />
                                    Delete
                                  </CButton>
                                  <CButton
                                    color="warning"
                                    size="sm"
                                    onClick={() => history.push(`/products/${item._id}`)}
                                  >
                                    <CIcon icon={cilPen} className="me-2" />
                                    Edit
                                  </CButton>
                                </>
                              ) : undefined}
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
        </CCol>
      </CRow>
    </>
  )
}

export default Products
