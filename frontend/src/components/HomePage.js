import React, { useState, useEffect } from 'react';
import { fetchReviews, fetchCourses, fetchProfs, fetchDepartments } from '../services/api';
import './HomePage.css';

function HomePage() {
  // State Initialization
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [profs, setProfs] = useState([]);
  const [departments, setDepartments] = useState([]);

  // States for filters and selections
  const [searchProfName, setSearchProfName] = useState('');
  const [searchClassCode, setSearchClassCode] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const [selectedProf, setSelectedProf] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);

  const [classProfessors, setClassProfessors] = useState([]);
  const [departmentProfessors, setDepartmentProfessors] = useState([]);

  const [filterType, setFilterType] = useState('');

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const reviewsData = await fetchReviews();
        const coursesData = await fetchCourses();
        const profsData = await fetchProfs();
        const departmentsData = await fetchDepartments();
        setReviews(reviewsData);
        setCourses(coursesData);
        setProfs(profsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    loadData();
  }, []);

  // Filter Change Handler
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setSearchProfName('');
    setSearchClassCode('');
    setSearchDepartment('');
    setFilteredResults([]);
    setSelectedProf(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setFilteredReviews([]);
  };

  // Search by Professor Name
  const handleSearchProfName = (term) => {
    setSearchProfName(term);
    setFilteredResults(
      profs.filter((prof) =>
        prof.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  // Search by Class Code
  const handleSearchClassCode = (term) => {
    setSearchClassCode(term);
    setFilteredResults(
      courses.filter((course) =>
        course.course_code.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  // Search by Department Name
  const handleSearchDepartment = (term) => {
    setSearchDepartment(term);
    setFilteredResults(
      departments.filter((department) =>
        department.department_name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  // Handle Professor Selection
  const handleProfSelect = (prof) => {
    setSelectedProf(prof);
    const professorCourses = courses.filter(
      (course) => course.professor_id === prof.professor_id
    );
    const professorReviews = reviews.filter((review) =>
      professorCourses.some((course) => course.course_id === review.course_id)
    );
    setFilteredReviews(professorReviews);
    setSelectedCourse(null); // Reset course selection when a new professor is selected
  };
  
  // Handle Class Code Filter for Professor
  const handleClassCodeFilterForProf = (selectedClassCode) => {
    if (!selectedProf || !selectedClassCode) return;
  
    const isValidCourse = courses.some(
      (course) =>
        course.course_id === selectedClassCode.course_id &&
        course.professor_id === selectedProf.professor_id
    );
  
    if (!isValidCourse) return;

    console.log("Selected Course:", selectedClassCode);
    console.log("Selected Professor:", selectedProf);

    const filtered = reviews.filter(
      (review) => review.course_id === selectedClassCode.course_id
    );

    console.log("Filtered Reviews:", filtered);
    setSelectedCourse(selectedClassCode);
    setFilteredReviews(filtered);

  setSelectedCourse(selectedClassCode);
  setFilteredReviews(filtered);
  };

  // Handle Class Code Search
  const handleClassCodeSearch = (selectedClassCode) => {
    if (!selectedClassCode) return;
  
    console.log("Searching for class code:", selectedClassCode.course_code);
  
    // Find professors teaching the selected class
    const professorsForClass = profs.filter((prof) =>
      courses.some(
        (course) =>
          course.course_id === selectedClassCode.course_id &&
          course.professor_id === prof.professor_id
      )
    );
  
    // Reset previously selected professor and reviews
    setSelectedProf(null);
    setFilteredReviews([]);
    setSelectedCourse(selectedClassCode);
    setClassProfessors(professorsForClass);
  
    console.log("Professors for class code:", professorsForClass);
  };
  

  // Handle Professor Selection for Class Code Search
  const handleProfessorForClassSelect = (prof) => {
    setSelectedProf(prof);
    if (selectedCourse) {
      const reviewsForClassAndProf = reviews.filter(
        (review) =>
          review.course_id === selectedCourse.course_id &&
          review.professor_id === prof.professor_id
      );
  
      console.log("Filtered Reviews for Class and Professor:", reviewsForClassAndProf);
  
      setFilteredReviews(reviewsForClassAndProf);
    }
  };
  
  

  // Handle Department Selection
  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);

    const professorsForDepartment = profs.filter(
      (prof) => prof.department_id === department.department_id
    );

    setDepartmentProfessors(professorsForDepartment);
    setFilteredResults([]);
  };

  // Handle Professor Selection for Department Search
  const handleDepartmentProfessorSelect = (prof) => {
    setSelectedProf(prof);
    setSelectedCourse(null);
    setFilteredReviews([]);
  
    // Filter courses taught by the professor and exclude invalid entries
    const professorCourses = courses.filter(
      (course) =>
        course.professor_id === prof.professor_id &&
        course.course_code && // Ensure course_code is not empty
        course.course_name // Ensure course_name is not empty
    );
  
    setFilteredResults(professorCourses); // Set valid courses for rendering
  };
  
  
  

  // Calculate Average Rating for Professor
  const calculateAverageRating = (professorId) => {
    const professorCourses = courses.filter(
      (course) => course.professor_id === professorId
    );
    const professorReviews = reviews.filter((review) =>
      professorCourses.some((course) => course.course_id === review.course_id)
    );
    const validRatings = professorReviews
      .map((review) => parseFloat(review.Ratings))
      .filter((rating) => !isNaN(rating));

    const totalRating = validRatings.reduce((sum, rating) => sum + rating, 0);
    return validRatings.length > 0
      ? (totalRating / validRatings.length).toFixed(1)
      : 'N/A';
  };

  return (
    <div className="homepage">
      <h1 className="homepage-title">Campus Critic</h1>
  
      {/* Filter Dropdown */}
      <div className="search-filter-container">
        <select
          className="filter-dropdown"
          value={filterType}
          onChange={handleFilterChange}
        >
          <option value="" disabled>
            Select Filter
          </option>
          <option value="professor">Search by Professor</option>
          <option value="classCode">Search by Class Code</option>
          <option value="department">Search by Department</option>
        </select>
      </div>
  
      {/* Search by Professor */}
      {filterType === 'professor' && (
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Professor Name"
            value={searchProfName}
            onChange={(e) => handleSearchProfName(e.target.value)}
          />
          {searchProfName.length > 0 && (
            <ul className="dropdown-list">
              {filteredResults.map((prof) => (
                <li
                  key={prof.professor_id}
                  onClick={() => {
                    handleProfSelect(prof);
                    setFilteredResults([]); // Hide dropdown after selection
                  }}
                  className={`dropdown-item ${
                    selectedProf && selectedProf.professor_id === prof.professor_id ? 'active-item' : ''
                  }`}
                >
                  {prof.name} (Avg. Rating: {calculateAverageRating(prof.professor_id)})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
  
      {/* Search by Class Code */}
      {filterType === 'classCode' && (
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Class Code"
            value={searchClassCode}
            onChange={(e) => handleSearchClassCode(e.target.value)}
          />
          {searchClassCode.length > 0 && (
            <ul className="dropdown-list">
              {filteredResults.map((course) => (
                <li
                  key={course.course_id}
                  onClick={() => {
                    handleClassCodeSearch(course);
                    setFilteredResults([]); // Hide dropdown after selection
                  }}
                  className={`dropdown-item ${
                    selectedCourse && selectedCourse.course_id === course.course_id ? 'active-item' : ''
                  }`}
                >
                  {course.course_code}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
  
      {/* Search by Department */}
      {filterType === 'department' && !selectedDepartment && (
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Department Name"
            value={searchDepartment}
            onChange={(e) => handleSearchDepartment(e.target.value)}
          />
          {searchDepartment.length > 0 && (
            <ul className="dropdown-list">
              {filteredResults.map((department) => (
                <li
                  key={department.department_id}
                  onClick={() => {
                    handleDepartmentSelect(department); // Select the department
                    setFilteredResults([]); // Clear the dropdown
                    setSearchDepartment(''); // Clear the input field
                  }}
                  className="dropdown-item"
                >
                  {department.department_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

  
      {/* Reviews for Selected Professor */}
      {selectedProf && filterType === 'professor' && (
        <div className="professor-reviews">
          <h2>
            Reviews for {selectedProf.name} (Avg. Rating: {calculateAverageRating(selectedProf.professor_id)})
          </h2>

          {/* Filter by Class Code */}
          <select
            className="class-filter-dropdown"
            value={selectedCourse ? selectedCourse.course_code : ''}
            onChange={(e) => {
              console.log("Dropdown value changed:", e.target.value); // Debug log
              const course = courses.find((c) => c.course_code === e.target.value);
              if (course) {
                handleClassCodeFilterForProf(course); // Use the selected course object
              }
            }}
          >
            <option value="">Filter by Class Code</option>
            {courses
              .filter((course) => course.professor_id === selectedProf.professor_id)
              .map((course) => (
                <option key={course.course_id} value={course.course_code}>
                  {course.course_code}
                </option>
              ))}
          </select>


          {/* Display Filtered Reviews */}
          <ul>
            {filteredReviews.map((review) => (
              <li key={review.review_id}>
                {review.review_text} - Rating: {review.Ratings}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Professors Teaching Selected Class */}
      {selectedCourse && filterType === 'classCode' && !selectedProf && (
        <div className="class-professors">
          <h2>Professors teaching {selectedCourse.course_code}</h2>
          <ul>
            {classProfessors.map((prof) => (
              <li
                key={prof.professor_id}
                onClick={() => {
                  handleProfessorForClassSelect(prof); // Handle professor selection
                }}
                className={`dropdown-item ${
                  selectedProf && selectedProf.professor_id === prof.professor_id ? 'active-item' : ''
                }`}
              >
                {prof.name} (Avg. Rating: {calculateAverageRating(prof.professor_id)})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews for Selected Professor */}
      {selectedProf && filterType === 'classCode' && (
        <div className="professor-reviews">
          <h2>
            Reviews for {selectedProf.name} in {selectedCourse.course_code}
          </h2>

          {/* Back Button */}
          <button
            className="back-button"
            onClick={() => {
              setSelectedProf(null); // Reset selected professor to go back to the list
              setFilteredReviews([]); // Clear filtered reviews
            }}
          >
            Back to Professors
          </button>

          {/* Display Filtered Reviews */}
          <ul>
            {filteredReviews.map((review) => (
              <li key={review.review_id}>
                {review.review_text} - Rating: {review.Ratings}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Professors in Selected Department */}
      {filterType === 'department' && selectedDepartment && !selectedProf && (
        <div className="department-professors">
          <h2>Professors in {selectedDepartment.department_name}</h2>
          <ul>
            {departmentProfessors.map((prof, index) => (
              <li
                key={prof.professor_id || index} // Use professor_id or index as key
                onClick={() => {
                  handleDepartmentProfessorSelect(prof); // Select professor
                }}
                className={`dropdown-item ${
                  selectedProf && selectedProf.professor_id === prof.professor_id ? 'active-item' : ''
                }`}
              >
                {prof.name} (Avg. Rating: {calculateAverageRating(prof.professor_id)})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Courses for Selected Professor */}
      {selectedProf && filterType === 'department' && !selectedCourse && (
        <div className="professor-courses">
          <h2>Courses Taught by {selectedProf.name}</h2>
          {/* List of Courses */}
          <ul>
            {filteredResults
              .filter((course) => course.course_code && course.course_name) // Ensure only valid courses
              .map((course) => (
                <li
                  key={course.course_code} // Use course_code as the unique key
                  onClick={() => {
                    setSelectedCourse(course); // Set the selected course
                    const courseReviews = reviews.filter(
                      (review) =>
                        review.course_id === course.course_id && // Match course_id
                        review.professor_id === selectedProf.professor_id // Match professor_id
                    );
                    setFilteredReviews(courseReviews); // Filter reviews by course_id and professor_id
                  }}
                  className="dropdown-item"
                >
                  {course.course_code} - {course.course_name}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Reviews for Selected Course */}
      {selectedCourse && selectedProf && filterType === 'department' && (
        <div className="professor-reviews">
          <h2>
            Reviews for {selectedProf.name} in {selectedCourse.course_code}
          </h2>

          {/* Back Button */}
          <button
            className="back-button"
            onClick={() => {
              setSelectedCourse(null); // Go back to the courses list
              setFilteredReviews([]); // Clear reviews
            }}
          >
            Back to Courses
          </button>

          {/* Display Reviews */}
          <ul>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <li key={review.review_id}>
                  {review.review_text} - Rating: {review.Ratings}
                </li>
              ))
            ) : (
              <li>No reviews available for this course.</li> // Display if no reviews are found
            )}
          </ul>
        </div>
      )}
    </div>
  ); 
}

export default HomePage;