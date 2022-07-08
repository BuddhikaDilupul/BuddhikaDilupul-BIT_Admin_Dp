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
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Alert from 'src/components/alert/Alert'
import { useHistory } from 'react-router-dom'
import Modal from 'src/components/modal/Modal'

const AddCity = () => {
  const [loader, setLoader] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const onSubmit = async (data) => {
    setServerAlert(false)
    try {
      setLoadingButton(true)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delivery/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(data),
      })

      if (_data.status === 201) {
        setLoadingButton(false)
        setVisible(true)
      }
      if (_data.status === 422) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Already Exists', color: 'warning' })
      }
    } catch (error) {
      console.error('Error:', error)
      setLoadingButton(false)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
    }
  }

  //modal close and navigate
  const toWhere = () => {
    history.push('/locations')
  }
  const handleClose = () => {
    setVisible(false)
  }

  return (
    <>
      <CCol xs={6}>{serverAlert ? <Alert data={alertDetails} /> : null}</CCol>
      <Modal
        open={visible}
        close={setVisible}
        data={toWhere}
        onClick={() => {
          handleClose()
        }}
        titleModal={'Location Added Successfully'}
        descModal={'New location has been added'}
        visible={visible}
      />
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add New Location</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">City Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="cityName"
                    name="cityName"
                    placeholder="Avissawella"
                    invalid={errors.cityName ? true : false}
                    {...register('cityName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z]+$/,
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.cityName && (
                    <span style={{ color: 'red' }}>{errors.cityName.message}</span>
                  )}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Charges</CFormLabel>
                  <CFormInput
                    type="text"
                    id="charges"
                    name="charges"
                    placeholder="100"
                    invalid={errors.charges ? true : false}
                    {...register('charges', {
                      required: 'Required',
                      pattern: {
                        value: /^(0|[1-9]\d*)$/, //positive int = /^(0|[1-9]\d*)$/  negative & positive decimal= /^-?(0|[1-9]\d*)(\.\d+)?$/
                        message: 'Must be a valid positive number',
                      },
                    })}
                  />
                  {errors.charges && <span style={{ color: 'red' }}>{errors.charges.message}</span>}
                </div>
                <CButton type={'submit'} color="primary" size="sm" className="px-4">
                  {loadingButton ? (
                    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                  ) : undefined}
                  {loadingButton ? 'Loading' : 'Save'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AddCity
