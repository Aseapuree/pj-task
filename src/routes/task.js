const express = require('express');
const router = express.Router();
const auth= require('../middlewares/authMiddleware');
const { createUserTask, getUserTask, updateUserTask, softDeleteTask, restoreTask } = require('../controllers/taskController');
const canAccessResources = require('../middlewares/canAccessResources');
const Task = require('../models/Task');



router.post('/register',auth,createUserTask);
router.get('/my-task',auth,getUserTask);
router.put('/:id',auth, canAccessResources(Task),updateUserTask)
router.delete('/:id',auth, canAccessResources(Task),softDeleteTask)
router.post('/:id',auth, canAccessResources(Task),restoreTask)

module.exports = router;