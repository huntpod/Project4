import React, { useState } from 'react';
import { createReview } from '../services/api';

function ReviewsPage() {
  const [newReview, setNewReview] = useState({ course_id: '', review_text: '', flagged: 0, ratings: 0 });

  const handleCreateReview = async () => {
    try {
      await createReview(newReview);
      setNewReview({ course_id: '', review_text: '', flagged: 0, ratings: 0 });
      alert("Review submitted successfully!");
    } catch (error) {
      console.error('Failed to create review', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <h1>Leave a Review</h1>
      <input
        type="text"
        name="course_id"
        value={newReview.course_id}
        onChange={handleInputChange}
        placeholder="Course ID"
      />
      <input
        type="text"
        name="review_text"
        value={newReview.review_text}
        onChange={handleInputChange}
        placeholder="Review Text"
      />
      <input
        type="number"
        name="ratings"
        value={newReview.ratings}
        onChange={handleInputChange}
        placeholder="Ratings"
        min="0"
        max="5"
      />
      <input
        type="checkbox"
        name="flagged"
        checked={!!newReview.flagged}
        onChange={(e) => handleInputChange({ target: { name: 'flagged', value: e.target.checked ? 1 : 0 } })}
      />
      <label htmlFor="flagged">Flagged</label>
      <button onClick={handleCreateReview}>Submit Review</button>
    </div>
  );
}

export default ReviewsPage;