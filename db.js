const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres.ovmjushcgtvogihheume', 'NAAihKZfgQmITy21', {
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    dialect: 'postgres',
});

sequelize.authenticate()
.then(()=>{
    console.log("Conectado ao Banco")
})
.catch((e)=>console.error("Erro ao conectar ao Banco", e))

module.exports = sequelize;