const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    day: { type: String, required: true },
    breakfast: String,
    lunch: String,
    dinner: String
});

const Menu = mongoose.model('Menu',menuSchema);
module.exports = Menu;