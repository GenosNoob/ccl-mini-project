import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import Meal from "../models/Meal.js";

dotenv.config();

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, { expiresIn: "24h" });
    const { password: userPassword, ...rest } = createdUser._doc;
    return res.status(200).json({ token, user: rest });
  } catch (error) {
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }
    console.log(user);
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "24h" });
    const { password: userPassword, ...rest } = user._doc;
    return res.status(200).json({ token, user: rest });
  } catch (error) {
    return next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) {
      return next(createError(404, "User not found"));
    }
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    // Optimized aggregation for today's workout stats
    const todayWorkoutStats = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurntForCategory: { $sum: "$caloriesBurned" },
          workoutCountForCategory: { $sum: 1 }
        },
      },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: "$totalCaloriesBurntForCategory" },
          totalWorkouts: { $sum: "$workoutCountForCategory" },
          categoryCalories: { $push: { _id: "$_id", totalCaloriesBurnt: "$totalCaloriesBurntForCategory" } }
        }
      }
    ]);

    // Aggregation for today's consumed calories
    const todayMealStats = await Meal.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalCaloriesConsumed: { $sum: "$calories" },
        },
      },
    ]);

    const totalCaloriesBurnt = todayWorkoutStats[0]?.totalCaloriesBurnt || 0;
    const totalWorkouts = todayWorkoutStats[0]?.totalWorkouts || 0;
    const avgCaloriesBurntPerWorkout =
      totalWorkouts > 0 ? totalCaloriesBurnt / totalWorkouts : 0;
    const categoryCalories = todayWorkoutStats[0]?.categoryCalories || [];

    //Format category data for pie chart

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    // --- Refactor for Weekly Stats ---
    const sevenDaysAgo = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() - 6
    );
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const allWorkoutsLast7Days = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    const allMealsLast7Days = await Meal.aggregate([
      { $match: { user: user._id, date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCaloriesConsumed: { $sum: "$calories" },
        },
      },
    ]);

    const workoutDataMap = new Map(allWorkoutsLast7Days.map(item => [item._id, item.totalCaloriesBurnt]));
    const mealDataMap = new Map(allMealsLast7Days.map(item => [item._id, item.totalCaloriesConsumed]));

    const weeks = [];
    const caloriesBurnt = [];
    const caloriesConsumed = []; // New array for consumed calories
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      const dateString = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      weeks.push(`${date.getDate()}`); // Just the day number for simplicity
      caloriesBurnt.push(workoutDataMap.get(dateString) || 0);
      caloriesConsumed.push(mealDataMap.get(dateString) || 0);
    }

    return res.status(200).json({
      totalCaloriesBurnt: totalCaloriesBurnt,
      totalCaloriesConsumed:
        todayMealStats.length > 0 ? todayMealStats[0].totalCaloriesConsumed : 0,
      totalWorkouts: totalWorkouts,
      avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
      totalWeeksStats: { // Renamed for clarity
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
        caloriesConsumed: caloriesConsumed, // Added consumed data
      },
      pieChartData: pieChartData,
      user: user, // Send full user object for profile
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    let date = req.query.date ? new Date(req.query.date) : new Date();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const todaysWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + workout.caloriesBurned,
      0
    );

    return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
  } catch (err) {
    next(err);
  }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutName, sets, reps, weight, duration, category, date } = req.body;

    // Basic validation
    if (!workoutName || !sets || !reps || !weight || !duration || !category) {
        return next(createError(400, "All fields are required"));
    }

    const newWorkoutDetails = {
        workoutName,
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
        duration: Number(duration),
        category,
    };

    const calories = parseFloat(calculateCaloriesBurnt(newWorkoutDetails));
    await Workout.create({
      ...newWorkoutDetails,
      caloriesBurned: calories,
      user: userId,
      date: date || new Date(),
    });

    return res.status(201).json({
      message: "Workouts added successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const userId = req.user.id;

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return next(createError(404, "Workout not found"));
    }

    // Ensure the user deleting the workout is the one who created it
    if (workout.user.toString() !== userId) {
      return next(createError(403, "You are not authorized to delete this workout"));
    }

    await Workout.findByIdAndDelete(workoutId);

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// New Meal Endpoints
export const addMeal = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { mealName, quantity, calories } = req.body;

    if (!mealName || !quantity || !calories) {
      return next(createError(400, "All meal fields are required"));
    }

    const newMeal = new Meal({
      user: userId,
      mealName,
      quantity,
      calories,
      date: new Date(),
    });

    const savedMeal = await newMeal.save();
    return res.status(201).json(savedMeal);
  } catch (err) {
    next(err);
  }
};

export const getMealsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    let date = req.query.date ? new Date(req.query.date) : new Date();
    
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const meals = await Meal.find({
      user: userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ date: -1 });

    return res.status(200).json(meals);
  } catch (err) {
    next(err);
  }
};

// Function to parse workout details from a line
const parseWorkoutLine = (parts) => {
  try {
    const details = {};
    if (parts.length >= 5) {
      details.workoutName = parts[1].substring(1).trim();
      details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
      details.reps = parseInt(
        parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
      );
      details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
      details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());

      // Validate that all numbers were successfully parsed
      if (isNaN(details.sets) || isNaN(details.reps) || isNaN(details.weight) || isNaN(details.duration)) {
        return null;
      }
      return details;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  // This is a simplified placeholder formula.
  // A more accurate calculation would use MET (Metabolic Equivalent of Task) values
  // based on the exercise type and the user's body weight.
  // Formula: (MET * 3.5 * bodyWeightInKg) / 200 = calories/min
  const caloriesBurntPerMinute = 10; // Sample value representing moderate-to-high intensity.
  return durationInMinutes * caloriesBurntPerMinute;
};
