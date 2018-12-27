$(function() {
    
        
        var headings = "h1, h2, h3, h4, h5, h6, p, strong";
        $headings = $(headings); 
        var cls = "mouseovered";



        MYONE = {
        	ajaxpost: function(outetHtml,indexnode,tagname){
        			var urlsend = document.location.href.split('/').pop()
        			var menuId = {
        				outer:outetHtml,
        				index:indexnode,
        				tagn:tagname,
        				filename:urlsend
        			};
        			
        			var request = $.ajax({
        				url: "/obrabotchik",
        				method: "POST",
        				data: { id : menuId.index, outer : menuId.outer, tag : menuId.tagn, filename : menuId.filename },
        				dataType: "html"
        			});
        			request.done(function( data ) {
        				console.log(data);
        			});

        			request.fail(function( jqXHR, textStatus ) {
        				alert( "Request failed: " + textStatus );
        			});
        		},
        	mouseoverFunc: function($headings){
        		$headings.on('mouseover', function(e) {
                    $(e.target).addClass(cls);
                    // console.log(this.tagName)
                })
        	},
        	mouseoutFunc: function ($headings) {
        		$headings.on('mouseout', function(e) {
                    $(e.target).removeClass(cls)
                })
        	},
        	onclickFunc: function ($headings) {
        		$headings.on('click', function(e) {
            		$(e.target)
                    	.addClass("preedit modal-content")
                    	.attr('contenteditable', 'true')
                    	.attr('id', 'ready')
                    	.off('click')
						.focus();
					var tg = $(e.target)[0].nodeName;
					console.log(tg);

					$('#tagsname').attr('value', tg).attr('placeholder', tg).change()
 					$('#reset-save').on('click', function(ev){
 					
 					console.log('=========');
					var outer = e.target.innerText;
					var tag = $('#ready')[0].nodeName;
					var indexId = getid(tag);
					console.log(outer);
					console.log(indexId);
					console.log(tag);

					MYONE.ajaxpost(outer,indexId,tag)
					$('#ready').removeAttr('id');
					$(ev.target).off('click')
					});
					// console.log(e.handleObj.guid);
						// e.preventDefault;
	        		edform(false);
					MYONE.offclickFunc($headings);
					

					function getid(tag){
						
						var matches = document.querySelectorAll(tag);
						for (i in matches) {
							if (matches[i].id == "ready") {
// 								console.log(i);
								return parseInt(i);
								break;
							}
						}
					};
				
				})
        	},
        	offclickFunc: function($headings){
        		$headings
	        		.off('mouseover')
	        		.off('mouseout')
	        		.off('click');
        			// MYONE.remdataFunc() 
        	},
        	remdataFunc: function(){
        		$('*').removeClass("preedit");
        		$('*').removeClass("modal-content");
        		$('*').removeClass("mouseovered");
        		// $('#ready').removeAttr('id');
        		$('*').removeAttr('contenteditable');
        		edform(true)
        	}
        };

        $('#rengen').on('change',function() {
        	var controler = $(this).prop('checked');
        if (controler == true){
        	MYONE.offclickFunc($headings)
        	MYONE.remdataFunc()
        }else{
        	MYONE.mouseoverFunc($headings)
        	MYONE.mouseoutFunc($headings)
        	if (controler == false && $('#ready').length == 0) {
                MYONE.onclickFunc($headings)
                
                }else{
                MYONE.remdataFunc()	
        	
	        }
	    }
    })
})


