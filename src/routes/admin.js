const express= require('express')
const router = express.Router();
const auth  = require('../middlewares/authMiddleware')
const checkRole = require('../middlewares/roleMiddleware');
const { getUserTaskAdm } = require('../controllers/taskController');

router.get('/dashboard',auth,checkRole(['admin']),(req,res)=>{
    res.json({message:`Bienvenido ${res.user.email}, tienes rol de ${res.user.role}`})
})

router.get('/users/:id/tasks',auth,checkRole(['admin']),getUserTaskAdm)

module.exports = router;