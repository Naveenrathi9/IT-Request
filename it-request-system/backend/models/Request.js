
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: String,
  empCode: String,
  designation: String,
  department: String,
  item: String,
  reason: String,

  hodEmail: { type: String, required: true },
  
  status: {
    hr: { type: String, default: 'pending' },
    hod: { type: String, default: 'pending' },
    it: { type: String, default: 'pending' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', requestSchema);
