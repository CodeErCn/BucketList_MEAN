//Create appBucket factories
appBucket.factory('bktFactory', function($http, $rootScope) {
    socket = io.connect();                // CONNECTING TO SOCKET.IO
    $rootScope.userSelf;                  // Create local User Self data
    $rootScope.onlineList=[];             // Create local Online list
    $rootScope.otherUser;
    var factory = {
        regiterNewUser: function(newUserData, callback) {
            $http.post('/regToMogo', newUserData).success(function(dataReturn) {
                callback(dataReturn);
            })
        },

        loginUser: function(userData, callback) {
            socket.emit('userLogIn', userData);
            
            socket.on('errorMsg', function(dataReturn) {
                callback(dataReturn);
            })
            
            socket.on('selfData', function(dataReturn) {
                $rootScope.userSelf = dataReturn;
                //console.log($rootScope.userSelf);
            })

            socket.on('otherData', function(dataReturn) {
                $rootScope.onlineList = dataReturn;
                //console.log($rootScope.onlineList);
                var flag = {error:false};
                callback(flag);
            })

            socket.on('updateList', function(dataReturn) {
                $rootScope.$apply(function() {
                    $rootScope.onlineList.push(dataReturn);
                })
                
                //console.log($rootScope.onlineList);
            })

            socket.on('addToBucketList', function(dataReturn) {
                // console.log("data return back to factory", dataReturn);
               if(dataReturn.forWho === $rootScope.userSelf.email) {
                  $rootScope.$apply(function() {
                      $rootScope.userSelf.bucket.push(dataReturn);
                  })
                  // console.log("after push data in factory", $rootScope.userSelf);
               }
            }) 
        },

        addBucket: function(bucketData) {
            socket.emit('addABucket', bucketData);
        },

        loggingout: function() {
            // console.log("here at factory??", $rootScope.userSelf);
            socket.emit('loggingOut', $rootScope.userSelf);
        },

        getUser: function(email) {
            for(var i=0, c=$rootScope.onlineList.length; i<c; i++)
            {
                if($rootScope.onlineList[i].email === email){
                    $rootScope.otherUser = $rootScope.onlineList[i];
                    break;
                }
            }
        },
    }
    
    return factory;
})
     