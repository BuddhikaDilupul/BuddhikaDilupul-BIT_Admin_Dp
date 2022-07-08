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

const AddProduct = () => {
  const [loader, setLoader] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [categoryData, setCategoryData] = useState(false)
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })
  const handleLoadCategory = async () => {
    setLoader(true)
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/category/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status === 200) {
        const data = await _data.json()
        setCategoryData(data.categories)
        setLoader(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
    }
  }
  const onSubmit = async (data) => {
    setServerAlert(false)
    try {
      setLoadingButton(true)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/`, {
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
      if (_data.status === 409) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Already exits', color: 'danger' })
      }
    } catch (error) {
      console.error('Error:', error)
      setLoadingButton(false)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
    }
  }

  const toWhere = () => {
    history.push('/products')
  }
  const handleClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    handleLoadCategory()
  }, [])
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
        descModal={'New product has been added'}
        visible={visible}
      />
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add Product</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Product Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="productName"
                    name="productName"
                    placeholder="Egg Burger Bun"
                    invalid={errors.productName ? true : false}
                    {...register('productName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z0-9 ]+$/,
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.productName && (
                    <span style={{ color: 'red' }}>{errors.productName.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Category Name</CFormLabel>
                  <CFormSelect
                    name="categoryName"
                    {...register('category_id', {
                      required: 'Required',
                    })}
                    aria-label="Default select example"
                  >
                    {categoryData.map((item, index) => {
                      return (
                        <option key={index} value={item._id}>
                          {item.categoryName}
                        </option>
                      )
                    })}
                  </CFormSelect>
                  {errors.category_id && (
                    <span style={{ color: 'red' }}>{errors.category_id.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Stocks</CFormLabel>
                  <CFormInput
                    type="number"
                    id="inStock"
                    name="inStock"
                    placeholder="100"
                    min={0}
                    invalid={errors.inStock ? true : false}
                    {...register('inStock', {
                      required: 'Required',
                      min: {
                        value: 1,
                        message: 'Enter stocks',
                      },
                      pattern: {
                        value: /^(0|[1-9]\d*)$/, //positive int = /^(0|[1-9]\d*)$/  negative & positive decimal= /^-?(0|[1-9]\d*)(\.\d+)?$/
                        message: 'Must be a valid positive number',
                      },
                    })}
                  />
                  {errors.inStock && <span style={{ color: 'red' }}>{errors.inStock.message}</span>}
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
                      min: {
                        value: 1,
                        message: 'Enter price',
                      },
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/, //positive int = /^(0|[1-9]\d*)$/  negative & positive decimal= /^-?(0|[1-9]\d*)(\.\d+)?$/
                        message: 'Must be a valid number',
                      },
                    })}
                  />
                  {errors.price && <span style={{ color: 'red' }}>{errors.price.message}</span>}
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

export default AddProduct
