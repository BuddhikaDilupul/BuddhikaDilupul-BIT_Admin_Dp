import React, { useEffect, useState } from 'react'
import {
  cilArrowRight,
  cilBell,
  cilDollar,
  cilFastfood,
  cilGroup,
  cilLaptop,
  cilMoney,
  cilMoon,
  cilSettings,
  cilUserFollow,
} from '@coreui/icons'
import Alert from './../../components/alert/Alert'
import { CCol, CRow, CWidgetStatsF, CLink } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router-dom'
import LoadingBars from 'src/components/skeleton/Skeleton'

const Dashboard = () => {
  const history = useHistory()
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [serverAlert, setServerAlert] = useState(false)
  const [state, setState] = useState({})
  const [loader, setLoader] = useState(false)

  const handleLoadData = async () => {
    setLoader(true)

    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })
      if (_data.status === 200) {
        const data = await _data.json()
        setState(data.data)
      }
      if (_data.status === 404) {
        setAlertDetails({ alertMsg: 'No data found', color: 'warning' })
        setServerAlert(true)
      }
      setLoader(false)
    } catch (error) {
      console.error('Error:', error)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'warning' })
    }
  }

  useEffect(() => {
    handleLoadData()
  }, [])
  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={24} icon={cilFastfood} size="xl" />}
            title="new orders"
            value={state.todayOrderCount}
            color="primary"
            footer={
              <CLink
                className="font-weight-bold font-xs text-medium-emphasis"
                onClick={() => history.push(`/orders`)}
                rel="noopener norefferer"
                target="_blank"
              >
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={24} icon={cilUserFollow} size="xl" />}
            title="new customers"
            value={state.newCustomer}
            color="info"
            footer={
              <CLink
                className="font-weight-bold font-xs text-medium-emphasis"
                onClick={() => history.push(`/customers`)}
                rel="noopener norefferer"
                target="_blank"
              >
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={24} icon={cilMoon} size="xl" />}
            title="total products"
            value={state.totalProducts}
            color="warning"
            footer={
              <CLink
                className="font-weight-bold font-xs text-medium-emphasis"
                onClick={() => history.push(`/products`)}
                rel="noopener norefferer"
                target="_blank"
              >
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={24} icon={cilDollar} size="xl" />}
            title="today income (LKR)"
            value={state.totalIncome}
            color="danger"
            footer={
              <CLink
                className="font-weight-bold font-xs text-medium-emphasis"
                onClick={() => history.push(`/revenue`)}
                rel="noopener norefferer"
                target="_blank"
              >
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
      </CRow>{' '}
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={24} icon={cilFastfood} size="xl" />}
            title="total orders"
            value={state.totalOrderCount}
            color="primary"
            footer={
              <CLink
                className="font-weight-bold font-xs text-medium-emphasis"
                onClick={() => history.push(`/orders`)}
                rel="noopener norefferer"
                target="_blank"
              >
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={24} icon={cilGroup} size="xl" />}
            title="total customers"
            value={state.totalCustomer}
            color="info"
            footer={
              <CLink
                className="font-weight-bold font-xs text-medium-emphasis"
                onClick={() => history.push(`/customers`)}
                rel="noopener norefferer"
                target="_blank"
              >
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={24} icon={cilMoon} size="xl" />}
            title="total categories"
            value={state.totalCategories}
            color="warning"
            footer={
              <CLink
                className="font-weight-bold font-xs text-medium-emphasis"
                onClick={() => history.push(`/categories`)}
                rel="noopener norefferer"
                target="_blank"
              >
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
        {/* <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={24} icon={cilMoney} size="xl" />}
            title="income"
            value={state.totalIncome}
            color="danger"
            footer={
              <CLink
                className="font-weight-bold font-xs text-medium-emphasis"
                href="https://coreui.io/"
                rel="noopener norefferer"
                target="_blank"
              >
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol> */}
      </CRow>
    </>
  )
}

export default Dashboard
