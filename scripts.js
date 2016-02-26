YAML = window.YAML;

$(document).ready(function() {


  // This lets highlight.js finish first
  setTimeout(function() {
    $('.replace').tooltip({
      show: false,
      hide: { effect: "puff", duration: 100 }
    });

    $('.hiera #update').on('click', function() {
      $('.facts input[type=text]').each(function() {
        var name = $(this).attr("name");
        $('span.replace.'+name).text($(this).val());
      });
    });

  }, 500);

  // update hiera.yaml when facts change
  $('.facts input[type=text]').on('input', function() {
    var name = $(this).attr("name");
    $('span.replace.'+name).text($(this).val());
  });


  $('.datasources li .path').on('click', function() {
    $(this).next('pre').toggle();
  });

  $('#lookup').on('click', function() {
    var timers = [];
    var key    = $('#key').val();
    var env    = $('.facts input[name=environment]').val();

    // stop any running lookup animations
    for (var i=0; i<timers.length; i++) {
      clearTimeout(timers[i]);
    }

    $('#result').hide();
    $('#result').removeClass('fail');
    $('#result').removeClass('success');
    $('.level').removeClass('active');

    for (var i = 1; i < 6; i++) {
      timers.push(setTimeout(function(current) {
        var previous = current -1;
        $('#level'+previous).removeClass('active');
        $('.datasources li pre').slideUp();

        if($('#level'+current).length) {
          $('#level'+current).addClass('active');

          var path = env + '/hieradata/' + $('#level'+current).text().replace(/"/g, '') + '.yaml';

          $('.datasources li .path').each(function() {
            var datasource = $(this).text();

            console.log('ds:'+datasource+':'+path+':');

            if(datasource == path) {
              var pre  = $(this).next('pre');
              var data = YAML.parse(pre.find('code').text());

              pre.slideDown();

              console.log('looking for '+key+' in '+ JSON.stringify(data));

              if(data.hasOwnProperty(key)) {
                console.log('Found ' +key)
                $('#result').text('Found: ' + key + ' = ' + data[key]);
                $('#result').addClass('success');
                $('#result').show();

                // stop the lookup
                for (var i=0; i<timers.length; i++) {
                  clearTimeout(timers[i]);
                }
              }

            }

          });
        }
      }, 3000 * (i-1), i));
    }

    timers.push(setTimeout(function() {
      $('.datasources li pre').slideUp();
      $('#result').text('Not found.');
      $('#result').addClass('fail');
      $('#result').show();
    }, 3000 * i));

  });

});
