import React, { useState, useEffect } from 'react';
import { fetchReviews } from '../services/api';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const reviewsData = await fetchReviews();
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    loadData();
  }, []);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    setFilteredReviews(reviews.filter(review => 
      review.review_text.toLowerCase().includes(term) ||
      review.course_id.toLowerCase().includes(term)
    ));
  };

  return (
    <div>
      <h1>Reviews Page</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by Professor or Course"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {filteredReviews.map(review => (
          <li key={review.review_id}>
            {`Course ID: ${review.course_id}, Review: ${review.review_text}, Flagged: ${review.flagged}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewsPage;