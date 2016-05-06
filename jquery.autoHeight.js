/*
 * 	auto Height 1.0 - jQuery plugin
 *	developed by Denik (Oleg Denisenko)
 *	http://denik.od.ua/
 */
(function($){

	$.fn.autoHeight = function(o){
	
		var o = jQuery.extend({
			item: '',
			cols: ''
		}, o);

		return this.each(function(index){
			var cont = $(this),
				item,
				cols;

			// Define variable
			cont.data('data', {});

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

			console.log('cols: '+ cols);

			for(i=0; i<= item.length; i+=cols)
			{
				var max = 0;

				item.slice(i,i+cols).height( MaxHeight(item.slice(i,i+cols)) );
			}
		}

		function MaxHeight(items)
		{
			return Math.max.apply(null,items.map(function(){return $(this).height()}));
		}
	}
	$("[data-autoHeight]").autoHeight();
})(jQuery);