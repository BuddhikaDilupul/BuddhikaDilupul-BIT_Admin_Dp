import React, { useState } from 'react'
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
import { useHistory } from 'react-router-dom'
import Modal from 'src/components/modal/Modal'

export default function AddCategory() {
  const [loadingButton, setLoadingButton] = useState(false)
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  const [imageFile, setImageFile] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' })
  const name = watch('CategoryName')

  const onSubmit = async (data) => {
    let category = {
      categoryName: name,
      image: imageFile,
    }
    try {
      setLoadingButton(true)
      setServerAlert(false)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(category),
      })
      if (_data.status === 201) {
        setLoadingButton(false)
        setVisible(true)
        setAlertDetails({ alertMsg: 'Updated Successfully', color: 'success' })
      }
      if (_data.status === 409) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({ alertMsg: 'Category already exist', color: 'warning' })
      }
      if (_data.status === 422) {
        setLoadingButton(false)
        setServerAlert(true)
        setAlertDetails({
          alertMsg: 'Please fill all values and check you entered values are correct',
          color: 'warning',
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setServerAlert(true)
      setAlertDetails({ alertMsg: 'Sorry! We are encountering an issue', color: 'danger' })
    }
  }

  //image
  const uploadImage = async (e) => {
    const file = e.target.files[0]
    const base64 = await convertBase64(file)
    setImageFile(base64)
  }

  //converting to base64
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

  //modal close and navigate
  const toWhere = () => {
    history.push('/categories')
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
        titleModal={'Updated Successfully'}
        descModal={'New category has been added'}
        visible={visible}
      />
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add Category</strong>
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
                    invalid={errors.CategoryName ? true : false}
                    {...register('CategoryName', {
                      required: 'Required',
                      pattern: {
                        value: /^[a-zA-Z ]+$/,
                        message: 'Enter valid name',
                      },
                    })}
                  />
                  {errors.CategoryName && (
                    <span style={{ color: 'red' }}>{errors.CategoryName.message}</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="formFileSm">Image File</CFormLabel>
                  <CFormInput
                    type="file"
                    size="sm"
                    name="CategoryImage"
                    onChange={(e) => uploadImage(e)}
                    id="formFileSm"
                    required
                  />
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
