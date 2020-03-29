function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

(function($){

	console.debug('init')

	var sendAnalyticsEvent = function (eventLabel) {
		gtag('event', eventLabel, {
		  'event_category': 'Share',
		  'event_label': eventLabel,
		  'value': 1
		})
	}

	$('.share a.btn').on('click', function(){
		var href = $(this).attr('href'),
			eventLabel = ""
		
		if( href.indexOf('twitter.com') >= 0 )
			eventLabel = 'Twitter';
		else if( href.indexOf('wa.me') >= 0 )
			eventLabel = 'Whatsapp';
		else if( href.indexOf('facebook.com') >= 0 )
			eventLabel = 'Facebook';

		console.debug('Share on '+eventLabel)

		sendAnalyticsEvent(eventLabel)
	})
        
})(jQuery);