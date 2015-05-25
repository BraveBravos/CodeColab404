if (!process.env.CLIENT_ID) {
  var keys = require('../keys.js');
  }


var express = require('express');
    app = express(),
    server  = require('http').createServer(app),
    bodyParser = require ('body-parser'),
    mongo = require('mongodb'),
    monk =require ('monk'),
    db = monk(process.env.MONGOLAB_URI || keys.dbAddress);

require('./config/express')(app);
// require('./auth')(app);
// require('./routes')(app);
// require('./models/browserChannel')(app);

app.post('/api/submitEmail', function(req, res) {
	var email = req.body.email
	var emailDB = db.get('Emails')
	emailDB.find({email: email}, function(err, result) {
		console.log(result)
		if(!result.length) {
			var insertData = [{email: email}],
          promise = emailDB.insert(insertData);

      promise.success(function(doc) {
        // done(null, doc[0]._id);
        res.status(200).send({message: 'User added to database.'})
      })
		} else {
			// done(null, result[0]._id)
      res.status(200).send({message: 'User already in database.'})
		}
	})



})


app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log('Node app running on port', app.get('port')) });



exports =module.exports=app;
