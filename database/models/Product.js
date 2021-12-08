module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('products', {
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
    slug: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'provinces',
        key: 'id'
      }
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'id'
      }
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'districts',
        key: 'id'
      }
    },
    tax_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'taxes',
        key: 'id'
      }
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'partners',
        key: 'id'
      }
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id'
      }
    },
    orientation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    facing_light: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumbnail_images: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  Product.associate = (models) => {
    Product.belongsToMany(models.attributes, {
      through: 'product_attributes',
      as: 'attributes',
      foreignKey: 'product_id'
    });
  };
  Product.associate = (models) => {
    Product.belongsToMany(models.product_images, {
      through: 'product_images',
      as: 'catalog_images',
      foreignKey: 'product_id'
    });
  };
  Product.associate = function (models) {
    Product.hasOne(models.dimensions, {
      foreignKey: 'product_id',
      as: 'dimensions',
      onDelete: 'CASCADE'
    });
  };
  return Product;
};
