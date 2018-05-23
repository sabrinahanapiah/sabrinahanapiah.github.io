var logAdsLoad = false;
var error_reporting = true;

function GetParam(name) {
    var match = new RegExp(name + "=([^&]+)*", "i").exec(location.search);
    if (match == null)
	match = new RegExp(name + "=(.+)", "i").exec(location.search);
    if (match == null)
	return null;
    match = match + "";
    console.log('Matching on : '+match);
    //**convert match to a string
    result = match.split(",");
    return decodeURIComponent(result[1]);
}

function domainStatus(pageOptions, status, ra) {
    var stat = "caf";
    var f = chkf();
    if (window.console && window.console.log) {
	window.console.log(status);
	window.console.log(pageOptions);
	if (ra) {
	    window.console.log('requestAccepted');
	}
    }
    if (typeof status.error_code != "undefined") {
	stat = "error";
    }
    if (status.adult === true) {
	stat = "adult";
    }
    if (typeof status.faillisted != "undefined") {
	stat = "faillist";
    }
    var referrerbase = document.referrer;
    try {
	referrerbase = parent.document.referrer;
    } catch (e) {

    }
    var schan = GetParam('schannel');
    var vchan = '';
    if(schan > 0){
	vchan = '&schannel='+schan;
    }
    var acqid = null;
    acqid = GetParam('acqid');
    var acq_query = '';
    if(acqid){
	acq_query = '&acqid='+acqid;
    }
    
    if (((f.d_h == 1 && f.d_w == 1) || (f.d_h == 30 && f.d_w == 100)) && f.u_his == 100) {
	// Semalt Crap!
    } else {
	var a = "/status.php?domain=" + pageOptions.domainName + "&trackingtoken=" + pageOptions.vdToken + "&status=" + stat + "&u_his=" + f.u_his + "&u_h=" + f.u_h + "&u_w=" + f.u_w + "&d_h=" + f.d_h + "&d_w=" + f.d_w + "&u_top=" + f.u_top + "&u_left=" + f.u_left + vchan + acq_query + "&http_referrer=" + encodeURIComponent(referrerbase); //+"&refuri="+ encodeURIComponent(window.location.href);
	var b = document.createElement("iframe");
	b.setAttribute("src", a);
	b.setAttribute("width", 0);
	b.setAttribute("height", 0);
	b.style.display = "none";
	document.body.appendChild(b);
    }
    //r peters
    document.body.style.display = 'block'
}

function cafCallback(requestAccepted, status) {
    if (requestAccepted) {
	try {
	    if (status.feed == 'afs' && status.query != '') {
		// WS Results
		//view_ws_results($('#ws_results'), 10, '');
	    }
	    if (window.console && window.console.log) {
		console.log('requestAccepted in cafCallback');
		console.log(pageOptions);
	    }
	    domainStatus(pageOptions, status, true);
	} catch (e) {
	    if (window.console && window.console.log) {
		console.log(e);
	    }
	}
    } else {
	var errcode = (typeof status.error_code != "undefined") ? status.error_code : 0;
	logError('ERROR CODE', errcode);
	domainStatus(pageOptions, status, false);
	if (window.console && window.console.log) {
	    console.log(status);
	    console.log(pageOptions);
	}
	if (!status.adult && pageOptions.pubId.indexOf('adult') !== -1) {
	    if (window.console && window.console.log) {
		console.log('Client/Type MisMatch!!!!');
	    }
	    //status.error_code = 221;
	}
	switch (status.error_code) {
	    case 223:
	    case 222:
	    case 221:
		var newstat = (pageOptions.pubId.indexOf('adult') !== -1) ? 'clean' : 'adult';
		if (window.console && window.console.log) {
		    console.log('Client/Type MisMatch');
		    console.log(pageOptions.pubId + ' to ' + newstat);
		}
		window.location = "/?ado=" + newstat;
		break;
		// 207, 239, 240
	    case 207:
	    case 239:
	    case 240:
		window.location = "/cf.php";
		break;
	    case 225:
		// Redirect to HTML feed.    
		window.location.replace("http://dp.g.doubleclick.net/apps/domainpark/domainpark.cgi?client=ca-" + pageOptions.pubId + "&domain_name=" + pageOptions.domainName + "&output=html&drid=" + pageOptions.domainRegistrant);
		break;
	    default:
		// Failover
		// 241 Invalid DRID
		if (window.console && window.console.log) {
		    console.log('Failover');
		    console.log(pageOptions.pubId + ' ' + typeof status.error_code);
		}
		window.location = "/sf.php";
		break;
	}
    }
}

function adsLoad(containerName, adsLoaded) {
    if (adsLoaded) {
	// All is well
    } else {
	switch (containerName) {
	    case "afs_bottom_ads":
	    case "afs_top_ads":
	    case "dynads":
		// Failover
		//window.location = "/sf.php";
		//break;
	}
	if (logAdsLoad) {
	    // Log Them
	    logError(containerName, 0);
	}
    }
}

function chkf() {
    var a = {};
    if (window.screen)
	a.u_h = window.screen.height, a.u_w = window.screen.width;
    var doc = window.document;
    if (typeof window.innerWidth === 'number') {
	a.d_w = window.innerWidth;
	a.d_h = window.innerHeight;
    } else if (doc.documentElement !== undefined && doc.documentElement.clientWidth !== undefined && doc.documentElement.clientWidth !== 0) {
	a.d_w = doc.documentElement.clientWidth;
	a.d_h = doc.documentElement.clientHeight;
    } else if (doc.body !== undefined && doc.body.clientWidth !== undefined) {
	a.d_w = doc.body.clientWidth;
	a.d_h = doc.body.clientHeight;
    } else {
	a.d_w = '';
	a.d_h = '';
    }

    if (typeof window.screenLeft === 'number') {
	a.u_top = window.screenTop;
	a.u_left = window.screenLeft;
    } else if (window.screenX !== undefined) {
	a.u_top = window.screenY;
	a.u_left = window.screenX;
    } else {
	a.u_top = '';
	a.u_left = '';
    }
    a.u_his = window.history.length;

    return a;
}

function view_ws_results(jobj, num_ads, feedback_url) {
    var html = '';
    try {
	if (num_ads < 5) {
	    num_ads = 5;
	}
	$.ajaxSetup({cache: false}); // turn off ie caching
	$.getJSON('/websearch.php',
		{q: GetParam('query'), max: num_ads},
	function (data) {
	    $.ajaxSetup({cache: true});
	    if (data && data.results.length > 0) {
		html = '<ul>';
		$.each(data.results, function (idx, r) {
		    html += build_ws(r);
		});
		html += '</ul>';

		jobj.html(html);
		jobj.find('li:first').addClass('first');
		jobj.find('li:last').addClass('last');
		jobj.find('ul').prepend('<li class="head">Search Results</li>');
	    }
	});

    } catch (e) {
	console.log("view_ws Error:" + e);
    }
}

function build_ws(ad) {
    var tm = GetParam('query');
    html = '';
    html += '<li><a href="' + ad.urle + '" class="adtitle" target="_blank">' + gpolicify(tm, ad.title) + '</a><br>';
    html += '<span class="adtext">' + gpolicify(tm, ad.description);
    html += '</span>';
    html += '<a href="' + ad.urle + '" class="adurl" >';
    html += gpolicify(tm, ad.url) + '</a></li>';

    return html;
}

function build_onclick(type, ty, tm) {
    var html = '';

    try {
	html += " onclick=\"behavior('" + type + "','" + ty.replace("'", "") + "','" + tm + "');\" ";
    } catch (e) {
	log("Build Onclick Error:" + e, 'err');
    }

    return html;
}

function gpolicify(term, str) {

    term = decodeURIComponent(term).replace("'", "").replace("+", " ");
    var terms = term.split(" ");

    for (var i = 0, len = terms.length; i < len; i++) {
	srctm = terms[i];
	var re = new RegExp(srctm, "gi");
	str = str.replace(re, '<strong>$&</strong>');
    }

    return str;
}

function logError(container, errcode) {
    if (error_reporting == true) {
	try {

	    a = "/err.php?action=caf&domain=" + pageOptions.domainName + "&pt=" + pageOptions.page_type + "&tt=" + pageOptions.vdToken + "&ec=" + errcode + "&ct=" + container + "&tm=" + encodeURIComponent(GetParam('query'));
	    b = document.createElement("iframe");
	    b.setAttribute("src", a);
	    b.setAttribute("width", 0);
	    b.setAttribute("height", 0);
	    b.style.display = "none";
	    document.body.appendChild(b);
	} catch (e) {
	    if (window.console && window.console.log) {
		console.log(e);
	    }
	}
    }
}

