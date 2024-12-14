const API_BASE = 'http://localhost/projects/project4/api/index.php';

// Helpers
const checkResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch data');
  }
  return await response.json();
};

// Admins
export const fetchAdmins = async () => {
  const response = await fetch(`${API_BASE}?resource=admins`);
  return await checkResponse(response);
};

export const createAdmin = async (admin) => {
  const response = await fetch(`${API_BASE}?resource=admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin),
  });
  return await checkResponse(response);
};

export const updateAdmin = async (admin) => {
  const response = await fetch(`${API_BASE}?resource=admins`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin),
  });
  return await checkResponse(response);
};

export const deleteAdmin = async (adminId) => {
  const response = await fetch(`${API_BASE}?resource=admins&id=${adminId}`, {
    method: 'DELETE',
  });
  return await checkResponse(response);
};

// Professors
export const fetchProfs = async () => {
  const response = await fetch(`${API_BASE}?resource=profs`);
  return await checkResponse(response);
};

export const createProf = async (prof) => {
  const response = await fetch(`${API_BASE}?resource=profs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prof),
  });
  return await checkResponse(response);
};

export const updateProf = async (prof) => {
  const response = await fetch(`${API_BASE}?resource=profs`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prof),
  });
  return await checkResponse(response);
};

export const deleteProf = async (profId) => {
  const response = await fetch(`${API_BASE}?resource=profs&id=${profId}`, {
    method: 'DELETE',
  });
  return await checkResponse(response);
};

// Departments
export const fetchDepartments = async () => {
  const response = await fetch(`${API_BASE}?resource=departments`);
  return await checkResponse(response);
};

export const createDepartment = async (department) => {
  const response = await fetch(`${API_BASE}?resource=departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(department),
  });
  return await checkResponse(response);
};

export const updateDepartment = async (department) => {
  const response = await fetch(`${API_BASE}?resource=departments`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(department),
  });
  return await checkResponse(response);
};

export const deleteDepartment = async (departmentId) => {
  const response = await fetch(`${API_BASE}?resource=departments&id=${departmentId}`, {
    method: 'DELETE',
  });
  return await checkResponse(response);
};

// Courses
export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE}?resource=courses`);
  return await checkResponse(response);
};

export const createCourse = async (course) => {
  const response = await fetch(`${API_BASE}?resource=courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
  return await checkResponse(response);
};

export const updateCourse = async (course) => {
  const response = await fetch(`${API_BASE}?resource=courses`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
  return await checkResponse(response);
};

export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_BASE}?resource=courses&id=${courseId}`, {
    method: 'DELETE',
  });
  return await checkResponse(response);
};

// Reviews
export const fetchReviews = async () => {
  const response = await fetch(`${API_BASE}?resource=reviews`);
  return await checkResponse(response);
};

export const createReview = async (review) => {
  const response = await fetch(`${API_BASE}?resource=reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  return await checkResponse(response);
};


export const updateReview = async (review) => {
  const response = await fetch(`${API_BASE}?resource=reviews`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  return await checkResponse(response);
};

export const deleteReview = async (reviewId) => {
  const response = await fetch(`${API_BASE}?resource=reviews&id=${reviewId}`, {
    method: 'DELETE',
  });
  return await checkResponse(response);
};