// High score table stored in localStorage, top 10 entries.
var Scores = (function () {
  var KEY = 'attack-of-trump:scores';
  var MAX_ENTRIES = 10;

  function load() {
    try {
      var list = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      // Storage can be full or blocked (private mode); the score is just not kept.
    }
  }

  // Adds an entry and returns its position in the table, or -1 if it didn't make the top.
  function add(name, score) {
    var list = load();
    var entry = { name: name, score: score };
    list.push(entry);
    list.sort(function (a, b) { return b.score - a.score; });
    list = list.slice(0, MAX_ENTRIES);
    save(list);
    return list.indexOf(entry);
  }

  return { load: load, add: add };
})();
