function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

Array.prototype.diff = function (arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for (var i = 0; i < this.length; i += 1) {
        if (arr2.indexOf(this[i]) > -1) {
            ret.push(this[i]);
        }
    }
    return ret;
};

Array.prototype.union_results = function (with_results2) {
    
    let concatUnion = this.concat(with_results2);
    let uniqueConceptIds = [];
    let union = [];

    //find distinct concept ids
    concatUnion.forEach(function (ele) {
        if ($.inArray(ele.id, uniqueConceptIds) === -1) uniqueConceptIds.push(ele.id);
    });

    //loop through distinct concept ids and merge same concept id rows
    uniqueConceptIds.forEach(function (uniqueConceptId) {
        let mergedConceptResult = new Object;
        concatUnion.filter(unionConcepts => unionConcepts.id === uniqueConceptId).forEach(function (concept) {
            mergedConceptResult = $.extend({}, mergedConceptResult, concept);
        });
        union.push(mergedConceptResult);
    });

    return union;
};

Array.prototype.union_results_parent = function (with_results2) {
    
    let concatUnion = this.concat(with_results2);
    let uniqueConceptIds = [];
    let union = [];

    //find distinct concept ids
    concatUnion.forEach(function (ele) {
        if ($.inArray(ele.id, uniqueConceptIds) === -1) uniqueConceptIds.push(ele.id);
    });

    //loop through distinct concept ids and merge same concept id rows
    uniqueConceptIds.forEach(function (uniqueConceptId) {
        let mergedConceptResult = new Object;
        concatUnion.filter(unionConcepts => unionConcepts.parent_id === uniqueConceptId).forEach(function (concept) {
            mergedConceptResult = $.extend({}, mergedConceptResult, concept);
            //{total_score_table: concept.total_score_table}
        });
        union.push(mergedConceptResult);
    });

    return union;
};