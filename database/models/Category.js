module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('categories', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    images: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isParent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
  return Category;
};
