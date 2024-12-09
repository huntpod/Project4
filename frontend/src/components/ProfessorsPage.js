import React, { useState, useEffect } from 'react';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../services/api';

function ProfessorsPage() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ course_name: '', course_code: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    loadData();
  }, []);

  const handleCreateCourse = async () => {
    try {
      const createdCourse = await createCourse(newCourse);
      setCourses([...courses, createdCourse]);
      setNewCourse({ course_name: '', course_code: '' });
    } catch (error) {
      console.error('Failed to create course', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter(course => course.course_id !== courseId));
    } catch (error) {
      console.error('Failed to delete course', error);
    }
  };

  // Similar input change handlers and state management goes here...

  return (
    <div>
      <h1>Professors Page</h1>
      <h2>Manage Courses</h2>
      <input
        type="text"
        name="course_name"
        value={newCourse.course_name}
        onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
        placeholder="Course Name"
      />
      <input
        type="text"
        name="course_code"
        value={newCourse.course_code}
        onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })}
        placeholder="Course Code"
      />
      <button onClick={handleCreateCourse}>Create Course</button>
      <ul>
        {courses.map(course => (
          <li key={course.course_id}>
            {course.course_name}
            <button onClick={() => handleDeleteCourse(course.course_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfessorsPage;