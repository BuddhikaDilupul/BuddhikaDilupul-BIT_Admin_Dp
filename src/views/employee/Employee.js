import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import Alert from 'src/components/alert/Alert'

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
} from '@coreui/react'
import LoadingBars from 'src/components/skeleton/Skeleton'

export default function Employee() {
  const [responseData, setResponseData] = useState({})
  const [loadingButton, setLoadingButton] = useState(false)
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [loader, setLoader] = useState(true)
  const [empData, setEmpData] = useState('')
  const [imageFile, setImageFile] = useState('')
  const params = useParams()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' })
  //   const onSubmit = async () => {
  //     const id = params.id

  //     try {
  //       setLoadingButton(true)
  //       const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/` + id, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: 'Bearer ' + localStorage.getItem('authToken'),
  //         },
  //         body: JSON.stringify(),
  //       })

  //       if (_data.status === 200) {
  //         const data = await _data.json()
  //         setLoadingButton(false)
  //         setServerAlert(true)
  //         setAlertDetails({ alertMsg: 'Updated Successfully', color: 'success' })
  //         setResponseData(data)
  //       }
  //     } catch (error) {
  //       console.error('Error:', error)
  //       setLoadingButton(false)
  //       setServerAlert(true)
  //       setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
  //     }
  //   }
  const handleLoadEmployeeData = async () => {
    const id = params.id
    setLoader(true)

    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/` + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status === 200) {
        const data = await _data.json()
        setEmpData(data.user)
        setLoader(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
    }
  }

  useEffect(() => {
    handleLoadEmployeeData()
  }, [])
  if (loader) {
    return <LoadingBars />
  }
  return (
    <>
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>

      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>View Employee Details</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit()}>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">First Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={empData.firstName}
                    readOnly={true}
                    invalid={errors.firstName}
                    {...register('firstName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z]^/,
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
                    readOnly={true}
                    defaultValue={empData.lastName}
                    invalid={errors.lastName}
                    {...register('lastName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z]^/,
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.lastName && (
                    <span style={{ color: 'red' }}>{errors.lastName.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Username</CFormLabel>
                  <CFormInput
                    type="text"
                    id="userName"
                    name="userName"
                    readOnly={true}
                    defaultValue={empData.userName}
                    invalid={errors.userName}
                    {...register('userName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z]/,
                        message: 'Enter valid username',
                      },
                    })}
                  />
                  {errors.userName && (
                    <span style={{ color: 'red' }}>{errors.userName.message}</span>
                  )}
                </div>
                {/* <CButton color={'primary'} type={'submit'}>
                  Submit
                </CButton> */}
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
