'use strict';

var config = require('./config');
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var validate = require('express-jsonschema').validate;
app.use(bodyParser.json());
app.use(cors());

var betsSchema = {
    type: 'object',
    properties: {
        bet_id: {
            type: 'number',
            required: true
        },
        stake: {
            type: 'number',
            required: true
        },

        odds: {
            type: 'object',
            required: true
        }
    }
}

// Listen on this port
var PORT = config.PORT;
var VERSION = config.VERSION;

var error_code={"statusCode":404,"error":"Not Found"};

var markets = [ {"bet_id":1,"event":"Next World Cup","name":"England","odds":{"numerator":10,"denominator":1}},
                {"bet_id":2,"event":"Next World Cup","name":"Brazil","odds":{"numerator":2,"denominator":1}},
                {"bet_id":3,"event":"Next World Cup","name":"Spain","odds":{"numerator":3,"denominator":1}},
                {"bet_id":4,"event":"Next World Cup","name":"Germany","odds":{"numerator":1,"denominator":1}},
                {"bet_id":5,"event":"Ryder Cup","name":"Europe","odds":{"numerator":7,"denominator":4}},
                {"bet_id":6,"event":"Ryder Cup","name":"USA","odds":{"numerator":9,"denominator":2}} ];
var init_transaction_id=1000;
var bets = [];




// Version
app.get('/', function (req, res) {
  res.send('Version:' + VERSION);
});

// Betting Market
app.get('/markets', function (req,res) {
    res.send(markets);
})

// Current bets
app.get('/bets', function (req, res) {
    console.log('asking for bets aray:', bets)
    res.send(bets);
})

// Place Bet
app.post('/bets', validate({body: betsSchema}), function (req, res) {
	bets.push(req.body);
    console.log('got bet: ', req.body)
    console.log('bet name: ', markets[req.body.bet_id].event)

    init_transaction_id=init_transaction_id+1
	res.status(201).send({"bet_id":req.body.bet_id,"event":markets[req.body.bet_id-1].event,"name":markets[req.body.bet_id-1].name,"odds":markets[req.body.bet_id-1].odds,"stake":req.body.stake,"transaction_id":init_transaction_id});
});

// Delete bet
app.delete('/bets/:index',function (req, res) {
    if(bets.length <= req.params.index){
        res.status(404).send(); 
    }
    bets.splice(req.params.index, 1);
    res.status(204).send();
});

app.use(function(err, req, res, next) {
    var responseData;
    if (err.name === 'JsonSchemaValidation') {
        res.status(400).send();
    }
    next();
});

app.get('*', function(req, res){
  res.status(404).send(error_code);
});

app.post('*', function(req,res){
    res.status(404).send(error_code);
});


if(!module.parent) {
   app.listen(PORT, function () {
    console.log('Null gaming server listening on port 3000!');
    });
}


