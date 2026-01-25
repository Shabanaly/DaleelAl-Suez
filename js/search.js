// search.js

function searchPlaces(list, keyword) {
    var results = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].name.indexOf(keyword) !== -1) {
            results.push(list[i]);
        }
    }
    return results;
}
