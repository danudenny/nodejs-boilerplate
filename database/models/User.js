module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    userName: {
      unique: true,
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      unique: true,
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15)
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
    {
      classMethods: {
        associate: function(models) {
          User.hasOne(models.verification_tokens, {
            as: 'verification_tokens',
            foreignKey: 'userId',
            foreignKeyConstraint: true,
          });
        }
      }
    },
    {
      classMethods: {
        associate: function(models) {
          User.belongsToMany(models.user_documents, {
            through: 'user_documents',
            as: 'users',
            foreignKey: 'user_id'
          });
        }
      }
    }
  );

  return User;
};
