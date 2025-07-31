const express = require('express');
const router = express.Router();
const auth= require('../middlewares/authMiddleware');
const { createTask, getUserTask } = require('../controllers/taskController');



router.post('/register',auth,createTask);
router.get('/my-task',auth,getUserTask);

module.exports = router;