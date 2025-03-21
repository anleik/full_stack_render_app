import React from 'react'

const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
  
    const notificationClass = type === 'added' ? 'added' : 'error'
  
    return (
      <div className={notificationClass}>
        {message}
      </div>
    )
  }
  
  export default Notification  