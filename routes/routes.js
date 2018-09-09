const https = require('https');
const key = 'RGAPI-60c5089c-f1f0-4bcf-8c36-42dd43b89864';
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
module.exports = function(router){

    router.use('/:userName', (req, res)=> {
        let url = `https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.userName}`;
        proccedCall(url, res);
    });
};