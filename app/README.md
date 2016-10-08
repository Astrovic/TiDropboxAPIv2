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

<img src="https://camo.githubusercontent.com/1c064d0eeb906d9588311dbff17dba082ec3b5f1/68747470733a2f2f70686f746f732d352e64726f70626f782e636f6d2f742f322f414143684e484b4c495a70465942565f7974766b39436e596830577551615f614f68694e4b4b75674b67496348512f31322f35333439363630392f706e672f33327833322f332f313437353933383830302f302f322f312e706e672f454c6554685f6b4547426b67416967432f544e66505946754175756f59635f5069536e64384b52536b513952565f6e71384471534536335a414658493f73697a655f6d6f64653d3326646c3d302673697a653d3132383078393630" width="300px" style="float:left; margin-right:1em;">

<img src="https://camo.githubusercontent.com/977bb76d249eb36fc6167fa6f2dcf2205d16b4e2/68747470733a2f2f70686f746f732d352e64726f70626f782e636f6d2f742f322f4141417444346f6f777839316b4369746336654b3833614c66306e76413330636d6c533954396465326a44646f772f31322f35333439363630392f706e672f33327833322f332f313437353933383830302f302f322f322e706e672f454c6554685f6b4547426b67416967432f777170427069416e704444725f412d344d444c664b6b58495a4b704d6c664970686f775566366b396759593f73697a655f6d6f64653d3326646c3d302673697a653d3132383078393630" width="300px" style="float:left; margin-right:1em;">

<img src="https://camo.githubusercontent.com/20f262b4c2c2ec1cf916a319ad0d808f7994ca51/68747470733a2f2f70686f746f732d322e64726f70626f782e636f6d2f742f322f41414465524a58517a465f3239427a3458585742747432714d735f676c2d746d4c4b35324665304352364e2d65512f31322f35333439363630392f706e672f33327833322f332f313437353930323830302f302f322f332e706e672f454c6554685f6b4547426b67416967432f496a3744444944674d6f52536b454875533150627941584b56354f567a796a796b65415550476c74442d513f73697a655f6d6f64653d3326646c3d302673697a653d313630307831323030" width="300px" style="float:left; margin-right:1em;">

<img src="https://camo.githubusercontent.com/b2582db51ef217ee8f8e67c80086a99fc1262a28/68747470733a2f2f70686f746f732d352e64726f70626f782e636f6d2f742f322f41414371533358365f44674944783139386667786e4266445665792d534b784e43386446724f4979336c76384a772f31322f35333439363630392f706e672f33327833322f332f313437353930363430302f302f322f342e706e672f454c6554685f6b4547426b67416967432f6f515f676f686261682d664553566d614e674549455f526d5852332d4e5445444b365a534e795862396f493f73697a655f6d6f64653d3326646c3d302673697a653d313630307831323030" width="300px" style="float:left; margin-right:1em;">

<img src="https://camo.githubusercontent.com/4a2eae2661d64586516f2e862a1ca489eaa5715b/68747470733a2f2f70686f746f732d342e64726f70626f782e636f6d2f742f322f41414246534f644e73526b566c61636e594a78776c6b6c725055766e6455693047693770776866326d65394b34512f31322f35333439363630392f706e672f33327833322f332f313437353930363430302f302f322f352e706e672f454c6554685f6b4547426b67416967432f6b5862356f7343553134397a6834623773533131394361466434747a6838586f436354375f574c686b6d343f73697a655f6d6f64653d3326646c3d302673697a653d313630307831323030" width="300px" style="float:left; margin-right:1em;">

<img src="https://camo.githubusercontent.com/a77ece996ca963d6ae5f6df9d5534262795c63e9/68747470733a2f2f70686f746f732d362e64726f70626f782e636f6d2f742f322f4141446f59706b316f546157325174694e3832597736665957303462455837724263756a637448505777727041772f31322f35333439363630392f706e672f33327833322f332f313437353930363430302f302f322f362e706e672f454c6554685f6b4547426b67416967432f456175773077714c6575333971664c374a52445338484664462d4c6c54626d78695a2d45436c3346746a383f73697a655f6d6f64653d3326646c3d302673697a653d313630307831323030" width="300px" style="float:left; margin-right:1em;">

<img src="https://camo.githubusercontent.com/2ce8b598ad4993438cc3ead7638464604f72a950/68747470733a2f2f70686f746f732d332e64726f70626f782e636f6d2f742f322f4141423276657138624d6f5557462d764e4b66434744414f616e4330324b33476e5f6563496a68686f58496444412f31322f35333439363630392f706e672f33327833322f332f313437353933383830302f302f322f372e706e672f454c6554685f6b4547426b67416967432f725052443933734d687a4a6e67306c5f2d4742317a76466179584259796e354d7958764778554e527056593f73697a655f6d6f64653d3326646c3d302673697a653d3132383078393630" width="300px" style="float:left; margin-right:1em;">


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
