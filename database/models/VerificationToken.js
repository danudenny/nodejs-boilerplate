module.exports = function(sequelize, DataTypes) {
    let VerificationToken = sequelize.define('verfication_token', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onUpdate: "cascade",
            onDelete: "cascade",
            references: { model: "users", key: "id" }
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                VerificationToken.belongsTo(models.users, {
                    as: "users",
                    foreignKey: "userId",
                    foreignKeyConstraint: true
                });
            }
        }
    });
    return VerificationToken;
};
