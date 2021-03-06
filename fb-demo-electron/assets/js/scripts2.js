const request = require('request');
const ACCESS_TOKEN = 'EAAXxGVI79FQBACfVZBTnvJ4jQZB98YeO76TnaiPt9yblWhq2w5wxrRbzaNFYGZB68z8VZCIJQUQFE7T6LO4D6pZCMsVbDNukZBX3ZCdQc7yrNemTQV0VARiO7mst3s2vsmVdbUlXWA49EUleMGbxhi2hyVGTWfxYrgZD';

let storeProducts = [];
let pageId, platformCode, platform, adAcctId, shopUrl;
let path = require('path');
const base64Img = require('base64-img');
const platformProducts = require(path.resolve('assets/js/Platform'));
const advertiseTool = require(path.resolve('assets/js/Advertise'));

function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 0);
	}
}

function bar_progress(progress_line_object, direction) {
	var number_of_steps = progress_line_object.data('number-of-steps');
	var now_value = progress_line_object.data('now-value');
	var new_value = 0;
	if(direction == 'right') {
		new_value = now_value + ( 100 / number_of_steps );
	}
	else if(direction == 'left') {
		new_value = now_value - ( 100 / number_of_steps );
	}
	progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
}

function getStoreProducts() {
	$('#product-list-loader').text('loading...');
	let storeUrl = $('#form-store-url').val();
	platformCode = $('#form-platform-select').val();
	adAcctId = $('#form-ad-account-id').val();
	pageId = $('#form-page-id').val();

	let reqProds = new Promise((resolve, reject) => {
		request(storeUrl, (err, res, body)=> {
			if (err || body === undefined) reject(err);
			resolve(body);
		});
	});

	reqProds.then(body => {
		platform = platformProducts[platformCode](body);
		platform.getProducts().then((products) => {
			$('#product-list-loader').text('');

			products.forEach(prodObj => {
				$('#product-list').append(`
					<span>
						<label class="checkbox-inline">
							<input class="select-prod-checkbox" name="selected-products" type="checkbox" value="${prodObj.id}">${prodObj.id} - ${prodObj.title}
						</label>
					</span>
					<br>
				`);
			});

            if (platform.getNextUrl()) {
                $('#form-store-url').val(platform.getNextUrl());
                getStoreProducts();
			} else {
				$('.select-prod-checkbox').change(function(){
					if ($('input[name="selected-products"]:checked').length > 10) {
						$(this).prop('checked', false);
					}
				});
			}
		}).catch(console.log);
	}).catch(()=> {
		$('#product-list-loader').text('Unable to fetch products. Please check that the store url is correct');
		return;
	});
}

function advertiseSelectedProducts(cpcBid, budget) {
	const selected = $('input[name="selected-products"]:checked');
	let selectedIds = [];

	selected.each(prod => {
		selectedIds.push($(selected[prod]).val());
	});
	let productsToAdvertise = storeProducts.filter(prod => {
		return selectedIds.indexOf(prod.id) >= 0;
	});

	platform.getAdImages(productsToAdvertise).then((res) => {
		let promises = [];
		res.forEach(prod => {
			promises.push(
				new Promise((resolve, reject) => {
					let p = { access_token: ACCESS_TOKEN };
					if (require('fs').existsSync(path.join(__dirname, prod.image))) {
                        base64Img.base64(path.join(__dirname, prod.image), (err, data) => {
                        	p.bytes = data;
                        	p.bytes = p.bytes.substr(p.bytes.indexOf(',')+1);
                            request.post({
                                headers: {'content-type' : 'application/json'},
                                url: `https://graph.facebook.com/v2.9/act_${adAcctId}/adimages`,
                                body: JSON.stringify(p)
                            }, (err, res, body) => {
                                if (err || !body || JSON.stringify(body) === JSON.stringify({})) {
                                    console.log(err, body);
                                    return reject(err);
                                }

                                body = JSON.parse(body);
                                prod.image_hash = body.images.bytes.hash;
                                resolve(body);
                            });
						});
                    }
				})
			);
		});
        return Promise.all(promises)
		.then(() => {
        	let adProds = res.map(prod => {
        		return {
        			description: prod.price + ' ' + prod.description,
					image_hash: prod.image_hash,
					link: prod.link,
					name: prod.title
				};
			});

            request.post({
                headers: {'content-type' : 'application/json'},
                url:     `https://graph.facebook.com/v2.9/act_${adAcctId}/adcreatives`,
                body:    JSON.stringify({
                    name: pageId,
                    object_story_spec: {
                        link_data: {
                            child_attachments: adProds,
                            link: shopUrl
                        },
                        page_id: pageId
                    },
                    access_token: ACCESS_TOKEN
                })
            }, function(error, response, body){
                if (error) {
                    console.log(error.message);
                    return;
                }

                body = JSON.parse(body);
                console.log('successfully created ad creative', body);
                advertiseTool.createAd(body.id, pageId, budget, cpcBid)
				.then(() => {
                    let message = `<div class="f1-step-icon"><i class="fa fa-facebook"></i></div>
				   	  Thanks. Your Ads are on the way!`;

                    $('#final-status').text('Done!');
                    $('#bid-div').html(message);
                    $('#final-submit').hide();
                    $('#final-prev').hide();
                    $('#restart').show();
				}).catch(console.log);
            });
		});
	}).catch(console.log);

	let message = `<div class="f1-step-icon"><i class="fa fa-facebook"></i></div>
				   	  Please Wait while ads are being created`;

	$('#final-status').text('Creating your Ads!');
	$('#bid-div').html(message);
	$('#final-submit').hide();
	$('#final-prev').hide();
	$('#restart').hide();
}

jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    */
    $.backstretch("assets/img/backgrounds/1.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });
    
    /*
        Form
    */
    $('.f1 fieldset:first').fadeIn('slow');
    
    $('.f1 input[type="text"], .f1 input[type="password"], .f1 textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    // next step
    $('.f1 .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');
    	var next_step = true;
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	// fields validation
    	parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			$(this).addClass('input-error');
    			next_step = false;
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation

		if ($(this)[0].id === 'store-details') {
			$('#product-list').text('');
            shopUrl = $('#form-store-url').val();
			storeProducts = [];
			getStoreProducts();
		}

		if ($(this)[0].id === 'select-products') {
			$('#success-status').hide();
			$('#final-status').show();
			$('#bid-div').show();
			$('#ad-create-success').hide();
			$('#restart').hide();
			$('#final-submit').show();
			$('input[name="form-cpc-bid"]').attr('placeholder', 'Your Cost Per Click Bid (Min 0.02 USD)');
			$('input[name="form-cpc-budget"]').attr('placeholder', 'Your Budget (Min 35 USD)');

			const selected = $('input[name="selected-products"]:checked');
			next_step = selected.length > 0;
		}
    	
    	if( next_step ) {
    		parent_fieldset.fadeOut(400, function() {
    			// change icons
    			current_active_step.removeClass('active').addClass('activated').next().addClass('active');
    			// progress bar
    			bar_progress(progress_line, 'right');
    			// show next step
	    		$(this).next().fadeIn();
	    		// scroll window to beginning of the form
    			scroll_to_class( $('.f1'), 20 );
	    	});
    	}
    	
    });

	$('#restart').on('click', () => {
		location.reload();
	});
    
    // previous step
    $('.f1 .btn-previous').on('click', function() {
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		current_active_step.removeClass('active').prev().removeClass('activated').addClass('active');
    		// progress bar
    		bar_progress(progress_line, 'left');
    		// show previous step
    		$(this).prev().fadeIn();
    		// scroll window to beginning of the form
			scroll_to_class( $('.f1'), 20 );
    	});
    });
    
    // submit
    $('.f1').on('submit', function(e) {
		e.preventDefault();
    	const cpcBid = $('#form-cpc-bid').val();
    	const budget = $('#form-cpc-budget').val();

		if (cpcBid) {
			advertiseSelectedProducts(cpcBid, budget);
			//testbelow();
		}
    });

    function testbelow() {
        request.get({
            headers: {'content-type' : 'application/json'},
            url:     `https://graph.facebook.com/v2.9/act_${adAcctId}/campaigns?access_token=${ACCESS_TOKEN}&fields=id,name`
        }, function(error, response, body){
            if (error) {
                console.log(error.message);
                return;
            }

            console.log(JSON.parse(body));
        });
    }
    
    
});
