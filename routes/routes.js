const https = require('https');
const key = 'RGAPI-1c469f1b-6b43-4575-a409-e82d068507e9';
const options = {headers: {'X-Riot-Token': key}};

function proccedCall(url) {
    https.get(url, options, (resp)=> {
        let data = '';

        resp.on('data', (chunk)=> {
            data += chunk;
        });

        resp.on('end', () => {
            return data;
        });
    });
}

// routes
module.exports = function(router, databases){

    router.use('/api/username/:userName', (req, res)=> {
        let url = `https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.userName}`;
        databases.Summoner.findAll({where: {
            name: req.params.userName
            }}).then((matches)=> {
                console.log(matches);
                if (matches.length) {
                    res.json(matches[0]);
                } else {
                    let data = JSON.parse(proccedCall(url));
                    database.Summoner.save({accountId: data.id, account: data.accountId, name: name}).then((user) => {
                        req.json(user);
                    }, (err) => {
                        console.error("Error occurred while saving new instance")
                    });
                }
        }, (err)=> {
                console.error(err);
        });
    });
    router.use('/api/rank/:userid', (req, res)=> {
	let url = `https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/${req.params.userid}`;
        databases.Summoner.findAll({where: {
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
