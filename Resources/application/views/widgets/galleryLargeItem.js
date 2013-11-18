(function() {
	he.register('galleryLargeItem', function(image, height) {

		var v = Ti.UI.createView({});
		
		
		// var maskHolder = Ti.UI.createView({
			// height: Ti.UI.SIZE,
			// width: Ti.UI.SIZE
		// });
		
		var mask = Ti.UI.createView({
			height: 620,
			width: Ti.UI.SIZE
		});
		
		
		// maskHolder.add(mask);
	
		Ti.API.info(image.url);
		mask.add( Ti.UI.createImageView({
			image: image.url,
			width: Ti.UI.SIZE,
			preventDefaultImage: true
		}) );
		
	
		v.add(mask);
		
		var slider = Ti.UI.createView({
			height: 40,
			bottom: 0,
			backgroundColor: 'transparent'
		});	
		
		var imgtitle = image.title;
		
 		if (imgtitle.length > 33) {
				imgtitle = imgtitle.substr(0,33);
				imgtitle = imgtitle + '...';
		}
		
		slider.add(he.create('Label', {
			text: imgtitle,
			textAlign: 'center',
			color: '#FFF',
			top: 0,
			height: 40,
			width: Ti.UI.FILL,
			backgroundColor: '#555',
			font: {
				fontFamily: bodyFont
			}
		}));

		slider.add(he.create('Label', {
			left: 10,
			top: 0,
			height: 40,
			width: 40,
			color: '#FFF',
			font: {
				fontSize: 30,
				fontFamily: iconFont
			},
			text: 'J'
		}));

		var backgroundView = Ti.UI.createView({
			height: Ti.UI.Fill,
			top: 40,
			backgroundColor: '#000',
			opacity: 0.5
		});
		slider.add(backgroundView);

		slider.add(he.create('Label', {
			text: image.description,
			color: '#FFF',
			textAlign: 'center',
			top: 50,
			left: 10,
			right: 10,
			font: {
				fontFamily: bodyFont
			}
		}))

		// Animate up
		var open = Titanium.UI.createAnimation();
		if(platform == 'Android'){
			open.height = '100%';			
		} else {
			open.height = Ti.UI.FILL;
			
		}
		
		open.duration = 500;

		// Animate down
		var close = Titanium.UI.createAnimation();
		close.height = 40;
		close.duration = 500;
		
 
		slider.addEventListener('click', function() {
			
			if(platform == 'Android'){
			
				if (slider.open) {
					slider.height = 40;
					slider.open = false;
				} else {
					slider.height = '100%';
					slider.open = true;
				}			
				
			} else {
			
				if (slider.open) {
					slider.animate(close);
					slider.open = false;
				} else {
					slider.animate(open);
					slider.open = true;
				}	
			}
						
		});
		
		

		v.add(slider);

		return v;

	});
})();
