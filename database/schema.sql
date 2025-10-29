-- ============================================
-- MASTER TABLES (Shared Pool)
-- ============================================

-- 1. Exercise Pool (Master list of all available exercises)
CREATE TABLE exercise_pool (
    exercise_id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Cardio, Strength, Flexibility, Sports
    difficulty_level VARCHAR(20), -- Beginner, Intermediate, Advanced
    calories_per_minute DECIMAL(5,2),
    description TEXT,
    instructions TEXT,
    target_muscles VARCHAR(200), -- Chest, Back, Legs, etc.
    equipment_needed VARCHAR(200), -- Dumbbells, Treadmill, None, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Food Items Pool (Master list of common foods)
CREATE TABLE food_pool (
    food_id SERIAL PRIMARY KEY,
    food_name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- Protein, Carbs, Vegetables, Fruits, Dairy
    serving_size VARCHAR(50),
    calories DECIMAL(6,2),
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fats DECIMAL(5,2),
    fiber DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER TABLES
-- ============================================

-- 3. Users (Main user accounts)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. User Profile (Extended user information)
CREATE TABLE user_profile (
    profile_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    height DECIMAL(5,2), -- in cm
    current_weight DECIMAL(5,2), -- in kg
    activity_level VARCHAR(20), -- Sedentary, Light, Moderate, Active, Very Active
    dietary_preference VARCHAR(50), -- Vegan, Vegetarian, Non-veg, Keto, etc.
    health_conditions TEXT,
    fitness_experience VARCHAR(20), -- Beginner, Intermediate, Advanced
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ============================================
-- MAPPING TABLES (User-specific selections)
-- ============================================

-- 5. User Exercise Plan (Maps users to exercises they want to do)
CREATE TABLE user_exercise_plan (
    plan_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercise_pool(exercise_id) ON DELETE CASCADE,
    sets INT,
    reps INT,
    duration_minutes INT, -- For cardio exercises
    frequency_per_week INT, -- How many times per week
    is_active BOOLEAN DEFAULT TRUE,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, exercise_id)
);

-- 6. User Meal Plan (Maps users to their meal preferences)
CREATE TABLE user_meal_plan (
    meal_plan_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    food_id INT REFERENCES food_pool(food_id) ON DELETE CASCADE,
    meal_type VARCHAR(20), -- Breakfast, Lunch, Dinner, Snack
    quantity DECIMAL(5,2),
    is_favorite BOOLEAN DEFAULT FALSE,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TRACKING TABLES (Daily logs)
-- ============================================

-- 7. Workout Log (Track actual workouts completed)
CREATE TABLE workout_log (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercise_pool(exercise_id) ON DELETE SET NULL,
    workout_date DATE NOT NULL,
    sets_completed INT,
    reps_completed INT,
    duration_minutes INT,
    calories_burned DECIMAL(6,2),
    notes TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Meal Log (Track daily food intake)
CREATE TABLE meal_log (
    meal_log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    food_id INT REFERENCES food_pool(food_id) ON DELETE SET NULL,
    meal_date DATE NOT NULL,
    meal_type VARCHAR(20), -- Breakfast, Lunch, Dinner, Snack
    quantity DECIMAL(5,2),
    total_calories DECIMAL(6,2),
    total_protein DECIMAL(5,2),
    total_carbs DECIMAL(5,2),
    total_fats DECIMAL(5,2),
    notes TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Weight Tracking (Track weight progress over time)
CREATE TABLE weight_tracking (
    weight_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    recorded_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recorded_date)
);

-- 10. Goals (User fitness goals)
CREATE TABLE goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- Weight Loss, Muscle Gain, Endurance, Flexibility
    target_value DECIMAL(6,2),
    current_value DECIMAL(6,2),
    start_date DATE NOT NULL,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'In Progress', -- In Progress, Achieved, Abandoned
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_workout_log_user_date ON workout_log(user_id, workout_date);
CREATE INDEX idx_meal_log_user_date ON meal_log(user_id, meal_date);
CREATE INDEX idx_weight_tracking_user ON weight_tracking(user_id, recorded_date);
CREATE INDEX idx_user_exercise_plan_user ON user_exercise_plan(user_id);
CREATE INDEX idx_user_meal_plan_user ON user_meal_plan(user_id);