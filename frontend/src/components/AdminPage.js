import React, { useState, useEffect, useContext } from 'react';
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchProfs,
  createProf,
  updateProf,
  deleteProf
} from '../services/api';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './Admin.css';

function AdminPage() {
  const { isAuthenticated, userRole, userId } = useContext(AuthContext); // Get context values
  const [departments, setDepartments] = useState([]);
  const [profs, setProfs] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ department_name: '' });
  const [newProf, setNewProf] = useState({ name: '', email: '', password: '', department_id: '' });

  useEffect(() => {
    if (isAuthenticated && userRole === 'admin') { // Ensure data loads only if authenticated
      const loadData = async () => {
        try {
          const departmentsData = await fetchDepartments();
          setDepartments(departmentsData);
          const profsData = await fetchProfs();
          setProfs(profsData);
        } catch (error) {
          console.error('Failed to fetch data', error);
        }
      };

      loadData();
    }
  }, [isAuthenticated, userRole]);

  const handleCreateDepartment = async () => {
    try {
      console.log('Sending department data:', newDepartment); // Log the data being sent
      const createdDepartment = await createDepartment(newDepartment);
      console.log('Created department:', createdDepartment); // Log the created department
      setNewDepartment({ department_name: '' });

      // Fetch the updated list of departments to ensure it updates immediately
      const updatedDepartments = await fetchDepartments();
      setDepartments(updatedDepartments);
    } catch (error) {
      console.error('Failed to create department', error);
    }
  };

  const handleCreateProf = async () => {
    try {
      console.log('Sending professor data:', newProf); // Log the data being sent
      const createdProf = await createProf(newProf);
      console.log('Created professor:', createdProf); // Log the created professor
      setNewProf({ name: '', email: '', password: '', department_id: '' });

      // Fetch the updated list of professors to ensure it updates immediately
      const updatedProfs = await fetchProfs();
      console.log('Updated professors:', updatedProfs); // Log the updated list of professors
      setProfs(updatedProfs);
    } catch (error) {
      console.error('Failed to create professor', error);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      await deleteDepartment(departmentId);
      setDepartments(departments.filter(dep => dep.department_id !== departmentId));
    } catch (error) {
      console.error('Failed to delete department', error);
    }
  };

  const handleDeleteProf = async (profId) => {
    try {
      await deleteProf(profId);
      setProfs(profs.filter(prof => prof.professor_id !== profId));
    } catch (error) {
      console.error('Failed to delete professor', error);
    }
  };

  return (
    <div className="container">
      <h1 className="admin-header">Admin Page</h1>
      
      {/* Manage Departments Section */}
      <div className="section-container">
        <h2>Manage Departments</h2>
        <input
          type="text"
          name="department_name"
          value={newDepartment.department_name}
          onChange={(e) => setNewDepartment({ department_name: e.target.value })}
          placeholder="Department Name"
        />
        <button onClick={handleCreateDepartment}>Create Department</button>
        <ul>
          {departments.map(dep => (
            <li key={dep.department_id}>
              {dep.department_name}
              <button onClick={() => handleDeleteDepartment(dep.department_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Manage Professors Section */}
      <div className="section-container">
        <h2>Manage Professors</h2>
        <input
          type="text"
          name="name"
          value={newProf.name}
          onChange={(e) => setNewProf({ ...newProf, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="text"
          name="email"
          value={newProf.email}
          onChange={(e) => setNewProf({ ...newProf, email: e.target.value })}
          placeholder="Email"  // Fixed the syntax here
        />
        <input
          type="password"
          name="password"
          value={newProf.password}
          onChange={(e) => setNewProf({ ...newProf, password: e.target.value })}
          placeholder="Password"
        />
        <select
          name="department_id"
          value={newProf.department_id}
          onChange={(e) => setNewProf({ ...newProf, department_id: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map(dep => (
            <option key={dep.department_id} value={dep.department_id}>
              {dep.department_name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateProf}>Create Professor</button>
        <ul>
          {profs.map(prof => (
            <li key={prof.professor_id}>
              {prof.name}
              <button onClick={() => handleDeleteProf(prof.professor_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;