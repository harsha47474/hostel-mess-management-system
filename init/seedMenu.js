const mongoose = require('mongoose');
const MessMenu = require('../models/menu');

const connectDB = require('../config/db');

async function seedMenu() {
  try {
    await connectDB();

    // Clear existing menu
    await MessMenu.deleteMany({});

    // Insert default weekly menu
    await MessMenu.insertMany([
      {
        day: 'Monday',
        mealType: 'breakfast',
        items: [
          { name: 'Idli & Chutney', isVeg: true },
          { name: 'Bread Omelette', isVeg: false }
        ]
      },
      {
        day: 'Monday',
        mealType: 'lunch',
        items: [
          { name: 'Rice & Sambar', isVeg: true },
          { name: 'Chicken Curry & Rice', isVeg: false }
        ]
      },
      {
        day: 'Monday',
        mealType: 'dinner',
        items: [
          { name: 'Chapati & Kurma', isVeg: true },
          { name: 'Fish Fry & Chapati', isVeg: false }
        ]
      },

      // Tuesday
      {
        day: 'Tuesday',
        mealType: 'breakfast',
        items: [
          { name: 'Poha', isVeg: true },
          { name: 'Egg Bhurji', isVeg: false }
        ]
      },
      {
        day: 'Tuesday',
        mealType: 'lunch',
        items: [
          { name: 'Dal Tadka & Rice', isVeg: true },
          { name: 'Mutton Curry & Rice', isVeg: false }
        ]
      },
      {
        day: 'Tuesday',
        mealType: 'dinner',
        items: [
          { name: 'Veg Pulao', isVeg: true },
          { name: 'Chicken Biryani', isVeg: false }
        ]
      },

      // Wednesday
      {
        day: 'Wednesday',
        mealType: 'breakfast',
        items: [
          { name: 'Upma', isVeg: true },
          { name: 'Egg Sandwich', isVeg: false }
        ]
      },
      {
        day: 'Wednesday',
        mealType: 'lunch',
        items: [
          { name: 'Rajma & Rice', isVeg: true },
          { name: 'Chicken Curry & Rice', isVeg: false }
        ]
      },
      {
        day: 'Wednesday',
        mealType: 'dinner',
        items: [
          { name: 'Chole & Bhature', isVeg: true },
          { name: 'Fish Curry & Rice', isVeg: false }
        ]
      },

      // Thursday
      {
        day: 'Thursday',
        mealType: 'breakfast',
        items: [
          { name: 'Dosa & Chutney', isVeg: true },
          { name: 'Egg Dosa', isVeg: false }
        ]
      },
      {
        day: 'Thursday',
        mealType: 'lunch',
        items: [
          { name: 'Veg Kurma & Rice', isVeg: true },
          { name: 'Chicken Kurma & Rice', isVeg: false }
        ]
      },
      {
        day: 'Thursday',
        mealType: 'dinner',
        items: [
          { name: 'Vegetable Fried Rice', isVeg: true },
          { name: 'Egg Fried Rice', isVeg: false }
        ]
      },

      // Friday
      {
        day: 'Friday',
        mealType: 'breakfast',
        items: [
          { name: 'Paratha & Curd', isVeg: true },
          { name: 'Keema Paratha', isVeg: false }
        ]
      },
      {
        day: 'Friday',
        mealType: 'lunch',
        items: [
          { name: 'Sambar & Rice', isVeg: true },
          { name: 'Fish Curry & Rice', isVeg: false }
        ]
      },
      {
        day: 'Friday',
        mealType: 'dinner',
        items: [
          { name: 'Paneer Tikka & Chapati', isVeg: true },
          { name: 'Chicken Tikka & Chapati', isVeg: false }
        ]
      },

      // Saturday
      {
        day: 'Saturday',
        mealType: 'breakfast',
        items: [
          { name: 'Poori & Potato Curry', isVeg: true },
          { name: 'Egg Curry & Poori', isVeg: false }
        ]
      },
      {
        day: 'Saturday',
        mealType: 'lunch',
        items: [
          { name: 'Vegetable Biryani', isVeg: true },
          { name: 'Chicken Biryani', isVeg: false }
        ]
      },
      {
        day: 'Saturday',
        mealType: 'dinner',
        items: [
          { name: 'Dal Fry & Rice', isVeg: true },
          { name: 'Mutton Curry & Rice', isVeg: false }
        ]
      },

      // Sunday
      {
        day: 'Sunday',
        mealType: 'breakfast',
        items: [
          { name: 'Aloo Paratha', isVeg: true },
          { name: 'Egg Paratha', isVeg: false }
        ]
      },
      {
        day: 'Sunday',
        mealType: 'lunch',
        items: [
          { name: 'Vegetable Pulao', isVeg: true },
          { name: 'Chicken Pulao', isVeg: false }
        ]
      },
      {
        day: 'Sunday',
        mealType: 'dinner',
        items: [
          { name: 'Paneer Curry & Rice', isVeg: true },
          { name: 'Fish Fry & Rice', isVeg: false }
        ]
      }
    ]
    );

    console.log("Default weekly mess menu seeded successfully ✅");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding mess menu ❌", err);
  }
}

seedMenu();