import React from 'react'

const LogoutButton = ({ onLogoutUserClick }) => {
  return(
    <div>
      <a href="#" onClick={(event) => onLogoutUserClick(event)}>Logout</a>
    </div>
  )
}

export default LogoutButton
