(function() {
	he.register('cmsUrlWindow', function(args) {

		var w = he.create('Window', {title: 'CMS URL'});

		var done = 0;

		var urlField = he.create('TextField', {
			left: 10,
			right: 10,
			top: 20,
			height: 40,
			value: gsm.gallery_url,
			backgroundColor: '#FFF'
		});
		w.add(urlField);

		var saveBtn = he.create('Button', {
			top: 40,
			left: 10,
			right: 10,
			title: 'Save'
		});
		saveBtn.addEventListener('click', function() {
			done = 0;
			saveBtn.title = 'Saving...';
			gsm.gallery_url = urlField.value;
			gsm.styles_url = urlField.value+'/styles';

			Titanium.App.Properties.setString('gallery_url', gsm.gallery_url);
			Titanium.App.Properties.setString('styles_url', gsm.styles_url);

			gsm.update_styles(doneCallback, errorCallback);
			gsm.update_gallery(doneCallback);
		});
		w.add(saveBtn);

		var doneCallback = function() {
			done++;
			if (done >= 2) {
				saveBtn.title = 'Done';
				alert('The app has updated, please fully close it and reopen to see the new styles.');
			}
		}
		var errorCallback = function() {
			saveBtn.title = 'Save';
			alert('There was a problem, please check the URL and try again.');
		}

		return w;
	});
})();
