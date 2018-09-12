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

    router.use('/api/username/:userName', async (req, res) => {
        let url = `https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.userName}`;
        let matches;
        try {
            matches = await databases.Summoner.findOne({
                where: {
                    name: req.params.userName
                }
            });
        } catch (err) {
            return res.json("An error occurred while retrieving data from riot API");
        }
        if (matches && (Date.now() - matches.dataValues.updatedAt.valueOf()) < 30000) {
            res.json(matches.dataValues);
        } else if (matches) {
            console.log("Refreshing cache");
            try {
                let data = await proccedCall(url);
                let parseData = JSON.parse(data);
                try {
                    let user = await
                    matches.save({id: parseData.id, accountId: parseData.accountId, name: parseData.name});
                    res.json(user.dataValues);
                } catch (err) {
                    return res.json("An error occurred while updating user on database")
                }
            } catch (err) {
                return res.json("An error occurred while retrieving data from database")
            }
        } else {
            try {
                let data = await proccedCall(url);
                let parseData = JSON.parse(data);
                try {
                    let user = await databases.Summoner.update({id: parseData.id, accountId: parseData.accountId, name: parseData.name});
                    res.json(user.dataValues);
                } catch (err) {
                    return res.json("An error occurred while updating user on database")
                }
            } catch (err) {
                return res.json("An error occurred while retrieving data from riot API");
            }
        }
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
