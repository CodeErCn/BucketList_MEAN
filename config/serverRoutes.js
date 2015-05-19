
var bkltCtrl = require('./../server/controllers/controller.js');
module.exports = function Routes(app) {

  // EXPRESS $HTTP REQUEST AND RESPONDS //
  app.get('/', function(req,res)                      // Initial page request
  {
    bkltCtrl.index(req,res);
  })

  app.post('/regToMogo', function(req,res)            // Register user data to mongodb
  {
      bkltCtrl.postAddReg(req,res);
  })
};
  