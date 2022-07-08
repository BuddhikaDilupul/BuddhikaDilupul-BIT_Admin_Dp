import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'
import Alert from 'src/components/alert/Alert'

const ChangeData = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })
  const [loadingButton, setLoadingButton] = useState(false)
  const [userData, setUserData] = useState()
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })

  const loadUserData = async () => {
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })
      if (_data.status === 200) {
        const data = await _data.json()
        setUserData(data.user)
        setLoadingButton(false)
      }
    } catch (err) {
      console.error('Error:', err)
      setLoadingButton(false)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Server Error', color: 'warning' })
    }
  }
  const onSubmit = async (data) => {
    setLoadingButton(true)
    const id = userData._id
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/` + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(data),
      })
      if (_data.status === 200) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Updated Successfully', color: 'success' })
      } else if (_data.status === 409) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'User Name already exists', color: 'danger' })
      } else if (_data.status === 500) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Server Error', color: 'warning' })
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])
  useEffect(() => {
    // reset form with user data
    reset(userData)
    //reference = https://jasonwatmore.com/post/2021/09/19/react-hook-form-set-form-values-in-useeffect-hook-after-async-data-load
  }, [userData])
  return (
    <>
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Your Details</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">User Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="userName"
                    name="userName"
                    invalid={errors.userName ? true : false}
                    {...register('userName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z]+$/,
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.userName && (
                    <span style={{ color: 'red' }}>{errors.userName.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">First Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="firstName"
                    name="firstName"
                    invalid={errors.firstName ? true : false}
                    {...register('firstName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z]+$/,
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.firstName && (
                    <span style={{ color: 'red' }}>{errors.firstName.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Last Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="lastName"
                    name="lastName"
                    invalid={errors.lastName ? true : false}
                    {...register('lastName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z]+$/, // value: /[A-Za-z]{3}/,value: /[^a-zA-Z\d]{3}/
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.lastName && (
                    <span style={{ color: 'red' }}>{errors.lastName.message}</span>
                  )}
                </div>
                <CButton color="primary" className="px-4" type={'submit'}>
                  {loadingButton ? (
                    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                  ) : undefined}
                  {loadingButton ? 'Loading' : 'Update'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ChangeData
