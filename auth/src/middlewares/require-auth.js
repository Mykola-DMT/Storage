const requireAuth = (req, res, next) => {
    if(!req.currentUser){
        res.status(401).json({
            errors: [{message: 'Not authorized'}]
        })
    }
    next()
}
module.exports = requireAuth