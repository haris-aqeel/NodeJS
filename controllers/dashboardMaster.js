exports.dashboardPage = (req, res) => {
    res.render('dashboard.ejs', { title: 'Welcome', cookies : req.cookies})
}