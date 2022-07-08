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
const Login = () => {
  const [token, setToken] = useState(false)
  const [loader, setLoader] = useState(false)
  const [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({
    alertMsg: 'Email or Password is invalid',
    color: 'danger',
  })
  const [loadingButton, setLoadingButton] = useState(false)

  const history = useHistory()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })
  const authenticateUser = async (data) => {
    try {
      setLoadingButton(true)
      // const data = { userName: username, password: password }
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (_data.status === 404) {
        setServerAlert(true)
        setLoadingButton(false)
      }
      if (_data.status === 200) {
        const data = await _data.json()
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('isAdmin', data.user.isAdmin)
        localStorage.setItem('authUser', data.user.firstName)
        localStorage.setItem('authID', data.user._id)
        setLoadingButton(false)
        history.push('/dashboard')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const authToken = async () => {
    setLoader(true)
    const token = localStorage.getItem('authToken')
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/authtoken`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      if (_data.status === 200) {
        setToken(true)
        history.push('/')
      } else {
        setLoader(false)
        setToken(false)
        history.push('/login')
      }
    } catch (err) {
      console.log('error', err)
    }
  }
  useEffect(() => {
    authToken()
  }, [])

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
                    <CForm onSubmit={handleSubmit(authenticateUser)}>
                      <h1>Ruwan Bakehouse</h1>
                      <h3>Login Portal</h3>
                      <p className="text-medium-emphasis">Sign In to your account</p>
                      {/* <img src="chef.png" /> */}
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
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        {errors.username && (
                          <span style={{ color: 'red' }}>{errors.username.message}</span>
                        )}
                        <CFormInput
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          // onChange={(e) => setPassword(e.target.value)}
                          invalid={errors.password ? true : false}
                          {...register('password', {
                            required: '  Password Required',
                          })}
                        />
                      </CInputGroup>
                      {errors.password && (
                        <span style={{ color: 'red' }}>{errors.password.message}</span>
                      )}
                      <CRow>
                        <CButton color="primary" className="px-4" type="submit">
                          {loadingButton ? (
                            <CSpinner
                              component="span"
                              size="sm"
                              variant="grow"
                              aria-hidden="true"
                            />
                          ) : undefined}
                          {loadingButton ? 'Loading' : 'Login'}
                        </CButton>
                        <br />
                        <CCol xs={6} className="text-right">
                          <CButton
                            color="link"
                            onClick={() => {
                              history.push('/reset')
                            }}
                            className="px-0"
                          >
                            Forgot password?
                          </CButton>
                        </CCol>
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

export default Login
