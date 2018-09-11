const Sequelize = require('sequelize');
const sequelize = new Sequelize('leagueAPI', 'leagueapi', 'ux4q889X7Sun2THF', {
    host: 'rectoria.eu',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

module.exports = sequelize;