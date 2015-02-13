var mongoose = require('mongoose')
var bkList = mongoose.model('bklist');

// SERVER ONLINE LIST for logged on users.
var onlineList = [];                                  // OnlineList of people who's online.

function userData (reqData, dbData)                   // Construct function for creating new userData.
{
    this.socket = reqData.socket.id;
    this.name = dbData.user_name;
    this.email = dbData.email_address;
    this.bucket = dbData.bucket;
    this.mongo = dbData._id;
}

function createBucket (userData, bucketData)                                                 // Construct function for creating new bucket list
{
    var date = new Date();
    this.bucketMsg = userData.name+" | "+bucketData.title+" - "+bucketData.desc+" - "+(date.getMonth()+1)+"."+date.getDate()+"."+date.getFullYear();
    this.checked=false;
}

function checkIfOnline (emailIn)                                         // Function to check if user already online
{
    for(user in onlineList) {
        if(onlineList[user].email == emailIn) {
            return true;
        }
    }

    return false;
}

// SOCKET LISTENERS //
module.exports = function Routes(app) {
    
    app.io.route('userLogIn', function(req)                             // Listeners for user log in 
    {
        var mail = req.data.email;                                      // Query user data by using email address
        if(checkIfOnline(mail))                                         // Check if the people trying to login is already online
        {
            req.io.emit('errorMsg', {error: true, msg: "The user has already sign in"});
        } else {
            bkList.findOne({email_address: mail}, function(err, dbDataOne) 
            {   
                if(!dbDataOne || req.data.password !== dbDataOne.password)  // If email is not found on the database
                {                                                           // OR password does not match
                    req.io.emit('errorMsg', {error: true, msg: "User Name or Password does not match our record. Please try again."});
                } else {                  
                       var user = new userData(req, dbDataOne);
                       //console.log(user);
                       req.io.emit('selfData', user);
                       req.io.emit('otherData', onlineList);
                       req.io.broadcast('updateList', user);
                       onlineList.push(user);
                       //console.log(onlineList);
                }
            })
        }
    })

    app.io.route('addABucket', function(req) {
        //console.log(req.data);
        var tagged = req.data.tagEmail;
        var creator = req.data.email;
        
        // Check if there is a Tagged person
        if(tagged === '')                                // If there is no tagged email (creator only)
        {   
            // Searching through the onlineList for user data.
            for(var i=0, c=onlineList.length; i<c; i++)
            {
                if(creator===onlineList[i].email){
                    var cBucket = new createBucket(onlineList[i], req.data);
                        // console.log('ioController', cBucket);
                    onlineList[i].bucket.push(cBucket);
                    
                    // save bucket list to MONGO
                    bkList.update({email_address: creator}, {$push: {bucket:cBucket} }, function(err){
                        // emit change only when database is successfully saved
                        if(!err) {
                            cBucket.forWho = creator;
                            req.io.emit('addToBucketList', cBucket);
                        }
                    });
                    break;
                }
            }

            // Update Mongodb on the user
        } else {
            // Searching through the onlineList for user data & tagged data
            for(var i=0, c=onlineList.length; i<c; i++)
            {

                if(tagged===onlineList[i].email){
                    var tBucket = new createBucket(onlineList[i], req.data);
                    var tPosition = i;
                        //console.log('ioController tagged', tBucket);
                }
                    
                if(creator===onlineList[i].email){
                    var cBucket = new createBucket(onlineList[i], req.data);
                    var cPosition = i;
                        //console.log('ioController creator', cBucket);
                }
            }
            // Update the bucket for tagged user data in onlineList    
            onlineList[tPosition].bucket.push(cBucket);
            // Update the bucket for creator user data in onlineList        
            onlineList[cPosition].bucket.push(tBucket);
                    
            //console.log(onlineList);
            
            // save bucket list to MONGO
            bkList.update({email_address: tagged}, {$push: {bucket:cBucket} }, function(err){
                // emit change only when database is successfully saved
                if(!err) {
                    // broadcast the creator bucket list to all client.
                    cBucket.forWho = tagged;
                    //console.log('tagged forwho', cBucket)
                    req.io.broadcast('addToBucketList',cBucket);
                }
            });

                    
            // save bucket list to MONGO
            bkList.update({email_address: creator}, {$push: {bucket:tBucket} }, function(err){
                // emit change only when database is successfully saved
                if(!err) {
                    tBucket.forWho = creator;
                    //console.log('creator forWho', tBucket)
                    req.io.emit('addToBucketList', tBucket);
                }
            });
        }
    })

    app.io.route("loggingOut", function(req) {
        // console.log("here at ioController", req.data);
        for(var i=0, c=onlineList.length; i<c; i++) {
            if(req.data.email===onlineList[i].email){
                onlineList.splice(i,1);
            }
        }
    })
}