import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import PropTypes from 'prop-types'
import { CChartPie } from '@coreui/react-chartjs'
import React, { useState } from 'react'

const Charts = (props) => {
  const [label, setLabel] = useState([])
  const [count, setCount] = useState([])
  function getRandomColor(data) {
    var letters = '0123456789ABCDEF'
    let clr = []
    clr.pop()
    for (var j = 0; j < data; j++) {
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      clr.push(color)
    }
    return clr
  }
  for (var j = 0; j < props.data.length; j++) {
    count.push(props.data[j][1])
    label.push(props.data[j][0])
  }
  let clr = getRandomColor(props.data.length)
  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>{props.tittle}</CCardHeader>
        <CCardBody>
          <CChartPie
            data={{
              labels: label,
              datasets: [
                {
                  data: count,
                  backgroundColor: clr,
                  //hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                },
              ],
            }}
          />{' '}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Charts
Charts.propTypes = {
  data: PropTypes.array,
  tittle: PropTypes.string,
}
