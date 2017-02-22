function books ( callback , options ) {

  var _ = require('underscore') ;

  var request = require('request') ;
  
  var getSlug = require('speakingurl');

  var fs = require('fs') ;
  
  var Entities = require('html-entities').AllHtmlEntities;
  
  var entities = new Entities();

  var conf = JSON.parse( fs.readFileSync ( __dirname + '/conf.json', 'utf8' ) ) ;

  var environment = options.parent_conf.environment ;

  var collection_code = options.parent_conf.collectionCode;

  var x = '?wt=json&fl=*&rows=1000&qt=dismax&qf=collection_code&q=' + collection_code;

  if (
    environment !== 'test'        &&
    environment !== 'development' &&
    environment !== 'stage'       &&
    environment !== 'production'
  ) {
    environment = '*' ;
  }

  var template = __dirname + '/book.mustache' ;

  var src = conf[environment].request.books.src + x;

  request ( src , function ( error, response, body ) {

    if ( ! error && response.statusCode == 200 ) {

      var books = JSON.parse( body ) ;

      _.each ( books.response.docs , function ( doc ) {
        callback ( { route: '/book/' + doc.id + '/index.html', template: template, data: doc } ) ;
      } ) ;

    }
  });

}

exports.books = books ;