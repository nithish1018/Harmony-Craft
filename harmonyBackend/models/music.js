// models/music.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Music extends Model {
    static associate(models) {
      Music.belongsTo(models.User,{
        foreignKey:"userID",
      })
    }
  }
  Music.init(
    {
      // Define columns here
      music: {
        type: DataTypes.BLOB, // Assuming you're storing the music data as BLOB
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Music',
    }
  );
  return Music;
};
