import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import Alert from 'src/components/alert/Alert'
import Modal from 'src/components/modal/Modal'
import CIcon from '@coreui/icons-react'
import { cilSend } from '@coreui/icons'

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const [loadingButton, setLoadingButton] = useState(false)
  const [text, setText] = useState('')
  var [serverAlert, setServerAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState({ alertMsg: '', color: 'success' })
  const [visible, setVisible] = useState(false)

  const onSubmit = async (data) => {
    try {
      setLoadingButton(false)
      setVisible(false)
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/staff/promotion`, {
        method: 'POST',
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
      setServerAlert(false)
      setVisible(true)
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

  useEffect(() => {}, [])

  return (
    <>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Send Promotions</strong> <small>To all customers</small>
          </CCardHeader>
          <CCardBody>
            <div className="col-auto mb-3">To : All</div>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CFormFloating>
                <CFormTextarea
                  className="mb-3"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  name="promotion"
                  style={{ height: '100px' }}
                  invalid={errors.promotion ? true : false}
                  {...register('promotion', {
                    required: 'Required',
                  })}
                ></CFormTextarea>
                {errors.promotion && (
                  <span style={{ color: 'red' }}>{errors.promotion.message}</span>
                )}
                <CFormLabel htmlFor="floatingTextarea2">Type message</CFormLabel>
              </CFormFloating>
              <CButton type="submit">
                <CIcon icon={cilSend} className="me-2" />
                Send
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </>
  )
}

export default ChangePassword
