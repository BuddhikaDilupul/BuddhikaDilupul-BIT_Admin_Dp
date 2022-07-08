import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
import Alert from 'src/components/alert/Alert'
import Modal from '../../components/modal/Modal'

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })
  const [loadingButton, setLoadingButton] = useState(false)
  const [reset, setReset] = useState(false)
  const [visible, setVisible] = useState()
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  function refreshPage() {
    window.location.reload()
  }
  const onSubmit = async (data) => {
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(data),
      })
      if (_data.status === 201) {
        setLoadingButton(false)
        setServerAlert(false)
        setAlertDetails({ alertMsg: 'Updated Successfully', color: 'success' })
        setVisible(true)
      } else if (_data.status === 409) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'User Name or email already exists', color: 'danger' })
      } else if (_data.status === 422) {
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Wrong input. You can check email domain', color: 'danger' })
      }
    } catch (err) {
      console.error('Error:', err)
      setLoadingButton(false)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Server Error', color: 'warning' })
    }
  }

  const handleClose = () => {
    setVisible(false)
    refreshPage()
  }
  const password = watch('password')
  return (
    <>
      <Modal
        open={visible}
        close={(setVisible, refreshPage)}
        data={refreshPage}
        // itemID={deleteItem}
        onClick={() => {
          handleClose()
        }}
        titleModal={'User Added Successfully'}
        descModal={'Employee can now login using credentials'}
        visible={visible}
      />
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add New Employee</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">User Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder="Kamal"
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
                  <CFormLabel htmlFor="exampleFormControlInput1">Email</CFormLabel>
                  <CFormInput
                    type="text"
                    id="email"
                    name="email"
                    placeholder="abc@gmail.com"
                    invalid={errors.email ? true : false}
                    {...register('email', {
                      required: 'Required',
                      pattern: {
                        value:
                          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                        message: 'Enter valid e-mail',
                      },
                    })}
                  />
                  {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">First Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
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
                    placeholder="Last Name"
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
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Password</CFormLabel>
                  <CFormInput
                    type="Password"
                    id="password"
                    name="password"
                    placeholder="password"
                    invalid={errors.password ? true : false}
                    {...register('password', {
                      required: 'Required',
                      minLength: {
                        value: 4,
                        message: 'Must be include more than 4 characters',
                      },
                      maxLength: {
                        value: 6,
                        message: 'Must be less than 7 characters',
                      },
                    })}
                  />
                  {errors.password && (
                    <span style={{ color: 'red' }}>{errors.password.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Confirm Password</CFormLabel>
                  <CFormInput
                    type="Password"
                    id="Password2"
                    name="Password2"
                    placeholder="Confirm Password"
                    invalid={errors.Password2 ? true : false}
                    {...register('Password2', {
                      required: 'Required',
                      validate: (value) => value === password || 'password do no match',
                    })}
                  />
                  {errors.Password2 && (
                    <span style={{ color: 'red' }}>{errors.Password2.message}</span>
                  )}
                </div>
                <CButton color={'primary'} type={'submit'}>
                  Submit
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Register
