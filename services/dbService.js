
var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db'
};


function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        // Pattern match to find the first instance of a Cloudant service in
        // VCAP_SERVICES. If you know your service key, you can access the
        // service credentials directly by using the vcapServices object.
        for (var vcapService in vcapServices) {
            if (vcapService.match(/cloudant/i)) {
                dbCredentials.url = vcapServices[vcapService][0].credentials.url;
            }
        }
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = "https://bde58a30-4ac1-42f3-b04d-3194997bd04f-bluemix:3fbae30f3d50ba7fe3113bc976bcc180cc6535d820049fc62915d3038bede7e2@bde58a30-4ac1-42f3-b04d-3194997bd04f-bluemix.cloudant.com";
    }

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();

exports.db = db;