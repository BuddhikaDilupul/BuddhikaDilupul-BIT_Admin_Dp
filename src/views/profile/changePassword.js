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
import Modal from 'src/components/modal/Modal'

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const [loadingButton, setLoadingButton] = useState(false)
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [visible, setVisible] = useState(false)

  const onSubmit = async (data) => {
    setLoadingButton(false)
    setServerAlert(false)
    setVisible(true)
    try {
      setVisible(false)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/reset`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(data),
      })
      if (_data.status === 200) {
        setLoadingButton(false)
        setVisible(true)
        setAlertDetails({ alertMsg: 'Updated Successfully', color: 'success' })
      } else if (_data.status === 400) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Current Password is Wrong', color: 'danger' })
      }
    } catch (err) {
      console.error('Error:', err)
      setLoadingButton(false)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Server Error', color: 'warning' })
    }
  }

  function refreshPage() {
    window.location.reload()
  }

  const handleClose = () => {
    setVisible(false)
  }

  const password = watch('password')
  useEffect(() => {}, [])

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
          titleModal={'Updated Successfully'}
          descModal={'Your password is changed'}
          visible={visible}
        />
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Change Password</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Current Password</CFormLabel>
                  <CFormInput
                    type="Password"
                    id="current_password"
                    name="current_password"
                    placeholder="Current password"
                    invalid={errors.current_password ? true : false}
                    {...register('current_password', {
                      required: 'Required',
                      // minLength: {
                      //   value: 6,
                      //   message: 'Must be include more than 6 characters',
                      // },
                      // maxLength: {
                      //   value: 7,
                      //   message: 'Must be less than 7 characters',
                      // },
                      // pattern: {
                      //   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                      //   message: 'Minimum eight characters, at least one letter and one number:',
                      // },
                    })}
                  />
                  {errors.current_password && (
                    <span style={{ color: 'red' }}>{errors.current_password.message}</span>
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
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                        message: 'Minimum six characters, at least one letter and one number:',
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
                <CButton color="primary" className="px-4" type={'submit'}>
                  {loadingButton ? (
                    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                  ) : undefined}
                  {loadingButton ? 'Loading' : 'Change'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ChangePassword
