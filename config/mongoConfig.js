var path = require('path'),
rootpath = path.normalize(__dirname + '/..'),
templatePath = path.normalize(__dirname + '/../server/mailer/templates'),
notifier = {
  service: 'postmark',
  APN: false,
  email: false,
  actions: ['comment'],
  tplPath: templatePath,
  key: 'POSTMARK_KEY',
  parseAppId: 'PARSE_APP_ID',
  parseApiKey: 'PARSE_MASTER_KEY'
};

module.exports = {
  development: {
    db: 'mongodb://localhost/bucket',
    root: rootpath,
    notifier: notifier,
    app: {
      name: 'Nodejs Express Mongoose Bucket'
    }
  },
  test: {
    db: 'mongodb://localhost/noobjs_test',
    root: rootpath,
    notifier: notifier,
    app:{
      name: 'Nodejs Express Mongoose Demo'
    }
  }
}