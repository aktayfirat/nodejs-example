
exports.get404Page = (req, res) => {

      res.status(404).render('../views/error/404.ejs', {

            my_title: '404 Not Found..',
            path: '404',
            isAuthenticated: req.session.isAuthenticated,
            user: req.user,
            isAdmin: req.user.isAdmin
      })

}


exports.get500page = (req, res) => {

      res.status(500).render('../views/error/500.ejs', {
            my_title: 'Eror Page',
            path: '500',
            user: req.user,
            isAuthenticated: req.session.isAuthenticated,
            isAdmin: req.user.isAdmin,

      })

}