import React, { createContext, useContext, useState, useMemo } from 'react'

const CustomerContext = createContext(null)

const STORAGE_KEY = 'luxoraCustomer'

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const loginCustomer = ({ name, email }) => {
    const sanitizedName = name?.trim()
    const sanitizedEmail = email?.trim().toLowerCase()
    if (!sanitizedName || !sanitizedEmail) return

    const payload = {
      name: sanitizedName,
      email: sanitizedEmail
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setCustomer(payload)
  }

  const logoutCustomer = () => {
    localStorage.removeItem(STORAGE_KEY)
    setCustomer(null)
  }

  const value = useMemo(
    () => ({ customer, loginCustomer, logoutCustomer }),
    [customer]
  )

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => {
  const context = useContext(CustomerContext)
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider')
  }
  return context
}

