// moveable circle
var clickingCircle = false;
$(".circle").mousedown(function (e) {
	e.preventDefault()
	e.stopPropagation();
	clickingCircle = true;
	clickingViewbox = false;
	var clickedPosX = e.clientX;
	var clickedPosY = e.clientY;
	var circleX = parseInt($(this).attr('cx'));
	var circleY = parseInt($(this).attr('cy'));

	$(".circle").mousemove(function (e) {
		e.preventDefault()
		e.stopPropagation();
		if (clickingCircle == false) return;
		var movedPosX = e.clientX;
		var movedPosY = e.clientY;
		var newX = circleX + (movedPosX - clickedPosX);
		var newY = circleY + (movedPosY - clickedPosY);
		$('#schema1svg').removeAttr('cx', 'cy');
		$(this).attr('cx', newX);
		$(this).attr('cy', newY);
		console.log(newX + ' ' + newY);
	});

});
$(".circle").on('mouseover', function (e) {
	$(this).attr('stroke-width', 8);
});

$(".circle").mouseleave(function (e) {
	clickingViewbox = false;
	clickingCircle = false;
	$(this).attr('stroke-width', 4);
});

//moveable conceptG
var clickingConceptG = false;
$(".conceptG").on('mousedown', function (e) {
	e.preventDefault()
	e.stopPropagation();
	clickingViewbox = false;
	clickingConceptG = true;
	var clickedPosX = e.clientX;
	var clickedPosY = e.clientY;

	var transformPos = d3.select(this).attr('transform').replace(/[^0-9\-.,]/g, '').split(',');
	var transformPosX = parseInt(transformPos[0]);
	var transformPosY = parseInt(transformPos[1]);
	console.log(transformPosX);

	$(this).on('mousemove', function (e) {
		e.preventDefault()
		e.stopPropagation();
		if (clickingConceptG == false) return;
		var movedPosX = e.clientX;
		var movedPosY = e.clientY;
		var newX = transformPosX + (movedPosX - clickedPosX);
		var newY = transformPosY + (movedPosY - clickedPosY);
		$(this).removeAttr('transform');
		$(this).attr('transform', 'translate(' + newX + ',' + newY + ')');
	});
});
$(".conceptG").on('mouseover', function (e) {
	$(this).children("rect").removeClass('rectPassive');
	$(this).children("rect").addClass('rectActive');
});

$(".conceptG").mouseleave(function (e) {
	clickingViewbox = false;
	clickingConceptG = false;
	$(this).children("rect").removeClass('rectActive');
	$(this).children("rect").addClass('rectPassive');
});

$.fn.drawSchema = function (iv_xml, iv_id) {
	//Parse the givn XML
	var xmlDoc = $.parseXML(iv_xml);
	var $xml = $(xmlDoc);

	// Find table Name
	var $table = $xml.find("TABLE");

	$table.each(function () {

		var tableid = $(this).find('NAME').first().text();
		$("#schema" + iv_id).append('<ul id="' + tableid + iv_id + '" class="list-group"><li class="list-group-item list-group-item-success"> ' + tableid + '</li></ul>');

		// Find first Tag COL_LIST --> all columns of table
		var $column = $(this).find("COL_LIST").first().children("COL_LIST_ITEM");

		$column.each(function () {
			$("#" + tableid + iv_id).append('<li class="list-group-item">' + $(this).find('NAME').text() + ' : ' + $(this).find('DATATYPE').text() + '</li>');

		});
	});
}

// create new conceptG on click TODO
svg.on("clickTMP", function () {
	var mouse = d3.pointer(event);

	var rect = svg.append("rect")
		.attr("class", "rectPassive")
		.attr("x", mouse[0])
		.attr("y", mouse[1])
		.attr("rx", "20")
		.attr("ry", "20")
		.attr("width", "200")
		.attr("height", "50");
});
/* 
<body>
<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
	<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
	<label class="btn btn-outline-primary" for="btnradio1">IS</label>
  
	<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
	<label class="btn btn-outline-primary" for="btnradio2">F</label>
</div>
</body>
*/

$.fn.drawXML = function (iv_xml, iv_id) {
	//Parse the given XML
	var xmlDoc = $.parseXML(iv_xml);
	var $xml = $(xmlDoc);

	// Find table Name
	var $table = $xml.find("TABLE");


	$table.each(function () {

		var tablename = $(this).find('NAME').first().text();

		var newTableConceptXY = newTableConceptPosition();

		var g = svg.append("g")
			.attr("id", tablename)
			.attr("data-type", "table")
			.attr("data-datatype", "")
			.attr("data-belongsToTable", "")
			.attr("data-belongsToSchema", iv_id)
			.attr("class", "conceptG")
			.attr("transform", "translate(" + newTableConceptXY[0] + "," + newTableConceptXY[1] + ")");

		var gtab = g;

		var rect = g.append("rect")
			.attr("class", "")
			.attr("rx", "20")
			.attr("ry", "20")
			.attr("width", "200")
			.attr("height", "50")
			.attr("fill", $("#colorpickermodal" + iv_id).css("color"))
			.attr("stroke-width", "2")
			.attr("stroke", "#000000");

		var text = g.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "25")
			.attr("dx", "100")
			.attr("font-family", "Verdana")
			.attr("font-size", "12")
			.attr("fill", "white")
			.attr("rx", "20")
			.attr("rx", "20")
			.text(tablename);


		//Find first Tag COL_LIST --> all columns of table
		var $column = $(this).find("COL_LIST").first().children("COL_LIST_ITEM");

		$column.each(function () {

			var columnname = $(this).find('NAME').first().text();
			var columndatatype = $(this).find('DATATYPE').first().text();

			var newColumnConceptXY = newColumnConceptPosition(newTableConceptXY);

			var g = svg.append("g")
				.attr("id", columnname + "belongsTo" + tablename)
				.attr("data-type", "column")
				.attr("data-datatype", columndatatype)
				.attr("data-belongsToTable", tablename)
				.attr("data-belongsToSchema", iv_id)
				.attr("class", "conceptG column")
				.attr("transform", "translate(" + newColumnConceptXY[0] + "," + newColumnConceptXY[1] + ")");

			var rect = g.append("rect")
				.attr("class", "")
				.attr("rx", "20")
				.attr("ry", "20")
				.attr("width", "200")
				.attr("height", "50")
				.attr("fill", pSBC(0.3, $("#colorpickermodal" + iv_id).css("color")))
				.attr("stroke-width", "2")
				.attr("stroke", "#000000");

			var text = g.append("text")
				.attr("text-anchor", "middle")
				.attr("dy", "25")
				.attr("dx", "100")
				.attr("font-family", "Verdana")
				.attr("font-size", "12")
				.attr("fill", "white")
				.attr("rx", "20")
				.attr("rx", "20")
				.text(columnname);

			svg.append("path")
				.attr("id", gtab.attr("id") + "pathTo" + g.attr("id"))
				.attr("d", "M" + (newTableConceptXY[0] + 100) + "," + (newTableConceptXY[1] + 50) + "L" + (newColumnConceptXY[0] + 100) + "," + (newColumnConceptXY[1] + 50))
				.attr('stroke', 'rgb(79, 80, 80)')
				.attr('fill', 'none')
				.attr("class", "arrow")
				.attr("data-pathstart", gtab.attr("id"))
				.attr("data-pathend", g.attr("id"));


			//bind events
			g.call(bindGOnMouseoverHandler);
			g.call(bindGOnMouseoutHandler);
			g.call(bindGOnClickHandler);
			dragHandler(g); // bind event on drag on g


		});
		//bind events
		g.call(bindGOnMouseoverHandler);
		g.call(bindGOnMouseoutHandler);
		g.call(bindGOnClickHandler);
		dragHandler(g); // bind event on drag on g	
	});
};

//<!-- sortable elements for canonicalrel -->
//<script src="https://cdn.jsdelivr.net/gh/RubaXa/Sortable/Sortable.min.js"></script>
//<script>
//	Sortable.create(canonicalrel1, { animation: 100, group: 'list-1', draggable: '.list-group-item', handle: '.list-group-item', sort: true, filter: '.sortable-disabled', chosenClass: 'active' });
//	Sortable.create(canonicalrel2, { animation: 100, group: 'list-1', draggable: '.list-group-item', handle: '.list-group-item', sort: true, filter: '.sortable-disabled', chosenClass: 'active' });
//</script>