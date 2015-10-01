(function($) {
  $(function() {
    var $output = $("#output");
    var content = "";

    var showSuggestions = function($ul) {
      return function() {
        $ul.slideDown('medium');
      };
    };
    var hideSuggestions = function($ul) {
      return function() {
        $ul.slideUp('medium');
      };
    };
    var createSuggestionList = function(suggestions) {
      var $ul = $("<ul />", { "class": "spelling-suggestions"});
      var max = Math.min(suggestions.length, 10);

      for (var i = 0; i < max; i++) {
        var $li = $("<li />");
        $li.text(suggestions[i]);
        $ul.append($li);
      }

      return $ul;
    };

    var parseResult = function(result) {
      $output.html("");
      var misspellings = result.misspellings;

      var $infoBox = $("#infoBox");
      $infoBox.find(".wordCount").text(result.wordCount);
      $infoBox.find(".correctCount").text(result.correctCount);
      $infoBox.find(".misspelledCount").text(result.misspellingCount);

      var lines = content.split("\n");
      for (var i = misspellings.length-2; i >= 0; i--) {
        var $newLine = $("<span />");
        var start = lines[i];
        var misspellingsLine = misspellings[i];
        console.log(start);

        for (var j = misspellingsLine.length-1; j >= 0; j--) {
          var misspelling = misspellingsLine[j];
          var word = misspelling.word;
          var position = misspelling.position;
          var endPosition = position+word.length;

          var errorPart = start.slice(position, endPosition);
          var end = start.slice(endPosition);
          start = start.slice(0, position);

          var $errorLi = $("<li />", { text: errorPart });
          var $suggestions = createSuggestionList(misspelling.alternatives);
          $errorLi.append($suggestions);
          $errorLi.hover(showSuggestions($suggestions), hideSuggestions($suggestions));

          var $errorPart = $("<ul />", { "class": "errorWord"});
          $errorPart.append($errorLi);

          $newLine.prepend(end);
          $newLine.prepend($errorPart);
        }
        $newLine.prepend(start);

        $output.prepend($("<br />"));
        $output.prepend($newLine);
      }
    };


    $("#checkBtn").on("click", function() {
      content = $("#textToCheck").val();
      $.ajax(
        { type: "POST",
          url: "/api/spellcheck",
          data: { content: content },
          success: function(spelling) {
            console.log("hyrra");
            parseResult(JSON.parse(spelling));
          }
        });
    });
  });
})(jQuery);
