module.exports = (sequelize, DataTypes) => {
    const Resume = sequelize.define('Resume', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filepath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploadDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }, {
      timestamps: true, 
    });
  
    Resume.associate = (models) => {
      Resume.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    };
  
    return Resume;
  };
  