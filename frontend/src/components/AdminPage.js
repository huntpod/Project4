import React, { useState, useEffect } from 'react';
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, fetchProfs, createProf, updateProf, deleteProf } from '../services/api';

function AdminPage() {
  const [departments, setDepartments] = useState([]);
  const [profs, setProfs] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ department_name: '' });
  const [newProf, setNewProf] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
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
  }, []);

  const handleCreateDepartment = async () => {
    try {
      const createdDepartment = await createDepartment(newDepartment);
      setDepartments([...departments, createdDepartment]);
      setNewDepartment({ department_name: '' });
    } catch (error) {
      console.error('Failed to create department', error);
    }
  };

  const handleCreateProf = async () => {
    try {
      const createdProf = await createProf(newProf);
      setProfs([...profs, createdProf]);
      setNewProf({ name: '', email: '', password: '' });
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

  // Similar input change handlers and state management goes here...

  return (
    <div>
      <h1>Admin Page</h1>
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
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={newProf.password}
        onChange={(e) => setNewProf({ ...newProf, password: e.target.value })}
        placeholder="Password"
      />
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
  );
}

export default AdminPage;