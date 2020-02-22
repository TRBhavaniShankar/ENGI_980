$(document).ready(function(){

  $('#register').on('submit', function(){

      var registerData;

      var x = $("this").serializeArray();
      
      $.each(x, function(i, field){
        registerData.append(field.name + ":" + field.value + " ");
      });

      $.ajax({
        type: 'POST',
        url: '/register',
        data: registerData,
        success: function(data){
          location.reload();
        },
        error: function(){
          alert('error posting');
        }
      });

      return false;

  });

  // $('li').on('click', function(){
  //     var item = $(this).text().replace(/ /g, "-");
  //     $.ajax({
  //       type: 'DELETE',
  //       url: '/todo/' + item,
  //       success: function(data){
  //         //do something with the data via front-end framework
  //         location.reload();
  //       }
  //     });
  // });

});
