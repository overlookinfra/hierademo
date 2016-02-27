YAML = window.YAML;

function clearAllTimers(timers) {
  // stop any running lookup animations
  for (var i=0; i<timers.length; i++) {
    clearTimeout(timers[i]);
  }
}

function interpolateVariables() {
  $('.facts input[type=text]').each(function() {
    var name = $(this).attr("name");
    $('span.replace.'+name).text($(this).val());
  });

  $('.hiera #update').hide();
  $('.hiera #reset').show();
}

function resetVariables() {
  $('.replace').each(function() {
    var title = $(this).attr("title");
    $(this).text(title);
  });

  $('.hiera #update').show();
  $('.hiera #reset').hide();
}

$(document).ready(function() {
  var timers = [];

  // This lets highlight.js finish first
  setTimeout(function() {
    $('.replace').tooltip({
      show: false,
      hide: { effect: "puff", duration: 100 }
    });

    $('.hiera #update').on('click', function() {
      interpolateVariables();
    });

    $('.hiera #reset').on('click', function() {
      resetVariables();
    });

  }, 500);

    $( "#help-dialog" ).dialog({
      autoOpen: false,
      height: 450,
      width: 600,
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });

    $( "#openhelp" ).click(function() {
      $( "#help-dialog" ).dialog( "open" );
    });

  // update hiera.yaml when facts change
  $('.facts input[type=text]').on('input', function() {
    var name = $(this).attr("name");
    $('span.replace.'+name).text($(this).val());
  });

  $('.datasources li .path').on('click', function() {
    $(this).next('pre').toggle();
  });

  $('#lookup').on('click', function() {
    var key = $('#key').val();
    var env = $('.facts input[name=environment]').val();

    clearAllTimers(timers);
    interpolateVariables();

    $('#result').show();
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

          $('#result #message').html('Looking for "<code>' + key + '</code>" in <code>' + path + '</code>');

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
                $('#result #message').text('Found: ' + JSON.stringify(data[key]));
                $('#result').addClass('success');

                // stop the lookup
                clearAllTimers(timers);
              }

            }

          });
        }
      }, 2000 * (i-1), i));
    }

    timers.push(setTimeout(function() {
      $('.datasources li pre').slideUp();
      $('#result #message').text('Not found.');
      $('#result').addClass('fail');
      $('#result').show();
    }, 3000 * i));

  });

});
