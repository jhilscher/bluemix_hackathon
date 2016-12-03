// watson
var watson    = require('watson-developer-cloud');
var Q         = require('q');
var config    = require('../config/config').config;

var alchemyApiKey = { api_key: process.env.ALCHEMY_API_KEY || config.API_KEY};
var alchemyLanguage = watson.alchemy_language(alchemyApiKey);
var alchemyDataNews = watson.alchemy_data_news(alchemyApiKey);

var extractText = Q.nfbind(alchemyLanguage.text.bind(alchemyLanguage));
var getNews = Q.nfbind(alchemyDataNews.getNews.bind(alchemyDataNews));

exports.extractText = extractText;
exports.getNews = getNews;

exports.analyze = function(text, callback) {

    var parameters = {
        extract: 'entities,keywords,taxonomy',
        sentiment: 1,
        maxRetrieve: 10,
        text: text
    };

    alchemyLanguage.combined(parameters, function (err, response) {
        if (err)
            console.error('error:', err);
        else
            callback(response);
    });

};