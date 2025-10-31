// in: frontend/src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
// --- NEW: Import updateGoal ---
import { getGoals, createGoal, updateGoal } from '../services/goalService';
import { getWorkouts, createWorkout, deleteWorkout } from '../services/workoutService';
import { getMeals, createMeal, deleteMeal } from '../services/mealService';
import { getExercises } from '../services/exerciseService';
import './Dashboard.css';

const GOAL_TYPES = [
  'Weight Loss',
  'Gain Muscle',
  'Run a 5k',
  'Improve Strength',
  'Eat Healthier'
];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Brunch'];

const Dashboard = () => {
  // --- NEW: Re-structured Goals State ---
  const [activeGoal, setActiveGoal] = useState(null);
  const [finishedGoals, setFinishedGoals] = useState([]);
  
  const [newGoalData, setNewGoalData] = useState({
    goal_type: GOAL_TYPES[0], // Default to the first type
    target_value: '', start_date: '', target_date: '', notes: ''
  });

  // --- (Other states are the same) ---
  const [workouts, setWorkouts] = useState([]);
  const [newWorkoutData, setNewWorkoutData] = useState({
    exercise_id: '', workout_date: '', sets_completed: '', reps_completed: '', duration_minutes: '', notes: ''
  });
  const [meals, setMeals] = useState([]);
  const [newMealData, setNewMealData] = useState({
  food_id: '', 
  meal_date: '', 
  meal_type: MEAL_TYPES[0], // <-- Use the first type by default
  quantity: '', 
  total_calories: '', 
  notes: ''
});
  const [activeTab, setActiveTab] = useState('goals');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exercisePool, setExercisePool] = useState([]); // Holds all exercises
const [exerciseSearch, setExerciseSearch] = useState(''); // Holds the search text
const [selectedExercise, setSelectedExercise] = useState(null); // Holds the clicked exercise

  // Fetch all data
 // in: frontend/src/pages/Dashboard.js

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [goalsData, workoutsData, mealsData, exercisesData] = await Promise.all([
          getGoals(),
          getWorkouts(),
          getMeals(),
          getExercises()
        ]);
        
        // --- THIS IS THE FIX ---
        // Sort goals into active and finished
        const active = goalsData.find(g => g.status === 'In Progress');
        const finished = goalsData.filter(g => g.status !== 'In Progress');
        setActiveGoal(active || null);
        setFinishedGoals(finished);
        // --- END FIX ---
        
        setWorkouts(workoutsData);
        setMeals(mealsData);
        setExercisePool(exercisesData);
        setError('');
      } catch (err) {
        setError(err.msg || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboard();
  }, []); // The empty array [] means this runs only once

  // --- GOAL HANDLERS (UPDATED) ---
const onGoalFormChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...newGoalData, [name]: value };

    // NEW LOGIC: If changing goal type, check if we need to clear target_value
    if (name === 'goal_type') {
      if (value !== 'Weight Loss' && value !== 'Gain Muscle') {
        updatedData.target_value = ''; // Clear target value
      }
    }
    
    setNewGoalData(updatedData);
  };
  
  const onGoalFormSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const newGoal = await createGoal(newGoalData);
      setActiveGoal(newGoal); // Set it as the new active goal
      setNewGoalData({ goal_type: GOAL_TYPES[0], target_value: '', start_date: '', target_date: '', notes: '' });
    } catch (err) { 
      setError(err.msg || 'Could not create goal'); 
      alert(err.msg || 'Error'); // Alert the user why it failed
    }
  };

  // --- NEW: Handle "Mark as Finished" ---
  const handleGoalFinished = async () => {
    if (!activeGoal) return;
    if (window.confirm('Mark this goal as finished?')) {
      try {
        const updatedGoal = await updateGoal(activeGoal.goal_id, { status: 'Completed' });
        setFinishedGoals([updatedGoal, ...finishedGoals]); // Add to finished list
        setActiveGoal(null); // Clear the active goal
      } catch (err) {
        setError(err.msg || 'Could not update goal');
      }
    }
  };
  
  // --- (Workout and Meal handlers are unchanged) ---
  const onWorkoutFormChange = (e) => setNewWorkoutData({ ...newWorkoutData, [e.target.name]: e.target.value });
  const onWorkoutFormSubmit = async (e) => {
  e.preventDefault();
  if (!selectedExercise) {
    alert('Please select an exercise from the list first.');
    return;
  }

  try {
    const dataToSubmit = { 
      ...newWorkoutData, 
      exercise_id: selectedExercise.exercise_id // <-- THIS IS THE CHANGE
    };

    const newWorkout = await createWorkout(dataToSubmit);
    setWorkouts([...workouts, newWorkout]);

    // Reset form and selection
    setNewWorkoutData({ exercise_id: '', workout_date: '', sets_completed: '', reps_completed: '', duration_minutes: '', notes: '' });
    setSelectedExercise(null);
    setExerciseSearch('');
  } catch (err) { setError(err.msg || 'Could not log workout'); }
};
  const handleWorkoutDelete = async (logId) => {
    if (window.confirm('Delete this workout log?')) {
      try {
        await deleteWorkout(logId);
        setWorkouts(workouts.filter(workout => workout.log_id !== logId));
      } catch (err) { setError(err.msg || 'Could not delete workout log'); }
    }
  };
  const onMealFormChange = (e) => setNewMealData({ ...newMealData, [e.target.name]: e.target.value });
  const onMealFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...newMealData, food_id: newMealData.food_id || 1 };
      const newMeal = await createMeal(dataToSubmit);
      setMeals([...meals, newMeal]);
      setNewMealData({ 
    food_id: '', 
    meal_date: '', 
    meal_type: MEAL_TYPES[0], // <-- Reset to the default type
    quantity: '', 
    total_calories: '', 
    notes: '' 
  });
    } catch (err) { setError(err.msg || 'Could not log meal'); }
  };
  const handleMealDelete = async (logId) => {
    if (window.confirm('Delete this meal log?')) {
      try {
        await deleteMeal(logId);
        setMeals(meals.filter(meal => meal.meal_log_id !== logId));
      } catch (err) { setError(err.msg || 'Could not delete meal log'); }
    }
  };


  // --- RENDER FUNCTIONS (UPDATED) ---

  const renderTabs = () => (
    <nav className="tab-nav">
      <button className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>My Goals</button>
      <button className={`tab-button ${activeTab === 'workouts' ? 'active' : ''}`} onClick={() => setActiveTab('workouts')}>My Workout Logs</button>
      <button className={`tab-button ${activeTab === 'meals' ? 'active' : ''}`} onClick={() => setActiveTab('meals')}>My Food Log</button>
    </nav>
  );

  // --- NEW: Renders the Create Goal Form (with Dropdown) ---
  const renderCreateGoalForm = () => (
    <form onSubmit={onGoalFormSubmit} className="log-form">
      <h3>Start a New Goal</h3>
      
      {/* This is the dropdown you just styled */}
      <select name="goal_type" value={newGoalData.goal_type} onChange={onGoalFormChange}>
        {GOAL_TYPES.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      {/* --- NEW CONDITIONAL LOGIC --- */}
      {/* Only show Target Value if goal_type is one of these */}
      {(newGoalData.goal_type === 'Weight Loss' || newGoalData.goal_type === 'Gain Muscle') && (
        <input 
          name="target_value" 
          type="number" 
          placeholder="Target Weight (e.g., 80)" 
          value={newGoalData.target_value} 
          onChange={onGoalFormChange} 
          required 
        />
      )}
      
      {/* These are the common fields */}
      <input name="start_date" type="date" value={newGoalData.start_date} onChange={onGoalFormChange} required />
      <input name="target_date" type="date" value={newGoalData.target_date} onChange={onGoalFormChange} />
      <input name="notes" placeholder="Notes" value={newGoalData.notes} onChange={onGoalFormChange} />
      <button type="submit">Create Goal</button>
    </form>
  );

  // --- NEW: Renders the *Active* Goal ---
  const renderActiveGoal = () => (
    <div className="log-form" style={{ background: 'rgba(52, 152, 219, 0.1)' }}>
      <h3>My Active Goal</h3>
      <div className="log-item-details" style={{ padding: '1rem', color: '#fff' }}>
        <span className="type" style={{ fontSize: '1.2rem' }}>{activeGoal.goal_type}</span>
        <span className="info" style={{ fontSize: '1rem', color: '#eee' }}>Target: {activeGoal.target_value}</span>
        <span className="info" style={{ fontSize: '1rem', color: '#eee' }}>Status: {activeGoal.status}</span>
      </div>
      <button onClick={handleGoalFinished} style={{ background: '#2ecc71', color: '#fff' }}>Mark as Finished</button>
    </div>
  );

  // --- NEW: Renders the Goals Section (Conditionally) ---
  const renderGoalsSection = () => (
    <div className="dashboard-content">
      {/* Show EITHER the active goal OR the create form */}
      {activeGoal ? renderActiveGoal() : renderCreateGoalForm()}

      <div className="log-list">
        <h3>Completed Goals</h3>
        {finishedGoals.length === 0 ? <p style={{padding: '1rem 1.5rem', color: '#999'}}>No completed goals yet.</p> : (
          finishedGoals.map(goal => (
            <div key={goal.goal_id} className="log-item">
              <div className="log-item-details">
                <span className="type">{goal.goal_type}</span>
                <span className="info">Target: {goal.target_value} | Status: {goal.status}</span>
              </div>
              {/* No delete button for finished goals, but you could add one! */}
            </div>
          ))
        )}
      </div>
    </div>
  );

  // --- (Workout and Meal renderers are unchanged) ---
  const renderWorkoutsSection = () => {

  // Filter the exercise pool based on the search text
  const filteredExercises = exercisePool.filter(exercise =>
    exercise.exercise_name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    // Pre-fill the workout date
    setNewWorkoutData({ ...newWorkoutData, workout_date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="dashboard-content">
      {/* --- COLUMN 1: SEARCH LIST --- */}
      <div className="workout-search-container">
        <h3>Search Exercises</h3>
        <input
          type="text"
          className="search-box"
          placeholder="Search for an exercise..."
          value={exerciseSearch}
          onChange={(e) => setExerciseSearch(e.target.value)}
        />
        <div className="exercise-list-scroll">
          {filteredExercises.length > 0 ? (
            filteredExercises.map(exercise => (
              <div
                key={exercise.exercise_id}
                className={`exercise-item ${selectedExercise?.exercise_id === exercise.exercise_id ? 'selected' : ''}`}
                onClick={() => handleExerciseSelect(exercise)}
              >
                {exercise.exercise_name}
              </div>
            ))
          ) : (
            <p style={{ padding: '1rem', color: '#999' }}>No exercises found.</p>
          )}
        </div>
      </div>

      {/* --- COLUMN 2: LOG FORM & LIST --- */}
      <div>
        {/* The "Log a Workout" form is now inside the log-list container */}
        <div className="log-list">
          {/* Show this form ONLY if an exercise is selected */}
          {selectedExercise ? (
            <form onSubmit={onWorkoutFormSubmit} className="log-form" style={{ background: 'none', boxShadow: 'none' }}>
              <h3>Log: {selectedExercise.exercise_name}</h3>
              <input name="workout_date" type="date" value={newWorkoutData.workout_date} onChange={onWorkoutFormChange} required />
              <input name="sets_completed" type="number" placeholder="Sets" value={newWorkoutData.sets_completed} onChange={onWorkoutFormChange} />
              <input name="reps_completed" type="number" placeholder="Reps" value={newWorkoutData.reps_completed} onChange={onWorkoutFormChange} />
              <input name="duration_minutes" type="number" placeholder="Duration (mins)" value={newWorkoutData.duration_minutes} onChange={onWorkoutFormChange} />
              <input name="notes" placeholder="Notes" value={newWorkoutData.notes} onChange={onWorkoutFormChange} />
              <button typeWhat="submit">Log Workout</button>
              <button type="button" onClick={() => setSelectedExercise(null)} style={{ background: '#777', marginTop: '0.5rem' }}>Cancel</button>
            </form>
          ) : (
            <h3 style={{ textAlign: 'center' }}>Select an exercise from the left to log it.</h3>
          )}
        </div>

        {/* The Workout History List */}
        <div className="log-list" style={{ marginTop: '2rem' }}>
          <h3>My Workout History</h3>
          {workouts.length === 0 ? <p style={{padding: '1rem 1.5rem', color: '#999'}}>No workouts logged.</p> : (
            workouts.map(workout => (
              <div key={workout.log_id} className="log-item">
                <div className="log-item-details">
                  {/* We'd need to JOIN to get name, so for now we'll just show date and exercise ID */}
                  <span className="type">Date: {new Date(workout.workout_date).toLocaleDateString()} (Exercise ID: {workout.exercise_id})</span>
                  <span className="info">Sets: {workout.sets_completed} | Reps: {workout.reps_completed} | Duration: {workout.duration_minutes} mins</span>
                </div>
                <div className="log-item-action">
                  <button onClick={() => handleWorkoutDelete(workout.log_id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

  const renderMealsSection = () => (
    <div className="dashboard-content">
      <form onSubmit={onMealFormSubmit} className="log-form">
        <h3>Log a Meal</h3>
        <input name="meal_date" type="date" value={newMealData.meal_date} onChange={onMealFormChange} required />
        
        {/* --- THIS IS THE NEW DROPDOWN --- */}
        <select name="meal_type" value={newMealData.meal_type} onChange={onMealFormChange}>
          {MEAL_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <input name="total_calories" type="number" placeholder="Total Calories" value={newMealData.total_calories} onChange={onMealFormChange} />
        <input name="quantity" type="number" placeholder="Quantity (e.g., 1)" value={newMealData.quantity} onChange={onMealFormChange} />
        <input name="notes" placeholder="Notes" value={newMealData.notes} onChange={onMealFormChange} />
        <button type="submit">Log Meal</button>
        {/* <small style={{display: 'block', marginTop: '1rem', color: '#777'}}>Note: Using default Food ID 1.</small> */}
      </form>
      <div className="log-list">
        <h3>My Food Log</h3>
        {meals.length === 0 ? <p style={{padding: '1rem 1.5rem', color: '#999'}}>No meals logged.</p> : (
          meals.map(meal => (
            <div key={meal.meal_log_id} className="log-item">
              <div className="log-item-details">
                <span className="type">{meal.meal_type || 'Meal'} on {new Date(meal.meal_date).toLocaleDateString()}</span>
                <span className="info">Calories: {meal.total_calories} kcal | Qty: {meal.quantity}</span>
              </div>
              <div className="log-item-action">
                <button onClick={() => handleMealDelete(meal.meal_log_id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // --- MAIN RETURN ---
  if (loading) return <div>Loading Dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {renderTabs()}
      <div className="dashboard-content-area">
        {activeTab === 'goals' && renderGoalsSection()}
        {activeTab === 'workouts' && renderWorkoutsSection()}
        {activeTab === 'meals' && renderMealsSection()}
      </div>
    </div>
  );
};

export default Dashboard;