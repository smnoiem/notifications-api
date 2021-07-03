const message = [
  'Your completion rate is very low. You will get suspended if you do not increase your completion rate.',
  'Your completion rate is low. You will get less requests if you do not increase your completion rate.',
  'Please complete more to get more requests.'
];

class Messages {
  static getMessage = (completionRate, cb) => {
    if(completionRate <= 0.5) cb(message[0]);
    else if(completionRate <= 0.7) cb(message[1]);
    else cb(message[2]);
  }
}

module.exports = Messages;