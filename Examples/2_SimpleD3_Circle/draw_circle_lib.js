function draw_circle(id, data){
    d3.select(id)
    .append("div")
    .style("width", "50px")
    .style("height", "50px")
    .style("background-color", data.color)
    .style("border-radius", "50px")
}