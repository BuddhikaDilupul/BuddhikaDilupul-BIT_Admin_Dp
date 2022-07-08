import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Alert from 'src/components/alert/Alert'
import Modal from 'src/components/modal/Modal'

const Reset = () => {
  const [token, setToken] = useState(false)
  const [loader, setLoader] = useState(false)
  const [serverAlert, setServerAlert] = useState(false)
  const [visible, setVisible] = useState(false)
  const [alertDetails, setAlertDetails] = useState({
    alertMsg: 'Email or username is invalid',
    color: 'danger',
  })
  const [loadingButton, setLoadingButton] = useState(false)

  const history = useHistory()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const changePassword = async (data) => {
    try {
      setLoadingButton(true)
      // const data = { userName: username, password: password }
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (_data.status === 200) {
        // setServerAlert(true)
        setVisible(true)
        setLoadingButton(false)
      }
      if (_data.status === 404) {
        setServerAlert(true)
        setLoadingButton(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const toLogin = () => {
    history.push('/login')
  }
  const handleClose = () => {
    setVisible(false)
  }

  useEffect(() => {}, [])

  if (loader) {
    return <LoadingBars />
  }

  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={4}>
              <CCardGroup>
                <CCard className="p-4">
                  {serverAlert ? <Alert data={alertDetails} /> : null}
                  <CCardBody>
                    <Modal
                      open={visible}
                      close={setVisible}
                      data={toLogin}
                      onClick={() => {
                        handleClose()
                      }}
                      titleModal={'Password  Reset!'}
                      descModal={'Please change your password in your first login!'}
                      visible={visible}
                    />
                    <CForm onSubmit={handleSubmit(changePassword)}>
                      <h1>Ruwan Bakehouse</h1>
                      <h3>Change Your Password</h3>
                      <div className="mb-3">
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            id="userName"
                            name="userName"
                            placeholder="Username"
                            invalid={errors.userName ? true : false}
                            {...register('userName', {
                              required: '  Username Required',
                            })}
                          />
                        </CInputGroup>
                        {errors.userName && (
                          <span style={{ color: 'red' }}>{errors.userName.message}</span>
                        )}
                      </div>

                      <CInputGroup className="mb-3">
                        <CInputGroupText id="addon-wrapping">@</CInputGroupText>{' '}
                        {errors.username && (
                          <span style={{ color: 'red' }}>{errors.username.message}</span>
                        )}
                        <CFormInput
                          type="text"
                          id="email"
                          name="email"
                          placeholder="email"
                          // onChange={(e) => setPassword(e.target.value)}
                          invalid={errors.email ? true : false}
                          {...register('email', {
                            required: '  email Required',
                          })}
                        />
                      </CInputGroup>
                      {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
                      <CRow>
                        <CButton color="warning" className="px-4" type="submit">
                          {loadingButton ? (
                            <CSpinner
                              component="span"
                              size="sm"
                              variant="grow"
                              aria-hidden="true"
                            />
                          ) : undefined}
                          {loadingButton ? 'Loading' : 'Reset Password'}
                        </CButton>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Reset
