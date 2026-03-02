const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Validate date is between May 10-13, 2022
        const checkDate = new Date(value);
        const startDate = new Date('2022-05-10');
        const endDate = new Date('2022-05-14'); // 14th at 00:00 means up to 13th
        return checkDate >= startDate && checkDate < endDate;
      },
      message: 'Interview date must be between May 10-13, 2022'
    }
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', InterviewSchema);
