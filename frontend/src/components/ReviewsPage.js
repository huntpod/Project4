import React, { useState, useEffect } from 'react';
import { createReview, fetchProfs, fetchCourses } from '../services/api';

function ReviewsPage() {
  const [newReview, setNewReview] = useState({ course_id: '', review_text: '', ratings: 0, professor_id: '' });
  const [profs, setProfs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const loadProfs = async () => {
      try {
        const profsData = await fetchProfs();
        setProfs(profsData);
      } catch (error) {
        console.error('Failed to fetch professors', error);
      }
    };

    const loadCourses = async () => {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };

    loadProfs();
    loadCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => course.professor_id === newReview.professor_id);
    setFilteredCourses(filtered);
  }, [newReview.professor_id, courses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview(prevState => ({ ...prevState, ratings: rating }));
  };

  const handleCreateReview = async () => {
    try {
      await createReview(newReview);
      setNewReview({ course_id: '', review_text: '', ratings: 0, professor_id: '' });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to create review', error);
    }
  };

  return (
    <div>
      <h1>Leave a Review</h1>
      <select
        name="professor_id"
        value={newReview.professor_id}
        onChange={handleInputChange}
      >
        <option value="">Select Professor</option>
        {profs.map(prof => (
          <option key={prof.professor_id} value={prof.professor_id}>
            {prof.name}
          </option>
        ))}
      </select>

      <select
        name="course_id"
        value={newReview.course_id}
        onChange={handleInputChange}
        disabled={!newReview.professor_id}
      >
        <option value="">Select Course</option>
        {filteredCourses.map(course => (
          <option key={course.course_id} value={course.course_id}>
            {course.course_name}
          </option>
        ))}
      </select>

      <textarea
        name="review_text"
        value={newReview.review_text}
        onChange={handleInputChange}
        placeholder="Write your review here..."
        rows="5"
        style={{ width: '100%' }}
      />

      <div>
        <p>Rating:</p>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => handleRatingChange(star)}
            style={{
              cursor: 'pointer',
              fontSize: '1.5em',
              color: newReview.ratings >= star ? '#FFD700' : '#CCCCCC',
            }}
          >
            ★
          </span>
        ))}
      </div>

      <button onClick={handleCreateReview}>Submit Review</button>
    </div>
  );
}

export default ReviewsPage;
