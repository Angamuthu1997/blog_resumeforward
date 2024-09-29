const { Sequelize, DataTypes } = require('sequelize');
const resume = require('./resume');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];


const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);


const User = require('./user')(sequelize, DataTypes);
const Post = require('./post')(sequelize, DataTypes);
const Resume = require('./resume')(sequelize, DataTypes);


User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Resume.belongsTo(User, {foreignKey: 'id', as: 'user'})



module.exports = {
  sequelize,
  User,
  Post,
  Resume
};
