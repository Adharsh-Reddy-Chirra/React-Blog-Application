import React, { useState } from 'react';
import { Button } from '@mui/material';

const RoleBasedAuthorization = ({ user }) => {
  const [userRole, setUserRole] = useState('');

  // Set user role upon login
  const handleLogin = () => {
    setUserRole(user.role);
  };

  // Handle common action
  const handleCommonAction = () => {
    console.log('Common action performed.');
  };

  // Handle admin action
  const handleAdminAction = () => {
    console.log('Admin action performed.');
  };

  return (
    <div>
      {/* Login button */}
      {!userRole && (
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      )}

      {/* Dashboard */}
      {userRole && (
        <div>
          <h1>Welcome to the Dashboard</h1>
          {/* Common features for all users */}
          <Button onClick={handleCommonAction}>Common Action</Button>

          {/* Render additional features based on user role */}
          {userRole === 'administrator' && (
            <Button onClick={handleAdminAction}>Admin Action</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleBasedAuthorization;
