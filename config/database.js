if(process.env.NODE_ENV==='production')
{
  module.exports = {mongoURI: 'mongodb://kunle:kb2232@ds125896.mlab.com:25896/blogdb'}
} else {
  module.exports = {mongoURI:'mongodb://localhost/blogDB'}
}