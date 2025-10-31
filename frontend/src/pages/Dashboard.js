// in: frontend/src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
// --- NEW: Import updateGoal ---
import { getGoals, createGoal, updateGoal } from '../services/goalService';
import { getWorkouts, createWorkout, deleteWorkout } from '../services/workoutService';
import { getMeals, createMeal, deleteMeal } from '../services/mealService';
import './Dashboard.css';

// --- NEW: Define your uniform goal types ---
const GOAL_TYPES = [
  'Weight Loss',
  'Gain Muscle',
  'Run a 5k',
  'Improve Strength',
  'Eat Healthier'
];

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
    food_id: '', meal_date: '', meal_type: '', quantity: '', total_calories: '', notes: ''
  });
  const [activeTab, setActiveTab] = useState('goals');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [goalsData, workoutsData, mealsData] = await Promise.all([
          getGoals(),
          getWorkouts(),
          getMeals()
        ]);
        
        // --- NEW: Sort goals on load ---
        const active = goalsData.find(g => g.status === 'In Progress');
        const finished = goalsData.filter(g => g.status !== 'In Progress');
        setActiveGoal(active || null);
        setFinishedGoals(finished);

        setWorkouts(workoutsData);
        setMeals(mealsData);
        setError('');
      } catch (err) {
        setError(err.msg || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

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
    try {
      const dataToSubmit = { ...newWorkoutData, exercise_id: newWorkoutData.exercise_id || 1 };
      const newWorkout = await createWorkout(dataToSubmit);
      setWorkouts([...workouts, newWorkout]);
      setNewWorkoutData({ exercise_id: '', workout_date: '', sets_completed: '', reps_completed: '', duration_minutes: '', notes: '' });
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
      setNewMealData({ food_id: '', meal_date: '', meal_type: '', quantity: '', total_calories: '', notes: '' });
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
  const renderWorkoutsSection = () => (
    <div className="dashboard-content">
      <form onSubmit={onWorkoutFormSubmit} className="log-form">
        <h3>Log a Workout</h3>
        <input name="workout_date" type="date" value={newWorkoutData.workout_date} onChange={onWorkoutFormChange} required />
        <input name="sets_completed" type="number" placeholder="Sets" value={newWorkoutData.sets_completed} onChange={onWorkoutFormChange} />
        <input name="reps_completed" type="number" placeholder="Reps" value={newWorkoutData.reps_completed} onChange={onWorkoutFormChange} />
        <input name="duration_minutes" type="number" placeholder="Duration (mins)" value={newWorkoutData.duration_minutes} onChange={onWorkoutFormChange} />
        <input name="notes" placeholder="Notes" value={newWorkoutData.notes} onChange={onWorkoutFormChange} />
        <button type="submit">Log Workout</button>
        <small style={{display: 'block', marginTop: '1rem', color: '#777'}}>Note: Using default Exercise ID 1.</small>
      </form>
      <div className="log-list">
        <h3>My Workout History</h3>
        {workouts.length === 0 ? <p style={{padding: '1rem 1.5rem', color: '#999'}}>No workouts logged.</p> : (
          workouts.map(workout => (
            <div key={workout.log_id} className="log-item">
              <div className="log-item-details">
                <span className="type">Date: {new Date(workout.workout_date).toLocaleDateString()}</span>
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
  );

  const renderMealsSection = () => (
    <div className="dashboard-content">
      <form onSubmit={onMealFormSubmit} className="log-form">
        <h3>Log a Meal</h3>
        <input name="meal_date" type="date" value={newMealData.meal_date} onChange={onMealFormChange} required />
        <input name="meal_type" type="text" placeholder="Meal Type (e.g., Breakfast)" value={newMealData.meal_type} onChange={onMealFormChange} />
        <input name="total_calories" type="number" placeholder="Total Calories" value={newMealData.total_calories} onChange={onMealFormChange} />
        <input name="notes" placeholder="Notes" value={newMealData.notes} onChange={onMealFormChange} />
        <button type="submit">Log Meal</button>
        <small style={{display: 'block', marginTop: '1rem', color: '#777'}}>Note: Using default Food ID 1.</small>
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