import React, { useState, useEffect } from 'react'
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
  CBadge,
} from '@coreui/react'
import LoadingBars from 'src/components/skeleton/Skeleton'
import { useParams } from 'react-router-dom'
import Alert from 'src/components/alert/Alert'
import { useHistory } from 'react-router-dom'
import Modal from 'src/components/modal/Modal'

const Location = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })
  const [loader, setLoader] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [cityData, setCityData] = useState()
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  const [productData, setProductData] = useState()
  const params = useParams()

  const handleLoadData = async () => {
    const id = params.id
    setLoader(true)
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delivery/` + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })
      if (_data.status === 200) {
        const data = await _data.json()
        setCityData(data.city)
        setLoader(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
    }
  }

  const onSubmit = async (data) => {
    setServerAlert(false)
    const id = params.id
    try {
      setLoadingButton(true)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delivery/` + id, {
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
      }
      if (_data.status === 409) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: ' Already exit', color: 'warning' })
      }
      setLoadingButton(false)
    } catch (error) {
      console.error('Error:', error)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
      setServerAlert(true)
    }
  }

  //modal close and navigate
  const toWhere = () => {
    history.push('/locations')
  }
  const handleClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    handleLoadData()
  }, [])
  useEffect(() => {
    // reset form with user data
    reset(cityData)
    //reference = https://jasonwatmore.com/post/2021/09/19/react-hook-form-set-form-values-in-useeffect-hook-after-async-data-load
  }, [cityData])
  if (loader) {
    return <LoadingBars />
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
        titleModal={'Updated Successfully'}
        descModal={'Location has been updated'}
        visible={visible}
      />

      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Edit City</strong>
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
                    {...register('city', {
                      required: 'Required',
                      pattern: {
                        value: /[a-zA-Z]{3}/,
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.cityName && (
                    <span style={{ color: 'red' }}>{errors.cityName.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Status</CFormLabel>
                  <CFormSelect
                    name="status"
                    invalid={errors.status ? true : false}
                    {...register('status', {
                      required: 'Required',
                    })}
                    aria-label="Default select example"
                  >
                    <option value="active"> Active</option>
                    <option value="disable"> Disable</option>
                  </CFormSelect>
                  {errors.status && <span style={{ color: 'red' }}>{errors.status.message}</span>}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Price</CFormLabel>
                  <CFormInput
                    type="text"
                    id="price"
                    name="price"
                    placeholder="Burger Bun"
                    invalid={errors.price ? true : false}
                    {...register('price', {
                      required: 'Required',
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/, //positive int = /^(0|[1-9]\d*)$/  negative & positive decimal= /^-?(0|[1-9]\d*)(\.\d+)?$/
                        message: 'Must be a valid number',
                      },
                    })}
                  />
                  {errors.price && <span style={{ color: 'red' }}>{errors.price.message}</span>}
                </div>
                <CButton color="primary" size="sm" className="px-4" type={'submit'}>
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

export default Location
