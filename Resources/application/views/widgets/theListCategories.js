(function() {
    he.register('theListCategories', function(args) {

        var v = he.create('View', {
            height: '210',
            top: args.top ? args.top : 0,
            width: 320,
            zIndex: 99,
            layout: 'composite'
        });

        v.add(he.create('ImageView', 'eventsBackground'));

        var music = he.create('ImageView', 'musicIcon');
        v.add(music);
        music.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('music', 14);
        });
        var comedy = he.create('ImageView', 'comedyIcon');
        v.add(comedy);
        comedy.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('comedy', 4);
        });
        var days_out = he.create('ImageView', 'daysOutIcon');
        v.add(days_out);
        days_out.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('days_out', 5);
        });
        var visual_art = he.create('ImageView', 'visualArtIcon');
        v.add(visual_art);
        visual_art.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('visual_art', 7);
        });

        var theatre = he.create('ImageView', 'theatreIcon');
        v.add(theatre);
        theatre.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('theatre', 12);
        });
        var family = he.create('ImageView', 'familyIcon');
        v.add(family);
        family.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('family', 8);
        });
        var cinema = he.create('ImageView', 'cinemaIcon');
        v.add(cinema);
        cinema.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('cinema', 9);
        });
        var sport = he.create('ImageView', 'sportIcon');
        v.add(sport);
        sport.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('sport', 11);
        });

        var clubs = he.create('ImageView', 'clubsIcon');
        v.add(clubs);
        clubs.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('clubs', 13);
        });
        var lgbt = he.create('ImageView', 'lgbtIcon');
        v.add(lgbt);
        lgbt.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('lgbt', 15);
        });
        var talks = he.create('ImageView', 'talksIcon');
        v.add(talks);
        talks.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('talks', 16);
        });
        var books = he.create('ImageView', 'booksIcon');
        v.add(books);
        books.addEventListener('click', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('books', 17);
        });


        var everything = he.create('View', 'showMeEverything');
        var thelist = he.create('ImageView', 'theListIcon');
        var everythingButton = he.create('contactButton', {type: 'everything', textleft: 15, fontsize: 15});

		thelist.top = 9;
		thelist.right = 10;

	    everything.add(everythingButton);
	    everything.height = 65;
	    everything.width = Ti.UI.FILL;
	    everything.left = 0;
	    everything.backgroundColor = '#ffffff';
	    everythingButton.width = 200;
	    everythingButton.left = 10;
	    everythingButton.top = 9;
	    everything.top = 156;
	    everything.add(thelist);
        v.add(everything);


        everythingButton.addEventListener('touchend', function(){
        	// gsm.actInd.show();
        	openWhatsOnResults('all', 0);
        });

        function openWhatsOnResults( /* String */ type, /* Number */ id) {
        	var whatsOnResults = he.create('whatsOnResults', {type: type, id: id, navBarHidden: true});
        	navigationController.open( whatsOnResults );
        }

        //var theatre = he.create('ImageView');
        //var family = he.create('ImageView');

        return v;
    });
})();
