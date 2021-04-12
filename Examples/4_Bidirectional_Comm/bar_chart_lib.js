function bar_chart(div_id, data_dict){
    const data = data_dict.array;
    const div = d3.select(div_id)
    const height = data.length * 20;
    
    const scaleY = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeRoundBands([0, height], .1);
    const scaleX = d3.scale.linear()
        .domain(d3.extent(data))
        .range([1, 120]);
    
    const svg = div.append("svg")
        .style("width", "120px")
        .style("height", height+"px");
    
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => scaleY(i))
        .attr("width", d => scaleX(d))
        .attr("height", scaleY.rangeBand());
}
