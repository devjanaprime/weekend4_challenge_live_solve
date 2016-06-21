var bodyParser = require('body-parser');
var urlencodedParser=bodyParser.urlencoded( { extended: false } );
var express = require('express');
var app=express();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/tasks_db';

// base url
app.get( '/', function( req, res ){
  console.log( 'at base url' );
  res.sendFile( path.resolve( 'views/index.html') );
});

// base url
app.get( '/displayTasks', function( req, res ){
  console.log( 'in displayTasks' );
  // get all tasks from db
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
    }
    else{
      // our results array
      var results=[];
      // if( req.body.queryType == 'all' ){
        // separate false/true complete, order by id DESC
        var allTasks = client.query( 'SELECT * FROM tasks ORDER BY complete, id DESC' );
      // }
      // else{
      //   // show only those that are not completed
      //   allTasks = client.query( 'SELECT * FROM tasks WHERE complete=false ORDER BY id DESC' );
      // }

      // for each row in allTasks, push into array
      allTasks.on( 'row', function( row ){
        results.push( row );
      }); // end on row
      allTasks.on( 'end', function(){
        // return array of rows as json
        return res.json( results );
      }); // end on end
    }
  }); //end connection
  // send to client
});

// spin up server
app.listen( 9900, 'localhost', function( req, res ){
  console.log( 'server listening on port 9900' );
});

// post route to create task
app.post( '/addTask', urlencodedParser, function( req, res ){
  console.log( 'in addTask: ' + req.body.task_name );
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
    } // end error
    else{
      client.query( 'INSERT INTO tasks ( task_name ) values ( $1 )', [ req.body.task_name ] );
      res.send( true );
    } // end no error
  });
});

// static folder
app.use( express.static( 'public' ) );
