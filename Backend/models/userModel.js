const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    validate: {
      validator: function(v) {
        // Accept phone numbers with country code
        return /^\+?[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  // ... other fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;
