import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import PropTypes from 'prop-types'
import React from 'react'

export default function DownloadPage({ rootElementID, downloadFileName }) {
  const downloadFileDocument = () => {
    const input = document.getElementById(rootElementID)
    html2canvas(input).then(function (canvas) {
      const imgData = canvas.toDataURL('image/png')
      const pdf = jsPDF('p', 'pt', 'a4')
      pdf.addImage(imgData, 'JPEG', 35, 35)
      pdf.save(downloadFileName)
    })
  }
  return (
    <div>
      <CButton onClick={downloadFileDocument}>
        <CIcon icon={cilCloudDownload} className="me-2" />
        Download
      </CButton>
    </div>
  )
}
DownloadPage.propTypes = {
  rootElementID: PropTypes.string,
  downloadFileName: PropTypes.string,
}
