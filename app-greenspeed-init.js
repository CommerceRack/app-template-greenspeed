$("#homepageTemplate").on('complete.cycle',function(state,$ele,infoObj){
	$('.productSlideshow',$ele).cycle();
	});


//unbind this from window anytime a category page is left.
//NOTE! if infinite prodlist is used on other pages, remove run this on that template as well.
$("#categoryTemplate").on('complete.infinitescroll',function(state,$ele,infoObj){
	$(window).off('scroll.infiniteScroll'); 
	});


$("#productTemplate, #productTemplateQuickView").on('complete.dynimaging',function(state,$ele,infoObj){
	handleSrcSetUpdate($ele);
	$('.prodDetailImagesContainer',$ele).imagegallery({
		show: 'fade',
		hide: 'fade',
		fullscreen: false,
		slideshow: false
		});
	});

//stops the video from playing when a user leaves the detail page (or quickview)
$("#productTemplate, #productTemplateQuickView").on('depart.youtubeReset',function(state,$ele,infoObj){
	var $iframe = $("[data-app-role='videoContainer']:first",$ele).find('iframe:first');
	var video = $iframe.attr('src');
	$iframe.attr('src',''); //this stops the video.
	$iframe.attr('src',$iframe.src); //set the src so if the page is visited again, the video is present. 
	});


myApp.rq.push(['script',0,(document.location.protocol == 'file:') ? myApp.vars.testURL+'jsonapi/config.js' : myApp.vars.baseURL+'jsonapi/config.js',function(){
//in some cases, such as the zoovy UI, zglobals may not be defined. If that's the case, certain vars, such as jqurl, must be passed in via P in initialize:
//	myApp.u.dump(" ->>>>>>>>>>>>>>>>>>>>>>>>>>>>> zGlobals is an object");
	window.myApp.vars.username = zGlobals.appSettings.username.toLowerCase(); //used w/ image URL's.
//need to make sure the secureURL ends in a / always. doesn't seem to always come in that way via zGlobals
	window.myApp.vars.secureURL = zGlobals.appSettings.https_app_url;
	window.myApp.vars.domain = zGlobals.appSettings.sdomain; //passed in ajax requests.
	window.myApp.vars.jqurl = (document.location.protocol === 'file:') ? myApp.vars.testURL+'jsonapi/' : '/jsonapi/';
	}]); //The config.js is dynamically generated.
	
myApp.rq.push(['extension',0,'order_create','extensions/checkout/extension.js']);
myApp.rq.push(['extension',0,'cco','extensions/cart_checkout_order.js']);
myApp.rq.push(['extension',0,'greenspeed','app-greenspeed.js']);

myApp.rq.push(['extension',0,'store_prodlist','extensions/store_prodlist.js']);
myApp.rq.push(['extension',0,'store_navcats','extensions/store_navcats.js']);
myApp.rq.push(['extension',0,'prodlist_infinite','extensions/prodlist_infinite.js']);
myApp.rq.push(['extension',0,'store_search','extensions/store_search.js']);
myApp.rq.push(['extension',0,'store_product','extensions/store_product.js']);
myApp.rq.push(['extension',0,'store_crm','extensions/store_crm.js']);
myApp.rq.push(['extension',0,'quickstart','app-quickstart.js','startMyProgram']);
myApp.rq.push(['extension',0,'cart_message','extensions/cart_message/extension.js']);
myApp.rq.push(['extension',0,'store_routing','extensions/store_routing.js']);

myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jsonpath.0.8.0.js']); //used pretty early in process..

//once peg is loaded, need to retrieve the grammar file. Order is important there. This will validate the file too.
myApp.u.loadScript(myApp.vars.baseURL+'resources/peg-0.8.0.js',function(){
	myApp.model.getGrammar(myApp.vars.baseURL+"resources/pegjs-grammar-20140203.pegjs");
	}); // ### TODO -> callback on RQ.push wasn't getting executed. investigate.

myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/tlc.js']); //in zero pass in case product page is first page.
myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.showloading-v1.0.jt.js']); //used pretty early in process..
myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.ui.anyplugins.js']); //in zero pass in case product page is first page.
myApp.rq.push(['css',1,myApp.vars.baseURL+'resources/anyplugins.css']);

myApp.rq.push(['script',0,myApp.vars.baseURL+'jquery.cycle2.min.js']); //used pretty early in process..
myApp.rq.push(['script',0,myApp.vars.baseURL+'jquery.cycle2.swipe.min.js']); //in zero pass in case product page is first page

//used for image enlargement in product layout
myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/load-image.min.js']); //in zero pass in case product page is first page.
myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.image-gallery.jt.js']); //in zero pass in case product page is first page.

//myApp.rq.push(['script',0,myApp.vars.baseURL+'srcset-polyfill-1.1.1-jt.js']); //in zero pass in case product page is first page.



//gets executed from app-admin.html as part of controller init process.
//progress is an object that will get updated as the resources load.
/*
'passZeroResourcesLength' : [INT],
'passZeroResourcesLoaded' : [INT],
'passZeroTimeout' : null //the timeout instance running within loadResources that updates this object. it will run indef unless clearTimeout run here OR all resources are loaded.

*/
myApp.u.showProgress = function(progress)	{
	function showProgress(attempt)	{
		if(progress.passZeroResourcesLength == progress.passZeroResourcesLoaded)	{
			//All pass zero resources have loaded.
			//the app will handle hiding the loading screen.
			myApp.u.appInitComplete();
			}
		else if(attempt > 150)	{
			//hhhhmmm.... something must have gone wrong.
			clearTimeout(progress.passZeroTimeout); //end the resource loading timeout.
			$('.appMessaging','#appPreView').anymessage({'message':'Init failed to load all the resources within a reasonable number of attempts.','gMessage':true,'persistent':true});
			}
		else	{
			var percentPerInclude = (100 / progress.passZeroResourcesLength);
			var percentComplete = Math.round(progress.passZeroResourcesLength * percentPerInclude); //used to sum how many includes have successfully loaded.
//			dump(" -> percentPerInclude: "+percentPerInclude+" and percentComplete: "+percentComplete);
			$('#appPreViewProgressBar').val(percentComplete);
			$('#appPreViewProgressText').empty().append(percentComplete+"% Complete");
			attempt++;
			setTimeout(function(){showProgress(attempt);},250);
			}
		}
	showProgress(0)
	}


//Any code that needs to be executed after the app init has occured can go here.
//will pass in the page info object. (pageType, templateID, pid/navcat/show and more)
myApp.u.appInitComplete = function(P)	{
	myApp.u.dump("Executing myAppIsLoaded code...");

	dump(" -> HEY! just a head's up, the default pageTransition was just overwritten from app-greenspeed-init.js");
	myApp.ext.quickstart.pageTransition = function($o,$n,infoObj){
		//showing the before before anything shows up in the dropdown when it is clicked is not user friendly.
		if(myApp.ext.quickstart.vars.hotw.length > 1)	{
			$('#hotwButton').show();
			}
		function transitionThePage()	{
//if $o doesn't exist, the animation doesn't run and the new element doesn't show up, so that needs to be accounted for.
//$o MAY be a jquery instance but have no length, so check both.
			if($o instanceof jQuery && $o.length)	{
				$('#mainContentArea').height($o.outerHeight()); //add a fixed height temporarily so that page doesn't 'collapse'
				dump(" -> offsetleft: " + $('#mainContentArea').width());
				$o.animate({'height':20,'width':20,'overflow':'hidden','left':$('#mainContentArea').width(),'top':-30},function(){
					$('#mainContentArea').height('');
					$o.removeAttr('style').hide();
					$n.css({'position':'relative','z-index':10}); //
					});
				}
			else	{
				//if o isn't set, n needs to be reset to relative positioning or the display will be wonky.
				$n.css({'position':'relative','z-index':10}); //
				}
			
			}

		$o.css({'position':'relative','z-index':'10'}); //make sure the old page is 'above' the new.
//$n isn't populated yet, most likely. So instead of animating it, just show it. Then animate the old layer above it.
		if($n instanceof jQuery && $o instanceof jQuery && ($n.attr('id') == $o.attr('id')))	{} //old and new match. do nothing.
		if($n instanceof jQuery)	{
			$n.addClass('pageTemplateBG').css({position:'absolute','z-index':9,'left':0,'top':0,'right':0}).show();
			}
//only 'jump to top' if we are partially down the page.  Using the header height as > means if a link in the header is clicked, we don't jump down to the content area. feels natural that way.
		if(infoObj.performJumpToTop && $(window).scrollTop() > $('header','#appView').height())	{
			$('html, body').animate({scrollTop : ($('header','#appView').length ? $('header','#appView').first().height() : 0)},500,function(){
				transitionThePage();
				});
			} //new page content loading. scroll to top.			
		else	{
			transitionThePage();
			}

		}
	
	//Cart Messaging Responses.
	myApp.cmr.push(['chat.join',function(message){
		if(message.FROM == 'ADMIN')	{
			var $ui = myApp.ext.quickstart.a.showBuyerCMUI();
			$("[data-app-role='messageInput']",$ui).show();
			$("[data-app-role='messageHistory']",$ui).append("<p class='chat_join'>"+message.FROM+" has joined the chat.<\/p>");
			$('.show4ActiveChat',$ui).show();
			$('.hide4ActiveChat',$ui).hide();
			}
		}]);
	
	//the default behavior for an itemAppend is to show the chat portion of the dialog. that's an undesired behavior from the buyer perspective (chat only works if admin is actively listening).
	myApp.cmr.push(['cart.itemAppend',function(message,$context)	{
		$("[data-app-role='messageHistory']",$context).append("<p class='cart_item_append'>"+message.FROM+" has added item "+message.sku+" to the cart.<\/p>");
		}]);
	
	myApp.cmr.push(['goto',function(message,$context){
		var $history = $("[data-app-role='messageHistory']",$context);
		$P = $("<P>")
			.addClass('chat_post')
			.append("<span class='from'>"+message.FROM+"<\/span> has sent over a "+(message.vars.pageType || "")+" link for you within this store. <span class='lookLikeLink'>Click here<\/span> to view.")
			.on('click',function(){
				showContent(myApp.ext.quickstart.u.whatAmIFor(message.vars),message.vars);
				});
		$history.append($P);
		$history.parent().scrollTop($history.height());
		}]);

	myApp.ext.order_create.checkoutCompletes.push(function(vars,$checkout){
//append this to 
		$("[data-app-role='thirdPartyContainer']",$checkout).append("<h2>What next?</h2><div class='ocm ocmFacebookComment pointer zlink marginBottom checkoutSprite  '></div><div class='ocm ocmTwitterComment pointer zlink marginBottom checkoutSprit ' ></div><div class='ocm ocmContinue pointer zlink marginBottom checkoutSprite'></div>");
		$('.ocmTwitterComment',$checkout).click(function(){
			window.open('http://twitter.com/home?status='+cartContentsAsLinks,'twitter');
			_gaq.push(['_trackEvent','Checkout','User Event','Tweeted about order']);
			});
		//the fb code only works if an appID is set, so don't show banner if not present.				
		if(myApp.u.thisNestedExists("zGlobals.thirdParty.facebook.appId") && typeof FB == 'object')	{
			$('.ocmFacebookComment',$checkout).click(function(){
				myApp.ext.quickstart.thirdParty.fb.postToWall(cartContentsAsLinks);
				_gaq.push(['_trackEvent','Checkout','User Event','FB message about order']);
				});
			}
		else	{$('.ocmFacebookComment').hide()}
		});
	}



//this will trigger the content to load on app init. so if you push refresh, you don't get a blank page.
//it'll also handle the old 'meta' uri params.
//this will trigger the content to load on app init. so if you push refresh, you don't get a blank page.
//it'll also handle the old 'meta' uri params.
myApp.router.appendInit({
	'type':'function',
	'route': function(v){
		return {'init':true} //returning anything but false triggers a match.
		},
	'callback':function(f,g){
		dump(" -> triggered callback for appendInit");
		g = g || {};
		if(g.uriParams.seoRequest){
			showContent(g.uriParams.pageType, g.uriParams);
			}
		else if(document.location.hash)	{	
			myApp.u.dump('triggering handleHash');
			myApp.router.handleHashChange();
			}
		else	{
			//IE8 didn't like the shortcut to showContent here.
			myApp.ext.quickstart.a.showContent('homepage');
			}
		if(g.uriParams && g.uriParams.meta)	{
			myApp.ext.cco.calls.cartSet.init({'want/refer':infoObj.uriParams.meta,'cartID':_app.model.fetchCartID()},{},'passive');
			}
		if(g.uriParams && g.uriParams.meta_src)	{
			myApp.ext.cco.calls.cartSet.init({'want/refer_src':infoObj.uriParams.meta_src,'cartID':_app.model.fetchCartID()},{},'passive');
			}
		}
	});
