const char_set = 'abcdefghijlkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function max_random_number(max) {
  return Math.floor(Math.random() * max);
}
function generateId() {
  let random_string = '';
  for(let i = 0; i < 6; i++) {
    random_string += char_set[max_random_number(char_set.length - 1)];
  }
  
  return random_string;
}

module.exports = generateId;