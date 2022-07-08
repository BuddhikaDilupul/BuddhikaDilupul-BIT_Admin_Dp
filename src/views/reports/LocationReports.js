import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CSpinner } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { addDays } from 'date-fns'
import { DateRangePicker } from 'react-date-range'
import Alert from 'src/components/alert/Alert'
const LocationReports = () => {
  const [city, setCity] = useState([])
  const [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [count, setCount] = useState([])
  const [loadingButton, setLoadingButton] = useState(false)
  const [value, setValue] = useState(['#FF6384'])
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
      setServerAlert(false)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ state }),
      })

      const data = await _data.json()

      if (_data.status === 200)
        for (let i = 0; i < data.length; i++) {
          city.push(data[i][0])
          count.push(data[i][1])
        }
      if (_data.status === 404) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
      }
      setLoadingButton(false)
    } catch (err) {
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
      setLoadingButton(false)
      console.log(err)
    }
  }
  //clear all prev data
  const clearData = () => {
    count.splice(0, count.length)
    city.splice(0, city.length)
  }
  return (
    <div>
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
      <CRow>
        <CCol xs={12} sm={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Most Ordered City </strong>
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
      {city.length > 0 ? (
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Most Ordered City </strong>
            </CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: city,
                  datasets: [
                    {
                      label: 'Orders count',
                      backgroundColor: '#f87979',
                      data: count,
                    },
                  ],
                }}
                labels="cities"
              />
            </CCardBody>
          </CCard>
        </CCol>
      ) : null}
    </div>
  )
}

export default LocationReports
