const Joi = require('joi');
const Task = require('../models/Task')
const logger = require('../utils/logger');


/**
 * Constante que nos ayuda a validar el objeto
 * recibido al crear una tarea
 */
const validateTask = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    tag: Joi.object({
      name: Joi.string().required(),
      color: Joi.string().required()
    }).optional(),
    status: Joi.string().valid('pending', 'paused', 'processing', 'completed')
  });

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createUserTask=async(req,res)=>{
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
/**
 * Funcion que obtiene las tareas relacionadas a un usuario logueado
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getUserTask=async(req,res)=>{
    try{
        logger.info("Usuario solicitante: ",req)
        const userid= req.user.id;
        if(!userid) return res.status(400).json("Id no reconocido");
        const tasks =await Task.find({user_create:userid,deleted:false })
        logger.info("Las tareas obtenidas: ",tasks)
        res.json(tasks);

    }catch(error){
        logger.error('Error: '+ error);
        return res.status(500).json({error:'No se pudo listar.'})
    }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updateUserTask=async(req,res)=>{
    try {

        const taskUpdate= req.body;
        logger.info('Taskupdate: ',taskUpdate);
        const task = req.task;
        logger.info('Info: ',req);
        task.updated_at=new Date();
        Object.assign(task,taskUpdate);
        await task.save();
        res.json({message:'Tarea actualizada con exito',task:req.task});
        
    } catch (err) {
        logger.error('Error: ', err)
        res.status(500).json({error:'Error interno del servidor'});
    }
}
/**
 * Funcion que hace un soft-delete simulando la eliminacion del registro,
 * para ello se hace uso de estados, en este caso se usa campo "deleted"
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.softDeleteTask=async(req,res)=>{
    try{
        const userId= req.params.id;
        if(!userId) return res.status(400).json({message:'Parametros faltantes o invalidos'})
        const task = await Task.findById(userId);
        if(!task || task.deleted) return res.status(404).json({message:'No se encontro la tarea o ya ha sido eliminada.'});
        task.deleted=true;
        task.deleted_at= new Date();
        await task.save() 
        res.json({message:'Tarea eliminada con exito.'})
    }catch(err){
        logger.error('Error: ',err)
        res.status(500).json({error:'Error interno del servidor'});
    }
}

exports.restoreTask=async(req,res)=>{
    try {
        logger.info("Req restore: ",req.params)
        const taskId= req.params.id;
        if(!taskId) return res.status(400).json({message:'Parametros insuficientes'});
        const task = await Task.findById(taskId);
        if(!task || !task.deleted) return res.status(400).json({message:'Tarea no encontrada'});
        task.deleted=false;
        await task.save();
        res.status(200).json({message:'Tarea reestablecida con exito', data:task});
        
    } catch (err) {
        logger.error("ERR RESTORE: ",err)
        res.status(500).json({message:"Error interno en el servidor"})
    }
}


 
/**            ADMIN                           */

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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