/* **************************************************************

   Copyright 2011 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */

var _store_greenspeed = function(_app) {
	var r= {
		vars : {
			scrollPosHist : "",
			scrollPosBackHit : "",
			scrollPosArrayIndex : "",

			catTemplates : {
			},
		},
		
		calls : {

		appBuyerCreate : {
			init : function(obj,_tag)	{
				this.dispatch(obj,_tag);
				return 1;
				},
			dispatch : function(obj,_tag){
				obj._tag = _tag || {};
				obj._cmd = "appBuyerCreate";
				_app.model.addDispatchToQ(obj,'immutable');
				}
			} //appBuyerCreate
		},
		
		callbacks : {
			init : {
				onSuccess : function(){
					_app.u.dump('BEGIN _app.ext_store_greenspeed.callbacks.init.onSuccess');
					_app.ext._store_greenspeed.u.bindOnclick();
					
										
				},
				onError : function() {
					_app.u.dump('BEGIN _app.ext_store_greenspeed.callbacks.init.onError');
				}
			},
			startExtension : {
				onSuccess : function (){
					_app.u.dump('BEGIN _app.ext_store_greenspeed.callbacks.startExtension.onSuccess')
					
					//replacement for bindByAnchor href to make crawlable links. Currently used mainly on sitemap
					
					//BEGIN ONCOMPLETES/ONDEPARTS/ONINITS
					_app.templates.productTemplate.on('complete.greenspeed',function(event,$context,infoObj){
					//_app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
						
						//var $context = $(_app.u.jqSelector('#',infoObj.parentID));
						var $tabContainer = $( ".tabbedProductContent",$context);
							if($tabContainer.length)	{
								if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
								else	{
									$tabContainer.anytabs();
								}
							}
							else	{} //couldn't find the tab to tabificate.
							
							
							//HOVER ZOOM FEATURE
							 
							 var image = $('.prodImageContainer',$context).attr('data-imgsrc');
							 //dump("var image =");
							 //dump (image);
							 var imageURL = _app.u.makeImage({
							   "name" : image,
							   "w" : 1000,
							   "h" : 1150,
							   "b" : "FFFFFF"
							   });
							 $('.largeImageContainer', $context).zoom({
							  url: imageURL,
							  on:'mouseover',
							  onZoomIn: function(){
							   // the active class causes the curser to be switched to a zoom out image - this occurs when the image has zoom
							   $('.largeImageContainer').addClass('active');
							   },
							  onZoomOut: function(){
							   // restores the zoom in curser after zoom out
							   $('.largeImageContainer').removeClass('active');
							   }});
							 $('.thumbnail',$context).on('mouseenter', function(){
								  //dump("Thumbnail swap action activated.");
								  $('.largeImageContainer').trigger('zoom.destroy');
								  //dump("$(this).parent().attr('data-imgsrc') = ");
								  //dump($(this).parent().attr('data-imgsrc'));
								  var newImage = $(this).attr('data-imgsrc');
								  
								  //IMAGE VIEWER CLICK BLOCKER
								  var thumbObject = $(this);
								  if(thumbObject.data("firstTimeHover")){
									  //_app.u.dump("firstTimeHover exists for " + $(this) + ". Doing nothing.")
								  }
								  else{
									  //_app.u.dump("firstTimeHover does not exists for " + $(this) + ". Adding it set to false.")
									  thumbObject.data('firstTimeHover',false).append();
								  }
								  
								  if (thumbObject.data('firstTimeHover') === false){
									  //_app.u.dump("Running image blocker for " + $(this) + ".")
									  var imageContainerSize = $('.imageContainer', $context).height();
									  //_app.u.dump(imageContainerSize);
									  $(".imageContainerBlocker", $context).css("height",imageContainerSize);
									  $(".imageContainerBlocker", $context).show();
								  }
								  //END IMAGE CLICK BLOCKER
							
								  $('.prodImageContainer > img',$context).attr('src', _app.u.makeImage({
									   "name" : newImage,
									   "w" : 450,
									   "h" : 560,
									   "b" : "FFFFFF"
								   }));
								  var newImageURL = _app.u.makeImage({
									   "name" : newImage,
									   "w" : 1000,
									   "h" : 1150,
									   "b" : "FFFFFF"
								   });
								   
								   //CLICK BLOCKER ACTIVATOR
								   setTimeout(function(){
									   $(".imageContainerBlocker", $context).hide();
									   thumbObject.data('firstTimeHover',true).append();
									   //_app.u.dump("Setting firstTimeHover to true for " + $(this) + ".");
								   }, 3000);
								   //END CLICK BLOCK ACTIVATOR
								   
								  $('.largeImageContainer').zoom({
									   url: newImageURL,
									   on:'mouseover',
									   onZoomIn: function(){
										$('.largeImageContainer').addClass('active');
										//_app.u.dump("we're running addClass");
										},
									   onZoomOut: function(){
										$('.largeImageContainer').removeClass('active');
										}
							   		});
							});
						
							function productHoverZoomClick(){
								$(".zoomImg", $context).before("<div onClick='_app.ext.store_product.u.showPicsInModal({\"pid\":$(this).attr(\"data-pid\")});' data-bind=\"var:product(zoovy:prod_image1; format:assignAttribute; attribute:data-pid;\">");
								$(".zoomImg", $context).after("</div>");
							}
					});
						
					_app.templates.homepageTemplate.on('complete.greenspeed',function(event,$context,infoObj){
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
					});
					
					_app.templates.categoryTemplate.on('complete.greenspeed',function(event,$context,infoObj){
						
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
					});
					
					_app.templates.companyTemplate.on('complete.greenspeed',function(event,$context,infoObj){
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
					});
					_app.templates.customerTemplate.on('complete.greenspeed',function(event,$context,infoObj){
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
					});
					_app.templates.searchTemplate.on('complete.greenspeed',function(event,$context,infoObj){
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
					});
					_app.templates.productTemplate.on('complete.greenspeed',function(event,$context,infoObj){
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
					});
					_app.templates.checkoutTemplate.on('complete.greenspeed',function(event,$context,infoObj){
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
					});
					_app.templates.pageNotFoundTemplate.on('complete.greenspeed',function(event,$context,infoObj){
						//INTERNET EXPLORER WARNING MESSAGE
						if($('.headerIE8WarningCont').data('messageShown')){
						}
						else{
							$('.headerIE8WarningCont').data('messageShown',false);
						}
						if($('.headerIE8WarningCont').data('messageShown') === false)
						{
							$('.headerIE8WarningCont').anymessage({'message':'We noticed you\'re using Internet Explorer 8. We recommend upgrading to version 9 and above or using Firefox, Chrome, or Safari for a more enhanced shopping experience.'});	
							$('.headerIE8WarningCont').data('messageShown',true).append();
						}
					});
					
					$('#cartTemplate').on('complete.updateMinicart',function(state,$ele,infoObj)	{
						var cartid = infoObj.cartid || myApp.model.fetchCartID();
						var $appView = $('#appView'), cart = myApp.data['cartDetail|'+cartid], itemCount = 0, subtotal = 0, total = 0;
						dump(" -> cart "+cartid+": "); dump(cart);
						if(!$.isEmptyObject(cart['@ITEMS']))	{
							itemCount = cart.sum.items_count || 0;
							subtotal = cart.sum.items_total;
							total = cart.sum.order_total;
							}
						else	{
							//cart not in memory yet. use defaults.
							}
						$('.cartItemCount',$appView).text(itemCount);
						$('.cartSubtotal',$appView).text(myApp.u.formatMoney(subtotal,'$',2,false));
						$('.cartTotal',$appView).text(myApp.u.formatMoney(total,'$',2,false));
					});
				},
				onError : function (){
					_app.u.dump('BEGIN app_store_greenspeed.callbacks.startExtension.onError');
				}
			},
		},
		
		
		////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {						
			collapseExpandFAQ : function($tagContext){
				if($(".faqContentCont", $tagContext).is(':hidden')){
					$(".faqContentCont", $tagContext).data('collapseExpand',false).append();
					//_app.u.dump("collapseExpand Data did not exist for this drop down. Created it.");
					//_app.u.dump($(".faqContentCont", $tagContext).data('collapseExpand'));
				}
				else{
				}
				
				if ($(".faqContentCont", $tagContext).data('collapseExpand') === false){
					$(".faqContentCont", $tagContext).slideDown(1000);
					$(".faqContentCont", $tagContext).data('collapseExpand',true).append();
					//_app.u.dump("FAQ was hidden. Now showing.");
				}
				else{
					$(".faqContentCont", $tagContext).slideUp(1000);
					$(".faqContentCont", $tagContext).data('collapseExpand',false).append();
					//_app.u.dump("FAQ was showing. Now hidden.");
				}
			} //END collapseExpandFAQ			 
		},//END a FUNCTIONS
		
		u : {			
			bindOnclick : function() {
				$('body').off('click', 'a[data-onclick]').on('click', 'a[data-onclick]', function(event){
					var $this = $(this);
					var P = _app.ext.quickstart.u.parseAnchor($this.data('onclick'));
					return _app.ext.quickstart.a.showContent('',P);
				});
			}
		},//END u FUNCTIONS
		
		renderFormats : {
			//Identical to the showIFSet render format but sets to inline instead of block.
			showIfSetInline : function($tag,data)	{
				if(data.value)	{
					$tag.show().css('display','inline'); //IE isn't responding to the 'show', so the display:inline is added as well.
					}
			}, //END showIfSetInline
			
			money : function($tag,data)	{			
	//			_app.u.dump('BEGIN view.formats.money');
				var amount = data.bindData.isElastic ? (data.value / 100) : data.value;
				if(amount)	{
					var r,o,sr;
					r = _app.u.formatMoney(amount,data.bindData.currencySign,'',data.bindData.hideZero);
	//					_app.u.dump(' -> attempting to use var. value: '+data.value);
	//					_app.u.dump(' -> currencySign = "'+data.bindData.currencySign+'"');
	
	//				**SPAN IS APPENDED TO ALL OF THE PRICE TEXT, RATHER THAN JUST THE CENTS**
					if(r.substr(0,1))	{
	//					_app.u.dump(' -> r = '+r);
						sr = r.split(r.substr(0,1));
						o = sr[0];
						if(sr[1])	{o += '<span class="productPriceText">$'+sr[1]+'<\/span>'}
						$tag.html(o);
						}
					else{
						$tag.html(r);
					}
				}
			}, //END money
			
			currencyelastic : function($tag,data)	{
				//dump("Begin currency elastic format");
				//dump(data);
				//dump($tag);
				
				var rawPrice = data.value.toString();
				var cents = ".";
				var position = rawPrice.length - 2;
				//dump(position);
				//dump(rawPrice);
				
				var r = "Our Price: $"+[rawPrice.slice(0, position), cents, rawPrice.slice(position)].join('');
				
				$tag.append(r);
			}, //currencyelastic
			
			currencyprodlist : function($tag,data)	{
				//dump("Begin currency product list format");
				//dump(data);
				//dump($tag);
				
				var r = "<span class='pricePrefix'>Our price:</span> $"+data.value;
				//dump(r);
				var cents = r.split(".")
				//dump(cents[1]);
				if(cents[1] == undefined){
					//dump ("No cents present. Add a .00")
					r = r + ".00";
				}
				else if(cents[1].length === 1){
					//dump(cents[1].length);
					//dump ("cents only has one value. Adding a zero.")
					r = r + "0";
				}
				else if(cents[1] == ""){
					//dump("Price value has a decimal but no cent values. Fixing this shenanigans");
					r = r + "00";
				}
				//dump(r);
				$tag.append(r);
			}, //currencyprodlist
			
			cartcurrency : function($tag,data)	{
				//dump("Begin currency product list format");
				//dump(data);
				//dump($tag);
				
				var r = "$"+data.value;
				//dump(r);
				var cents = r.split(".")
				//dump(cents[1]);
				if(cents[1] == undefined){
					//dump ("No cents present. Add a .00")
					r = r + ".00";
				}
				else if(cents[1].length === 1){
					//dump(cents[1].length);
					//dump ("cents only has one value. Adding a zero.")
					r = r + "0";
				}
				else if(cents[1] == ""){
					//dump("Price value has a decimal but no cent values. Fixing this shenanigans");
					r = r + "00";
				}
				//dump(r);
				$tag.append(r);
			}, //cartcurrency
			
			currencymsrp : function($tag,data)	{
				//dump("Begin currency product list format");
				//dump(data);
				//dump($tag);
				
				var r = "<span class='msrpPrefix'>MSRP:</span> $"+data.value;
				//dump(r);
				var cents = r.split(".")
				//dump(cents[1]);
				if(cents[1] == undefined){
					//dump ("No cents present. Add a .00")
					r = r + "<span class='cents'>.00</span>";
				}
				else if(cents[1].length === 1){
					//dump(cents[1].length);
					//dump ("cents only has one value. Adding a zero.")
					var pricePieces = r.split(".");
					r = pricePieces[0] + "<span class='cents'>.00</span>";
				}
				else if(cents[1] == ""){
					//dump("Price value has a decimal but no cent values. Fixing this shenanigans");
					var pricePieces = r.split(".");
					r = pricePieces[0] + "<span class='cents'>.00</span>";
				}
				//dump(r);
				$tag.append(r);
			}, //currencymsrp
			
			currencyelasticmsrp : function($tag,data)	{
				dump("Begin elastic msrp product list format");
				dump(data);
				dump($tag);
				
				var r = "<span class='msrpPrefix'>MSRP:</span> $"+data.value;
				dump(r);
				var cents = r.split(".")
				dump(cents[1]);
				if(cents[1] == undefined){
					dump ("No cents present. Add a .00")
					r = r + "<span class='cents'>.00</span>";
				}
				else if(cents[1].length === 1){
					dump(cents[1].length);
					dump ("cents only has one value. Adding a zero.")
					var pricePieces = r.split(".");
					r = pricePieces[0] + "<span class='cents'>.00</span>";
				}
				else if(cents[1] == ""){
					dump("Price value has a decimal but no cent values. Fixing this shenanigans");
					var pricePieces = r.split(".");
					r = pricePieces[0] + "<span class='cents'>.00</span>";
				}
				dump(r);
				$tag.append(r);
			}, //currencyelasticmsrp
				
				priceretailsavingsdifferenceprodlistitem : function($tag,data)	{
					var o; //output generated.
					var pData = _app.data['appProductGet|'+data.value]['%attribs'];
					//use original pdata vars for display of price/msrp. use parseInts for savings computation only.
					var price = Number(pData['zoovy:base_price']);
					var msrp = Number(pData['zoovy:prod_msrp']);
					if(price > 0 && (msrp - price > 0))	{
						o = _app.u.formatMoney(msrp-price,'$',2,true)
						o = "You save: " + o;
						$tag.append(o);
						}
					else	{
						$tag.hide(); //if msrp > price, don't show savings because it'll be negative.
						}
				}, //priceRetailSavings
				
				priceretailsavingspercentageprodlistitem : function($tag,data)	{
					var o; //output generated.
					var pData = _app.data['appProductGet|'+data.value]['%attribs'];
					//use original pdata vars for display of price/msrp. use parseInts for savings computation only.
					var price = Number(pData['zoovy:base_price']);
					var msrp = Number(pData['zoovy:prod_msrp']);
					if(price > 0 && (msrp - price > 0))	{
						var savings = (( msrp - price ) / msrp) * 100;
						o = savings.toFixed(0)+'%';
						o = "(" + o + ")";
						$tag.append(o);
						}
					else	{
						$tag.hide(); //if msrp > price, don't show savings because it'll be negative.
						}
					}, //priceRetailSavings	
					
					showhidearea : function($tag,data)	{
						//dump("showHideCategoryVideo data object = ");
						//dump(data);
						if(data.value == null || data.value == ""){
							$tag.hide();
						}
						else{
							$tag.show();
						}	
				},//showhidearea
				
				
			
		},
		
		e : {
		},
		
		tlcFormats : {
			//currencyprodlist : function(argObj,globals)	{
			currencyprodlist : function(data,thisTLC)	{
				//dump("Begin currency format");
				//dump(data);
				//dump(thisTLC);
				
				//var r = "$"+globals.binds[argObj.bind]; 
				var r = "Our price: $"+data.globals.binds[data.globals.focusBind];
				//dump(r);
				var cents = r.split(".")
				//dump(cents[1]);
				if(cents[1] == undefined){
					//dump ("No cents present. Add a .00")
					r = r + ".00";
				}
				
				else if(cents[1].length === 1){
				//dump(cents[1].length);
				//dump ("cents only has one value. Adding a zero.")
				}
				//dump(r);
				return(r);
			}, //currencyprodlist
		}
	}
	return r;
}