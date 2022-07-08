import React from 'react'
import PropTypes from 'prop-types'
import { CAlert } from '@coreui/react'

const Alert = (props) => {
  return (
    <>
      <CAlert color={props.data.color}>
        <strong>{props.data.alertMsg}</strong>
      </CAlert>
    </>
  )
}

export default Alert
Alert.propTypes = {
  data: PropTypes.object,
}
