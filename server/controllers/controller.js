var mongoose = require('mongoose')
var bkList = mongoose.model('bklist');

module.exports = {
    index: function(request, response) {
        response.render('index',  {title:"Bucket List"});
    },

    // post to mongodb
    postAddReg: function(request, response) {
            var newUser = {
                user_name: request.body.userName,
                email_address: request.body.email,
                password: request.body.password,
                bucket: []
            }

            var a = new bkList(newUser);
            a.save(function(err) {
                if(err){
                    console.log(err);
                    response.send({error: false, msg: "Validation error. Please try again."});
                } else {
                    response.send({error: true, msg: 'Register Successful!'});
                }
            });
    },
}
    
