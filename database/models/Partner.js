module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define('partners', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        not: ['[a-z]', 'i']
      }
    },
    partner_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    joined_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      default: true
    }
  });
  return Partner;
};
