module.exports = (sequelize, DataTypes) => {
  const Attribute = sequelize.define('attributes', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  });
  Attribute.associate = (models) => {
    Attribute.belongsToMany(models.products, {
      through: 'product_attributes',
      as: 'products',
      foreignKey: 'attribute_id'
    });
  };
  return Attribute;
};
