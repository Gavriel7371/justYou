import React, { useContext, useState, useEffect } from 'react';
import { userContext } from '../../App.jsx';
import axios from 'axios';
import "../DataManagement/Management.css";

function Management() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [role, setRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const getAllUsers = async () => {
    try {
      const res = await axios.get('/backend/auth/Management');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete('/backend/auth/Management/' + id);
      getAllUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const changeRole = async (id, roletxt) => {
    try {
      await axios.put('/backend/auth/Management/' + id, { roletxt });
      getAllUsers(); // Refresh the user list after role change
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  const filterUsersByRole = (role) => {
    if (role === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === role));
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setSelectedRole(selectedRole);
    filterUsersByRole(selectedRole);
  };

  const { user } = useContext(userContext);

  return (
    <div className="managementContainer">
      {user?.role === "admin" ? (
        <>
          <div className='showByRole'>
            <h3>סנן לפי תפקיד</h3>
            <select onChange={handleRoleChange} value={selectedRole}>
              <option value="">כל התפקידים</option>
              <option value="admin">מנהל</option>
              <option value="instructor">מדריך</option>
              <option value="user">משתמש</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>שם</th>
                <th>תפקיד</th>
                <th>דוא"ל</th>
                <th>טלפון</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button onClick={() => { window.location.href = `mailto:${user.email}`; }}>שלח מייל</button>
                    <button onClick={() => { deleteUser(user._id); }}>מחק משתמש</button>
                    <br />
                    <select onChange={(e) => setRole(e.target.value)} defaultValue="">
                      <option value="" disabled>שנה תפקיד</option>
                      <option value="admin">מנהל</option>
                      <option value="instructor">מדריך</option>
                      <option value="user">משתמש</option>
                    </select>
                    <button onClick={() => { changeRole(user._id, role); }}>שנה תפקיד</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <h2>אין לך הרשאה לגשת לדף זה</h2>
      )}
    </div>
  );
}

export default Management;
