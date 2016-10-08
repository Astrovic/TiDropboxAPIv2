# Titanium Appcelerator Javascript Dropbox API v2

I needed a library that would use the new Dropbox API v2.
Not finding any, I decided to create this **module/document**, which uses the [Dropbox API v2 HTTP] .

This module uses OAuth 2.0 authorization token flow, then you must first [create a Dropbox App key].
For each API method, it is available the complete documentation and a test. You can also consult the official documentation directly ;)

Enjoy

Vittorio Sorbera
astrovicApps
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

<img src="https://photos-6.dropbox.com/t/2/AADeVnQrZW0oK-jnHY3xsRgLkLlVFptE3PCMDniV3CpsuA/12/53496609/png/32x32/3/1475902800/0/2/1.png/ELeTh_kEGBkgAigC/TNfPYFuAuuoYc_PiSnd8KRSkQ9RV_nq8DqSE63ZAFXI?size_mode=3&dl=0&size=1600x1200" width="300px">

<img src="https://photos-4.dropbox.com/t/2/AABe0U34TIl1EBGN_nk0jrqP34_8hot-43mV0UIS2XXPDg/12/53496609/png/32x32/3/1475902800/0/2/2.png/ELeTh_kEGBkgAigC/wqpBpiAnpDDr_A-4MDLfKkXIZKpMlfIphowUf6k9gYY?size_mode=3&dl=0&size=1600x1200" width="300px">

<img src="https://photos-2.dropbox.com/t/2/AADeRJXQzF_29Bz4XXWBtt2qMs_gl-tmLK52Fe0CR6N-eQ/12/53496609/png/32x32/3/1475902800/0/2/3.png/ELeTh_kEGBkgAigC/Ij7DDIDgMoRSkEHuS1PbyAXKV5OVzyjykeAUPGltD-Q?size_mode=3&dl=0&size=1600x1200" width="300px">

<img src="https://photos-5.dropbox.com/t/2/AACqS3X6_DgIDx198fgxnBfDVey-SKxNC8dFrOIy3lv8Jw/12/53496609/png/32x32/3/1475906400/0/2/4.png/ELeTh_kEGBkgAigC/oQ_gohbah-fESVmaNgEIE_RmXR3-NTEDK6ZSNyXb9oI?size_mode=3&dl=0&size=1600x1200" width="300px">

<img src="https://photos-4.dropbox.com/t/2/AABFSOdNsRkVlacnYJxwlklrPUvndUi0Gi7pwhf2me9K4Q/12/53496609/png/32x32/3/1475906400/0/2/5.png/ELeTh_kEGBkgAigC/kXb5osCU149zh4b7sS119CaFd4tzh8XoCcT7_WLhkm4?size_mode=3&dl=0&size=1600x1200" width="300px">

<img src="https://photos-6.dropbox.com/t/2/AADoYpk1oTaW2QtiN82Yw6fYW04bEX7rBcujctHPWwrpAw/12/53496609/png/32x32/3/1475906400/0/2/6.png/ELeTh_kEGBkgAigC/Eauw0wqLeu39qfL7JRDS8HFdF-LlTbmxiZ-ECl3Ftj8?size_mode=3&dl=0&size=1600x1200" width="300px">

<img src="https://photos-1.dropbox.com/t/2/AADX6-o9ggFDLQsInIQRB4VX5rYu73SI-wAPnOall1njQw/12/53496609/png/32x32/3/1475906400/0/2/7.png/ELeTh_kEGBkgAigC/rPRD93sMhzJng0l_-GB1zvFayXBYyn5MyXvGxUNRpVY?size_mode=3&dl=0&size=1600x1200" width="300px">

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
