module.exports = function (Model, field = 'user_create') {
    return async (req, res, next) => {
        try{

            const resource = await Model.findById(req.params.id);
            if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
            
            const isOwner = resource[field]?.toString() === req.user.id;
            const isAdmin = req.user.role === 'admin';
            
            if (!isOwner && !isAdmin) {
                return res.status(403).json({ error: 'No autorizado' });
            }
            
            req.task = resource;
            next();
        }catch(err){
            res.status(500).json({error: 'Error internoal validar acceso'})
        }
    };
  };