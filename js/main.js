$(document).ready(function () {

  var dir = "img/";
  var fileextension = ".jpg";
  $.ajax({
      //This will retrieve the contents of the folder if the folder is configured as 'browsable'
      url: dir,
      success: function (data) {
          //List all .png file names in the page
          $(data).find("a:contains(" + fileextension + ")").each(function () {

              var filename = this.href.replace(window.location.host, "").replace("http://", "");
              filename = filename.split('/')[2];
              var template = '<div class="image-section">'
                +'<div class="image-wrap">'
                  +'<img class="show-image" src="'+dir+filename+'" />'
                  +'<img class="target-image" src="'+dir+filename+'" />'
                +'</div>'
                +'<div class="color-thief-output"></div>'
              +'</div>';
              // if(filename == 'photo4.jpg'){
                $('.full-section').append(template);
              // }
          });
          startMotion(); 
      }
  });

  var startMotion = function() {
    var colorThief = new ColorThief();

    var imageSections = $('.full-section .image-section');
    var currentImageNum = 0;
    var mouseover = false;
    var restart;
    $('.full-section').on('mouseover', function(){
      $(this).addClass('full-hover');
      mouseover = true;
    });
    $('.full-section').on('mouseleave', function(){
      $(this).removeClass('full-hover');
      mouseover = false;
      if(!disapperDiv && typeof restart !== 'undefined'){
        restart();
      }
    });

    var colorDiv, imageSection;
    var disapperDiv = false;
    $('.show-image').on('click', function(){
      imageSection     = $(this).closest('.image-section');
      colorDiv = imageSection.find('.color-div');
      
      if(imageSection.find('.show-image').hasClass('big-img')){
        disapperDiv = false;
        imageSection.find('.show-image').removeClass('big-img');
        setTimeout(function(){
          for(var i=0; i < colorDiv.length; i++){
            showHideColor(i, false);
          }
        }, 1000);
      }else{
        disapperDiv = true;
        for(var i=0; i < colorDiv.length; i++){
          showHideColor(i, true);
        }
        if(!mouseover && typeof restart !== 'undefined'){
          restart();
        }
      };
    });

    function showHideColor(i, hide){
      setTimeout(function(){
        console.log('i : '  + i);
        if(hide){
          colorDiv.eq(i).css('display', 'none');
          if((i+1) >= colorDiv.length){
              imageSection.find('.show-image').addClass('big-img');
          }
        }else{
          colorDiv.eq(i).css('display', 'block');
        }
        
      },i*10);
    };
    var showNextImage = function() {
      var $imageSection     = imageSections.eq(currentImageNum);
      if($imageSection.length == 0){
        currentImageNum = 0; 
        $imageSection     = imageSections.eq(currentImageNum);
      } 
      var $targetimage      = $imageSection.find('.target-image');
      showColorsForImage($targetimage, $imageSection);
      currentImageNum++;
    };
    // Run Color Thief functions and display results below image.
    // We also log execution time of functions for display.
    var showColorsForImage = function($image, $imageSection ) {
      var image                    = $image[0];
      var start                    = Date.now();
      var palette                  = colorThief.getPalette(image);

     
      $imageSection.find('.color-thief-output').empty();

      for(var i=0; i < palette.length; i++){
        var r = palette[i][0][0];
        var g = palette[i][0][1];
        var b = palette[i][0][2];
        $imageSection.find('.color-thief-output').append('<div class="color-div" style="background-color:rgba('+r+','+g+','+b+',1.0"></div>');

      }

      $imageSection.find('.color-thief-output').append('<div class="color-div" style="background-color:rgba(255,255,255,1.0"></div>');

      $imageSection.css('display','block');
      if(!mouseover && !disapperDiv){
        setTimeout(function(){
          $imageSection.css('display','none');
          showNextImage();
        },200);
      }else{
        restart = function(){
            setTimeout(function(){
            $imageSection.css('display','none');
            showNextImage();
          },200);
        }
      }
    };

    showNextImage();
  }
});