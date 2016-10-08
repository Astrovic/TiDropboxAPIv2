// open a single window
var win = Ti.UI.createWindow({
    backgroundColor : 'white',
    title : "TiWebview"
});

// TODO: write your module tests here
var TiWebview = require('com.mobmaxime.TiWebview');
Ti.API.info("module is => " + TiWebview);

var button = Ti.UI.createButton({
    title : "Delete Cookies",
    top : "20dp",
    left : "20dp",
    width : "150dp",
    height : "30dp"
});
win.add(button);

button.addEventListener('click', function(e){
    TiWebview.deleteAllCoockie("github.com");
});

var webview = Ti.UI.createWebView({
    top : "50dp",
    bottom : "0dp",
    url : 'http://github.com/JigarM'
});

webview.addEventListener('load', function(e) {
    var url = e.url;
    
    Ti.API.info('Cookies of URL ==>  ' + url);
    var Cookies = TiWebview.listCookies(url);
    var count = 0;
    for (var key in Cookies) {
        Ti.API.info('Name ==> ' + key + ' and Value ==>: ' + Cookies[key]);
        count++;
    }

    if (Cookies.logged_in) {
        Ti.API.info('is logged_in? ==> ' + Cookies.logged_in);
    }

    alert('Total Cookies Count ==> ' + count);
});
win.add(webview);
win.open();
