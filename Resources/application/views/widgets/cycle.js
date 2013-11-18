( function(){
	
    he.register('cycleButton', function(args) {
    	
    	v = he.create('View', {height:Ti.UI.SIZE, width:92});
    	
    	v.uparrow   	=  he.create('ImageView' , {image:directoryPath+'application/assets/images/GCMB/leftarrowup.png', height:30, width:46, left:0, top:0});
    	v.downarrow 	=  he.create('ImageView' , {image:directoryPath+'application/assets/images/GCMB/arrowrightup.png', height:30, width:46, left:46,  top:0});
		
		
		v.add(v.uparrow);
		v.add(v.downarrow);

    	return v;
    });
	
})();
