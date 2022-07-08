import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
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
import { useParams } from 'react-router-dom'
import Modal from 'src/components/modal/Modal'
import ProductWisCustomerReport from '../reports/ProductWisCustomerReport'
import LoadingBars from 'src/components/skeleton/Skeleton'
import Alert from 'src/components/alert/Alert'

const Product = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })
  const [loader, setLoader] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [categoryData, setCategoryData] = useState()
  const [productData, setProductData] = useState()
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  const params = useParams()

  const handleLoadCategory = async () => {
    const id = params.id
    setLoader(true)
    try {
      const _dataCategory = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/category/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })
      const _dataProduct = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/` + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })
      if (_dataCategory.status === 200) {
        const dataCategory = await _dataCategory.json()
        setCategoryData(dataCategory.categories)
        const dataProduct = await _dataProduct.json()
        setProductData(dataProduct.product)
      }
      setLoader(false)
    } catch (error) {
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry !! We are encountering an issue!', color: 'warning' })
      console.error('Error:', error)
    }
  }

  const onSubmit = async (data) => {
    const id = params.id
    delete data._id
    console.log(data)
    setServerAlert(false)

    try {
      setLoadingButton(true)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/` + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(data),
      })

      if (_data.status === 200) {
        setVisible(true)
        setLoadingButton(false)
      }
      if (_data.status === 409) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Already Exist', color: 'warning' })
      }
      setLoadingButton(false)
    } catch (error) {
      console.error('Error:', error)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Internal server Error', color: 'warning' })
    }
  }

  //modal close and navigate
  const toWhere = () => {
    history.push('/products')
  }
  const handleClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    handleLoadCategory()
  }, [])
  useEffect(() => {
    // reset form with productData data
    reset(productData)
    //reference = https://jasonwatmore.com/post/2021/09/19/react-hook-form-set-form-values-in-useeffect-hook-after-async-data-load
  }, [productData])
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
        descModal={'Product has been updated'}
        visible={visible}
      />
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Edit Product</strong>
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
                    invalid={errors.categoryName ? true : false}
                    {...register('category_id._id')}
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
      <ProductWisCustomerReport data={params.id} />
    </>
  )
}

export default Product
