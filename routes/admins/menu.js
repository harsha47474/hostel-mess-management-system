const exprees = require('express');
const router = exprees.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const wrapAsync = require('../../utils/wrapAsync');
const menuSchema = require("../../models/menu");

router.get('/menu', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const menus = await menuSchema.find().sort({ day: 1 });
  res.render('admin/menu', { user : req.user ,menus });
}));

router.post('/menu', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const { day, mealType, items } = req.body;

  // items will be an array of { name, isVeg }
  await menuSchema.findOneAndUpdate(
    { day, mealType },
    { items },
    { upsert: true }
  );

  res.redirect('/admins/menu');
}));

router.post('/menu/delete/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await menuSchema.findByIdAndDelete(id);
  res.redirect('/admins/menu');
}));

router.post('/menu/edit/:itemId', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const { itemId } = req.params;
  const { name, isVeg } = req.body;

  await menuSchema.updateOne(
    { "items._id": itemId },
    {
      $set: {
        "items.$.name": name,
        "items.$.isVeg": isVeg === "true"
      }
    }
  );

  res.redirect('/admins/menu');
}));


module.exports = router;