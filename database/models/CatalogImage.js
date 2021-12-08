module.exports = (sequelize, DataTypes) => {
  const CatalogImage = sequelize.define('catalog_images', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  CatalogImage.associate = (models) => {
    CatalogImage.belongsToMany(models.products, {
      through: 'catalog_images',
      as: 'products',
      foreignKey: 'image_catalog_id'
    });
  };
  return CatalogImage;
};
