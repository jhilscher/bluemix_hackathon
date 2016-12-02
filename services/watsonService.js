// watson
var watson    = require('watson-developer-cloud');
var Q         = require('q');

var alchemyApiKey = { api_key: process.env.ALCHEMY_API_KEY || '98076d671505a349733d79e662257b413bd41ba5'};
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