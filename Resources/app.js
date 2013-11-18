var db_version = 'db_v16';

// var rebrand          = 'gcmb';
// var rebrand          = 'sms';
// Atanas: People make Glasgow rebrand (Official Glasgow Guide)
var rebrand = 'pmg';

(function(){
	// catch the db installation
	if (!Titanium.App.Properties.getString('DB_installed_'+db_version)) {

		var conn = Titanium.Database.install('application/rebrands/'+rebrand+'/'+db_version+'.sql', db_version);
		conn.close();
		Titanium.App.Properties.setString('DB_installed', 'true');

	}
})();

// Atanas: Check for iOS 7
// http://docs.appcelerator.com/titanium/latest/#!/guide/iOS_7_Migration_Guide
var ios7 = false;
if (Titanium.Platform.name == 'iPhone OS')
{
	var local_version = Titanium.Platform.version.split(".");
	var local_major = parseInt(local_version[0],10);

	// Can only test this support on a 3.2+ device
	if (local_major >= 7)
	{
		ios7 = true;
	}
}

// All application functionality is namespaced here
var app              = {};
app.dbInstallDateYMD = '2013-02-06';
app.dbInstallDateDMY = '06-02-2013';
app.latitude         = '52.502012';
app.longitude        = '-1.888275';
app.accuracy         = '';
app.deviceWidth      = Ti.Platform.displayCaps.platformWidth;
app.deviceHeight     = Ti.Platform.displayCaps.platformHeight;


// Atanas: Twitter integration
var Codebird = require("application/libraries/codebird");
var globalCodebird = new Codebird();
globalCodebird.setConsumerKey('tzzjee2gacZQGPPkFZ4Q', 'fmfh53kOrDH3Wc0d7uvicAyx2U38tOYmATJBRzGMn0');

function http_build_query (formdata, numeric_prefix, arg_separator) {
    // Generates a form-encoded query string from an associative array or object.
    //
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/http_build_query
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Legaev Andrey
    // +   improved by: Michael White (http://getsprink.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +    revised by: stag019
    // +   input by: Dreamer
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: urlencode
    // *     example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');
    // *     returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
    // *     example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
    // *     returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'
    var value, key, tmp = [],
        that = this;

    var _http_build_query_helper = function (key, val, arg_separator) {
        var k, tmp = [];
        if (val === true) {
            val = "1";
        } else if (val === false) {
            val = "0";
        }
        if (val !== null && typeof(val) === "object") {
            for (k in val) {
                if (val[k] !== null) {
                    tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
                }
            }
            return tmp.join(arg_separator);
        } else if (typeof(val) !== "function") {
            return that.urlencode(key) + "=" + that.urlencode(val);
        } else {
            throw new Error('There was an error processing for http_build_query().');
        }
    };

    if (!arg_separator) {
        arg_separator = "&";
    }
    for (key in formdata) {
        value = formdata[key];
        if (numeric_prefix && !isNaN(key)) {
            key = String(numeric_prefix) + key;
        }
        tmp.push(_http_build_query_helper(key, value, arg_separator));
    }

    return tmp.join(arg_separator);
}

function urlencode (str) {
    // URL-encodes string
    //
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/urlencode
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Lars Fischer
    // +      input by: Ratheous
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Joris
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // %          note 1: This reflects PHP 5.3/6.0+ behavior
    // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
    // %        note 2: pages served as UTF-8
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
    str = (str + '').toString();

    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    	replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

var MapModule;
app.newMapView = function( height ) {
  app.mapView = null;
  // Atanas: Add the Maps code here
  if (Ti.Platform.name == 'android') {
  	if( app.mapView ) {
  		// Skip
  	} else {
  		// Atanas:
		MapModule = require('ti.map');
		var rc = MapModule.isGooglePlayServicesAvailable();
		switch (rc) {
    		case MapModule.SUCCESS:
        		Ti.API.info('Google Play services is installed.');
        		break;
    		case MapModule.SERVICE_MISSING:
        		alert('Google Play services is missing. Please install Google Play services from the Google Play store.');
        		break;
    		case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
        		alert('Google Play services is out of date. Please update Google Play services.');
        		break;
    		case MapModule.SERVICE_DISABLED:
       			alert('Google Play services is disabled. Please enable Google Play services.');
        		break;
    		case MapModule.SERVICE_INVALID:
        		alert('Google Play services cannot be authenticated. Reinstall Google Play services.');
        		break;
    		default:
        		alert('Unknown error.');
        		break;
		}
  		app.mapView = MapModule.createView({
    		mapType: MapModule.NORMAL_TYPE,
  			region: {
  				latitude: app.latitude,
  				longitude: app.longitude,
  				latitudeDelta: 0.01,
  				longitudeDelta: 0.01
  			},
  			animate: true,
  			regionFit: true,
  			userLocation: true,
  			height: height || app.deviceHeight / 2,
  			width: app.deviceWidth
  		});
  	}
  } else {
  	app.mapView = Titanium.Map.createView({
  		mapType: Titanium.Map.STANDARD_TYPE,
  		region: {
  			latitude: app.latitude,
  			longitude: app.longitude,
  			latitudeDelta: 0.01,
  			longitudeDelta: 0.01
  		},
  		animate: true,
  		regionFit: true,
  		userLocation: true,
  		height: height || app.deviceHeight / 2,
  		width: app.deviceWidth
  	});
  }
};
app.newMapView();

// Move all local 'toExternal' files to external storage, if available
app.externalFiles = {};
app.mapBadges = {};

app.currentWindow;
app.previousWindow = [];


Ti.API.info(Ti.Platform.name);

var platform = Ti.Platform.name == 'iPhone OS' ? 'iOS' : 'Android';
var directoryPath = (platform == 'Android') ? '../../' : '';

var iconFont  	= 'Icon-Font';
var bodyFont	= (platform == 'Android') ? 'Semplicita-Pro-Medium' : 'Semplicita Pro';
var lastOpenedWindow  = '';

// Setup analytics tracking
// var Analytics = require('/application/libraries/analytics').Analytics;
// var analytics = new Analytics('UA-970223-73');
// analytics.start(5);

GoogleAnalytics = require("com.thinkorange.google.analytics");
GoogleAnalytics.startTracker({
    accountID: 'UA-970223-73',
    debug: true
});
// GoogleGoogleAnalytics.trackPageView('/');
GoogleAnalytics.setAnonymizeIp(true);
GoogleAnalytics.setSampleRate(95);

function get_html_translation_table (table, quote_style) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philip Peterson
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: noname
  // +   bugfixed by: Alex
  // +   bugfixed by: Marco
  // +   bugfixed by: madipta
  // +   improved by: KELAN
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Frank Forte
  // +   bugfixed by: T.Wild
  // +      input by: Ratheous
  // %          note: It has been decided that we're not going to add global
  // %          note: dependencies to php.js, meaning the constants are not
  // %          note: real constants, but strings instead. Integers are also supported if someone
  // %          note: chooses to create the constants themselves.
  // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
  // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
  var entities = {},
    hash_map = {},
    decimal;
  var constMappingTable = {},
    constMappingQuoteStyle = {};
  var useTable = {},
    useQuoteStyle = {};

  // Translate arguments
  constMappingTable[0] = 'HTML_SPECIALCHARS';
  constMappingTable[1] = 'HTML_ENTITIES';
  constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
  constMappingQuoteStyle[2] = 'ENT_COMPAT';
  constMappingQuoteStyle[3] = 'ENT_QUOTES';

  useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
  useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

  if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
    throw new Error("Table: " + useTable + ' not supported');
    // return false;
  }

  entities['38'] = '&amp;';
  if (useTable === 'HTML_ENTITIES') {
    entities['160'] = '&nbsp;';
    entities['161'] = '&iexcl;';
    entities['162'] = '&cent;';
    entities['163'] = '&pound;';
    entities['164'] = '&curren;';
    entities['165'] = '&yen;';
    entities['166'] = '&brvbar;';
    entities['167'] = '&sect;';
    entities['168'] = '&uml;';
    entities['169'] = '&copy;';
    entities['170'] = '&ordf;';
    entities['171'] = '&laquo;';
    entities['172'] = '&not;';
    entities['173'] = '&shy;';
    entities['174'] = '&reg;';
    entities['175'] = '&macr;';
    entities['176'] = '&deg;';
    entities['177'] = '&plusmn;';
    entities['178'] = '&sup2;';
    entities['179'] = '&sup3;';
    entities['180'] = '&acute;';
    entities['181'] = '&micro;';
    entities['182'] = '&para;';
    entities['183'] = '&middot;';
    entities['184'] = '&cedil;';
    entities['185'] = '&sup1;';
    entities['186'] = '&ordm;';
    entities['187'] = '&raquo;';
    entities['188'] = '&frac14;';
    entities['189'] = '&frac12;';
    entities['190'] = '&frac34;';
    entities['191'] = '&iquest;';
    entities['192'] = '&Agrave;';
    entities['193'] = '&Aacute;';
    entities['194'] = '&Acirc;';
    entities['195'] = '&Atilde;';
    entities['196'] = '&Auml;';
    entities['197'] = '&Aring;';
    entities['198'] = '&AElig;';
    entities['199'] = '&Ccedil;';
    entities['200'] = '&Egrave;';
    entities['201'] = '&Eacute;';
    entities['202'] = '&Ecirc;';
    entities['203'] = '&Euml;';
    entities['204'] = '&Igrave;';
    entities['205'] = '&Iacute;';
    entities['206'] = '&Icirc;';
    entities['207'] = '&Iuml;';
    entities['208'] = '&ETH;';
    entities['209'] = '&Ntilde;';
    entities['210'] = '&Ograve;';
    entities['211'] = '&Oacute;';
    entities['212'] = '&Ocirc;';
    entities['213'] = '&Otilde;';
    entities['214'] = '&Ouml;';
    entities['215'] = '&times;';
    entities['216'] = '&Oslash;';
    entities['217'] = '&Ugrave;';
    entities['218'] = '&Uacute;';
    entities['219'] = '&Ucirc;';
    entities['220'] = '&Uuml;';
    entities['221'] = '&Yacute;';
    entities['222'] = '&THORN;';
    entities['223'] = '&szlig;';
    entities['224'] = '&agrave;';
    entities['225'] = '&aacute;';
    entities['226'] = '&acirc;';
    entities['227'] = '&atilde;';
    entities['228'] = '&auml;';
    entities['229'] = '&aring;';
    entities['230'] = '&aelig;';
    entities['231'] = '&ccedil;';
    entities['232'] = '&egrave;';
    entities['233'] = '&eacute;';
    entities['234'] = '&ecirc;';
    entities['235'] = '&euml;';
    entities['236'] = '&igrave;';
    entities['237'] = '&iacute;';
    entities['238'] = '&icirc;';
    entities['239'] = '&iuml;';
    entities['240'] = '&eth;';
    entities['241'] = '&ntilde;';
    entities['242'] = '&ograve;';
    entities['243'] = '&oacute;';
    entities['244'] = '&ocirc;';
    entities['245'] = '&otilde;';
    entities['246'] = '&ouml;';
    entities['247'] = '&divide;';
    entities['248'] = '&oslash;';
    entities['249'] = '&ugrave;';
    entities['250'] = '&uacute;';
    entities['251'] = '&ucirc;';
    entities['252'] = '&uuml;';
    entities['253'] = '&yacute;';
    entities['254'] = '&thorn;';
    entities['255'] = '&yuml;';
  }

  if (useQuoteStyle !== 'ENT_NOQUOTES') {
    entities['34'] = '&quot;';
  }
  if (useQuoteStyle === 'ENT_QUOTES') {
    entities['39'] = '&#39;';
  }
  entities['60'] = '&lt;';
  entities['62'] = '&gt;';


  // ascii decimals to real symbols
  for (decimal in entities) {
    if (entities.hasOwnProperty(decimal)) {
      hash_map[String.fromCharCode(decimal)] = entities[decimal];
    }
  }

  return hash_map;
}

function strtotime (str, now) {
    // http://kevin.vanzonneveld.net
    // +   original by: Caio Ariede (http://caioariede.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: David
    // +   improved by: Caio Ariede (http://caioariede.com)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Wagner B. Soares
    // +   bugfixed by: Artur Tchernychev
    // %        note 1: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    // *     example 1: strtotime('+1 day', 1129633200);
    // *     returns 1: 1129719600
    // *     example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    // *     returns 2: 1130425202
    // *     example 3: strtotime('last month', 1129633200);
    // *     returns 3: 1127041200
    // *     example 4: strtotime('2009-05-04 08:30:00');
    // *     returns 4: 1241418600
    var i, l, match, s, parse = '';

    str = str.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces
    str = str.replace(/[\t\r\n]/g, ''); // unecessary chars
    if (str === 'now') {
        return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
    } else if (!isNaN(parse = Date.parse(str))) {
        return parse / 1000 | 0;
    } else if (now) {
        now = new Date(now * 1000); // Accept PHP-style seconds
    } else {
        now = new Date();
    }

    str = str.toLowerCase();

    var __is = {
        day: {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        },
        mon: [
            'jan',
            'feb',
            'mar',
            'apr',
            'may',
            'jun',
            'jul',
            'aug',
            'sep',
            'oct',
            'nov',
            'dec'
        ]
    };

    var process = function (m) {
        var ago = (m[2] && m[2] === 'ago');
        var num = (num = m[0] === 'last' ? -1 : 1) * (ago ? -1 : 1);

        switch (m[0]) {
        case 'last':
        case 'next':
            switch (m[1].substring(0, 3)) {
            case 'yea':
                now.setFullYear(now.getFullYear() + num);
                break;
            case 'mon':
                now.setMonth(now.getMonth() + num);
                break;
            case 'wee':
                now.setDate(now.getDate() + (num * 7));
                break;
            case 'day':
                now.setDate(now.getDate() + num);
                break;
            case 'hou':
                now.setHours(now.getHours() + num);
                break;
            case 'min':
                now.setMinutes(now.getMinutes() + num);
                break;
            case 'sec':
                now.setSeconds(now.getSeconds() + num);
                break;
            default:
                var day = __is.day[m[1].substring(0, 3)];
                if (typeof day !== 'undefined') {
                    var diff = day - now.getDay();
                    if (diff === 0) {
                        diff = 7 * num;
                    } else if (diff > 0) {
                        if (m[0] === 'last') {
                            diff -= 7;
                        }
                    } else {
                        if (m[0] === 'next') {
                            diff += 7;
                        }
                    }
                    now.setDate(now.getDate() + diff);
                }
            }
            break;

        default:
            if (/\d+/.test(m[0])) {
                num *= parseInt(m[0], 10);

                switch (m[1].substring(0, 3)) {
                case 'yea':
                    now.setFullYear(now.getFullYear() + num);
                    break;
                case 'mon':
                    now.setMonth(now.getMonth() + num);
                    break;
                case 'wee':
                    now.setDate(now.getDate() + (num * 7));
                    break;
                case 'day':
                    now.setDate(now.getDate() + num);
                    break;
                case 'hou':
                    now.setHours(now.getHours() + num);
                    break;
                case 'min':
                    now.setMinutes(now.getMinutes() + num);
                    break;
                case 'sec':
                    now.setSeconds(now.getSeconds() + num);
                    break;
                }
            } else {
                return false;
            }
            break;
        }
        return true;
    };

    match = str.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);
    if (match !== null) {
        if (!match[2]) {
            match[2] = '00:00:00';
        } else if (!match[3]) {
            match[2] += ':00';
        }

        s = match[1].split(/-/g);

        s[1] = __is.mon[s[1] - 1] || s[1];
        s[0] = +s[0];

        s[0] = (s[0] >= 0 && s[0] <= 69) ? '20' + (s[0] < 10 ? '0' + s[0] : s[0] + '') : (s[0] >= 70 && s[0] <= 99) ? '19' + s[0] : s[0] + '';
        return parseInt(this.strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2]) + (match[4] ? match[4] / 1000 : ''), 10);
    }

    var regex = '([+-]?\\d+\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)' + '|(last|next)\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))' + '(\\sago)?';

    match = str.match(new RegExp(regex, 'gi')); // Brett: seems should be case insensitive per docs, so added 'i'
    if (match === null) {
        return false;
    }

    for (i = 0, l = match.length; i < l; i++) {
        if (!process(match[i].split(' '))) {
            return false;
        }
    }

    return now.getTime() / 1000 | 0;
}


function html_entity_decode (string, quote_style) {
  // http://kevin.vanzonneveld.net
  // +   original by: john (http://www.jd-tech.net)
  // +      input by: ger
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +   improved by: marc andreu
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Ratheous
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Nick Kolosov (http://sammy.ru)
  // +   bugfixed by: Fox
  // -    depends on: get_html_translation_table
  // *     example 1: html_entity_decode('Kevin &amp; van Zonneveld');
  // *     returns 1: 'Kevin & van Zonneveld'
  // *     example 2: html_entity_decode('&amp;lt;');
  // *     returns 2: '&lt;'
  var hash_map = {},
    symbol = '',
    tmp_str = '',
    entity = '';
  tmp_str = string.toString();

  if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
    return false;
  }

  // fix &amp; problem
  // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
  delete(hash_map['&']);
  hash_map['&'] = '&amp;';

  for (symbol in hash_map) {
    entity = hash_map[symbol];
    tmp_str = tmp_str.split(entity).join(symbol);
  }
  tmp_str = tmp_str.split('&#039;').join("'");

  return tmp_str;
}

if (false && Ti.Platform.name === 'iPhone OS'){
	/*
	Ti.include(
		'/application/libraries/gsm.js',

		'/application/libraries/helium.js',
		'/application/libraries/joli.js',
		'/application/libraries/navigationController.js',
		'/application/libraries/geolib.js',
		//'/application/libraries/jLinq.js',

		'/application/phpjs/date.js',
		'/application/phpjs/ucwords.js',
		'/application/phpjs/strtotime.js',

		'/application/styles/default.js',

		'/application/models/adverts.js',
		'/application/models/categories.js',
		'/application/models/images.js',
		'/application/models/offers.js',
		'/application/models/stores.js',
		'/application/models/events.js',
		'/application/models/events_categories.js',
		'/application/models/performances.js',
		'/application/models/categories_stores.js',
		'/application/models/offers_stores.js',
		'/application/models/highlights.js',

		'/application/models/setup.js'
	);

	Titanium.App.Properties.setString('lastUpdate', 'never');
	Titanium.App.Properties.setString('lastUpdateEventsCategories', 'never');
	Titanium.App.Properties.setString('lastUpdateCategories', 'never');
	Titanium.App.Properties.setString('lastUpdateEvents', 'never');
	Titanium.App.Properties.setString('lastUpdatePerformances', 'never');
	Titanium.App.Properties.setString('lastUpdateHighlights', 'never');
	//gsm.drop_database();
	gsm.clear_database();
	gsm.update();
	gsm.update_performances();
	gsm.update_list_categories(); // We're told this never changes
	gsm.update_list_events();
	gsm.update_list_events_categories();
	gsm.update_highlights();
	*/
}else{

	// require AdMob
	var admob = require("ti.admob");
	// require('application/libraries/date');

	Ti.include(
		'/application/libraries/gsm.js',
		// Atanas: Helium must have been used for unit testing
		// There is custom code added in helium.js
		'/application/libraries/helium.js',
		'/application/libraries/joli.js',
		'/application/libraries/navigationController.js',
		'/application/libraries/geolib.js',
		//'/application/libraries/jLinq.js',
		'/application/libraries/browser.js',
	    '/application/libraries/date.js',

		'/application/phpjs/date.js',
		'/application/phpjs/ucwords.js',
		'/application/phpjs/strtotime.js',

		'/application/models/adverts.js',
		'/application/models/categories.js',
		'/application/models/images.js',
		'/application/models/offers.js',
		'/application/models/stores.js',
		'/application/models/events.js',
		'/application/models/events_categories.js',
		'/application/models/performances.js',
		'/application/models/categories_stores.js',
		'/application/models/offers_stores.js',
		'/application/models/highlights.js',
		'/application/models/galleries.js',
		'/application/models/styles.js',

		'/application/models/setup.js',

		'/application/views/widgets/admob.js',
		'/application/views/widgets/actionBar.js',
		'/application/views/widgets/titleBar.js',
		'/application/views/widgets/theListCategories.js',
		'/application/views/widgets/travelCategories.js',
		'/application/views/widgets/carousel.js',
		'/application/views/widgets/badge.js',
		'/application/views/widgets/carousel_item.js',
		'/application/views/widgets/calendar.js',
		'/application/views/widgets/calendar_item.js',
		'/application/views/widgets/nearby_store.js',
		'/application/views/widgets/galleryLargeItem.js',
		'/application/views/widgets/homeTitleBar.js',
		'/application/views/widgets/backBtn.js',
		'/application/views/widgets/contactButton.js',
		'/application/views/widgets/cycle.js',

		'/application/views/windows/directory.js',
		'/application/views/windows/categories.js',
		'/application/views/windows/results.js',
		'/application/views/windows/detail.js',
		'/application/views/windows/whats_on.js',
		'/application/views/windows/travel.js',
		'/application/views/windows/info.js',
		'/application/views/windows/travel_results.js',
		'/application/views/windows/travel_map.js',
		'/application/views/windows/whats_on_results.js',
		'/application/views/windows/whats_on_detail.js',
		'/application/views/windows/image_view.js',
		'/application/views/windows/zoomable_image.js',
		'/application/views/windows/gallery.js',
		'/application/views/windows/gallery_large.js',
		'/application/views/windows/gallery_map_view.js',
		'/application/views/windows/map.js',
        // '/application/views/windows/cms-url.js',

		'/application/views/rows/directoryRow.js',
		'/application/views/rows/specialOfferRow.js',
		'/application/views/rows/categoryRow.js',
		'/application/views/rows/contactRow.js',
		'/application/views/rows/transportRow.js',
		'/application/views/rows/eventsRow.js',
		'/application/views/rows/offerRow.js',
		'/application/views/rows/tileView.js',

		'/application/styles/default.js'
	);

	var directoryWindow = he.create('DirectoryWindow', {navBarHidden: true});

	navigationController.open( directoryWindow );

	// gsm.drop_database();
	//gsm.clear_database();
	gsm.openedWindows = [];
	gsm.update();

	// gsm.update_list_categories(); // We're told this never changes


	function translateErrorCode(code) {
		if (code == null) {
			return null;
		}
		switch (code) {
			case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
				return "Location unknown";
			case Ti.Geolocation.ERROR_DENIED:
				return "Access denied";
			case Ti.Geolocation.ERROR_NETWORK:
				return "Network error";
			case Ti.Geolocation.ERROR_HEADING_FAILURE:
				return "Failure to detect heading";
			case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
				return "Region monitoring access denied";
			case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
				return "Region monitoring access failure";
			case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
				return "Region monitoring setup delayed";
		}
	}

	function updateLocation(){
		Ti.Geolocation.purpose = 'Finding nearby businesses';
		Titanium.Geolocation.getCurrentPosition(function(e){
			Ti.API.info(translateErrorCode(e.code));

			Ti.API.info('GOT CURRENT location' + JSON.stringify(e));

			try {
				app.longitude = e.coords.longitude;
				app.latitude = e.coords.latitude;
				app.accuracy = e.coords.accuracy;
			} catch(e){

			}

		});
	}


	setTimeout(function(){
		updateLocation();
	}, 2000);


	app.sortByName = function(a,b){

		return ((a.title == b.title) ? 0 : ((a.title > b.title) ? 1 : -1 ));
	};

	app.sortByDistance = function(a,b){
		Ti.API.info(JSON.stringify(a));
		Ti.API.info(JSON.stringify(b));
		return ((a.distance == b.distance) ? 0 : ((a.distance > b.distance) ? 1 : -1 ));
	};


	// 	 droid dont like this for some reason
	var isExternalStoragePresent = Ti.Filesystem.isExternalStoragePresent();
	var imageCaptureFile = undefined;
	if (isExternalStoragePresent) {
		(function() {
			var localFile, externalFile;

			localFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/maps/subway_map.png');
			externalFile = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'subway_map.png');
			externalFile.write(localFile.read());



			//app.externalFiles['subway_map.png'] = externalFile;

			Titanium.App.Properties.setString('subway_map', externalFile.nativePath);
			externalFile = null;

			localFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/maps/rail_map.png');
			externalFile = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'rail_map.png');
			externalFile.write(localFile.read());

			Titanium.App.Properties.setString('rail_map', externalFile.nativePath);
			externalFile = null;

			//app.externalFiles['rail_map.png'] = externalFile;

			localFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/maps/mobility_map.png');
			externalFile = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'mobility_map.png');
			externalFile.write(localFile.read());

			Titanium.App.Properties.setString('mobility_map', externalFile.nativePath);
			externalFile = null;
			//alert(Titanium.App.Properties.getString('mobility_map'));

			//app.externalFiles['mobility_map.png'] = externalFile;

		})();

	}


	Ti.API.info('Titanium.Platform.id: ' + Titanium.Platform.id);
	Ti.API.info('Titanium.Platform.locale: ' + Titanium.Platform.locale);
	Ti.API.info('Titanium.Platform.macaddress: ' + Titanium.Platform.macaddress);
	Ti.API.info('Titanium.Platform.model: ' + Titanium.Platform.model);
	Ti.API.info('Titanium.Platform.name: ' + Titanium.Platform.name);
	Ti.API.info('Titanium.Platform.netmask: ' + Titanium.Platform.netmask);
	Ti.API.info('Titanium.Platform.osname: ' + Titanium.Platform.osname);
	Ti.API.info('Titanium.Platform.ostype: ' + Titanium.Platform.ostype);
	Ti.API.info('Titanium.Platform.username: ' + Titanium.Platform.username);
	Ti.API.info('Titanium.Platform.version: ' + Titanium.Platform.version);


	var senderId = 'stylemileapp@gmail.com';

	if (platform == 'Android') {
		var c2dm = require('com.findlaw.c2dm');
		Ti.API.info("module is => " + c2dm);

		Ti.API.info('Registering...');
		c2dm.registerC2dm(senderId, {
		    success:function(e) {
		        Ti.API.info('JS registration success event: ' + e.registrationId);
		        // send the registration is to your server


		        // Malcolm this may be the bit you need to edit


		        var args = {
		        	"pushNotificationKey": e.registrationId,
		        	"deviceModel" : Titanium.Platform.model,
		        	"appId" : "HOGMANAY",
		        	"appVersion" : "1.0",
		        	"deviceType" : "ANDROID",
		        	"osVersion" : Titanium.Platform.version,
		        	"deviceKey" : Titanium.Platform.createUUID()
		        };

		      // Ti.API.info(JSON.parse(args));

		        var xhr = Titanium.Network.createHTTPClient();

				xhr.onerror = function(){
					// var response = Titanium.XML.parseString(this.responseText);
		    		Ti.API.info('Sorry, there was an error: ');
				};

				xhr.onload = function(){
					//Ti.API.info(this.responseData);
					/*
					if(this.responseText.length > 10){
						try {
							var response = Titanium.XML.parseString(this.responseText);
						} catch(e) {}
					}

					Ti.API.info('Response was: ' + response);
					*/
				};

				Ti.API.info('URL WILL BE: ' + 'http://seeglasgowapp.com/api/registerDevice?' + http_build_query(args, '', '&'));

				xhr.open('GET', 'http://seeglasgowapp.com/api/registerDevice?' + http_build_query(args, '', '&'));
				xhr.send();

		    },
		    error:function(e) {
		        Ti.API.error("Error during registration: "+e.error);

		        var message;
		        if(e.error == "ACCOUNT_MISSING") {
		            message = "No Google account found; you'll need to add one (in Settings/Accounts) in order to activate notifications";
		        } else {
		            message = "Error during registration: "+e.error;
		        }

		        Titanium.UI.createAlertDialog({
		            title: 'Push Notification Setup',
		            message: message,
		            buttonNames: ['OK']
		        }).show();
		    },
		    callback:function(e) // called when a push notification is received
		    {
		        Ti.API.info('JS message event: ' + JSON.stringify(e.data));

		        var intent = Ti.Android.createIntent({
		            action: Ti.Android.ACTION_MAIN,
		            flags: Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED,
		            className: 'com.swanify.glasgow.Activity',
		            packageName: 'com.swanify.glasgow'
		        });
		        intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

		        // This is fairly static: Not much need to be altered here
		        var pending = Ti.Android.createPendingIntent({
		            activity: Ti.Android.currentActivity,
		            intent: intent,
		            type: Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
		        });

		        var notification = Ti.Android.createNotification({
		            contentIntent: pending,
		            contentTitle: 'New message',
		            contentText: e.data.message,
		            tickerText: "New message"
		        });

		        Ti.Android.NotificationManager.notify(1, notification);
		    }
		});
	}
}

// facebook
// Make sure it's autorised, and do the function
function facebook(callback) {
	Ti.API.info('facebook!');
	if (Ti.Facebook.loggedIn) {
		Ti.API.info('User is logged into facebook');
		callback();
	} else {
		Ti.API.info('Try to log user into facebook');
		Ti.Facebook.appid = '424090987627217';
		Ti.Facebook.permissions = ['publish_stream']; // Permissions your app needs
		Ti.Facebook.addEventListener('login', function(e) {
			if (e.success) {
				// alert('Logged In');
				callback();
			} else if (e.error) {
				// alert(e.error);
			} else if (e.cancelled) {
				// alert("Canceled");
			}
		});
		Ti.API.info('Ti.Facebook.authorize: '+Ti.Facebook.authorize());
	}
}
// Wanna test logging in as new?
// Ti.Facebook.logout();


// Rate reminder
var rateReminder = function() {
	var stopAsking = Ti.App.Properties.hasProperty('stopAsking');
	if (!stopAsking) {

		var ask = function() {
			Ti.API.info('Reminding to rate...');
			var dialog = Ti.UI.createAlertDialog({
				cancel: 2,
				buttonNames: ['Yes please', 'Ask me later', 'No thanks'],
				message: 'Thanks for using our app, we hope you like it. Could you take a moment to rate it?',
				title: 'Like our App?'
			});
			dialog.addEventListener('click', function(e){
				if (e.index === e.source.cancel){
					Ti.API.info('StopAsking = true')
					Ti.App.Properties.setBool('stopAsking', true);
				}
				if (e.index == 0) {
					Ti.API.info('Woohoo! Rate that app!!');
					Ti.API.info('StopAsking = true')
					Ti.App.Properties.setBool('stopAsking', true);

					// Atanas:
					// Note: All the rebranded apps point to the original Glasgow app for ratings
					// Do we have to change that?
                    if (platform == 'Android') {
                        if (rebrand = 'sms') {
                            Ti.Platform.openURL('https://play.google.com/store/apps/details?id=com.nation1.gsws');
                        } else {
        					Ti.Platform.openURL('https://play.google.com/store/apps/details?id=com.nation1.gsws');
                        }
                    } else {
                        if (rebrand = 'sms') {
                            Ti.Platform.openURL('https://itunes.apple.com/gb/app/glasgow-scotland-with-style/id495663640?mt=8');
                        } else {
                            Ti.Platform.openURL('https://itunes.apple.com/gb/app/glasgow-scotland-with-style/id495663640?mt=8');
                        }
                    }
				} else {
					Ti.API.info('lastAsked = '+now);
					Ti.App.Properties.setInt('lastAsked', now);
				}
			});
			dialog.show();
		}

		var now = Math.round( new Date().getTime() / 1000 );
		var launches  = Ti.App.Properties.hasProperty('launchCount') ? Ti.App.Properties.getInt('launchCount') : 0;
		var lastAsked = Ti.App.Properties.hasProperty('lastAsked')   ? Ti.App.Properties.getInt('lastAsked')   : 0;

		if (launches == 3) {
			ask();
		} else if (launches > 3) {
			var askInterval = 60 * 60 * 24 * 2;
			if (lastAsked <= now - askInterval) {
				ask();
			} else {
				Ti.API.info('Too soon to ask to rate again.');
			}
		} else {
			Ti.API.info('Not been three launches yet.');
		}
		launches++;
		Ti.App.Properties.setInt('launchCount', launches);
		Ti.API.info('New launch count: '+launches);
	} else {
		Ti.API.info('Never asking to rate again, spoil sports.');
	}
}
rateReminder();

Ti.App.addEventListener('resume', function() {
    rateReminder();
    gsm.update();
    setTimeout(function(){
        updateLocation();
    }, 2000);
});

var lastResumeUpdate = new Date().getTime();

if (platform == 'Android') {
    directoryWindow.addEventListener('open', function() {
        directoryWindow.activity.addEventListener('resume', function() {

            if (lastResumeUpdate >= new Date().getTime() - (1800 * 1000)) return;

            lastResumeUpdate = new Date().getTime();
            rateReminder();
            gsm.update();
            setTimeout(function(){
                updateLocation();
            }, 2000);
        });
    });
}

