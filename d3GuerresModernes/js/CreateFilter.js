var filtersNumber = 0;

function getUniqueList(data,variable){
	var uniqueList = d3.nest()
  .key(function(d) { return d[variable]; })
  .entries(data)
  .sort(function (a,b) {return d3.ascending(a.key, b.key);})
  .map(function(entry) { return entry.values[0]; });
  return uniqueList;
}

function appendFilter(htmlNode,formType, data, variable){
	switch(formType){
		case "rangeFilter":
			return appendRangeFilter(htmlNode,data,variable);
			break;
		case "listFilter":
			return appendListFilter(htmlNode,data,variable);
			break;
		case "checkBoxFilter":
			return appendCheckboxFilter(htmlNode,data,variable);
			break;
		case "buttonGroupFilter":
			return appendButtonGroupFilter(htmlNode,data,variable);
			break;
	}
}

function appendRangeFilter(htmlNode,data,variable){
	filtersNumber= filtersNumber+1;
	htmlNode.append("div")
	.attr("id","filterForm"+filtersNumber)
	.attr("class","filterForm")
	.attr("type","text")
	.attr("data-type","rangeFilter")
	.attr("data-variable",variable)
	.attr("data-value-start",d3.min(data,function(d){return d[variable]}))
	.attr("data-value-end",d3.max(data,function(d){return d[variable]}))

	var p = htmlNode.append("p")
	.append("label")
	.attr("for","filterForm"+filtersNumber+"input")
	.text("Range :")

	 p.append("input")
	.attr("type","text")
	.attr("id","filterForm"+filtersNumber+"input")
	.attr("readonly","")
	.attr("style","border:0; color:#f6931f; font-weight:bold;")

	var input=$( "#filterForm"+filtersNumber+"input" );
	var filterForm=$("#filterForm"+filtersNumber)
	console.log(d3.min(data,function(d){return d[variable]}));
	console.log(d3.max(data,function(d){return d[variable]}));

	$( "#filterForm"+filtersNumber ).slider({
      range: true,
      min: d3.min(data,function(d){return parseInt(d[variable])}),
      max: d3.max(data,function(d){return parseInt(d[variable])}),
      values: [ d3.min(data,function(d){return d[variable]}), d3.max(data,function(d){return d[variable]}) ],
      slide: function( event, ui ) {
      	console.log("kikou")
        input.val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        console.log("kikou1")
        filterForm.attr("data-value-start",ui.values[0]);
        console.log("kikou2")
        filterForm.attr("data-value-end",ui.values[1]);
        console.log("kikou3")
        filter(data);
      }
    });

    $( "#filterForm"+filtersNumber+"input" ).val( "" + $( "#filterForm"+filtersNumber ).slider( "values", 0 ) +
      " - " + $( "#filterForm"+filtersNumber ).slider( "values", 1 ) );
}

function appendListFilter(htmlNode,data,variable){
	filtersNumber= filtersNumber+1;
	var uniqueList = getUniqueList(data,variable);

  var select = htmlNode.append("select")
  .attr("id","filterForm"+filtersNumber)
  .attr("data-type","listFilter")
  .attr("data-variable",variable)

  var option = select
  .selectAll("option")
  .data(uniqueList)
  .enter()
  .append("option")
  .attr("data-value",function(d){return d[variable]})


  select.insert("option",":first-child").attr("data-value","").text("Tous les lieux")

  option
  .text(function(d){return d[variable]})

  $("#filterForm"+filtersNumber).change(function(){filter(data)})
}

function appendCheckboxFilter(htmlNode,data,variable){
	filtersNumber = filtersNumber+1;
	var uniqueList= getUniqueList(data,variable);
	var form = htmlNode.append("form")
	.attr("id","filterForm"+filtersNumber)
  	.attr("data-type","checkBoxFilter")
  	.attr("data-variable",variable)

  	var span = form
  	.selectAll("span")
  	.data(uniqueList)
  	.enter()
  	.append("span")
  	.attr("data-value",function(d){ return d[variable]})

  	span
  	.append("input")
  	.attr("type","checkBox")
  	.attr("id",function(d,i){return 'checkBox'+i})
  	.attr("class","checkBoxFilter")
  	.attr("checked","")

  	var label = span
	.append("label")
	.attr("for",function(d,i){return 'checkBox'+i})
	.text(function(d){return d[variable]})

	$('.checkBoxFilter').change(function(){
    filter(data);
  })
}

function appendButtonGroupFilter(htmlNode,data,variable){
	filtersNumber = filtersNumber+1;
	var uniqueList = getUniqueList(data,variable);
	var buttonGroup= htmlNode.append("ul")
	.attr("id","filterForm"+filtersNumber)
  	.attr("data-type","buttonGroupFilter")
  	.attr("data-variable",variable)
  	.attr("class","button-group")

  	var li= buttonGroup
  	.selectAll("li")
  	.data(uniqueList)
  	.enter()
  	.append("li")
  	.attr("class",function(d){return "buttonFilter"})
  	.append("a")
  	.attr("data-value",function(d){ return d[variable]})
  	.on("click",function(d){console.log($(this).parent().parent().find($(".button")).attr("class","button")); $(this).attr("class","button active");filter(data)})
  	.attr("class","button")
  	.append("span")
  	.text(function(d){return d[variable]})
}

function filter(initialData){
	var dataFilter= initialData;
	for(var i=1;i<=filtersNumber;i++){
		switch($("#filterForm"+i).attr("data-type")){
			case  "rangeFilter":
				dataFilter = rangeFilter($("#filterForm"+i),dataFilter);
				break;
			case "checkBoxFilter" :
				dataFilter = checkBoxFilter($("#filterForm"+i),dataFilter);
				break;
			case "listFilter" :
				dataFilter =listFilter($("#filterForm"+i),dataFilter);
				break;
			case "buttonGroupFilter" :
				dataFilter =buttonGroupFilter($("#filterForm"+i),dataFilter);
				break;
		}
	}
	drawSVG(dataFilter);
}

function rangeFilter(filterForm,data){
	var variable = filterForm.attr("data-variable");
	data= data.filter(function(d){return d[variable] >= filterForm.attr("data-value-start") && d[variable] <= filterForm.attr("data-value-end")});
return data;
}

function checkBoxFilter(filterForm,data){
	var variable = filterForm.attr("data-variable");
	filterForm.find("input").each(function(){
	    var checkboxValue=this.__data__[variable];
	    !this.checked ? data = data.filter(function(d){
	        return d[variable]!==checkboxValue;
	    }):data=data;
  	})
	return data;
}

function listFilter(filterForm,data){
	var variable = filterForm.attr("data-variable");
	var selected = filterForm.find(":selected").attr("data-value");
	data = data.filter(function(d){return d[variable].match(selected)})
	return data;
}

function buttonGroupFilter(filterForm,data){
	var variable = filterForm.attr("data-variable");
	var selected = filterForm.find(".active").attr("data-value");
	data = data.filter(function(d){return d[variable].match(selected)})
	return data;
}