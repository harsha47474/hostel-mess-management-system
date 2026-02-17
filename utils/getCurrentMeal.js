module.exports = function getCurrentMeal() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 10) return "Breakfast";
    if (hour >= 12 && hour < 15) return "Lunch";
    if (hour >= 19 && hour < 22) return "Dinner";

    return null;
};