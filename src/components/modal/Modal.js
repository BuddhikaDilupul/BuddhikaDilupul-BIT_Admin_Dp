import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import PropTypes from 'prop-types'
const Modal = (props) => {
  return (
    <>
      <CModal backdrop="static" visible={props.open} onClose={() => props.close()}>
        <CModalHeader>
          <CModalTitle>{props.titleModal}</CModalTitle>
        </CModalHeader>
        <CModalBody>{props.descModal}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => props.close()}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              props.data(props.itemID)
              props.close()
            }}
          >
            Ok
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
export default React.memo(Modal)
Modal.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  onClick: PropTypes.func,
  itemID: PropTypes.string,
  data: PropTypes.func,
  titleModal: PropTypes.string,
  descModal: PropTypes.string,
}
