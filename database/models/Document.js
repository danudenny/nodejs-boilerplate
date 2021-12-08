module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('documents', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    doc_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    doc_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    doc_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Document.associate = (models) => {
    Document.belongsToMany(models.users, {
      through: 'user_documents',
      as: 'documents',
      foreignKey: 'document_id'
    });
  };
  return Document;
};
