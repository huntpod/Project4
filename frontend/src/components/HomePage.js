import React, { useState, useEffect } from 'react';
import { fetchReviews, fetchCourses, fetchProfs } from '../services/api';

function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [profs, setProfs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const reviewsData = await fetchReviews();
        const coursesData = await fetchCourses();
        const profsData = await fetchProfs();
        setReviews(reviewsData);
        setCourses(coursesData);
        setProfs(profsData);
        setFilteredReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = reviews.filter(review => {
      const course = courses.find(c => c.course_id === review.course_id);
      const prof = profs.find(p => p.professor_id === review.professor_id);
      return (
        (course && course.course_code.toLowerCase().includes(term)) ||
        (prof && prof.name.toLowerCase().includes(term))
      );
    });
    setFilteredReviews(filtered);
  }, [searchTerm, reviews, courses, profs]);

  return (
    <div>
      <h1>Reviews</h1>
      <input
        type="text"
        placeholder="Search by Course Code or Professor Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredReviews.map(review => {
          const course = courses.find(c => c.course_id === review.course_id);
          const prof = profs.find(p => p.professor_id === review.professor_id);
          const courseCode = course ? course.course_code : 'Unknown';
          const professorName = prof ? prof.name : 'Unknown';
          return (
            <li key={review.review_id}>
              {`Course Code: ${courseCode}, Professor: ${professorName}, Review: ${review.review_text}, Flagged: ${review.flagged}, Ratings: ${review.Ratings}`}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default HomePage;