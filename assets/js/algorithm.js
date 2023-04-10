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

        //more elegant way - has to be debugged
        //let sum = 0
        //sum = concatUnion.filter(unionConcepts => unionConcepts.id === uniqueConceptId).reduce((accumulator, concept) => {
        //    return accumulator + concept.score;
        //  }, 0);
        //union.push(new Object({id: uniqueConceptId, total_score: sum}));        
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

//vector hot encoding representation data type
function is_datatype_numeric(data_type) {
    let ret = 0;
    if (data_type!= undefined) {
        ret = data_type.includes("NUMBER") || data_type.includes("INT")|| data_type.includes("FLOAT")? 1:0;
    }
    return ret;
}

function is_datatype_text(data_type) {
    let ret = 0;
    if (data_type!= undefined) {
        ret = data_type.includes("VARCHAR") || data_type.includes("TEXT")? 1:0;
    }
    return ret;
}
function is_datatype_date(data_type) {
    let ret = 0;
    if (data_type!= undefined) {
        ret = data_type.includes("DATE")|| data_type.includes("TIME")? 1:0;
    }
    return ret;
}
function is_datatype_miscellaneous(data_type) {
    let ret = 0;
    if (data_type!= undefined) {
        ret = data_type.includes("BLOB")? 1:0;
    }
    return ret;
}


function tableToCSV(tableIdentifier) {
    console.log("H")
    // Variable to store the final csv data
    var csv_data = [];
    
    // Get each row data
    var rows = $('#'+tableIdentifier+' tr');

    //columns
    
    //csv_data.push();

    for (var i = 0; i < rows.length; i++) {

        // Get each column data
        var cols = rows[i].querySelectorAll('td, th');

        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {

            // Get the text data of each cell
            // of a row and push it to csvrow
            csvrow.push(cols[j].innerHTML);
        }

        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
    }

    // Combine each row data with new line character
    csv_data = csv_data.join('\n');

    // Call this function to download csv file 
    // console.log(csv_data);

    CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });

    // Create to temporary link to initiate
    // download process
    var temp_link = document.createElement('a');

    // Download csv file
    temp_link.download = tableIdentifier +".csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}			

