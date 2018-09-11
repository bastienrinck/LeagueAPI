const https = require('https');
const key = 'RGAPI-1c469f1b-6b43-4575-a409-e82d068507e9';
const options = {headers: {'X-Riot-Token': key}};

function proccedCall(url, res) {
    https.get(url, options, (resp)=> {
        let data = '';

        resp.on('data', (chunk)=> {
            data += chunk;
        });

        resp.on('end', () => {
            res.json(data);
        });
    });
}

// routes
module.exports = function(router, database){

    router.use('/api/username/:userName', (req, res)=> {
        let url = `https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.userName}`;
        proccedCall(url, res);
    });
    router.use('/api/rank/:userid', (req, res)=> {
	let url = `https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/${req.params.userid}`;
        proccedCall(url, res);
    });
};
