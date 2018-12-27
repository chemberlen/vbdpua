$(function() {
    $('.bubbleInfotop').each(function() {
        // options
        var distance = -10;
        var time = 250;
        var hideDelay = 500;

        var hideDelayTimer = null;

        // tracker
        var beingShown = false;
        var shown = false;

        var triggerbtn = $('.triggerbtn', this);
        var popupbtn = $('.popupbtn', this).css('opacity', 0);
        var popupHeight = $('.popupbtn').css('height');

        // set the mouseover and mouseout on both element
        $('body').on("mouseenter", function() {
            // stops the hide event if we move from the trigger to the popup element
            if (hideDelayTimer) clearTimeout(hideDelayTimer);

            // don't trigger the animation again if we're being shown, or already visible
            if (beingShown || shown) {
                return;
            } else {
                beingShown = true;

                // reset position of popup box
                popupbtn.css({
                        top: 10,
                        left: 10,
                        // bottom: popupHeight,
                        display: 'block' // brings the popup back in to view
                    })

                    // (we're using chaining on the popup) now animate it's opacity and position
                    .animate({
                        top: '-=' + distance + 'px',
                        opacity: 1
                    }, time, 'swing', function() {
                        // once the animation is complete, set the tracker variables
                        beingShown = false;
                        shown = true;
                    });
            }
        }).on("mouseleave",function() {
            // reset the timer if we get fired again - avoids double animations
            if (hideDelayTimer) clearTimeout(hideDelayTimer);

            // store the timer so that it can be cleared in the mouseover if required

            hideDelayTimer = setTimeout(function() {
                hideDelayTimer = null;
                popupbtn.animate({
                    top: '-=' + distance + 'px',
                    opacity: 0
                }, time, 'swing', function() {
                    // once the animate is complete, set the tracker variables
                    shown = false;
                    // hide the popup entirely after the effect (opacity alone doesn't do the job)
                    popupbtn.css('display', 'none');
                });
            }, hideDelay);
        });
    });

});

function edform(contr) {
	
$('.bubbleInfotop2').each(function() {
        // optionss
        var distance = 150;
        var time = 250;
        var hideDelay = 500;

        var hideDelayTimer = null;

        // tracker
        var beingShown = false;
        var shown = contr;

        var trigger = $('.trigger', this);
        var popup = $('.popup', this).css('opacity', 0);
        var popupHeight = $('.popup').css('height');

        // set the mouseover and mouseout on both element
        
            // stops the hide event if we move from the trigger to the popup element
            if (hideDelayTimer) clearTimeout(hideDelayTimer);

            // don't trigger the animation again if we're being shown, or already visible
            if (beingShown || shown) {
                return;
            } else {
                beingShown = true;

                // reset position of popup box
                popup.css({
                        top: 0,
                        left: 0,
                        // bottom: popupHeight,
                        display: 'block' // brings the popup back in to view
                    })

                    // (we're using chaining on the popup) now animate it's opacity and position
                    .animate({
                        top: '-=' + distance + 'px',
                        opacity: 1
                    }, time, 'swing', function() {
                        // once the animation is complete, set the tracker variables
                        beingShown = false;
                        shown = true;
                    });
            }
       
    });
};