(function() {
    he.register('titleBar', function(args) {
    	
        var v = he.create('View', 'titleBar', {
            height: '50',
            top: args.top ? args.top : 0,
            width: app.deviceWidth,
            zIndex: args.zIndex ? args.zIndex : 999
        });
        
        // v.add(he.create('ImageView', {width: 77, height:50, left: 10, top:0, canScale: false, image: '/application/assets/images/style_HOGMANY/title_logo.png'}));
        if(args.title){
        	v.add(he.create('Label', 'titleBarLabel', {text: args.title}));        
        } /*else if(args.useSwitch === true) {
        	var thePicker = he.create('Picker', {columns: 1, zIndex: 100, left: 100, height: 25, font: {fontSize: 12}, right: 10, top:3, bottom:3});
			var data = [];
			data.push(he.create('PickerRow', {title: 'Shopping'}));
			data.push(he.create('PickerRow', {title: 'Lifestyle'}));
			thePicker.add(data);
			v.add(thePicker);
        } */
       
       
            
        return v;
    });
})();
