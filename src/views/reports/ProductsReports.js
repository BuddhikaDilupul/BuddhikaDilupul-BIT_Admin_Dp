import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CRow,
  CSpinner,
} from '@coreui/react'
import { CChartBar, CChartLine, CChartPie } from '@coreui/react-chartjs'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { addDays } from 'date-fns'
import Alert from 'src/components/alert/Alert'
import { DateRangePicker } from 'react-date-range'

const ProductReports = () => {
  const [products, setProducts] = useState([])
  const [count, setCount] = useState([])
  const [value, setValue] = useState(['#FF6384'])
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [serverAlert, setServerAlert] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: 'selection',
    },
  ])

  const loadData = async () => {
    clearData()
    try {
      setLoadingButton(true)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ state }),
      })
      if (_data.status === 200) {
        const data = await _data.json()
        setServerAlert(false)

        for (let i = 0; i < data.length; i++) {
          products.push(data[i][0])
          count.push(data[i][1])
        }
        setLoadingButton(false)
      }
      if (_data.status === 404) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
        setLoadingButton(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  //clear all prev data
  const clearData = () => {
    count.splice(0, count.length)
    products.splice(0, products.length)
  }
  return (
    <div>
      <CRow>
        <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>

        <CCol xs={12} sm={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Summery of Sold Products</strong>
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
      {products.length > 0 ? (
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Summery of Sold Products</strong>
            </CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: products,
                  datasets: [
                    {
                      label: 'Sold count',
                      backgroundColor: '#f87979',
                      data: count,
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </CCol>
      ) : null}
    </div>
  )
}

export default ProductReports
