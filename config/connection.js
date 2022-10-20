const { connect, connection } = require('mongoose');
const con = process.env.MONGODB_URI || 'mongo://127.0.0.1:27017/SNApiDB';

connect(con, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
