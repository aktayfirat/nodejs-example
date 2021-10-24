module.exports = (req, res, next) => {

    if (!req.session.isAuthenticated) {
        req.session.redirectTo = req.url //Kulanıcının o anda gitmek istediği url
        return res.redirect('/login')
    }
    next()

}