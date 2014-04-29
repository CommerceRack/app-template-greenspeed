/* **************************************************************

   Copyright 2013 Zoovy, Inc.

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

var greenspeed = function(_app) {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.

	
//resize is executed continuously and the browser dimensions change. This function allows the code to be executed once, on finish (or pause)
	$(window).resize(function() {
		if(this.resizeTO) {clearTimeout(this.resizeTO);}
		this.resizeTO = setTimeout(function() {
			$(this).trigger('resizeEnd');
			}, 500);
		});
//when window is resized, generate a new logo. The code is triggered right after being bound to generate the correct size logo to start.
	$(window).bind('resizeEnd', function(P) {
		//resize the logo to maximum available space.
		var $logo = $('.logo',$('#mastHead'));
		var $container = $('.container:first'); //used to determine margin width so logo sides align with 'shop' sides.
// _app.data[rd.datapointer]['zoovy:company_name']
		if(_app.data['appProfileInfo|'+zGlobals.appSettings.domain_only])	{
			$logo.html("<img alt='"+(_app.data['appProfileInfo|'+zGlobals.appSettings.domain_only]['zoovy:company_name'] || "")+"' src='"+_app.u.makeImage({"name":_app.data['appProfileInfo|'+zGlobals.appSettings.domain_only]['zoovy:logo_website'],"w":Math.round(($logo.width() - ($container.width() * .02) )),"h":$logo.height(),"b":"TTTTTT","tag":0})+"' />"); //the 100% makes the logo scale on resize before being regenerated.
			}
		
		if(typeof handleSrcSetUpdate == 'function')	{
			handleSrcSetUpdate($("#mainContentArea :visible:first"))
			}
		}).trigger('resizeEnd');
	
//bind a click action for the dropdown on the shop link.
	$('#shopNowLink').on('click',function(){
		$('#tier1categories').slideDown();
		$( document ).one( "click", function() {
			$('#tier1categories').slideUp();
			});
		return false;
		});

	//.menu adds some formatting for the HTOW dropdown.
	$('#hotwMenu').menu().width('200').on('click','li',function(){
		$('#hotwButton').addClass('ui-state-hover');
		showContent('',$(this).data());
		//do not return false here. if so, the 'one' click added to the body won't get triggered by clicking a sotw.
		});

//each time the HOTW button is clicked, the dropdown is generated showing the last few pages viewed.
	$('#hotwButton').button({icons: {primary: "ui-icon-circle-triangle-w"},text: false}).on('click',function(){
		var
			$menu = $('#hotwMenu').empty(),
			hotw = _app.ext.myRIA.vars.hotw;
// SANITY -> hotw has a fixed length (15 by default).
//start at spot 1. spot 0 is the page in focus.
		for(var i = 1; i < 8; i += 1)	{
			if(hotw[i])	{
				$menu.append($("<li \/>").data(hotw[i]).addClass('pointer').text(_app.ext.greenspeed.u.formatInfoObj4HOTW(hotw[i])));
				}
			else	{
				break; //exit early once the end of hotw is reached.
				}
			}
		$('#hotwMenu').slideDown();
		$(document.body).one('click',function(){
			$('#hotwButton').removeClass('ui-state-hover');
			$menu.slideUp();
			});
		return false;
		});



				
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				dump('BEGIN admin_orders.callbacks.init.onError');
				}
			}
		}, //callbacks


////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {

			}, //Actions



		tlcFormats : {
			
			//this tlcformat gets run AFTER the image has been appended/replaced. It needs the data-attributes set.
			srcset : function(data,thisTLC)	{
//				dump(" -> srcset data: "); dump(data,'dir');
				if(data.value)	{
					var argObj = thisTLC.args2obj(data.command.args,data.globals); //this creates an object of the args
					var srcset = new Array();
//					dump(" -> argObj"); dump(argObj,'dir');
					if(argObj.views)	{
//						dump(" -> argObj.views IS set");
						var viewArr = argObj.views.split(','), L = viewArr.length;
						for(var i = 0; i < L; i += 1)	{
							var obj = _app.u.kvp2Array(viewArr[i]), string = '';
							string = thisTLC.makeImageURL({'width':obj.w,'height':obj.h,'data-media':data.value,'data-bgcolor':'ffffff'});
							if(obj.vp)	{string += " "+obj.vp;}
							if(obj.dpi)	{string += " "+obj.dpi;}
							srcset.push(string);
							}
						data.globals.binds[data.globals.focusBind] = srcset.join(',');
						}
					}
				return true; //continue processing tlc
				},
			
			prodthumbs : function(data,thisTLC)	{
				
				var attribs = data.value; //shortcut.
				if(attribs['zoovy:prod_image2'])	{
//					dump(" -> image 2 is set.");
					var $ul = $("<ul>").addClass('prodDetailThumbs');
					for(var i = 1; i <= 99; i++)	{
						if(attribs['zoovy:prod_image'+i])	{
							$ul.append("<li class='prodDetailThumb'><a href='"+thisTLC.makeImageURL({'data-media':attribs['zoovy:prod_image'+i],'data-bgcolor':'ffffff'})+"' data-gallery='gallery'><img src='"+thisTLC.makeImageURL({'width':50,'height':50,'data-media':attribs['zoovy:prod_image'+i],'data-bgcolor':'ffffff'})+"' alt=''  width='50' height='50' /></a></li>");
							}
						else	{
							break; //once an break in the images is hit, end the loop (basically requires images to be consecutive)
							//image not set.
							}
						}
					data.globals.binds[data.globals.focusBind] = $ul;
					}
				else	{
//					dump(" -> image 2 is NOT set.");
					//if image2 isn't set, skip em all.
					}
				return true;
				}		
			
			},

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {

			imageurlhref : function($tag,data)	{
				data.bindData.name = (data.bindData.valuePretext) ? data.bindData.valuePretext+data.value : data.value;
				data.bindData.w = $tag.attr('width');
				data.bindData.h = $tag.attr('height');
				data.bindData.tag = 0;
				$tag.attr('href',_app.u.makeImage(data.bindData)); //passing in bindData allows for using
				}
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {


			formatInfoObj4HOTW : function (sotw){
				var r; //what is returned. a 'pretty' text for this history item.
				switch(sotw.pageType)	{
					case 'product':
						r = "product: "+((_app.data['appProductGet|'+sotw.pid]) ?  _app.data['appProductGet|'+sotw.pid]['%attribs']['zoovy:prod_name'] : sotw.pid);
						break;
					
					case 'category':
						r = "category: "+((_app.data['appNavcatDetail|'+sotw.navcat]) ?  _app.data['appNavcatDetail|'+sotw.navcat].pretty : sotw.navcat);
						break;
					
					case 'homepage':
						r = "Home";
						break;
					
					case 'search':
						r = "Search: "+sotw.KEYWORDS;
						break;
					
					case 'cart':
						r = 'Cart';
						break;
			
					case 'checkout':
						r = 'Checkout';
						break;
			
					default:
						r = sotw.pageType + ': '+sotw.show;
					}
				return r;
				}


			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}