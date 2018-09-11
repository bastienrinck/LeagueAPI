const https = require('https');
const key = 'RGAPI-1c469f1b-6b43-4575-a409-e82d068507e9';
const options = {headers: {'X-Riot-Token': key}};

function proccedCall(url) {
    return new Promise((resolve)=> {
        https.get(url, options, (resp)=> {
            let data = '';
            resp.on('data', (chunk)=> {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(data);
            });
        });
    });
}

// routes
module.exports = function(router, databases){

    router.use('/api/username/:userName', (req, res)=> {
        let url = `https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.userName}`;
        databases.Summoner.findOne({
            where: {
                name: req.params.userName
            }
        }).then((matches) => {
            console.log(Date.now());
            console.log(matches.dataValues.updatedAt.valueOf());
            console.log(Date.now() - matches.dataValues.updatedAt.valueOf());
            console.log((Date.now() - matches.dataValues.updatedAt.valueOf()) < 30000);
            if (matches && (Date.now() - matches.dataValues.updatedAt.valueOf()) < 30000) {
                console.log(`${Date.now()} - ${matches.dataValues.updatedAt.valueOf()} = ${Date.now() - matches.dataValues.updatedAt.valueOf()}`);
                res.json(matches.dataValues);
            }
            else if (matches) {
                console.log("Refreshing cache");
                proccedCall(url).then((data) => {
                    let parseData = JSON.parse(data);
                    matches.update({id: parseData.id, accountId: parseData.accountId, name: parseData.name, updatedAt: Date.now()}).then((user) => {
                        res.json(user.dataValues);
                    }, (err) => {
                        console.error("Error occurred while saving new instance");
                        console.error(`"Error: " ${err}`);
                    });
                }, () => {
                });
            } else {
                proccedCall(url).then((data) => {
                    let parseData = JSON.parse(data);
                    databases.Summoner.create({id: parseData.id, accountId: parseData.accountId, name: parseData.name}).then((user) => {
                        res.json(user.dataValues);
                    }, (err) => {
                        console.error("Error occurred while saving new instance");
                        console.error(`"Error: " ${err}`);
                    });
                }, () => {
                });
            }
        });
    });

    router.use('/api/rank/:userid', (req, res)=> {
	let url = `https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/${req.params.userid}`;
        databases.Summoner.findOne({where: {
                name: req.params.userid
            }}).then((matches)=> {
            console.log(matches);
            let data = proccedCall(url);
            res.json(data);
        }, (err)=> {
            console.error(err);
        });
    });
};
