(function($) {
    $.fn.smartPlayer = function(options) {
         
        var settings;
        
        var video;
        var videoList = [];
        var mediaControls;
        var down;
        var mouseX;
        var mouseY;
        var marginLeft;
        var $this;
        
        var onChange;
        
        var mediaControlsHtml = '<div id="media-controls">\n\
                    <div class="video-control">\n\
                    </div>\n\
                    <div class="video-control play">\n\
                    </div>\n\
                    <div class="video-control">\n\
                    </div>\n\
                    <div id="video-inf">\n\
                        <div id="video-info">\n\
                            <div id="video-name">\n\
                                <div>\n\
                                Krist Van D feat. Niles Mason - Vacancy\n\
                                </div>\n\
                            </div>\n\
                            <div id="video-time">\n\
                                00:12\n\
                            </div>\n\
                        </div>\n\
                        <div id="custom-progress">\n\
                            <div min="0" max="100" id="progress-time"></div>\n\
                            <div id="progress-circle"></div>\n\
                            <div class="help">\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                    <div class="videos-list">\n\
                    </div>\n\
		</div>';
        
         
        //metoda prywatna
        function changeTab(event) {
            event.preventDefault();
            $this = $(this);
            if($this.hasClass('disabled'))
                return;
        }
        
        function play() {
            if (video.paused || video.ended) {
		// Change the button to be a pause button
		//changeButtonType(playPauseBtn, 'pause');
		
                $this.find('.play').addClass('pause');
		video.play();
            }
            // Otherwise it must currently be playing
            else {
                    // Change the button to be a play button
                    //changeButtonType(playPauseBtn, 'play');
                    $this.find('.play').removeClass('pause');
                    video.pause();
            }
        }
        
        function stop() {
            video.pause();
            video.currentTime = 0;
        }
        
        function changeVolume() {
            video.volume = this.value / 100;
        }
        
        function onTimeUpdate() {
            var progressBar = $('#video-progress').first();
            var percentage = Math.floor((100 / video.duration) * video.currentTime);
            progressBar.val(percentage);
            $('#progress-time').css('width',percentage*2 + 'px');
            $('#progress-circle').css('margin-left', percentage*2 + 'px');
            
            var time = convertTime(Math.floor(video.currentTime));
            
            $('#video-time').html(time);
        }
        
        function changeCurrentTime(event) {
            if(down) {
                $('#progress-circle').css('margin-left', (parseInt(marginLeft) + event.clientX - mouseX) + 'px');
                
                var percent = (parseInt(marginLeft) + event.clientX - mouseX)/2;
                video.currentTime = video.duration * percent / 100;
            }
            //video.currentTime = Math.floor( video.duration * this.value/100);
        }
        
        function convertTime(time) {
            var min = Math.floor(time / 60);
            var sec = time % 60;
            if(sec < 10)
                sec = '0' + sec;
            if(min < 10)
                min = '0' + min;
            
            return min + ":" + sec;
        }
        
        function titleAnimation(titleWidth) {
            console.log('animatye');
            $('#video-name > div').animate({
                'marginLeft': (150 - titleWidth - 20) + 'px'
            },
            {
                duration: (titleWidth - 130)*100
            });

            $('#video-name > div').animate({
                'marginLeft': '0px'
            },
            {
                duration: (titleWidth - 130)*100
            });
        }
         
        //metody publiczne
        var methods = {
            refresh: function() {
                // TODO
            },
            enable: function() {
                // TODO
            },
            disable: function() {
                // TODO
            },
            destroy: function() {
                //destruktor TODO
                $this = $(this);
                $this.unbind("click");
                $this.css("background-color","");
                $this.removeData("smartPlayer");   
            }
        };
         
        return this.each(function() {
            //ciało naszego pluginu
            if(methods[options]){  
                //wywołana metoda publiczna
                return methods[options].apply( this, arguments );
            }
            else if (typeof options === 'object' || ! options ){
                //wywołany konstruktor
                settings = $.extend( {
                  list: [],
                  skin: 'white-skin'
                }, options);
                //inicjalizacja pluginu
                $this = $(this);
                data = $this.data("smartPlayer");
                video = $this.find('video').get(0);
                mediaControls = $this.find('#media-controls').get(0);
                
                if(!data)
                {
                    $this.append(mediaControlsHtml);
                    data = $this.data("smartPlayer", settings);
                    $this.find('li a').bind("click", changeTab);
                    $this.find('#media-controls .play').bind('click', play);
                    $this.find('#media-controls #stop-button').bind('click', stop);
                    $this.find('#media-controls #mute').bind('change', changeVolume);
                    //$this.find('#media-controls #video-progress').bind('change', changeCurrentTime);
                    $this.find('#media-controls #video-inf').mousemove(function(event) {
                        changeCurrentTime(event);
                    });
                    $this.find('#media-controls #video-inf').mouseup(function() {
                                down = false;  
                            });
                    $this.find('#media-controls #progress-circle').mousedown(function(event) {
                                down = true;
                                mouseX = event.clientX;
                                marginLeft = $('#progress-circle').css('margin-left');
                            }).mouseup(function() {
                                down = false;  
                            });
                    $this.find('#media-controls #custom-progress').click(function(event) {
                        var x = event.clientX  - $('#progress-circle').offset().left;
                        if(x > 0) {
                            x -= 5;
                            $('#progress-circle').css('margin-left', '+=' + x + 'px');
                        } else {
                            x = -x;
                            x += 5;
                            $('#progress-circle').css('margin-left', '-=' + x + 'px');
                        }

                        var percent = parseInt($('#progress-circle').css('margin-left'))/2;
                        video.currentTime = video.duration * percent / 100;
                    });
                    
                    $this.find('#media-controls #custom-progress').mousemove(function(event) {
                        var x = event.clientX  - $('#progress-circle').offset().left;
                        x -= 5;
                        var percent = (parseInt($('#progress-circle').css('margin-left'))+x)/2;
                        //video.currentTime = ;
                        
                        var margin = percent*2 - 30;
                        $('.help').css('margin-left', margin + 'px');
                        $('.help').html(convertTime(Math.floor(video.duration * percent / 100)));
                        $('.help').show();
                    });
                    $this.find('#media-controls #custom-progress').mouseleave(function(event) {
                        $('.help').hide();
                    });
                    
                    video.ontimeupdate = function(){onTimeUpdate()};
                    
                    settings.list.forEach(function(entry) {
                        var next = '<div class="video-next">\n\
                            <div class="video-next-title">\n\
                                ' + entry + '\n\
                            </div>\n\
                            <div class="video-next-time">\n\
                                03:28\n\
                            </div>\n\
                        </div>';
                        $('.videos-list').append(next);
                        
                        videoList.push(entry);
                        
                    });
                    
                }
                video.controls = false;
                $this.addClass(settings.skin);
                
                var titleWidth = $('#video-name > div').get(0).clientWidth;
                console.log(titleWidth);
                
                if(titleWidth > 150) {
                    //setInterval(titleAnimation(titleWidth), 1);
                    setInterval($.proxy(function(){
                        $('#video-name > div').animate({
                            'marginLeft': (150 - titleWidth - 20) + 'px'
                        },
                        {
                            duration: (titleWidth - 130)*100
                        });

                        $('#video-name > div').animate({
                            'marginLeft': '0px'
                        },
                        {
                            duration: (titleWidth - 130)*100
                        });}, this), 30000);
                }
                
                
                return;
            }
            else{
                //bład
                $.error('smartPlayer: no method: '+ options);
            }
        });
    }
})(jQuery)
