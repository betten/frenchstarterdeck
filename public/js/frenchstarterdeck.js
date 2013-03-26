$(function() {
  $.ajax({
    url: '../json/french_1_1000_wiktionary_with_examples.json?' + new Date().getTime()
  }).done(function(words) {
    $('#loading').hide();
    $('#nav').show();

    var list_html = '';

    var wlen = words.length;
    for(var i = 0; i < wlen; i++) {
      var word = words[i].word;
      var examples = words[i].examples;

      var examples_html = '';
      var elen = examples.length;
      for(var j = 0; j < elen; j++) {
        examples_html += '<tr class="example">';
        examples_html += '<td><input class="selected" type="checkbox" /></td>';
        examples_html += '<td class="french" width="50%">' + examples[j][0] + '</td>';
        examples_html += '<td class="english">' + examples[j][1] + '</td>';
        examples_html += '</tr>';
      }

      var word_html = '<div class="word">';
      word_html += '<h4>' + word + '</h4>';
      word_html += '<table class="table table-striped table-hover">' + examples_html + '</table>';
      word_html += '</div>';

      list_html += word_html;
    }

    document.getElementById('list').innerHTML = list_html;

    select_n_random_per_word(3);
    update_count();
    $('#list .word :checkbox').click(update_count);
  });

  var clear_all = function() {
    var boxes = document.getElementsByClassName('selected');
    var blen = boxes.length;
    for(var i = 0; i < blen; i++) {
      boxes[i].checked = false;
    }
  };
  var select_n_random_per_word = function(n) {
    clear_all();
    var words = document.getElementsByClassName('word');
    var wlen = words.length;
    for(var i = 0; i < wlen; i++) {
      var word = words[i];
      var nodes = word.getElementsByClassName('selected');
      var checkboxes = [];

      for(var k = 0, nlen = nodes.length; k < nlen; checkboxes.push(nodes[k++]));

      for(var j = 0; j < n; j++) {
        if(!checkboxes.length) break;
        var index = Math.round(Math.random()*(checkboxes.length - 1));
        checkboxes[index].checked = true;
        checkboxes.splice(index, 1);
      }
    }
  };
  var update_count = function() {
    var boxes = document.getElementsByClassName('selected');
    var blen = boxes.length;
    var count = 0;
    for(var i = 0; i < blen; i++) {
      if(boxes[i].checked) count++;
    }
    $('#count').text(count);
  };

  var confirm_message = "Are you sure? All currently selected sentences will be lost.";
  $('#clear').click(function() {
    if(confirm(confirm_message)) {
      clear_all();
    }
    update_count();
  });
  $('#random').click(function() {
    if(confirm(confirm_message)) {
      select_n_random_per_word(3);
      update_count();
    }
  });
  $('#all').click(function() {
    if(confirm(confirm_message)) {
      var boxes = document.getElementsByClassName('selected');
      var blen = boxes.length;
      for(var i = 0; i < blen; i++) {
        boxes[i].checked = true;
      }
    }
    update_count();
  });
  $('#download').click(function() {
    $(this).button('loading');
    var e = document.getElementsByClassName('example');
    var n = e.length;
    var form_html = '';
    for(var i = 0; i < n; i++) {
      if(e[i].getElementsByClassName('selected')[0].checked) {
        // trying out some node traversal and native js to see if faster than jquery
        var word = e[i].parentNode.parentNode.parentNode.getElementsByTagName('h4')[0].innerText;
        var french = e[i].getElementsByClassName('french')[0].innerText;
        var english = e[i].getElementsByClassName('english')[0].innerText;
        form_html += '<input name="word[' + i + '][word]" value="' + word + '" />';
        form_html += '<input name="word[' + i + '][french]" value="' + french + '" />';
        form_html += '<input name="word[' + i + '][english]" value="' + english + '" />';
      }
    }
    $('#generate').html(form_html);
    $('#generate').submit();
    $(this).button('reset');
  });
});
