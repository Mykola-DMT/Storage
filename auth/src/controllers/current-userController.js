const jwt = require('jsonwebtoken')

exports.current_user = async function(req, res){
    if(!req.session?.jwt){
        return res.send({ currentUser: null })
    }

    try{
        const payload = jwt.verify(req.session.jwt, process.env.jwt_key)
        res.send({ currentUser: payload })
    }catch (err){
        res.send({ currentUser: null })
    }
}