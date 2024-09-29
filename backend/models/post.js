module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: 'Users', 
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, 
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, 
    },
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author',
    });
  };

  return Post;
};



