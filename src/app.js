require('dotenv').config();
const rateLimit=require('express-rate-limit');
const express = require('express');
const morgan = require('morgan');
const helmet =require('helmet');
const csrf = require('csurf');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin')
const taskRoutes = require('./routes/task')

const connectDB = require('./config/db');

// Conecta a Mongo antes de iniciar el servidor
connectDB();

app = express();

//Seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))


const limiter =rateLimit({
    windowMs:15*60*60,//15 min
    max:100
});

app.use(limiter);

//CSRF token solo si usas cookies en produccion
//const csrfProtection=csrf({cookie:true});
//app.use(csrfProtection);


app.get('/',(req,res)=>res.send("Secure API V1"));

//app.use('/api', adminRoutes); // todas las rutas empiezan con /api
app.use('/api', authRoutes); // todas las rutas empiezan con /api
app.use('/api/task', taskRoutes); // todas las rutas empiezan con /api/task
app.use('/api/admin', adminRoutes); // todas las rutas empiezan con /api/admin

module.exports=app;
