import React, {createContext, useState} from 'react'

export const SelectedFilePathContext = createContext()

export const SelectedFilePathProvider = ({children}) => {
  const value = useState(null);

  return (
    <SelectedFilePathContext.Provider value={value}>
      {children}
    </SelectedFilePathContext.Provider>
  )
}
