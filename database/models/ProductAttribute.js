module.exports = (sequelize, DataTypes) => {
  const ProductAttribute = sequelize.define('product_attributes', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    attribute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'attributes',
        key: 'id'
      }
    }
  });
  return ProductAttribute;
};
