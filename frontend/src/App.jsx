import React, { useState } from 'react'
import './App.css'
import AppRoutes from './Routes/AppRoutes'
import { AuthProvider } from './Utils/AuthContext'
const App = () => {

  return (
    <>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <AuthProvider>
        <AppRoutes/>
    </AuthProvider>
    </>
  )
}

export default App
