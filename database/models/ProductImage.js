module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define('product_images', {
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
    image_catalog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'catalog_images',
        key: 'id'
      }
    }
  });
  return ProductImage;
};
