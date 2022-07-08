import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import Alert from 'src/components/alert/Alert'
import { useHistory } from 'react-router-dom'

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
import LoadingBars from 'src/components/skeleton/Skeleton'
import Modal from 'src/components/modal/Modal'

export default function AddCategory() {
  const [loadingButton, setLoadingButton] = useState(false)
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [loader, setLoader] = useState(true)
  const [categoryData, setCategoryData] = useState('')
  const [imageFile, setImageFile] = useState('')
  const [visible, setVisible] = useState(false)
  const params = useParams()
  const history = useHistory()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const name = watch('CategoryName')

  const onSubmit = async () => {
    const id = params.id

    let category = {
      categoryName: name,
      image: imageFile,
    }
    try {
      setLoadingButton(true)
      const _data = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/category/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(category),
      })
      if (_data.status === 200) {
        const data = await _data.json()
        setLoadingButton(false)
        setVisible(true)
        setAlertDetails({ alertMsg: 'Updated Successfully', color: 'success' })
      }
      if (_data.status === 409) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Already Exits!', color: 'warning' })
      }
    } catch (error) {
      console.error('Error:', error)
      setLoadingButton(false)
      setServerAlert(true)
      setAlertDetails({
        alertMsg: 'We are encountering an issue! ',
        color: 'warning',
      })
    }
  }
  //load data
  const handleLoadCategory = async () => {
    const id = params.id
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/category/` + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      })

      if (_data.status === 200) {
        const data = await _data.json()
        setCategoryData(data.category)
        setLoader(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
    }
  }
  //image uploading
  const uploadImage = async (e) => {
    const file = e.target.files[0]
    const base64 = await convertBase64(file)
    setImageFile(base64)
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const toWhere = () => {
    history.push('/categories')
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
        descModal={'Category updated'}
        visible={visible}
      />
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Edit Category</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Category Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="CategoryName"
                    name="CategoryName"
                    placeholder="Burger Bun"
                    defaultValue={categoryData.categoryName}
                    invalid={errors.CategoryName}
                    {...register('CategoryName', {
                      required: 'Required',
                      pattern: {
                        value: /[a-zA-Z]{3}/,
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.CategoryName && (
                    <span style={{ color: 'red' }}>{errors.CategoryName.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CCol xs={12} sm={2}>
                    <img src={categoryData.image} width="100" height="100" alt="imgae" />
                  </CCol>
                  <CCol xs={12} sm={12}>
                    <CFormLabel htmlFor="formFileSm">Image File</CFormLabel>
                    <CFormInput
                      type="file"
                      size="sm"
                      name="CategoryImage"
                      onChange={(e) => uploadImage(e)}
                      id="formFileSm"
                      required
                    />
                  </CCol>
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
