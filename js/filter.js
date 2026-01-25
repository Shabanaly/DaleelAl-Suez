// filter.js

function filterBySubCategory(list, sub) {
    var results = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].subCategory === sub) {
            results.push(list[i]);
        }
    }
    return results;
}

function filterByCategory(list, cat) {
    var results = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].category === cat) {
            results.push(list[i]);
        }
    }
    return results;
}
