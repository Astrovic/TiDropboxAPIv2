var TiDropbox = require("ti.dropbox").TiDropbox;

TiDropbox.init({
  APP_KEY: 'e9tribefg77q4wg', /*<YOUR APP KEY HERE>*/
  APP_SECRET: 'dkrhmji4z14k2wf', /*<YOUR APP SECRET HERE>*/
  redirectUri: 'https://astrovicapps.com/_apptest/tidropbox_cb.html', /*<YOUR OAuth2 Redirect URI SET TO DROPBOX APP CONSOLE>*/
  response_type: "code", // "token" or "code". Token flow expires after 4 hours!
  app_mime_scheme: "tidropbox" // *<YOUR APP MIME SCHEME HERE SET TO TIAPP.XML>*/
});

var dropboxAPIv2 = require("dropboxAPIv2").dropboxAPIv2;
var selectedMethod = "";
var isTablet = $.apiListTV.isTablet;

var apiList = [];
for(var methodStr in dropboxAPIv2){
    if(dropboxAPIv2.hasOwnProperty(methodStr)) {
      var methodStrLbl = Ti.UI.createLabel({
        left: "15dp",
        right : "120dp",
      	width: Ti.UI.SIZE,
      	height: Ti.UI.SIZE,
      	color: "#fff",
      	font: {
      		fontSize: isTablet ? "20sp" : "13sp",
      		fontWeight: "bold"
      	},
        text: methodStr
      });
      var infoLbl = Ti.UI.createLabel({
        right: isTablet ? "110dp" : "60dp",
        width: isTablet ? "80dp" : "50dp",
      	height: "40dp",
      	color: "#0bb1d5",
        backgroundColor: "#fff",
        borderRadius: 5,
      	font: {
      		fontSize: isTablet ? "20sp" : "16sp",
      		fontWeight: "bold"
      	},
        text : "Info",
        textAlign : "center"
      });
      var testLbl = Ti.UI.createLabel({
        right: isTablet ? "15dp" : "5dp",
      	width: isTablet ? "80dp" : "50dp",
      	height: "40dp",
      	color: "#0bb1d5",
        backgroundColor: "#fff",
        borderRadius: 5,
      	font: {
      		fontSize: isTablet ? "20sp" : "16sp",
      		fontWeight: "bold"
      	},
        text : "Test",
        textAlign : "center"
      });
      var apiRow = Ti.UI.createTableViewRow({methodStr:methodStr});
      apiRow.add(methodStrLbl);
      apiRow.add(infoLbl);
      if(methodStr.indexOf("auth")===-1){
        apiRow.add(testLbl);
      };
      apiList.push(apiRow);
    };
};
$.apiListTV.data = apiList;

function checkToken(){
  if(Ti.App.Properties.getString('DROPBOX_TOKENS',null)){
    $.loginBtn.logged = true;
    $.loginBtn.title = "Dropbox Logout";
    $.apiListTV.show();
  }else{
    $.loginBtn.logged = false;
    $.loginBtn.title = "Dropbox Login";
    $.apiListTV.hide();
  };
  $.activityBgView.hide();
};
checkToken();

function loginBtnClick(e) {
  checkToken();
  $.activityLbl.text = $.loginBtn.logged ? "Dropbox Logout..." : "Dropbox Login...";
  $.activityBgView.show();
  if(!$.loginBtn.logged){
    TiDropbox.generateAuthUrl(function(e){
      Ti.API.info("generateAuthUrl checkins response-> " + JSON.stringify(e));
      if(e.success){
        createTest();
      }else{
        Titanium.UI.createAlertDialog({
            title: "AUTH ACCESS TOKEN",
            message: e.msg,
            buttonNames: ['OK']
        }).show();
        checkToken();
      };
    });
  }else{
    TiDropbox.revokeAccessToken(function(e){
      Ti.API.info("revokeAccessToken checkins response-> " + JSON.stringify(e));
      Titanium.UI.createAlertDialog({
          title: "REVOKE ACCESS TOKEN",
          message: e.msg,
          buttonNames: ['OK']
      }).show();
      checkToken();
    });
    if(OS_IOS){
      removeCookieiOS();
    };
  };
}

function removeCookieiOS(){
  // To remove cookies on iOS use tiWebview module
  var TiWebview = require('com.mobmaxime.TiWebview');
  var url = "https://www.dropbox.com";
  var wv = Ti.UI.createWebView({
      url: url,
      visible : false
  });
  $.index.add(wv)
  wv.addEventListener('load',removeCookies);
  function removeCookies(e){
    var raw_cookies = TiWebview.listCookies(url);
    Ti.API.info('\n\n\n**logout(): Cookies of URL "'+url+'" ==> '+ JSON.stringify(raw_cookies));
    Ti.API.info('\n**logout(): before deleteAllCoockie: ');
    for (var key in raw_cookies) {
      Ti.API.info('**Name ==> ' + key + ' and Value ==>: ' + raw_cookies[key]);
    };
    TiWebview.deleteAllCoockie("dropbox.com"); // require location, ("https://www.dropbox.com/etc..." ----> "dropbox.com")
    raw_cookies = TiWebview.listCookies(url);
    Ti.API.info('\n**logout(): after deleteAllCoockie --> Cookies of URL "'+url+'" ==> '+ JSON.stringify(raw_cookies));
    for (var key in raw_cookies) {
      Ti.API.info('**Name ==> ' + key + ' and Value ==>: ' + raw_cookies[key]);
    };
    wv.removeEventListener('load',removeCookies);
    $.index.remove(wv);
    wv = null;
    TiWebview =null;
  };
};

function onSuccessCallback(xhr) {
  $.activityBgView.hide();
    Ti.API.info("onSuccessCallback checkins response-> " + xhr.responseText);
    Titanium.UI.createAlertDialog({
        title: selectedMethod + ": METHOD SUCCESS",
        message: xhr.responseText,
        buttonNames: ['OK']
    }).show();
};

function onErrorCallback(e) {
  $.activityBgView.hide();
    Ti.API.info("onErrorCallback checkins response-> " + JSON.stringify(e));
    Titanium.UI.createAlertDialog({
        title: selectedMethod + ": METHOD FAILED",
        message: JSON.stringify(e),
        buttonNames: ['OK']
    }).show();
    if(JSON.stringify(e).indexOf("invalid_access_token")!=-1){
      Ti.App.Properties.setString('DROPBOX_TOKENS',null);
      checkToken();
    };
};

function callMethod(e){
  selectedMethod = e.row.methodStr;
  if(e.source.text === "Test"){
    $.activityLbl.text = "callMethod\n" + e.row.methodStr;
    $.activityBgView.show();
    var params = dropboxAPIv2[selectedMethod].testParams;
    Ti.API.debug("\t**** testParams ****");
    Ti.API.debug(params);
    Ti.API.debug("\t**** testParams ****\n");
    // If I call an upload method, check file to upload
    if(selectedMethod.indexOf("upload")!=-1){
      var blob = checkFile(selectedMethod);
    }else{
      var blob = null;
    };
    TiDropbox.callMethod({
      methodStr: selectedMethod,
      paramsObj: params,
      fileBin: blob,
      onSuccessCallback: onSuccessCallback,
      onErrorCallback: onErrorCallback,
      callMethodXhrObjCallback: function(e) {
        console.log("/////// current TiDropbox.xhr object //////////");
        console.log(e);
        console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
      }
    });
  }else if(e.source.text === "Info"){
    Alloy.createController('infoWin',{method : dropboxAPIv2[selectedMethod], selectedMethod : selectedMethod}).getView().open();
  };
};

function checkFile(selectedMethod){
  // check file name in my testParams and, if exixsts,
  // check if I've this file on my app resource folder
  if(dropboxAPIv2[selectedMethod].testParams.path){
    var pathFolders = dropboxAPIv2[selectedMethod].testParams.path.split("/");
    for(var i in pathFolders){
      if(pathFolders[i].indexOf(".")!=-1){
        Ti.API.debug("I need file " + pathFolders[i]);
        if(Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, pathFolders[i]).exists()){
          Ti.API.debug("Yeeeah, I found it! :)");
          return Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, pathFolders[i]).read();
        }else{
          Ti.API.debug("Sorry, file not found! :(");
          return null;
        };
      };
    };
  };
};

function createTest(){
  $.activityBgView.show();
  var i = -1;
  var testFiles = [
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/Homework/math/Matrices.txt",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "Matrices.txt").read()
    },
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/video.mp4",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "video.mp4").read()
    },
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/Homework/math/Prime_Numbers.txt",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "Prime_Numbers.txt").read()
    },
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/Prime_Numbers.txt",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "Prime_Numbers.txt").read()
    },
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/word.docx",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "word.docx").read()
    },
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/my_awesome/word.docx",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "word.docx").read()
    },
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/root/word.docx",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "word.docx").read()
    },
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/image.jpg",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "image.jpg").read()
    },
    {
      methodStr : "files/upload",
      testParams: {
          "path": "/a.txt",
          "mode": "add",
          "autorename": true,
          "mute": false
      },
      blob : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "a.txt").read()
    },
    {
      methodStr : "files/create_folder",
      testParams: {
          "path": "/example/workspace",
          "autorename": false
      },
      blob : null
    }
  ];
  function callMethodTest(){
    i++;
    if(testFiles[i]){
      $.activityLbl.text = testFiles[i].methodStr + "\n" + testFiles[i].testParams.path;
      TiDropbox.callMethod({
        methodStr: testFiles[i].methodStr,
        paramsObj: testFiles[i].testParams,
        fileBin: testFiles[i].blob,
        onSuccessCallback: onSuccess,
        onErrorCallback: onError
      });
    }else{
      $.activityLbl.text = "DONE :)";
      setTimeout(function(){
        checkToken();
      },500);
    };
  };
  callMethodTest();
  function onSuccess(){
    callMethodTest();
  };
  function onError(){
    callMethodTest();
  };
};

$.index.open();
