function checkRole(allowedRoles=[]){
    return (req,res,next)=>{
        if(!req.user) return res.status(401).json({error:"Usuario no encontrado."});

        if(!allowedRoles.includes(req.user.rol)){
            return res.status(403).json({error:"No tienes permiso para acceder a esta ruta."})
        }
        next();
    }
}

module.exports = checkRole;