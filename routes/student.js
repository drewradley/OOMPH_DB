module.exports = {
    getStudent: (req, res) => {
        let query = "SELECT * FROM `Proctors` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('student.ejs', {
                title: "Students Portal"
                ,proctors: result
            });
        });
    },
};