import React, { useState, useEffect, useContext } from 'react';
import { fetchCourses, createCourse, deleteCourse } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './ProfessorPage.css';

function ProfessorsPage() {
  const { userId } = useContext(AuthContext); // Use userId from context
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ course_name: '', course_code: '' });

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return; // Ensure userId is available
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    loadData();
  }, [userId]); // Re-fetch courses if userId changes

  const handleCreateCourse = async () => {
    try {
      const createdCourse = await createCourse({ ...newCourse, professor_id: userId });
      setCourses([...courses, createdCourse]);
      setNewCourse({ course_name: '', course_code: '' }); // Resetting fields
    } catch (error) {
      console.error('Failed to create course', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter((course) => course.course_id !== courseId));
    } catch (error) {
      console.error('Failed to delete course', error);
    }
  };

  return (
    <div className="container">
      <h1 className="prof-header">Professors Page</h1>

      <div className="section-container">
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
          {courses.filter(course => course.professor_id == userId).map((course) => (
            <li key={course.course_id}>
              {course.course_name} ({course.course_code})
              <button onClick={() => handleDeleteCourse(course.course_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfessorsPage;