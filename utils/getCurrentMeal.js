module.exports = function getCurrentMeal() {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 10) return "Breakfast";
    if (hour >= 12 && hour < 15) return "Lunch";
    if (hour >= 16 && hour < 23) return "Dinner";

    return null;
};