var autoIncrement = require('mongoose-auto-increment');
var config = require('../config/config.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cnx = mongoose.createConnection("mongodb://localhost/ageg");
autoIncrement.initialize(cnx);

var voteType = {
  list: [ 'radio' ]
};

var VoteSchema = new Schema({
  voteID: Number,
  creator: {
    match: config.standards.regExes.cip,
    type: String
  },
  description: String,
  endDate: Date,
  notes: String,
  participants: [{
    cip: String
  }],
  startDate: Date,
  title: String,
  votes: [{
    options: [{
      name: String,
      /*type: {
        type: String,
        enum: voteType.list
      }*/
    }], // Vote options given to the user
    prompt: String, // Prompt String
    type: {
      type: String,
      enum: voteType.list
    }, // 
    vote: String
  }]
});

// AutoIncrements
VoteSchema.plugin(autoIncrement.plugin, { model: 'Votes', field: 'voteID' });

mongoose.model('Votes', VoteSchema);