$(document).ready(function() {

  // Place JavaScript code here...
  $(".box1").hover(function(){
    $(".box1 .overlay").css("opacity", "1");
    $(".box1 h1").css("opacity", "0");
    $(".box1 p").css("opacity", "1");
  }, function(){
      $(".box1 .overlay").css("opacity", "0");
      $(".box1 h1").css("opacity", "1");
      $(".box1 p").css("opacity", "0");
  });

  $(".box2").hover(function(){
    $(".box2 .overlay").css("opacity", "1");
    $(".box2 h1").css("opacity", "0");
    $(".box2 p").css("opacity", "1");
  }, function(){
      $(".box2 .overlay").css("opacity", "0");
      $(".box2 h1").css("opacity", "1");
      $(".box2 p").css("opacity", "0");
  });

  $(".box3").hover(function(){
    $(".box3 .overlay").css("opacity", "1");
    $(".box3 h1").css("opacity", "0");
    $(".box3 p").css("opacity", "1");
  }, function(){
      $(".box3 .overlay").css("opacity", "0");
      $(".box3 h1").css("opacity", "1");
      $(".box3 p").css("opacity", "0");
  });

  $(".box4").hover(function(){
    $(".box4 .overlay").css("opacity", "1");
    $(".box4 h1").css("opacity", "0");
    $(".box4 p").css("opacity", "1");
  }, function(){
      $(".box4 .overlay").css("opacity", "0");
      $(".box4 h1").css("opacity", "1");
      $(".box4 p").css("opacity", "0");
  });

});
