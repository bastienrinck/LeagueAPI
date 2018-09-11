const Sequelize = require('sequelize');
const fs = require('fs');
const dirPath = './tables/';
const sequelize = new Sequelize('leagueAPI', 'leagueapi', 'ux4q889X7Sun2THF', {
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

fs.readdirSync(dirPath).forEach((table)=> {
        require(dirPath + table)(sequelize);
    });
module.exports = sequelize;
