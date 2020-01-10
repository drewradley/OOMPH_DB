const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title: "Add a new student/proctors"
            ,message: ''
        });
    },
    addPlayer: (req, res) => {
        // if (!req.files) {
        //     return res.status(400).send("No files were uploaded.");
        // }
        var studentName=req.body.SFN_input;
        var studentEmail =req.body.SE_input;
        var studentAccommodations=req.body.SA_input;
        var StudentCourse1=req.body.SCC1_input;
        var StudentCourse2=req.body.SCC2_input;
        var Proctor1fullname=req.body.PN1_input;
        var Proctor1institution=req.body.PI1_input;
        var Proctor1email=req.body.PE1_input;
        var Proctor1phone=req.body.PP1_input;
        var Proctor1Relationship=req.body.PP1_type;
        var Proctor2fullname=req.body.PN2_input;
        var Proctor2institution=req.body.PI2_input;
        var Proctor2email=req.body.PE2_input;
        var Proctor2phone=req.body.PP2_input;
        var Proctor2Relationship=req.body.PP2_type;

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = null;
        let image_name = "Image";
        //let fileExtension = uploadedFile.mimetype.split('/')[1];
       // image_name = "username + '.' + fileExtension";

        let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message,
                    title: "Add a new proctor"
                });
            } else {
                if (err) {
                    return res.status(500).send(err);
                }
                // send the player's details to the database
                let query = `INSERT INTO Proctors (studentName, studentEmail, studentAccommodations, StudentCourse1, StudentCourse2, 
                                    Proctor1fullname, Proctor1institution, Proctor1email,Proctor1phone,Proctor1Relationship,
                                    Proctor2fullname,Proctor2institution,Proctor2email,Proctor2phone,Proctor2Relationship) 
                 VALUES ('${studentName}', '${studentEmail}','${studentAccommodations}','${StudentCourse1}','${StudentCourse2}',
                          '${Proctor1fullname}', '${Proctor1institution}','${Proctor1email}','${Proctor1phone}','${Proctor1Relationship}',
                          '${Proctor2fullname}','${Proctor2institution}','${Proctor2email}','${Proctor2phone}','${Proctor2Relationship}')`;
                db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
                
            }
        });
    },
    editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `Proctors` WHERE id = '" + playerId + "' ";
        db.query(query, (err, result) => { console.log(result);
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-player.ejs', {
                title: "Edit  Proctor"
                ,proctor: result[0]
                ,message: ''
            });
        });
    },
    editPlayer: (req, res) => {
        var studentName=req.body.SFN_input;
        var studentEmail =req.body.SE_input;
        var studentAccommodations=req.body.SA_input;
        var StudentCourse1=req.body.SCC1_input;
        var StudentCourse2=req.body.SCC2_input;
        var Proctor1fullname=req.body.PN1_input;
        var Proctor1institution=req.body.PI1_input;
        var Proctor1email=req.body.PE1_input;
        var Proctor1phone=req.body.PP1_input;
        var Proctor1Relationship=req.body.PP1_type;
        var Proctor2fullname=req.body.PN2_input;
        var Proctor2institution=req.body.PI2_input;
        var Proctor2email=req.body.PE2_input;
        var Proctor2phone=req.body.PP2_input;
        var Proctor2Relationship=req.body.PP2_type;

        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE `Proctors` SET `studentName` = '" + studentName + "', `studentEmail` = '" + studentEmail + "', `studentAccommodations` = '" + studentAccommodations + "', `StudentCourse1` = '" + StudentCourse1 + "', `StudentCourse2` = '" + StudentCourse2 
            + "', `Proctor1fullname` = '" + Proctor1fullname + "', `Proctor1institution` = '" + Proctor1institution + "', `Proctor1email` = '" + Proctor1email + "', `Proctor1phone` = '" + Proctor1phone + "', `Proctor1Relationship` = '" + Proctor1Relationship
            + "', `Proctor2fullname` = '" + Proctor2fullname + "', `Proctor2institution` = '" + Proctor2institution + "', `Proctor2email` = '" + Proctor2email + "', `Proctor2phone` = '" + Proctor2phone + "', `Proctor2Relationship` = '" + Proctor2Relationship 
            + "' WHERE `Proctors`.`id` = '" + playerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
       // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM Proctors WHERE id = "' + playerId + '"';
        db.query(deleteUserQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
        
    }
};
