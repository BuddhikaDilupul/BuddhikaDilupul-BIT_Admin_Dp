import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
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
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { addDays } from 'date-fns'
import { DateRangePicker } from 'react-date-range'
import { cilPen, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Alert from 'src/components/alert/Alert'

const CustomerReports = () => {
  const history = useHistory()
  const [loadingButton, setLoadingButton] = useState(false)
  const [responseData, setResponseData] = useState({})
  var [display, setDisplay] = useState([])
  const [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [pagination, setPagination] = useState([])
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: 'selection',
    },
  ])
  function ccyFormat(num) {
    return `${num.toFixed(2)}`
  }
  const loadData = async () => {
    clearData()
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/reports/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ state }),
      })
      setLoadingButton(true)
      if (_data.status === 200) {
        setServerAlert(false)
        const data = await _data.json()

        for (let i = 1; i <= Math.ceil(data.length / 10); i++) {
          pagination.push(i)
        }

        for (let i = 0; i < 10 && i < data.length; i++) {
          display.push(data[i])
        }
        setResponseData(data)
        setLoadingButton(false)
      }
      if (_data.status === 404) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
        setLoadingButton(false)
      }
      if (_data.status === 401) {
        setServerAlert(true)
        setLoadingButton(false)
        setAlertDetails({ alertMsg: 'Unauthorized access', color: 'warning' })
      }
    } catch (err) {
      setLoadingButton(false)
      setServerAlert(true)
      setAlertDetails({ alertMsg: '', color: 'warning' })
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
  return (
    <div>
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>

      <CRow>
        <CCol xs={12} sm={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Customer Loyalty</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-4">
                <div className="col-auto">
                  <DateRangePicker
                    onChange={(item) => setState([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={state}
                    direction="horizontal"
                    maxDate={new Date()}
                  />
                </div>
                <div className="col-auto">
                  <CButton
                    color="primary"
                    size="sm"
                    className="px-4"
                    onClick={() => {
                      loadData()
                    }}
                  >
                    {loadingButton ? (
                      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                    ) : undefined}
                    {loadingButton ? 'Loading' : 'Generate'}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {display.length > 0 ? (
        <>
          <CRow>
            <CCol xs={12} sm={6}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Customer Loyalty</strong>
                </CCardHeader>

                <CCardBody>
                  <p className="text-medium-emphasis small">
                    Here the all Customer Loyalty Reports of your shop.
                  </p>
                  <CTable bordered hover>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Customer</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Ordered Count</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {display.map((item, index) => {
                        return (
                          <CTableRow key={index}>
                            <CTableDataCell>
                              {item[0].firstName + ' ' + item[0].lastName}
                            </CTableDataCell>
                            <CTableDataCell>{item[0].count}</CTableDataCell>
                            <CTableDataCell>LKR {ccyFormat(item[0].price)}</CTableDataCell>
                            <CTableDataCell className="d-flex justify-content-evenly">
                              <span>
                                <CButton
                                  color="warning"
                                  size="sm"
                                  onClick={() => history.push(`/customers/${item[0].id}`)}
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
      ) : null}
    </div>
  )
}

export default CustomerReports
