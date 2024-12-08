import React, { useEffect, useState } from 'react';
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview
} from './services/api';

function App() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ course_id: '', review_text: '', flagged: 0 });
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReview, setEditReview] = useState({ course_id: '', review_text: '', flagged: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const reviewsData = await fetchReviews();
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    loadData();
  }, []);

  const handleCreateReview = async () => {
    try {
      const createdReview = await createReview(newReview);
      setReviews([...reviews, createdReview]);
      setNewReview({ course_id: '', review_text: '', flagged: 0 });
    } catch (error) {
      console.error('Failed to create review', error);
    }
  };

  const handleEditReview = async (reviewId) => {
    setEditReviewId(reviewId);
    const reviewToEdit = reviews.find(review => review.review_id === reviewId);
    setEditReview(reviewToEdit);
  };

  const handleUpdateReview = async () => {
    try {
      await updateReview({ ...editReview, review_id: editReviewId });
      setReviews(reviews.map(review => (review.review_id === editReviewId ? editReview : review)));
      setEditReviewId(null);
      setEditReview({ course_id: '', review_text: '', flagged: 0 });
    } catch (error) {
      console.error('Failed to update review', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(review => review.review_id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditReview(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="App">
      <h1>Reviews</h1>
      <ul>
        {reviews.map(review => (
          <li key={review.review_id}>
            {`Course ID: ${review.course_id}, Review: ${review.review_text}, Flagged: ${review.flagged}`}
            <button onClick={() => handleEditReview(review.review_id)}>Edit</button>
            <button onClick={() => handleDeleteReview(review.review_id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Create Review</h2>
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
        type="checkbox"
        name="flagged"
        checked={!!newReview.flagged}
        onChange={(e) => handleInputChange({ target: { name: 'flagged', value: e.target.checked ? 1 : 0 } })}
      />
      <label htmlFor="flagged">Flagged</label>
      <button onClick={handleCreateReview}>Create</button>

      {editReviewId && (
        <div>
          <h2>Edit Review</h2>
          <input
            type="text"
            name="course_id"
            value={editReview.course_id}
            onChange={handleEditInputChange}
            placeholder="Course ID"
          />
          <input
            type="text"
            name="review_text"
            value={editReview.review_text}
            onChange={handleEditInputChange}
            placeholder="Review Text"
          />
          <input
            type="checkbox"
            name="flagged"
            checked={!!editReview.flagged}
            onChange={(e) => handleEditInputChange({ target: { name: 'flagged', value: e.target.checked ? 1 : 0 } })}
          />
          <label htmlFor="flagged">Flagged</label>
          <button onClick={handleUpdateReview}>Update</button>
          <button onClick={() => setEditReviewId(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;