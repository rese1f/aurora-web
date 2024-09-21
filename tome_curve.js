function tome_curve() {
    var parentWidth = d3.select('#tome_div').node().getBoundingClientRect().width;
    
    var margin = {top: 15, right: 0, bottom: 10, left: 0};
    var image_size_width = parentWidth - margin.left - margin.right;
    var image_size_height = (image_size_width * 200) / 320; // Maintain aspect ratio

    var indicator_image_size = 30;
    var indicator_image_padding = 5;

    var base_dir = 'static/img/tome_curve/';
    
    var image_data = [
        { id: 'display_image_fig1', title: 'What is the instrument held by an ape?'},
    ];

    var indicator_data = [
        { id: 'tome_vdc', opacity: 1.0, question: 'What is the instrument held by an ape?'},
        { id: 'tome_image', opacity: 0.2, question: 'What animal is drawn on that red signicade?'},
        { id: 'tome_video', opacity: 0.2, question: 'At which conference did someone get that black mug?'},
    ];

    var container = d3.select('#tome_div')
        .append('svg')
        .attr('width', '100%')
        .attr('height', image_size_height + margin.top + margin.bottom + indicator_image_size + 10)
        .attr('viewBox', `0 0 ${image_size_width} ${image_size_height + margin.top + margin.bottom + indicator_image_size + 10}`);

    var image_group = container
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    var indicator_group = container
        .append('g')
        .attr('transform', `translate(${margin.left}, ${image_size_height + margin.top + 10})`);

    function image_init() {
        // Main image
        image_group.selectAll('image')
            .data(image_data)
            .enter()
            .append('image')
            .attr('width', image_size_width)
            .attr('height', image_size_height)
            .attr('xlink:href', base_dir + 'tome_vdc.png')
            .attr('id', d => d.id)
            .attr('x', 0)
            .attr('y', 0);

        // Question text
        image_group.selectAll('text')
            .data(image_data)
            .enter()
            .append('text')
            .attr('id', d => d.id + '_title')
            .style("text-anchor", "middle")
            .style("font-weight", 700)
            .style('font-size', '14px')
            .text(d => d.title)
            .attr('x', image_size_width / 2)
            .attr('y', -5);

        // Indicator images
        indicator_group.selectAll('image')
            .data(indicator_data)
            .enter()
            .append('image')
            .attr('width', indicator_image_size)
            .attr('height', indicator_image_size)
            .attr('xlink:href', d => `${base_dir}${d.id}.png`)
            .attr('id', d => d.id + '_fig1')
            .attr('x', (d, i) => i * (indicator_image_size + indicator_image_padding))
            .attr('y', 0)
            .attr('opacity', d => d.opacity)
            .on('click', select_new_image);
    }

    function select_new_image(event, d) {
        indicator_group.selectAll('image')
            .attr('opacity', item => item.id === d.id ? 1.0 : 0.2);
        
        image_group.select('#display_image_fig1')
            .attr('xlink:href', `${base_dir}${d.id}.png`);
        
        image_group.select('#display_image_fig1_title')
            .text('Question: ' + d.question);
    }

    image_init();
}

document.addEventListener('DOMContentLoaded', tome_curve);