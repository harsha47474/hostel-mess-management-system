const express = require('express');
const session = require('express-session');
const User = require('./models/user');
const app = express();
const passport = require('passport');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const authRoutes = require('./routes/auth');
const flash = require('connect-flash');
const flashMiddleware = require('./middlewares/flash');
const connectDB = require('./config/db');
const studentDashboardRoutes = require('./routes/Students/dashboard');
const adminDashboardRoutes = require('./routes/admins/dashboard');
const menuRoutes = require('./routes/Students/menuRoute');
const attendanceRoutes = require('./routes/Students/attendance');
const billingRoutes = require('./routes/Students/billing');

connectDB();


const port = 8080;

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}))
app.use(flash());


app.get('/', (req,res)=>{
    res.send("Hostel Mess Management System");
})


app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash middleware
app.use(flashMiddleware);

//routes
app.use('/', authRoutes);
app.use('/students', studentDashboardRoutes);
app.use('/admin', adminDashboardRoutes);
app.use("/student",menuRoutes);
app.use("/student",attendanceRoutes);
app.use("/student",billingRoutes);


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})