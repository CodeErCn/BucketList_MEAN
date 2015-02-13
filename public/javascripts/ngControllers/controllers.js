// create appBucket controller

appBucket.controller('registerCtrl', function($scope, bktFactory) {

    $scope.confirmPassword = function() {
        if($scope.reg && $scope.reg.confirmPw === $scope.reg.password) {
            return false;
        } else {
            return true;
        }
    }

    $scope.submit = function() {
        bktFactory.regiterNewUser($scope.reg, function(dataReturn) {
            if(dataReturn.error) {
                $scope.success = true;
                $scope.errors = false;
                $scope.msg = dataReturn.msg;
            } else {
                $scope.errors = true;
                $scope.success = false;
                $scope.msg = dataReturn.msg;
            }
        })
        
        $scope.reg.userName='';
        $scope.reg.email='';
        $scope.reg.password='';
        $scope.reg.confirmPw='';
        $scope.success = $scope.errors = false;
    }

})



appBucket.controller('loginCtrl', function($scope, $location, bktFactory) {
    $scope.log = function() {
        bktFactory.loginUser($scope.login, function(dataReturn) {
            if(dataReturn.error)
            {
                $scope.$apply(function(){
                    $scope.ers = true;
                    $scope.msg = dataReturn.msg;
                })
            } else {
                $scope.$apply(function(){
                    $location.path('/dashboard');
                })
            }
        });
        
        $scope.login.email='';
        $scope.login.password='';
    }
})
    

appBucket.controller('dshbrdCtrl', function($scope, $rootScope, $location, bktFactory){    
    $scope.userName = $rootScope.userSelf.name;
    $scope.userMongo = $rootScope.userSelf.mongo;
    $scope.userBuckets = $rootScope.userSelf.bucket;
    $scope.onlineUsers = $rootScope.onlineList;

    $scope.addalist = function() {
        var bucket = {};
        bucket.email = $rootScope.userSelf.email;
        bucket.tagEmail = $('select.dshTag option:selected').val();
        bucket.title = $scope.dshbrdTitle;
        bucket.desc =$scope.dshbrdDescrip;
        
        $scope.dshbrdTitle = '';
        $scope.dshbrdDescrip ='';
        
        // console.log("bucket created in controller", bucket);
        bktFactory.addBucket(bucket);
    }

    $scope.logout = function() {
        bktFactory.loggingout();
    }

    $(document).on('click', 'a.user', function() {
        userEmail = $(this).attr('user')
        bktFactory.getUser(userEmail);
        $scope.$apply(function() {
            $location.path('/user');
        })
    })
})

appBucket.controller('userCtrl', function($scope, $rootScope, bktFactory) {
    //console.log($scope.otherUser);

    $scope.otherName = $rootScope.otherUser.name
    $scope.otherBuckets = $rootScope.otherUser.bucket

    $scope.logout = function() {
        bktFactory.loggingout();
    }
})