/*
 * 	auto Height 1.1 - jQuery plugin
 *	developed by Denik (Oleg Denisenko)
 *	http://denik.od.ua/
 */
(function($){

	$.fn.autoHeight = function(o){
	
		var o = jQuery.extend({
			item: '',
			cols: '',
			plusNested: '',
			debug: false
		}, o),
		ah_containerIndex = 0;

		return this.each(function(index){
			var cont = $(this),
				item,
				cols;

			// Define variable
			cont.data('data', {});

			// Debug?
			if( cont.data('debug') ) o.debug = true;

			// Detect target
			if( cont.data('item')!=undefined ) item = cont.data('item');
			else if( o.item!='' ) item = o.item;
			else $.each(['.item','.entry','.itm','ent'], function(i,cl){
				if( cont.find('>'+ cl).length )
				{
					item = '>'+ cl;
					return ;
				}
			});
			var item = cont.find(item);
			if( ! item.length ) return;

			// Child items that need to be added to the height
			if( o.plusNested=='' && cont.data('plusnested')!=undefined )
			{
				o.plusNested = cont.data('plusnested');
			}
			
			AutoHeight(cont, item);

			cont.bind("DOMSubtreeModified",function(){
				updateHeight(cont, item);
			});

			// Update dom by resize
			$(window).resize(function(){
				updateHeight(cont, item);
			});
		});

		function updateHeight(cont, item)
		{
			var data = cont.data('data');

			if( data.lock ) return false;
			data.lock = true;

			if( data.timeoutId ) clearTimeout( data.timeoutId );
			
			data.timeoutId = setTimeout(function(){
				item.height('auto');
				AutoHeight(cont, item);
				data.lock = false;
			}, 50);
		}

		function AutoHeight(cont, item)
		{
			// Detect cols
			if( cont.data('cols')!=undefined ) cols = cont.data('cols');
			else if( o.cols!='' ) cols = o.cols;
			else cols = Math.floor(cont.innerWidth()/item.outerWidth());

			// Track container index
			if( cont.data('containerIndex') == undefined )
			{
				cont.data('containerIndex', ah_containerIndex++);
			}

			var contIndex = cont.data('containerIndex');

			if( o.debug ) {
				console.log('Container:', cont);
				console.log('cols: '+ cols);
			}

			var rowIndex = -1;
			for(var i=0; i<=item.length; i+=cols)
			{
				rowIndex++;
				var slice = item.slice(i, i+cols);
				var imgs = slice.find('img[src][src!=""]');
				var imagesTotal  = imgs.length,
					imagesLoaded = 0;

				if( imagesTotal )
				{
					if( o.debug ) console.log("C:"+contIndex+",R:"+rowIndex+": found "+imagesTotal+" image(s)");

					// WaitForImages
					waitForImages(imgs, function(){
						if( o.debug ) console.log("C:"+contIndex+",R:"+rowIndex+": All images loaded", this);
						slice.height( MaxHeight(slice) );
					});
				}
				else
				{
					if( o.debug ) console.log("C:"+contIndex+",R:"+rowIndex+": NOT found images");
					slice.height( MaxHeight(slice) );
				}
			}
		}

		/**
		 * Wait for load all images
		 * @param  {object}   imgs     jQuery images array ([img, img...])
		 * @param  {Function} callback
		 * @return {void}
		 */
		function waitForImages(imgs, callback)
		{
			var imagesLoaded = 0,
				imagesTotal  = imgs.length;

			var CheckDone = function(){
				if( imagesLoaded >= imagesTotal )
				{
					if( typeof(callback) == 'function' ) callback();
				}
			}

			imgs.one("load", function(){
				imagesLoaded++;
				CheckDone();
			}).each(function(){
				// fix for cached images
				if( this.complete ){
					imagesLoaded++;
					CheckDone();
				}
			});
		}

		function MaxHeight(items)
		{
			return Math.max.apply(null,items.map(function(){
				var height = $(this).height();
				if( o.plusNested!='' ) $(this).find(o.plusNested).each(function(){height+=$(this).height()});
				return height;
			}));
		}
	}
	$(document).ready(function(){
		$("[data-autoHeight]").autoHeight();
	});
})(jQuery);