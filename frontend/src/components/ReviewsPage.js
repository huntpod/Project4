import React, { useState, useEffect } from 'react';
import { createReview, fetchProfs, fetchCourses } from '../services/api';
import './ReviewsPages.css';

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
      if (!newReview.professor_id || !newReview.course_id || !newReview.review_text || !newReview.ratings) {
        alert('Please fill out all fields before submitting your review.');
        return;
      }

      const response = await createReview({
        professor_id: newReview.professor_id,
        course_id: newReview.course_id,
        review_text: newReview.review_text,
        ratings: newReview.ratings,
      });

      if (response) {
        alert('Review submitted successfully!');
        setNewReview({ course_id: '', review_text: '', ratings: 0, professor_id: '' });
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting the review.');
    }
  };

  return (
    <div className="reviews-container">
      <h1 className="reviews-header">Leave a Review</h1>
      <div className="dropdown-container">
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
      </div>

      <textarea
        name="review_text"
        value={newReview.review_text}
        onChange={handleInputChange}
        placeholder="Write your review here..."
        rows="5"
      />

      <div className="rating-container">
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

      <button className="review-buttons" onClick={handleCreateReview}>Submit Review</button>
    </div>
  );
}

export default ReviewsPage;
