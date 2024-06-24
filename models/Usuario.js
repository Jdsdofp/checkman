const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../db');

const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'usuario',
    timestamps: false
});

Usuario.prototype.validPassword = async function (senha) {
    return await bcrypt.compare(senha, this.senha);
};

Usuario.beforeCreate(async (user) => {
    user.senha = await bcrypt.hash(user.senha, 10);
});

module.exports = Usuario;
