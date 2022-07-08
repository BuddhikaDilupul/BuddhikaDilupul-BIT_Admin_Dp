import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
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
import { CChartBar, CChartLine, CChartPie } from '@coreui/react-chartjs'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { addDays } from 'date-fns'
import { DateRangePicker } from 'react-date-range'
import { cilPen, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Alert from 'src/components/alert/Alert'

const ProductIncomeReports = () => {
  const [responseData, setResponseData] = useState({})
  const [count, setCount] = useState({})
  var [display, setDisplay] = useState([])
  const [pagination, setPegination] = useState([])
  const [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [loadingButton, setLoadingButton] = useState(false)
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
    setServerAlert(false)
    clearData()
    try {
      setLoadingButton(true)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/productIncome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ state }),
      })
      if (_data.status === 200) {
        const data = await _data.json()

        for (let i = 1; i <= Math.ceil(data.products.length / 10); i++) {
          pagination.push(i)
        }

        for (let i = 0; i < 10 && i < data.products.length; i++) {
          display.push(data.products[i])
        }
        setLoadingButton(false)
        setCount(data.productCount)
        setResponseData(data.products)
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
              <strong>Product wise Income</strong>
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
      {responseData.length > 0 ? (
        <>
          <CRow>
            <CCol xs={12} sm={6}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Product Income</strong>
                </CCardHeader>

                <CCardBody>
                  <p className="text-medium-emphasis small">
                    Here the all Products of your shop with income.
                  </p>
                  <CTable bordered hover>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Sold Count</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Item Price</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {display.map((item, index) => {
                        return (
                          <CTableRow key={index}>
                            <CTableDataCell>{item[0]}</CTableDataCell>
                            <CTableDataCell>{item[2]}</CTableDataCell>
                            <CTableDataCell>LKR {ccyFormat(item[1])}</CTableDataCell>
                            <CTableDataCell>LKR {ccyFormat(item[1] * item[2])}</CTableDataCell>
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

export default ProductIncomeReports
