//TODO Objectoriented programming for SVG Container 
/*function svgContainer(){
    this.svg = d3.select("#schema1").append("svg")
        .attr("id", "schemasvg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 2000 1000");
    
    this.appendPath = function(){
        this.svg.append("path")
            .attr("id", "wa_path")
            .attr("d", "M100,100L200,200")
            .attr('stroke', 'black')
            .attr('stroke-width', '3')
            .attr('fill', 'none')
            .attr("class", "arrow invisible")
            .attr("data-pathend", "NULL")
            .attr("data-pathstart", "NULL");
    };
}

var svgContainerO = new svgContainer();
svgContainerO.appendPath();
*/

//Rounding const
const round10 = (value, exp) => decimalAdjust('round', value, exp);

// D3 ELEMENTS
var svg = d3.select("#schema1").append("svg")
    .attr("id", "schemasvg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 2000 1000");

var path = svg.append("path")
    .attr("id", "wa_path")
    .attr("d", "M100,100L200,200")
    .attr('stroke', 'black')
    .attr('stroke-width', '3')
    .attr('fill', 'none')
    .attr("class", "arrow invisible")
    .attr("data-pathend", "NULL")
    .attr("data-pathstart", "NULL");

var defs = svg.append("defs");
var marker = defs.append("marker")
    .attr("id", "mark-end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", "4")
    .attr("markerWidth", "5")
    .attr("markerHeight", "5")
    .attr("orient", "auto")

var pathm = marker.append("path")
    .attr("d", "M0,-5L10,0L0,5");



// EVENTS FOR SVG

// drag newPath in SVG if newPath true (--> disables connecting same concept)
svg.on("mousemove", function (e) {
    if (newPath) {

        //new path end position
        path.attr("d", path.attr("d").split('L')[0] + "L" + parseInt(d3.pointer(e)[0]) + "," + parseInt(d3.pointer(e)[1]));

        // check mouse moved a little bit from initial click
        if ((gInitialClickCordinates[0] - parseInt(d3.pointer(e)[0]) > 100 ||
            gInitialClickCordinates[0] - parseInt(d3.pointer(e)[0]) < - 100) &&
            (gInitialClickCordinates[1] - parseInt(d3.pointer(e)[1]) > 100 ||
                gInitialClickCordinates[1] - parseInt(d3.pointer(e)[1]) < - 100)) {
            //console.log(gInitialClickCordinates[0] + ',' + parseInt(d3.pointer(e)[0]))
            newPathMouseMoved = true;
        }
    }
});

//remove arrow when not clicked onto a gConcept
svg.on("click", function (e) {
    if (newPath) {
        //initialize wa_path
        newPath = false;
        newPathMouseMoved = false;
        path.classed("invisible", true)
            .attr("data-pathend", "NULL")
            .attr("data-pathstart", "NULL");
    }
});

$(window).mouseup(function (e) {
    clickingViewbox = false;
});

// SVG VIEWBOX SLIDER and SCROLL EVENTS 
$("#schema1slider").change(function () {
    var newWidth = this.value * 40;
    var newHeight = this.value * 20;
    var viewBoxValue = '0 0 ' + newWidth + ' ' + newHeight;
    $('#schemasvg').attr('viewBox', viewBoxValue);
});

$('#schemasvg').on('mousewheel', function (e) {
    //console.log(e.clientX - this.getBoundingClientRect().x);
    //console.log(e.clientY - this.getBoundingClientRect().y);
    var viewBoxCordinatesString = $('#schemasvg').attr('viewBox');
    var viewBoxCordinates = viewBoxCordinatesString.split(" ");
    //console.log(viewBoxCordinates);
    if (e.originalEvent.wheelDelta / 120 > 0) {

        var newX = parseInt(viewBoxCordinates[0]) + (0.05 * (e.clientX - this.getBoundingClientRect().x));
        var newY = parseInt(viewBoxCordinates[1]) + (0.05 * (e.clientY - this.getBoundingClientRect().y));
        var newWidth = parseInt(viewBoxCordinates[2]) - 20;
        var newHeight = parseInt(viewBoxCordinates[3]) - 10;


        $('#schemasvg').removeAttr('viewBox');
        $('#schemasvg').attr('viewBox', newX + ' ' + newY + ' ' + newWidth + ' ' + newHeight);
        //console.log('scrolling up ! ' + e.clientX + ' ' + e.clientY);
        $("#schema1slider").val(newWidth / 40);

    }
    else {
        var newX = parseInt(viewBoxCordinates[0]) * 0.97; //- (0.01 * (e.clientX - this.getBoundingClientRect().x));
        var newY = parseInt(viewBoxCordinates[1]) * 0.97; //- (0.01 * (e.clientY - this.getBoundingClientRect().y));
        var newWidth = parseInt(viewBoxCordinates[2]) + 20;
        var newHeight = parseInt(viewBoxCordinates[3]) + 10;


        $('#schemasvg').removeAttr('viewBox');
        $('#schemasvg').attr('viewBox', newX + ' ' + newY + ' ' + newWidth + ' ' + newHeight);
        //console.log('scrolling down ! ' + e.clientX + ' ' + e.clientY);
        $("#schema1slider").val(newWidth / 40);
    }
});

// SVG VIEWBOX CLICK and MOUSEMOVE EVENTS 
var clickingViewbox = false;
$('#schemasvg').mousedown(function (e) {
    clickingViewbox = true;
    var clickedPosX = e.clientX;
    var clickedPosY = e.clientY;
    //console.log('Initial click: ' + clickedPosX + ' ' + clickedPosY);

    var viewBoxCordinatesString = $('#schemasvg').attr('viewBox');
    var viewBoxCordinates = viewBoxCordinatesString.split(" ");

    $("#schemasvg").mousemove(function (e) {
        if (clickingViewbox == false) return;
        var movedPosX = e.clientX;
        var movedPosY = e.clientY;

        var newX = parseInt(viewBoxCordinates[0]) + clickedPosX - movedPosX;
        var newY = parseInt(viewBoxCordinates[1]) + clickedPosY - movedPosY;

        $('#schemasvg').removeAttr('viewBox');
        $('#schemasvg').attr('viewBox', newX + ' ' + newY + ' ' + viewBoxCordinates[2] + ' ' + viewBoxCordinates[3]);
        //console.log('moved: ' + movedPosX + ' ' + movedPosY);
    });

});

// variable set true when new connection is to be drawn
var newPath = false;
var newPathMouseMoved = false;
var gInitialClickCordinates = [0, 0];

//Front-End d3 elements for positioning conceptG 
var newTableConceptPositionXY = [-400, 400];

var newTableConceptPosition = function () {
    newTableConceptPositionXY[0] = newTableConceptPositionXY[0] + 800;
    if (newTableConceptPositionXY[0] > 1600) {
        newTableConceptPositionXY[0] = 400;
        newTableConceptPositionXY[1] = newTableConceptPositionXY[1] + 300;
    };
    var position = newTableConceptPositionXY;
    circleAroundTableCounter = 0;
    return position;
};

var circleAroundTableCounter = 0;
var circleAroundTable = [[0, -100], [250, -100], [250, 0], [250, 100], [0, 100], [-250, 100], [-250, 0], [-250, -100],
[+200, -50], [+200, +50], [-200, +50], [-200, -50], [0, 50], [0, -50]]

var newColumnConceptPosition = function (TableConceptXY) {
    let position = [(TableConceptXY[0] + circleAroundTable[circleAroundTableCounter][0]),
    (TableConceptXY[1] + circleAroundTable[circleAroundTableCounter][1])];
    if (circleAroundTableCounter < 13 ? circleAroundTableCounter++ : circleAroundTableCounter = 0);
    return position;
};

// Concept List for Constructor generated concepts
var concept_id_index = 0; //Concept ID 
let schema_count = 0;
var conceptList = []; //Concept Object List

// Constructor for concepts
function concept(concept_name, parent_concept_id, data_type) {
    concept_id_index = concept_id_index + 1;
    let schema;

    if (parent_concept_id === undefined) { // --> it is a schema-concept
        type = 'schema';
        if (concept_name === 'global') { this.color = $("#colorpickerglobalconcept").css("color") }
        else {
            schema_count = schema_count + 1;
            this.color = $("#colorpickermodal" + schema_count).css("color");
        };
    } else { // --> it has a parent-concept
        let parent_concept = conceptList.find(concept => concept.id === parent_concept_id);
        //parent_id = parent_concept.id;
        type = (parent_concept.type == 'schema') ? 'table' : 'attribute';
        schema = (type === 'table') ? parent_concept.name : parent_concept.get_parent_concept().name;
        if (schema === 'global') { this.transformation1 = ''; this.transformation2 = ''; this.transformation3 = ''; }
    }

    this.id = 'CONCEPT_' + concept_id_index;
    this.name = (concept_name.includes("Global") || concept_name.includes("Global")) ? this.id + '_' + concept_name : concept_name;
    this.refined_local_name = this.name;
    this.parent_id = parent_concept_id;
    this.parent_name = (parent_concept_id === undefined) ? '' : concept_id_to_concept(parent_concept_id).name;
    this.type = type;
    this.schema = schema;
    this.data_type = data_type;
    this.constraint_name;
    this.constraint_ref_id;
    this.global_id = [];
    this.draw = true;
    this.is_drawn = false;
    this.synonyms_retrieved = false;
    this.synonyms = [];

    //vector hot encoding representation meta
    this.vec_type_schema = this.type == 'schema' ? 1 : 0;
    this.vec_type_table = this.type == 'table' ? 1 : 0;
    this.vec_type_attribute = this.type == 'attribute' ? 1 : 0;
    //this.vec_schema_global = 0;
    //this.vec_schema_local = 0;

    //vector hot encoding representation data type
    this.vec_datatype_numeric = is_datatype_numeric(this.data_type);
    //this.vec_datatype_numericfloat = this.data_type.includes("FLOAT")? 1:0;
    this.vec_datatype_text = is_datatype_text(this.data_type);
    this.vec_datatype_date = is_datatype_date(this.data_type);
    this.vec_datatype_miscellaneous = is_datatype_miscellaneous(this.data_type);

    //vector hot encoding representation constraint
    this.vec_constraint_pk = 0;
    this.vec_constraint_fk = 0;
    this.vec_constraint_fkref = 0;
    this.vec_constraint_notnull = 0;
    this.vec_constraint_default = 0;
    this.vec_constraint_unique = 0;
    this.vec_constaint_check = 0;

    this.set_constraint = function (constraint, constraint_ref_concept_id) {
        this.constraint_name = constraint;
        this.constraint_ref_id = constraint_ref_concept_id;

        //vector hot encoding representation constraint
        this.vec_constraint_pk = constraint.includes("PRIMARY KEY") ? 1 : 0;
        this.vec_constraint_fk = constraint.includes("FOREIGN KEY") ? 1 : 0;
        this.vec_constraint_notnull = constraint.includes("NOT NULL") ? 1 : 0;
        this.vec_constraint_default = constraint.includes("DEFAULT") ? 1 : 0;
        this.vec_constraint_unique = constraint.includes("UNIQUE") ? 1 : 0;
        this.vec_constaint_check = constraint.includes("CHECK") ? 1 : 0;
    };

    this.set_global_concept = function (global_concept_id) {
        global_concept = concept_id_to_concept(global_concept_id);
        this.global_id.push(global_concept.id);

        //set automatically in transformation if empty
        if (global_concept.transformation1 === '' && this.schema === 'SCHEMA1') {
            global_concept.transformation1 = this.name;
        } else if (global_concept.transformation2 === '' && this.schema === 'SCHEMA2') {
            global_concept.transformation2 = this.name;
        } else if (global_concept.transformation3 === '' && this.schema === 'SCHEMA3') {
            global_concept.transformation3 = this.name;
        }

        //draw path between global to local concept if both are drawn
        if (this.is_drawn && global_concept.is_drawn) {
            var global_concept_drawn_X = global_concept.get_drawn_concept_position()[0];
            var global_concept_drawn_Y = global_concept.get_drawn_concept_position()[1];
            var loc_concept_drawn_X = this.get_drawn_concept_position()[0];
            var loc_concept_drawn_Y = this.get_drawn_concept_position()[1];

            svg.append("path")
                .attr("id", global_concept.id + "pathTo" + this.id)
                .attr("d", "M" + (global_concept_drawn_X + 100) + "," + (global_concept_drawn_Y + 50) + "L" + (loc_concept_drawn_X + 100) + "," + (loc_concept_drawn_Y + 50))
                .attr('stroke', path.attr("stroke"))
                .attr("stroke-width", path.attr("stroke-width"))
                .attr('fill', path.attr('fill'))
                .attr("class", "arrow globaltolocal") //append class for global to local path filtering
                .attr("data-pathend", this.id)
                .attr("data-pathstart", global_concept.id);
        }
    }

    this.remove_global_concept = function (global_concept_id) {
        global_concept = concept_id_to_concept(global_concept_id);

        //remove global concept id from local concept global_id array
        var index = this.global_id.indexOf(global_concept.id);
        if (index !== -1) { this.global_id.splice(index, 1); };

        //remove svg path
        d3.select("#" + global_concept.id + "pathTo" + this.id).remove();

        //refresh concept detail view 
        global_concept.update_conceptmeta();
    }

    this.set_draw = function (bool) {
        this.draw = bool;
    }

    // Exclude hardcoded some string elements hindering to retrieve synonyms
    this.modify_concept_name = function () {
        let new_name = this.refined_local_name;
        //if(this.schema === 'Schema1'){
        new_name = new_name.replaceAll("STS_DIM","");
        new_name = new_name.replaceAll("STS_FCT","");
        new_name = new_name.replace("DB1_ORDERINGDB_", "");
        new_name = new_name.replace("DB1_", "");
        new_name = new_name.replace("DB4_", "");
        new_name = new_name.replaceAll("_", " ")
        
        //} else if (this.schema === 'Schema2'){
        //    new_name = new_name.replace("", "");
        //};
        this.refined_local_name = new_name;
        return new_name;
    }

    this.set_synonyms = function () {
        let concept = this;
        concept.modify_concept_name();
        let conceptNames = concept.refined_local_name.split(" ");

        conceptNames.forEach(function (conceptName) {
            const settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://wordsapiv1.p.rapidapi.com/words/" + conceptName + "/synonyms",
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "ae8e2c7884msh6a0c32b120b6dcdp159ea6jsn4c219d367fc6",
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
                },
            };
            $.ajax(settings).done(function (response) {
                console.log(response.synonyms);
                concept.synonyms = concept.synonyms.concat(response.synonyms.map(function (x) { return x.toUpperCase() }));
            }).fail(function () {
                console.log("No synonyms found for " + conceptName);
            }).always(function () {
                concept.synonyms_retrieved = true;
                if (conceptNames.length > 1) {
                    concept.synonyms = concept.synonyms.concat(conceptName.toUpperCase());
                };
            });
        });

        concept.synonyms.push(concept.refined_local_name.toUpperCase());
        //concept.synonyms = concept.synonyms.concat(concept.refined_local_name.toLowerCase());

        return true;
    }

    this.compare_similar_synonyms = function () {
        let that = this;
        var synonyms_result = [];

        conceptList.filter(concept => concept.id != that.id && concept.type == that.type && concept.schema != 'global').
            forEach(function (concept) {
                let same_synonyms = concept.synonyms.diff(that.synonyms);
                if (same_synonyms.length > 0) {
                    synonyms_result.push({
                        id: concept.id, synonyms_score: same_synonyms.length + '/' + that.synonyms.length,
                        synonyms_num_score: round10((same_synonyms.length / that.synonyms.length), -4)
                    });
                }
            });
        return synonyms_result;
    }

    this.compare_number_attributes = function () {
        //table specific
        let that = this;
        let thatNumberOfAttributes = that.get_all_children_concepts().length;
        var attributes_result = [];
        conceptList.filter(concept => concept.id != that.id && concept.type == that.type && concept.schema != 'global').
            forEach(function (concept) {
                attributes_result.push({ id: concept.id, compare_attributes: concept.get_all_children_concepts().length + '/' + thatNumberOfAttributes })
            });
        return attributes_result;
    }

    this.compare_number_foreignkeys = function () {
        //table specific
        let that = this;
        let thatNumberOfForeignKeys = that.get_all_children_concepts().filter(concept => concept.constraint_name === "FOREIGN KEY").length;
        var foreignkeys_result = [];
        conceptList.filter(concept => concept.id != that.id && concept.type == that.type && concept.schema != 'global').
            forEach(function (concept) {
                foreignkeys_result.push({ id: concept.id, compare_foreignkeys: concept.get_all_children_concepts().filter(concept => concept.constraint_name === "FOREIGN KEY").length + '/' + thatNumberOfForeignKeys })
            });
        return foreignkeys_result;
    }


    this.conceptList_to_JSON = function () {
        //relevant for fuzzy search
        let that = this;
        let conceptListJson = new Array();
        conceptList.filter(concept => concept.type == that.type && concept.schema != 'global').
            forEach(function (concept) {
                let conceptJson = new Object();
                conceptJson.id = concept.id;
                conceptJson.name = concept.name;
                conceptJson.refined_local_name = concept.modify_concept_name();
                conceptListJson.push(conceptJson);
            });
        //console.log(conceptListJson);
        let conceptListJsonArray = JSON.parse(JSON.stringify(conceptListJson));
        return conceptListJsonArray;
    };

    this.compare_datatypes = function () {
        let datatypes_result = [];
        let that = this;
        let datatypes = that.get_datatypes();
        //console.log(this.id + ': '+ datatypes)
        conceptList.filter(concept => concept.id != that.id && concept.type == 'table' && concept.schema != 'global').
            forEach(function (concept) {
                let intersec_datatypes = datatypes.filter(value => concept.get_datatypes().includes(value));
                datatypes_result.push({
                    id: concept.id, compare_datatypes: intersec_datatypes.length + '/' + datatypes.length,
                    compare_datatypes_num_score: (intersec_datatypes.length / datatypes.length)
                });
            });
        return datatypes_result;
    };

    this.get_datatypes = function () {
        let datatypes = [];
        let unique_datatypes = [];
        if (this.type == 'table') {
            this.get_all_children_concepts().forEach(function (concept) {
                datatypes.push(concept.data_type);
            });
            datatypes.forEach(function (i, el) {
                if ($.inArray(el, unique_datatypes) === -1) unique_datatypes.push(el);
            });
            if (datatypes.length == 0) {
                datatypes.push('NONE');
            }
        } else {
            return datatypes.push(this.data_type);
        }
        return datatypes.filter((x, i, a) => a.indexOf(x) == i); //distinct datatypes
    }

    this.get_same_datatypes = function () {

        let same_datatypes_result = [];
        conceptList.filter(concept => concept.id != this.id && concept.schema != 'global' && concept.type === this.type && concept.data_type === this.data_type).
            forEach(function (concept) {
                same_datatypes_result.push({ id: concept.id, same_datatype: 1 });
            });
        return same_datatypes_result;
    }

    this.get_table_score = function (bool_tab_score) {
        let parent_ids = [];
        let that = this;
        let tables_similarity_score;
        if (bool_tab_score) {
            tables_similarity_score = that.get_parent_concept().tablelocalconceptfinder();
        };
        let parent_score;
        conceptList.filter(concept => concept.id != that.id && concept.type === that.type).
            forEach(function (concept) {
                if (bool_tab_score) {
                    if (tables_similarity_score.find(parent_concept => parent_concept.id === concept.parent_id) === undefined) {
                        parent_score = 0;
                    } else {
                        parent_score = tables_similarity_score.find(parent_concept => parent_concept.id === concept.parent_id).total_score_table;
                    }
                } else {
                    parent_score = 0;
                };
                parent_ids.push({
                    id: concept.id,
                    schema: concept.schema,
                    parent_id: concept.parent_id,
                    total_score_table: parent_score
                });
            });
        return parent_ids;
    }

    this.get_attributes_score = function () {
        //table specific
        let table_ids = [];
        let that = this;
        conceptList.filter(concept => concept.id != that.id && concept.type == that.type && concept.schema != 'global').
            forEach(function (tab_concept) {
                table_ids.push({
                    id: tab_concept.id,
                    schema: tab_concept.schema,
                    total_score_attribute: 0
                })
            });
        this.get_all_children_concepts().forEach(function (att_concept) {
            let attributes_similarity_score = att_concept.attributelocalconceptfinder(false);
            table_ids.forEach(function (tab_concept) {
                if (attributes_similarity_score.find(att_concept => att_concept.parent_id == tab_concept.id) === undefined) {
                    tab_concept.total_score_attribute += 0;
                } else {
                    tab_concept.total_score_attribute += attributes_similarity_score.find(att_concept => att_concept.parent_id == tab_concept.id).total_score_attribute;
                };
            });
        })

        //sorting
        table_ids.sort(function (a, b) {
            return b.total_score_attribute - a.total_score_attribute;
        });

        //normalization for each schema
        let conceptLT = new Array();
        get_all_schemata_concepts().forEach(function (conceptS) {
            let conceptSconceptsLT = table_ids.
                filter(conceptSconceptLT => conceptSconceptLT.schema == conceptS.name);
            let min = conceptSconceptsLT[conceptSconceptsLT.length - 1].total_score_attribute;
            let delta = conceptSconceptsLT[0].total_score_attribute - min; //max - min
            for (i = 0; i < conceptSconceptsLT.length; i++) {
                conceptSconceptsLT[i].total_score_attribute = round10((conceptSconceptsLT[i].total_score_attribute - min) / delta, -4);
            }
            conceptLT = conceptLT.concat(conceptSconceptsLT);
        });

        return conceptLT;
    };

    this.get_same_constraints = function () {
        var same_constraints_result = [];
        conceptList.filter(concept => concept.id != this.id && concept.type === this.type && concept.schema != 'global' && concept.constraint_name === this.constraint_name).
            forEach(function (concept) {
                same_constraints_result.push({ id: concept.id, same_constraint: 1 });
            });
        return same_constraints_result;
    }

    this.fuzzy_search = function () {
        const options = {
            // isCaseSensitive: false,
            includeScore: true,
            // shouldSort: true,
            // includeMatches: false,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            //threshold: 0.3,
            // distance: 100,
            // useExtendedSearch: false,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            keys: [
                "refined_local_name"
            ]
        };
        const fuse = new Fuse(this.conceptList_to_JSON(), options);

        //transform JSON into Array
        var fuzzy_result = [];
        let fuzzy_result_JSON = fuse.search(this.refined_local_name);

        for (let i = 0; i < fuzzy_result_JSON.length; i++) {
            fuzzy_result.push({ id: fuzzy_result_JSON[i].item.id, fuzzy_score: round10((1 - fuzzy_result_JSON[i].score), -4) });
        }

        return fuzzy_result;
    }

    this.attributelocalconceptfinder = function (bool_tab_score) {
        //compare synonyms arrays
        let synonyms_result = this.compare_similar_synonyms();

        //compary names by fuzzy logic
        let fuzzy_result = this.fuzzy_search();
        var union = synonyms_result.union_results(fuzzy_result);

        //same datatypes
        let same_datatypes = this.get_same_datatypes();
        union = union.union_results(same_datatypes);

        //same constraints
        let same_constraints = this.get_same_constraints();
        union = union.union_results(same_constraints);

        //retrive all table parent_ids and their table matching score
        let parent_ids = this.get_table_score(bool_tab_score);
        union = union.union_results(parent_ids);

        //console.log(union);

        //calculate score attributes
        union.forEach(function (row) {
            if (row.synonyms_num_score === undefined || isNaN(row.synonyms_num_score)) {
                row.synonyms_num_score = 0;
                row.synonyms_score = 0;
            }
            if (row.fuzzy_score === undefined || isNaN(row.fuzzy_score)) {
                row.fuzzy_score = 0;
            }
            if (row.same_datatype === undefined) {
                row.same_datatype = 0;
            }
            if (row.same_constraint === undefined) {
                row.same_constraint = 0;
            }

            row.total_score_attribute = round10(row.synonyms_num_score + row.fuzzy_score + row.same_datatype + row.same_constraint, -4);
            row.total_score = round10(row.total_score_attribute + row.total_score_table, -4);

        });

        //sort array total_score descending
        union.sort(function (a, b) {
            return b.total_score - a.total_score;
        });

        return union;
    }

    this.tablelocalconceptfinder = function () {
        //compare synonyms arrays
        let synonyms_result = this.compare_similar_synonyms();

        //compary names by fuzzy logic
        let fuzzy_result = this.fuzzy_search();
        var union = synonyms_result.union_results(fuzzy_result);

        //#attributes 
        let number_attributes_result = this.compare_number_attributes();
        union = union.union_results(number_attributes_result);

        //#foreignkeys
        let number_foreignkeys_result = this.compare_number_foreignkeys();
        union = union.union_results(number_foreignkeys_result);

        //#datatypes
        let number_same_datatypes = this.compare_datatypes();
        union = union.union_results(number_same_datatypes);

        //retrive all coressponding sum (highest attribute scores)
        let total_score_attributes = this.get_attributes_score();
        union = union.union_results(total_score_attributes);

        //calculate score tables

        union.forEach(function (row) {
            if (row.synonyms_num_score === undefined || isNaN(row.synonyms_num_score)) {
                row.synonyms_num_score = 0
                row.synonyms_score = 0
            }
            if (row.fuzzy_score === undefined || isNaN(row.fuzzy_score)) {
                row.fuzzy_score = 0
            }
            if (row.compare_datatypes_num_score === undefined || isNaN(row.compare_datatypes_num_score)) {
                row.compare_datatypes_num_score = 0
            }
            if (row.total_score_attribute === undefined || isNaN(row.total_score_attribute)) {
                row.total_score_attribute = 0
            }
            row.total_score_table = round10(row.synonyms_num_score + row.fuzzy_score + row.compare_datatypes_num_score, -4);
            row.total_score = round10(row.total_score_table + row.total_score_attribute, -4);
        });

        //sort array total_score descending
        union.sort(function (a, b) {
            return b.total_score - a.total_score;
        });

        return union;
    }

    this.get_constraint_concept = function () {
        return conceptList.find(concept => concept.id === this.constraint_ref_id);
    }

    this.get_parent_concept = function () {
        return conceptList.find(concept => concept.id === this.parent_id);
    }

    this.get_all_children_concepts = function () {
        return conceptList.filter(concept => concept.parent_id === this.id);
    }

    this.get_schema_concept = function () {
        if (this.type === 'schema') { return this; }
        else if (this.type === 'table') { return this.get_parent_concept(); }
        else if (this.type === 'attribute') { return this.get_parent_concept().get_parent_concept(); }
    }

    this.get_table_concept = function () {
        if (this.type === 'schema') { return this; }
        else if (this.type === 'table') { return this; }
        else if (this.type === 'attribute') { return this.get_parent_concept(); }
    }

    this.add_child_concept = function (child_concept_name, attr_data_type) {
        if (this.type === 'attribute') {
            console.log('Can not add child concept of attribute')
        } else {
            new_child = new concept(child_concept_name, this.id, attr_data_type);
            return new_child;
        };
    }

    this.get_drawn_concept = function () {
        return d3.select("#" + this.id);
    }

    this.get_drawn_concept_position = function () {
        var position = d3.select("#" + this.id).attr('transform').replace(/[^0-9\-.,]/g, '').split(',');
        return new Array(parseInt(position[0]), parseInt(position[1]));
    }

    this.get_drawn_paths = function () {
        let concept = this;
        return d3.selectAll("path").filter(function (e) { return d3.select(e).attr("data-pathend") == concept.id });
        // && d3.select(e).attr("data-pathstart") == concept.id });
    }

    this.set_drawn_concept_text = function (new_description) {
        d3.select("#" + this.id).select("text").text(new_description);
    }

    this.check_constraint_color = function () {
        if (this.constraint_name === 'PRIMARY KEY') {
            d3.select("#" + this.id).select("rect").attr("fill", "#D4AC0D");
        }
        else if (this.constraint_name === 'FOREIGN KEY') {
            d3.select("#" + this.id).select("rect").attr("fill", "#5D6D7E");
        } else {
            d3.select("#" + this.id).select("rect").attr("fill", pSBC(0.3, this.get_schema_concept().color));
        }
    }

    this.update_conceptmeta = function () {
        if (this.schema === "global") {
            $("#globalconceptmeta").removeClass("invisible");

            // find and list concepts connected with global concept
            $("#globalrel1").empty();
            $("#globalrel2").empty();
            $("#globalrel3").empty();

            conceptList.filter(conceptsConnected => conceptsConnected.global_id.includes(this.id) && conceptsConnected.schema === 'SCHEMA1').
                forEach(conceptObj => $("#globalrel1").append('<li class="list-group-item"><span class="name">' + conceptObj.name + '</span><button type="button" class="removeglobalconceptbtn btn-close float-end" data-conceptid="' + conceptObj.id + '" aria-label="Close"></button></li>'));

            conceptList.filter(conceptsConnected => conceptsConnected.global_id.includes(this.id) && conceptsConnected.schema === 'SCHEMA2').
                forEach(conceptObj => $("#globalrel2").append('<li class="list-group-item"><span class="name">' + conceptObj.name + '</span><button type="button" class="removeglobalconceptbtn btn-close float-end" data-conceptid="' + conceptObj.id + '" aria-label="Close"></button></li>'));

            conceptList.filter(conceptsConnected => conceptsConnected.global_id.includes(this.id) && conceptsConnected.schema === 'SCHEMA3').
                forEach(conceptObj => $("#globalrel3").append('<li class="list-group-item"><span class="name">' + conceptObj.name + '</span><button type="button" class="removeglobalconceptbtn btn-close float-end" data-conceptid="' + conceptObj.id + '" aria-label="Close"></button></li>'));


            if (this.type === "attribute") {
                $("#conceptdatatype").prop("disabled", false);
                $("#conceptname").prop("disabled", false);
                $("#conceptconstraint").prop("disabled", false);
            } else {
                $("#conceptdatatype").prop("disabled", true);
                $("#conceptconstraint").prop("disabled", true);
                $("#conceptname").prop("disabled", false);
            }
        } else {
            $("#globalconceptmeta").addClass("invisible");
            $("#conceptname").prop("disabled", true);
            $("#conceptdatatype").prop("disabled", true);
            $("#conceptconstraint").prop("disabled", true);
        };

        //fill conceptmeta
        $("#conceptid").val(this.id);
        $("#conceptname").val(this.name);
        $("#concepttype").val(this.type);
        $("#conceptdatatype").val(this.data_type);
        $("#conceptconstraint").val(this.constraint_name);
        $("#conceptschemasource").val(this.schema);
        $("#concepttablesource").val((this.type === 'attribute') ? this.parent_name : '');

        feather.replace();
    };

    this.draw_concept = function (iv_svg) {
        let fontWeight = 400;
        let fontStyle = "normal";
        let strokeWidth = 2; //latex
        if (this.schema === 'global') { strokeWidth = 5; }; //latex

        if (this.type === 'schema') { return; }
        else if (this.type === 'table') {
            //position of table
            var positionXY = newTableConceptPosition();
            var color = this.get_schema_concept().color;
        }
        else if (this.type === 'attribute') {
            //position of attribute
            var parentPositionX = this.get_parent_concept().get_drawn_concept_position()[0];
            var parentPositionY = this.get_parent_concept().get_drawn_concept_position()[1];
            var positionXY = newColumnConceptPosition([parentPositionX, parentPositionY]);

            if (this.constraint_name === 'PRIMARY KEY') {
                //color = "#D4AC0D"; //latex
                fontWeight = 900;
            }
            else if (this.constraint_name === 'FOREIGN KEY') {
                //color = "#5D6D7E"; //latex
                fontStyle = "italic";
            }
            //else { //latex
            color = pSBC(0.3, this.get_schema_concept().color);
            //} //latex
            //predraw path to parent
            svg.append("path")
                .attr("id", this.parent_id + "pathTo" + this.id)
                .attr("d", "M" + (parentPositionX + 100) + "," + (parentPositionY + 50) + "L" + (positionXY[0] + 100) + "," + (positionXY[1] + 50))
                .attr('stroke', 'rgb(79, 80, 80)')
                .attr('fill', 'none')
                .attr("class", "arrow tabtoattr")
                .attr("data-pathstart", this.parent_id)
                .attr("data-pathend", this.id);
        };

        // Dummy conceptG Element
        var g = iv_svg.append("g")
            .attr("id", this.id)
            .attr("class", "conceptG")
            .attr("transform", "translate(" + positionXY[0] + "," + positionXY[1] + ")");

        if (this.type === 'attribute') {
            var rect = g.append("rect")
                .attr("class", "")
                .attr("width", "200")
                .attr("height", "50")
                .attr("fill", color)
                .attr("stroke-width", strokeWidth)
                .attr("stroke", "#000000")
                .attr("rx", "20")
                .attr("ry", "20");
        } else {
            var rect = g.append("rect")
                .attr("class", "")
                .attr("width", "200")
                .attr("height", "50")
                .attr("fill", color)
                .attr("stroke-width", strokeWidth)
                .attr("stroke", "#000000");
        };

        var text = g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "25")
            .attr("dx", "100")
            .attr("font-family", "Verdana")
            .attr("font-size", "12")
            .attr("font-style", fontStyle)
            .attr("font-weight", fontWeight)
            .attr("fill", "white")
            .attr("rx", "20")
            .attr("rx", "20")
            .text(this.name);


        this.is_drawn = true;

        //bind events
        g.call(bindGOnMouseoverHandler);
        g.call(bindGOnMouseoutHandler);
        g.call(bindGOnClickHandler);
        dragHandler(g); // bind event on drag on g
    }

    conceptList.push(this);
};

window.concept_id_to_concept = function (id) {
    return conceptList.find(concept => concept.id === id);
}

window.get_all_global_table_concepts = function () {
    return conceptList.filter(concept => concept.schema === 'global' && concept.type === 'table' && concept.name != 'global');
}

window.get_all_schemata_concepts = function () {
    return conceptList.filter(concept => concept.type === 'schema' && concept.name != 'global');
}

var drawn_concept_to_concept = function (drawn_concept) {
    return conceptList.find(concept => concept.id === d3.select(drawn_concept).attr('id'));
};


//MAKING COLORS LIGHTER
var pSBC = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        } return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
};

// EVENTHANDLERS + EVENTS FOR conceptG ELEMENTS 

const bindGOnMouseoverHandler = function (elem) {
    elem.on("mouseover", function () {
        d3.select(this).select("rect").attr("class", "hoverRect");
    });
};

const bindGOnMouseoutHandler = function (elem) {
    elem.on("mouseout", function () {
        d3.select(this).select("rect").attr("class", "");
    });
};

const bindGOnClickHandler = function (elem) {

    elem.on("click", function (e) {
        var clicked_concept = drawn_concept_to_concept(this);
        e.preventDefault()
        e.stopPropagation();

        //Click --> Concept View 
        clicked_concept.update_conceptmeta();

        //public variables neccesarry to calculate whethere the mouse has moved further away from clicked concept
        gInitialClickCordinates[0] = parseInt(d3.pointer(e)[0]);
        gInitialClickCordinates[1] = parseInt(d3.pointer(e)[1]);

        // Click + altKey --> Delete concept
        if (e.altKey) {
            elem.transition()
                .duration(500)
                .attr("transform", elem.attr("transform") + "scale(0)")
                .remove();
        }
        // Click + shiftKey --> initialize new path
        if (e.shiftKey) {
            //set global to local relationship only allowed for global elements
            if (clicked_concept.schema === "global") {
                newPath = true;
                var transformPos = d3.select(this).attr('transform').replace(/[^0-9\-.,]/g, '').split(',');
                var transformPosX = parseInt(transformPos[0]);
                var transformPosY = parseInt(transformPos[1]);

                path.classed("invisible", false) //remove invisible class
                    .attr("data-pathstart", d3.select(this).attr("id"))
                    .attr("d", "M" + (transformPosX + 100) + "," + (transformPosY + 25) + "L" + (transformPosX + 100) + "," + (transformPosY + 100));
            }
        }
        // Click on other concept to connect path
        if (newPath && newPathMouseMoved) {
            path.attr("data-pathend", d3.select(this).attr("id"));

            concept_id_to_concept(path.attr("data-pathend")).set_global_concept(path.attr("data-pathstart"));

            //initialize wa_path
            newPath = false;
            path.classed("invisible", true)
                .attr("data-pathend", "NULL")
                .attr("data-pathstart", "NULL");

            newPathMouseMoved = false;
        }
    });
};

// conceptG drag event
var dragHandler = d3.drag()
    .on("drag", function (e) {
        var dragG = d3.select(this)
            .attr('transform', 'translate(' + (e.x - 100) + ',' + (e.y - 25) + ')');

        //any paths are dragged to
        var transformPos = d3.select(this).attr('transform').replace(/[^0-9\-.,]/g, '').split(',');
        var transformPosX = parseInt(transformPos[0]);
        var transformPosY = parseInt(transformPos[1]);

        //path selector with filter condition on draged conceptG and data-pathstart
        d3.selectAll("path").filter(function () { return d3.select(this).attr("data-pathstart") == dragG.attr("id") })
            .each(function (d, i) {
                d3.select(this).attr("d", "M" + (transformPosX + 100) + "," + (transformPosY + 50) + "L" + d3.select(this).attr("d").split('L')[1]);
            });

        //path selector with filter condition on draged conceptG and data-pathend
        d3.selectAll("path").filter(function () { return d3.select(this).attr("data-pathend") == dragG.attr("id") })
            .each(function (d, i) {
                d3.select(this).attr("d", d3.select(this).attr("d").split('L')[0] + "L" + (transformPosX + 100) + "," + (transformPosY + 50));
            });

    })
    //.on("end", function(e){})
    ;





