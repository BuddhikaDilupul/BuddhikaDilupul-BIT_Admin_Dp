import React, { useState } from 'react'
import {
  CBadge,
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
import { CChartBar } from '@coreui/react-chartjs'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { addDays } from 'date-fns'
import { DateRangePicker } from 'react-date-range'
import Alert from 'src/components/alert/Alert'
const Revenue = () => {
  const [total, setTotal] = useState([])
  const [loadingButton, setLoadingButton] = useState(false)
  const [pagination, setPagination] = useState([])
  const [dates, setDates] = useState([])
  var [responseData, setResponseData] = useState([])
  var [display, setDisplay] = useState([])
  const [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
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
      setLoadingButton(true)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/income`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ state }),
      })

      if (_data.status === 200) {
        setServerAlert(false)
        const data = await _data.json()
        for (let i = 1; i <= Math.ceil(data.totalIncome.length / 10); i++) {
          pagination.push(i)
        }
        for (let i = 0; i < 10 && i < data.totalIncome.length; i++) {
          display.push(data.totalIncome[i])
        }
        for (let i = 0; i < data.totalIncome.length; i++) {
          total.push(data.totalIncome[i][1])
          dates.push(data.totalIncome[i][0])
        }
        setResponseData(data.totalIncome)

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
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
      console.log(err)
    }
  }
  //clear all prev data
  const clearData = () => {
    display.splice(0, display.length)
    responseData.splice(0, responseData.length)
    pagination.splice(0, pagination.length)
    total.splice(0, total.length)
    dates.splice(0, dates.length)
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
              <strong>Overall Income</strong>
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
                  <strong>Income Report</strong>
                </CCardHeader>

                <CCardBody>
                  <p className="text-medium-emphasis small">Here the income report of your shop.</p>
                  <CTable bordered hover>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Total Income</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {display.map((item, index) => {
                        return (
                          <CTableRow key={index}>
                            <CTableDataCell>{item[0]}</CTableDataCell>
                            <CTableDataCell>LKR {ccyFormat(item[1])}</CTableDataCell>
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
      {total.length > 0 ? (
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Income of Your Shop </strong>
              </CCardHeader>
              <CCardBody>
                <CChartBar
                  data={{
                    labels: dates,
                    datasets: [
                      {
                        label: 'LKR',
                        backgroundColor: '#f87979',
                        data: total,
                      },
                    ],
                  }}
                  labels="months"
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ) : null}
    </div>
  )
}

export default Revenue
