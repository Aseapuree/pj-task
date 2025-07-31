const Joi = require('joi');
const Task = require('../models/Task')
const logger = require('../utils/logger');



const validateTask = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    tag: Joi.object({
      name: Joi.string().required(),
      color: Joi.string().required()
    }).optional(),
    status: Joi.string().valid('pending', 'paused', 'processing', 'completed')
  });

exports.createTask=async(req,res)=>{
    try {
        logger.info("REQ: ",req.user.id)
        
        const { error } = validateTask.validate(req.body);
        if(error) return res.status(400).json({error:error.details[0].message});

        const task=new Task({
            ...req.body,
            user_create:req.user.id,
            created_at: new Date()
        })
        await task.save();
        res.status(201).json({meesage: 'Tarea creada correctamente.'})

    } catch (error) {
        logger.error('Se produjo un error: ',error)
        return res.status(500).json({error:'No se pudo crear la tarea.'})
        
    }
}

exports.getUserTask=async(req,res)=>{
    try{

        const tasks =await Task.find({user_create:req.user_id})
        res.json(tasks);

    }catch(error){
        logger.error('Error: '+ error);
        return res.status(500).json({error:'No se pudo listar.'})
    }
}

exports.getUserTaskAdm= async(req,res)=>{
    try{
        const userId = req.params.id;
        const tasks =await Task.find({user_create:userId})
        if(tasks.length==0) return res.status(200).json({message:'No se encontro tareas para este usuario'});
        res.json(tasks)
    }catch(error){
        logger.error('Error al listar por adm',error)
        return res.status(500).json({error:'Error en el servidor'})

    }
}