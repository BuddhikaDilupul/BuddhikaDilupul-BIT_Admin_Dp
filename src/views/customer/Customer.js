import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import Alert from 'src/components/alert/Alert'
import Modal from 'src/components/modal/Modal'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Orders from './Orders'
import Charts from 'src/components/charts/Charts'
import CIcon from '@coreui/icons-react'
import { cilSend } from '@coreui/icons'

export default function Customer() {
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [loader, setLoader] = useState(true)
  const [customerData, setCustomerData] = useState('')
  const [visible, setVisible] = useState(false)
  const params = useParams()
  var [serverAlert, setServerAlert] = useState(false)
  const id = params.id
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' })
  // const onSubmit = async () => {
  //   const id = params.id

  //   let customer = {
  //     userName: '',
  //     firstName: '',
  //     lastName: '',
  //   }
  //   try {
  //     setLoadingButton(true)
  //     const _data = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/customer/' + id, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer ' + localStorage.getItem('authToken'),
  //       },
  //       body: JSON.stringify(customer),
  //     })

  //     if (_data.status === 200) {
  //       const data = await _data.json()
  //       setLoadingButton(false)
  //       setServerAlert(true)
  //       setAlertDetails({ alertMsg: 'Updated Successfully', color: 'success' })
  //       setResponseData(data)
  //     }
  //   } catch (error) {
  //     console.error('Error:', error)
  //     setLoadingButton(false)
  //     setServerAlert(true)
  //     setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
  //   }
  // }
  const onSubmit = async (data) => {
    try {
      // setLoadingButton(false)
      // setVisible(false)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/customer/` + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(data),
      })
      if (_data.status === 200) {
        setVisible(true)
      }
      setServerAlert(false)
      // setVisible(true)
    } catch (err) {
      console.error('Error:', err)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Server Error', color: 'warning' })
    }
  }
  const handleLoadCustomerData = async () => {
    // const id = params.id
    setLoader(true)

    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/customer/` + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status === 200) {
        const data = await _data.json()
        setCustomerData(data.customer)
        setLoader(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
    }
  }

  function refreshPage() {
    window.location.reload()
  }

  const handleClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    handleLoadCustomerData()
  }, [])
  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
      <CRow>
        <Modal
          open={visible}
          close={setVisible}
          data={refreshPage}
          onClick={() => {
            handleClose()
          }}
          titleModal={'Message sent'}
          descModal={'Email promo sent to the customer'}
          visible={visible}
        />
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>View Customer Details</strong>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlInput1">First Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="firstName"
                  name="firstName"
                  defaultValue={customerData.firstName}
                  readOnly={true}
                  invalid={errors.firstName}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlInput1">Last Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="lastName"
                  name="lastName"
                  readOnly={true}
                  defaultValue={customerData.lastName}
                  invalid={errors.lastName}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlInput1">Email</CFormLabel>
                <CFormInput
                  type="text"
                  id="email"
                  name="email"
                  readOnly={true}
                  defaultValue={customerData.email}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlInput1">Address</CFormLabel>
                <CFormInput
                  type="text"
                  id="address"
                  readOnly={true}
                  name="address"
                  defaultValue={customerData.address}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlInput1">Phone Number</CFormLabel>
                <CFormInput
                  type="text"
                  id="phoneNumber"
                  readOnly={true}
                  name="phoneNumber"
                  defaultValue={customerData.phoneNumber}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Send Promotions</strong> <small>{customerData.firstName}</small>
            </CCardHeader>
            <CCardBody>
              <div className="col-auto mb-3">To : {customerData.email}</div>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <CFormFloating>
                  <CFormTextarea
                    className="mb-3"
                    placeholder="Leave a comment here"
                    id="floatingTextarea2"
                    name="promotion"
                    style={{ height: '100px' }}
                    invalid={errors.promotion ? true : false}
                    {...register('promotion', {
                      required: 'Required',
                    })}
                  ></CFormTextarea>
                  {errors.promotion && (
                    <span style={{ color: 'red' }}>{errors.promotion.message}</span>
                  )}
                  <CFormLabel htmlFor="floatingTextarea2">Type message</CFormLabel>
                </CFormFloating>
                <CButton type="submit">
                  <CIcon icon={cilSend} className="me-2" />
                  Send
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>{' '}
      <CRow>
        <CCol xs={12} sm={12}>
          <CCard className="mb-4">
            <CCardBody>
              {/* table */}
              <Orders id={id} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
