const mongoose = require('mongoose');
const MessMenu = require('../models/menu');

const MONGO_URL = "mongodb://127.0.0.1:27017/hostel_mess_management";

async function seedMenu() {
  try {
    await mongoose.connect(MONGO_URL);

    // Clear existing menu
    await MessMenu.deleteMany({});

    // Insert default weekly menu
    await MessMenu.insertMany([
      { day: 'Monday', breakfast: 'Idli & Chutney', lunch: 'Rice & Sambar', dinner: 'Chapati & Kurma' },
      { day: 'Tuesday', breakfast: 'Dosa & Chutney', lunch: 'Veg Biryani', dinner: 'Pongal & Chutney' },
      { day: 'Wednesday', breakfast: 'Upma', lunch: 'Curd Rice & Pickle', dinner: 'Parotta & Salna' },
      { day: 'Thursday', breakfast: 'Poori & Potato Masala', lunch: 'Tomato Rice', dinner: 'Chapati & Dal' },
      { day: 'Friday', breakfast: 'Bread & Jam', lunch: 'Fried Rice', dinner: 'Idiyappam & Kurma' },
      { day: 'Saturday', breakfast: 'Pongal & Vada', lunch: 'Lemon Rice', dinner: 'Dosa & Sambar' },
      { day: 'Sunday', breakfast: 'Aloo Paratha', lunch: 'Chicken Biryani', dinner: 'Chapati & Paneer Curry' }
    ]);

    console.log("Default mess menu seeded successfully ✅");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding mess menu ❌", err);
  }
}

seedMenu();
