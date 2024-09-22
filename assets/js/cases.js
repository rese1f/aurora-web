function cases() {
    var static_width = 700;
    var margin = {top: 30, right: 0, bottom: 10, left: 0};
    var image_size_width = static_width - margin.left - margin.right;

    var indicator_image_size = 132;
    var indicator_image_padding = 10;

    var base_dir = 'assets/vid/cases/';
    
    var indicator_data = [
        { id: 'case_1', opacity: 1.0, fontSize: '0.75em', title: '[Detailed Caption] The video depicts a serene beach scene where a young woman stands on the sandy shore, gazing out towards the ocean. She is wearing a black beanie and a pink jacket, adding a pop of color to the otherwise muted scene. The beach, a vast expanse of sand, stretches out in front of her, meeting the ocean at the horizon. The ocean, a vast body of water, is visible in the background. The beach is bathed in a soft, diffused light, creating a dreamy atmosphere. The girls gaze is directed towards the horizon, suggesting a sense of wonder or contemplation. The image is slightly blurred, adding a dreamy quality to the scene. The womans position on the beach, coupled with the gentle waves of the ocean, suggests a moment of contemplation or admiration. The relative positions of the objects suggest a peaceful day at the beach, with the girl possibly enjoying the serene view of the ocean. The colors are mostly muted, with the girls pink jacket standing out against the sandy beach and the blue ocean. The blurred background and the out-of-focus elements, such as the ocean and the sky, contribute to the sense of tranquility and focus on the woman. There is no text present in the video, and the colors are muted, with the exception of the pink jacket, which stands out against the more subdued tones of the surroundings.'},
        { id: 'case_2', opacity: 0.2, fontSize: '0.75em', title: '[Detailed Caption] The video features a man with a beard and long hair, lying on the ground with his head resting on a tree trunk. He is wearing a colorful shirt with a mix of orange and green patterns. The mans face is partially obscured by the tree trunk, but his eyes are visible, looking upwards. He appears to be smiling or laughing, with his mouth open. The mans arms are crossed over his chest, suggesting a relaxed or playful posture. The background is blurred, but it appears to be a natural outdoor setting, possibly a forest or park. In the background, another person is partially visible, their presence subtly hinted at by a hand reaching out from the left side of the frame. The colors in the video are warm, with the mans shirt standing out against the muted background. The mans hair and beard are dark, and he has a light complexion. The overall mood of the video is lighthearted and carefree. There are no visible texts or other objects in the video, and the relative positions of the objects remain constant with the man in the foreground and the second person in the background.'},
        { id: 'case_3', opacity: 0.2, fontSize: '0.75em', title: '[Detailed Caption] The video depicts a dynamic scene of a green car in motion on a winding road. The car, a vibrant blue sedan, is seen navigating through the curves of the road, moving from the left side of the frame to the right. Its a bright, sunny day, and the road appears to be wet, possibly from recent rain. The cars vibrant green color stands out against the gray road and the greenery of the surrounding grassy areas. In the distance, a white car is visible, adding to the sense of motion and activity in the scene. The surrounding landscape is lush and green, with mountains and trees visible in the background. The road itself is a narrow, two-lane road with a white line marking its center. The weather appears to be clear and sunny, with the sky visible in the top right corner of the frame. The cars movement is smooth and controlled, suggesting it is driving at a moderate speed. There are no visible texts or other objects that can be counted or located relative to each other in the video.'},
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
            .attr('id', 'display_case_video1')
            .attr('width', image_size_width)
            .attr('controls', true)
            .append('source')
            .attr('type', 'video/mp4');

        // Title
        video_overlay.append('div')
            .attr('id', 'display_case_video1_title')
            .style('text-align', 'left')
            // .style('font-weight', 'bold')
            .style('margin-top', '8px');

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
    }

    function select_new_video(event, d) {
        indicator_group.selectAll('foreignObject')
            .attr('opacity', item => item.id === d.id ? 1.0 : 0.2);
        
        var video = d3.select('#display_case_video1');
        var source = video.select('source');
        
        source.attr('src', `${base_dir}${d.id}.mp4`)
        video.node().load(); // Force the video to load
        
        d3.select('#display_case_video1_title')
            .html(`<span style="font-size: ${d.fontSize};">${d.title}</span>`);

        video.on('loadedmetadata', function() {
            var aspect_ratio = this.videoHeight / this.videoWidth;
            var new_height = image_size_width * aspect_ratio;
            
            video.attr('height', new_height);
            
            // updateContainerHeight(new_height);
        });

        // Play all indicator videos
        // indicator_group.selectAll('video').each(function() {
        //     this.play().catch(e => console.log("Autoplay prevented:", e));
        // });
    }

    function displayIndicatorData(data) {
        console.log('displayIndicatorData called with', data);
        data.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.style.opacity = item.opacity;
                const titleElement = element.querySelector('.title'); // Assuming there's a class 'title' for the title element
                if (titleElement) {
                    titleElement.textContent = item.title;
                    titleElement.style.fontSize = item.fontSize;
                    titleElement.style.lineHeight = item.lineHeight;

                }
            }
        });
    }

    displayIndicatorData(indicator_data);

    image_init();
    select_new_video(null, indicator_data[0]);
}

cases();