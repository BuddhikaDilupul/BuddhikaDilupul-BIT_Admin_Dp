import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
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
import DatePicker from 'react-datepicker'
import Alert from 'src/components/alert/Alert'
import 'react-datepicker/dist/react-datepicker.css'
import { cilZoom } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ProductWisCustomerReport = (props) => {
  const [loadingButton, setLoadingButton] = useState(false)
  const [responseData, setResponseData] = useState({})
  var [display, setDisplay] = useState([])
  const [pagination, setPagination] = useState([])
  const [startDate, setStartDate] = useState()
  const [searchData, setSearchData] = useState()
  const [endDate, setEndDate] = useState()
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({
    alertMsg: 'No order found',
    color: 'warning',
  })

  const id = props.data
  const loadData = async () => {
    clearData()
    try {
      const _data = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/reports/product/sold/` + id,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
          body: JSON.stringify({ startDate, endDate, searchData }),
        },
      )
      setLoadingButton(true)
      if (_data.status === 200) {
        const data = await _data.json()
        setServerAlert(false)
        for (let i = 1; i <= Math.ceil(data.length / 10); i++) {
          pagination.push(i)
        }

        for (let i = 0; i < 10 && i < data.length; i++) {
          if (data[i][2] > 0) display.push(data[i])
        }
        setResponseData(data)
        setLoadingButton(false)
      }
      if (_data.status === 404) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
        setLoadingButton(false)
      }
      if (display.length === 0) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No one ordered this product', color: 'warning' })
        setLoadingButton(false)
      }
      if (_data.status === 401) {
        setServerAlert(true)
        setLoadingButton(false)
        setAlertDetails({ alertMsg: 'Unauthorized access', color: 'warning' })
      }
    } catch (err) {
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
      console.log(err, 'error')
    }
  }
  //clear all prev data
  const clearData = () => {
    display.splice(0, display.length)
    pagination.splice(0, pagination.length)
  }
  const handleShowData = (page) => {
    setDisplay((prevArray) => [])

    for (let i = page * 10; i < (page + 1) * 10; i++) {
      if (responseData[i] === undefined) {
        break
      }
      setDisplay((prevArray) => [...prevArray, responseData[i]])
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <div>
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Customer Loyalty for this Product</strong>
            </CCardHeader>
            <CCardBody>
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
                  <CButton color="primary" onClick={() => loadData()}>
                    <CIcon icon={cilZoom} className="me-2" />
                    Search
                  </CButton>
                </div>
              </CForm>

              <br />
              {display.length > 0 ? (
                <>
                  <CRow>
                    <CCol xs={12} sm={12}>
                      <CCard className="mb-4">
                        <CCardBody>
                          <CCol xs={12}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
                          <CTable bordered hover>
                            <CTableHead color="dark">
                              <CTableRow>
                                <CTableHeaderCell scope="col">Customer</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Order Count</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Product Count</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Avg</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {display.map((item, index) => {
                                return (
                                  <CTableRow key={index}>
                                    <CTableDataCell>{item[0]}</CTableDataCell>
                                    <CTableDataCell>{item[2]}</CTableDataCell>
                                    <CTableDataCell>{item[1]}</CTableDataCell>
                                    <CTableDataCell>
                                      {item[2] / item[1] ? Math.round(item[1] / item[2]) : 0}
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
                </>
              ) : (
                <CCol xs={12}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default ProductWisCustomerReport
ProductWisCustomerReport.propTypes = {
  data: PropTypes.string,
}
