var DataTypes = require("sequelize").DataTypes;
var _exercise_pool = require("./exercise_pool");
var _food_pool = require("./food_pool");
var _goals = require("./goals");
var _meal_log = require("./meal_log");
var _user_custom_exercises = require("./user_custom_exercises");
var _user_custom_foods = require("./user_custom_foods");
var _user_exercise_plan = require("./user_exercise_plan");
var _user_meal_plan = require("./user_meal_plan");
var _user_profile = require("./user_profile");
var _users = require("./users");
var _weight_tracking = require("./weight_tracking");
var _workout_log = require("./workout_log");

function initModels(sequelize) {
  var exercise_pool = _exercise_pool(sequelize, DataTypes);
  var food_pool = _food_pool(sequelize, DataTypes);
  var goals = _goals(sequelize, DataTypes);
  var meal_log = _meal_log(sequelize, DataTypes);
  var user_custom_exercises = _user_custom_exercises(sequelize, DataTypes);
  var user_custom_foods = _user_custom_foods(sequelize, DataTypes);
  var user_exercise_plan = _user_exercise_plan(sequelize, DataTypes);
  var user_meal_plan = _user_meal_plan(sequelize, DataTypes);
  var user_profile = _user_profile(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var weight_tracking = _weight_tracking(sequelize, DataTypes);
  var workout_log = _workout_log(sequelize, DataTypes);

  user_exercise_plan.belongsTo(exercise_pool, { as: "exercise", foreignKey: "exercise_id"});
  exercise_pool.hasMany(user_exercise_plan, { as: "user_exercise_plans", foreignKey: "exercise_id"});
  workout_log.belongsTo(exercise_pool, { as: "exercise", foreignKey: "exercise_id"});
  exercise_pool.hasMany(workout_log, { as: "workout_logs", foreignKey: "exercise_id"});
  meal_log.belongsTo(food_pool, { as: "food", foreignKey: "food_id"});
  food_pool.hasMany(meal_log, { as: "meal_logs", foreignKey: "food_id"});
  user_meal_plan.belongsTo(food_pool, { as: "food", foreignKey: "food_id"});
  food_pool.hasMany(user_meal_plan, { as: "user_meal_plans", foreignKey: "food_id"});
  user_exercise_plan.belongsTo(user_custom_exercises, { as: "custom_exercise", foreignKey: "custom_exercise_id"});
  user_custom_exercises.hasMany(user_exercise_plan, { as: "user_exercise_plans", foreignKey: "custom_exercise_id"});
  workout_log.belongsTo(user_custom_exercises, { as: "custom_exercise", foreignKey: "custom_exercise_id"});
  user_custom_exercises.hasMany(workout_log, { as: "workout_logs", foreignKey: "custom_exercise_id"});
  meal_log.belongsTo(user_custom_foods, { as: "custom_food", foreignKey: "custom_food_id"});
  user_custom_foods.hasMany(meal_log, { as: "meal_logs", foreignKey: "custom_food_id"});
  user_meal_plan.belongsTo(user_custom_foods, { as: "custom_food", foreignKey: "custom_food_id"});
  user_custom_foods.hasMany(user_meal_plan, { as: "user_meal_plans", foreignKey: "custom_food_id"});
  goals.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(goals, { as: "goals", foreignKey: "user_id"});
  meal_log.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(meal_log, { as: "meal_logs", foreignKey: "user_id"});
  user_custom_exercises.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_custom_exercises, { as: "user_custom_exercises", foreignKey: "user_id"});
  user_custom_foods.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_custom_foods, { as: "user_custom_foods", foreignKey: "user_id"});
  user_exercise_plan.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_exercise_plan, { as: "user_exercise_plans", foreignKey: "user_id"});
  user_meal_plan.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_meal_plan, { as: "user_meal_plans", foreignKey: "user_id"});
  user_profile.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasOne(user_profile, { as: "user_profile", foreignKey: "user_id"});
  weight_tracking.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(weight_tracking, { as: "weight_trackings", foreignKey: "user_id"});
  workout_log.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(workout_log, { as: "workout_logs", foreignKey: "user_id"});

  return {
    exercise_pool,
    food_pool,
    goals,
    meal_log,
    user_custom_exercises,
    user_custom_foods,
    user_exercise_plan,
    user_meal_plan,
    user_profile,
    users,
    weight_tracking,
    workout_log,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
