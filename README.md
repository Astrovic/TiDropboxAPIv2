# Titanium Appcelerator Javascript Dropbox API v2

I needed a library that would use the new Dropbox API v2.
Not finding any, I decided to create this **module/document**, which uses the [Dropbox API v2 HTTP] .

This module uses OAuth 2.0 authorization token flow, then you must first [create a Dropbox App key].
For each API method, it is available the complete documentation and a test. You can also consult the official documentation directly ;)

Enjoy

Vittorio Sorbera, astrovicApps

www.facebook.com/astrovicApps

### Get started
You need a [Dropbox App key], and a `redirect_uri` which must be configured on **Redirect URIs** field of your Dropbox App Settings, on *OAuth 2* section.
```js
var TiDropbox = require("tidropbox").TiDropbox;
TiDropbox.init('<YOUR APP KEY HERE>', '<YOUR redirect_uri HERE>');
```
### OAauth 2 token flow
Generating a token to be able to invoke methods
```js
TiDropbox.generateAuthUrl(function(){
    // I'm logged, now I can call any method
});
```
### API call
After obtaining a valid token, you can call any method, simply use the function:
```js
TiDropbox.callMethod (methodStr, paramsObj, fileBin, onSuccessCallback, onErrorCallback)
```
- **methodStr** (*string*): represent API target. It contains Dropbox's namespace and method name. eg. `"files/upload"` or `"sharing/share_folder"` or more at [/lib/dropboxAPIv2.js]
- **paramsObj** (*object*): parameters, depends on resource field
- **fileBin** (*blob/null*): file to upload, depends on resource field
- **onSuccessCallback** (*function*): callback on succes
- **onErrorCallback** (*function*): callback on error

### Revoke AccessToken
```js
TiDropbox.revokeAccessToken(function(){
    // Logout, do something...
});
```

That's all. Simple :)


#### Example of use
```js
var TiDropbox = require("tidropbox").TiDropbox;
TiDropbox.init('<YOUR APP KEY HERE>', '<YOUR redirect_uri HERE>');

// Check if I have a token
if(Ti.App.Properties.getString('DROPBOX_TOKENS',null))){
    login();
 }else{
    TiDropbox.revokeAccessToken(function(){
        // Logout, do something...
    });
};

function login(){
    TiDropbox.generateAuthUrl(function(){
        // I'm logged, now I can call any method (/lib/dropboxAPIv2.js)
        // For example, if I want upload a.txt file on Dropbox App root folder
        var methodStr = "files/upload";
        var paramsObj: {
          path: "/a.txt",
          mode: "add",
          autorename: true,
          mute: false
        };
        var fileBin = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "a.txt").read();
        TiDropbox.callMethod(methodStr, paramsObj, fileBin, onSuccessCallback, onErrorCallback)
    });
};

// callback functions
function onSuccessCallback(xhr) {
    Ti.API.info("onSuccessCallback checkins response-> " + xhr.responseText);
    Titanium.UI.createAlertDialog({
        title: "METHOD SUCCESS",
        message: xhr.responseText,
        buttonNames: ['OK']
    }).show();
};

function onErrorCallback(e) {
    Ti.API.info("onErrorCallback checkins response-> " + JSON.stringify(e));
    Titanium.UI.createAlertDialog({
        title: "METHOD FAILED",
        message: JSON.stringify(e),
        buttonNames: ['OK']
    }).show();
    if(JSON.stringify(e).indexOf("invalid_access_token")!=-1){
        //The session has expired, I need a new token
        Ti.App.Properties.setString('DROPBOX_TOKENS',null);
    };
};
```

#### Screenshots

<div style="float:left; margin-right:1em;">
<img src="https://photos-5.dropbox.com/t/2/AAChNHKLIZpFYBV_ytvk9CnYh0WuQa_aOhiNKKugKgIcHQ/12/53496609/png/32x32/3/1475938800/0/2/1.png/ELeTh_kEGBkgAigC/TNfPYFuAuuoYc_PiSnd8KRSkQ9RV_nq8DqSE63ZAFXI?size_mode=3&dl=0&size=1280x960" width="300px">
</div>
<div style="float:left; margin-right:1em;">
<img src="https://photos-5.dropbox.com/t/2/AAAtD4oowx91kCitc6eK83aLf0nvA30cmlS9T9de2jDdow/12/53496609/png/32x32/3/1475938800/0/2/2.png/ELeTh_kEGBkgAigC/wqpBpiAnpDDr_A-4MDLfKkXIZKpMlfIphowUf6k9gYY?size_mode=3&dl=0&size=1280x960" width="300px">
</div>
<div style="float:left; margin-right:1em;">
<img src="https://camo.githubusercontent.com/20f262b4c2c2ec1cf916a319ad0d808f7994ca51/68747470733a2f2f70686f746f732d322e64726f70626f782e636f6d2f742f322f41414465524a58517a465f3239427a3458585742747432714d735f676c2d746d4c4b35324665304352364e2d65512f31322f35333439363630392f706e672f33327833322f332f313437353930323830302f302f322f332e706e672f454c6554685f6b4547426b67416967432f496a3744444944674d6f52536b454875533150627941584b56354f567a796a796b65415550476c74442d513f73697a655f6d6f64653d3326646c3d302673697a653d313630307831323030" width="300px">
</div>
<div style="float:left; margin-right:1em;">
<img src="https://camo.githubusercontent.com/b2582db51ef217ee8f8e67c80086a99fc1262a28/68747470733a2f2f70686f746f732d352e64726f70626f782e636f6d2f742f322f41414371533358365f44674944783139386667786e4266445665792d534b784e43386446724f4979336c76384a772f31322f35333439363630392f706e672f33327833322f332f313437353930363430302f302f322f342e706e672f454c6554685f6b4547426b67416967432f6f515f676f686261682d664553566d614e674549455f526d5852332d4e5445444b365a534e795862396f493f73697a655f6d6f64653d3326646c3d302673697a653d313630307831323030" width="300px">
</div>
<div style="float:left; margin-right:1em;">
<img src="https://camo.githubusercontent.com/4a2eae2661d64586516f2e862a1ca489eaa5715b/68747470733a2f2f70686f746f732d342e64726f70626f782e636f6d2f742f322f41414246534f644e73526b566c61636e594a78776c6b6c725055766e6455693047693770776866326d65394b34512f31322f35333439363630392f706e672f33327833322f332f313437353930363430302f302f322f352e706e672f454c6554685f6b4547426b67416967432f6b5862356f7343553134397a6834623773533131394361466434747a6838586f436354375f574c686b6d343f73697a655f6d6f64653d3326646c3d302673697a653d313630307831323030" width="300px">
</div>
<div style="float:left; margin-right:1em;">
<img src="https://camo.githubusercontent.com/a77ece996ca963d6ae5f6df9d5534262795c63e9/68747470733a2f2f70686f746f732d362e64726f70626f782e636f6d2f742f322f4141446f59706b316f546157325174694e3832597736665957303462455837724263756a637448505777727041772f31322f35333439363630392f706e672f33327833322f332f313437353930363430302f302f322f362e706e672f454c6554685f6b4547426b67416967432f456175773077714c6575333971664c374a52445338484664462d4c6c54626d78695a2d45436c3346746a383f73697a655f6d6f64653d3326646c3d302673697a653d313630307831323030" width="300px">
</div>
<div style="float:left; margin-right:1em;">
<img src="https://photos-3.dropbox.com/t/2/AAB2veq8bMoUWF-vNKfCGDAOanC02K3Gn_ecIjhhoXIdDA/12/53496609/png/32x32/3/1475938800/0/2/7.png/ELeTh_kEGBkgAigC/rPRD93sMhzJng0l_-GB1zvFayXBYyn5MyXvGxUNRpVY?size_mode=3&dl=0&size=1280x960" width="300px">
</div>

### Todos

 - OAauth 2 code flow


License
----
**Copyright (c) 2016 Vittorio Sorbera, astrovicApps**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Dropbox API v2 HTTP]: <https://www.dropbox.com/developers/documentation/http/documentation>
   [create a Dropbox App key]: <https://www.dropbox.com/developers/apps/create>
   [Dropbox App key]: <https://www.dropbox.com/developers/apps>
   [/lib/dropboxAPIv2.js]: <https://github.com/Astrovic/TiDropboxAPIv2/blob/master/app/lib/dropboxAPIv2.js>
