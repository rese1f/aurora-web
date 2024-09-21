function cases() {
    var static_width = 700;
    var margin = {top: 30, right: 0, bottom: 10, left: 0};
    var image_size_width = static_width - margin.left - margin.right;

    var indicator_image_size = 60;
    var indicator_image_padding = 10;

    var base_dir = 'assets/vid/cases/';
    
    var indicator_data = [
        { id: 'case_1', opacity: 1.0, title: 'case 1'},
        { id: 'case_2', opacity: 0.2, title: 'case 2'},
        { id: 'case_3', opacity: 0.2, title: 'case 3'},
    ];

    var container = d3.select('#cases_div')
        .append('svg')
        .attr('width', static_width)
        .attr('id', 'case_svg');

    var video_overlay = d3.select('#video_overlay');

    var indicator_group = container
        .append('g')
        .attr('id', 'indicator_group');

    function updateContainerHeight(height) {
        var total_height = height + margin.top + margin.bottom + indicator_image_size + 20;
        container
            .attr('height', total_height)
            .attr('viewBox', `0 0 ${static_width} ${total_height}`);
        
        indicator_group
            .attr('transform', `translate(${margin.left}, ${height + margin.top + 20})`);
    }

    function image_init() {
        // Main video
        video_overlay.append('video')
            .attr('id', 'display_image_fig1')
            .attr('width', image_size_width)
            .attr('controls', true)
            .append('source')
            .attr('type', 'video/mp4');

        // Title
        video_overlay.append('div')
            .attr('id', 'display_image_fig1_title')
            .style('text-align', 'center')
            .style('font-weight', 'bold')
            .style('margin-top', '10px');

        // Indicator videos
        indicator_group.selectAll('foreignObject')
            .data(indicator_data)
            .enter()
            .append('foreignObject')
            .attr('width', indicator_image_size)
            .attr('height', indicator_image_size)
            .attr('x', (d, i) => i * (indicator_image_size + indicator_image_padding))
            .attr('y', 0)
            .attr('opacity', d => d.opacity)
            .each(function(d) {
                d3.select(this)
                    .append('xhtml:video')
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('muted', true)
                    .attr('loop', true)
                    .attr('playsinline', true)
                    .append('source')
                    .attr('src', `${base_dir}${d.id}.mp4`)
                    .attr('type', 'video/mp4');
            })
            .on('click', select_new_video);

        // Initialize with the first video
        select_new_video(null, indicator_data[0]);
    }

    function select_new_video(event, d) {
        indicator_group.selectAll('foreignObject')
            .attr('opacity', item => item.id === d.id ? 1.0 : 0.2);
        
        var video = d3.select('#display_image_fig1');
        var source = video.select('source');
        
        source.attr('src', `${base_dir}${d.id}.mp4`);
        
        video.node().load(); // Force the video to load
        
        d3.select('#display_image_fig1_title')
            .text(d.title);

        video.on('loadedmetadata', function() {
            var aspect_ratio = this.videoHeight / this.videoWidth;
            var new_height = image_size_width * aspect_ratio;
            
            video.attr('height', new_height);
            
            updateContainerHeight(new_height);
        });

        // Play all indicator videos
        indicator_group.selectAll('video').each(function() {
            this.play().catch(e => console.log("Autoplay prevented:", e));
        });
    }

    image_init();
}

document.addEventListener('DOMContentLoaded', cases);