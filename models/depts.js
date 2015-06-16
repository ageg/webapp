var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Faculty Departments Enum
var depts = {
  list: ['Biotechnologique', 'Chimique', 'Civil', 'Électrique', 'Informatique', 'Mécanique']
};

module.exports = depts;