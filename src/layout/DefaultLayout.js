import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const history = useHistory()
  const [token, setToken] = useState(false)
  const authToken = async () => {
    const token = localStorage.getItem('authToken')
    try {
      const _data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/authToken`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      if (_data.status !== 200) {
        history.push('/login')
      }
    } catch (err) {
      console.log('error', err)
    }
  }
  useEffect(() => {
    authToken()
  }, [])
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
