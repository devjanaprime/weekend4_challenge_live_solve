console.log( 'script.js sourced' );

$( document ).ready( function(){
  console.log( 'jQuery is ready' );
  $( '#addTask' ).on( 'click', function(){
    // prevent spamming button
    event.preventDefault();

    // get value of taskNameIn
    var taskName = $( '#taskNameIn' ).val();
    console.log( "captured task name: " + taskName );

    // create object to send
    var objectToSend ={
      "task_name": taskName
    };

    // ajax call to addTask
    $.ajax({
      type: 'POST',
      url: '/addTask',
      data: objectToSend,
      success: function( data ){
        getTasks();
      }
    }); // end ajax

  }); // end addTask click

  function getTasks()
  {
    // get tasks from db
    $.ajax({
      type: 'GET',
      url: '/displayTasks',
      success: function( data ){
        showTasks( data );
      } // end success
    }); //end ajax
  } // end getTasks

  function showTasks( allTasks ){
    $('#outputDiv').empty();
    for( var i=0; i<allTasks.length; i++ ){
      // for each record append to DOM with a containing div
      var divText = "<div id='task" + allTasks[i].id + "'>";
      var lineText =  "<p><b>" + allTasks[i].task_name + "</b>";
      divText += lineText;
      if( !allTasks[i].complete ){
        var buttonText0 =  "<button>Complete</button>";
        divText += buttonText0;
      }
      var buttonText1 =  "<button>Delete</button></p></div>";
      divText += buttonText1;
      $('#outputDiv').append( divText );
    } //end for
  } // end showTasks

  getTasks();

}); // end document ready
