// module.exports = {
//   db: 'mongodb://anu123:anu123@ds161295.mlab.com:61295/anu-mymdb', // diff url for heroku
// };
module.exports = {
  db: process.env.PROD_MONGODB, // diff url for heroku
};
