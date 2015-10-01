var aspell = require('aspell');

var checker = (function() {
  var checker = {};
  var wordCount = 0;
  var correctCount = 0;
  var misspellingCount = 0;
  var line = 0;
  var misspellings = [];
  misspellings[0] = [];


  var end = function(callback) {
    return function() {
      callback(getStatus());
    };
  };
  var error = function(chunk) {
    console.log("Error when running aspell:");
    console.log(chunk);
  };
  var resultHandler = function(result) {
    var type = result.type;
    wordCount++;

    if (type === "ok") {
      correctCount++;
    } else if (type === "misspelling") {
      misspellingCount++;
      misspellings[line].push(result);
    } else if (type === "comment") {
      console.log("*********************");
      console.log("Comment");
      console.log(result.line);
      console.log("*********************");
    } else if (type === "line-break") {
      line++;
      misspellings[line] = [];
    } else if (type === "unknown") {
      console.log("*********************");
      console.log("Uknown");
      console.log("*********************");
    }
  };
  var getStatus = function() {
    return {
      wordCount: wordCount,
      correctCount: correctCount,
      misspellingCount: misspellingCount,
      misspellings: misspellings
    };
  };
  var checkSpelling = function(content, callback) {
    wordCount = 0;
    correctCount = 0;
    misspellingCount = 0;
    line = 0;
    misspellings = [];
    misspellings[0] = [];

    var emitter = aspell(content);
    emitter.on("error", error)
      .on("result", resultHandler)
      .on("end", end(callback));
  };

  checker.getStatus = getStatus;
  checker.checkSpelling = checkSpelling;

  return checker;
})();

exports.checkSpelling = checker.checkSpelling;
