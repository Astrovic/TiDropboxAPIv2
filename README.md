# Titanium Appcelerator Javascript Dropbox API v2

[![gitTio](http://img.shields.io/badge/on-gittio-00B4CC.svg)](http://gitt.io/component/ti.dropbox)

I needed a library that would use the new Dropbox API v2.
Not finding any, I decided to create this **module/document**, which uses the [Dropbox API v2 HTTP] .

This module uses OAuth 2.0 authorization token flow, then you must first [create a Dropbox App key].
For each API method, it is available the complete documentation and a test. You can also consult the official documentation directly ;)

Enjoy

Vittorio Sorbera, astrovicApps

www.facebook.com/astrovicApps

## Table of contents

- [Get started](#get-started)
- [Example of use](#example-of-use)
- [Screenshots](#screenshots)
- [Todos](#todos)
- [Guidelines for pull requests](#guidelines-for-pull-requests)
- [License](#license)

---

# Get started [![gitTio](http://gitt.io/badge.svg)](http://gitt.io/component/ti.dropbox)
Download the [latest release ZIP-file](https://github.com/Astrovic/TiDropboxAPIv2/releases) and consult the [Titanium Documentation](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_a_Module) on how install it, or simply use the [gitTio CLI](http://gitt.io/cli):

`$ gittio install ti.dropbox`

### Initialize module
You need a [Dropbox App key], and a `redirect_uri` which must be configured on **Redirect URIs** field of your Dropbox App Settings, on *OAuth 2* section.
```js
var TiDropbox = require("ti.dropbox").TiDropbox;
TiDropbox.init('<YOUR APP KEY HERE>', '<YOUR redirect_uri HERE>');
```
### OAauth 2 token flow
Generating a token to be able to invoke methods.
Callback return an object with these parameters:
- **success** (*boolean*): response result
- **access_token** (*string*): access token key
- **msg** (*string*): description of the response result

```js
TiDropbox.generateAuthUrl(function(e){
    if(e.success){
      // I'm logged, now I can call any method
      Titanium.UI.createAlertDialog({
          title: "AUTH SUCCESS",
          message: e.msg + "\n" + "Your access token is: " + e.access_token,
          buttonNames: ['OK']
      }).show();
    }else{
      Titanium.UI.createAlertDialog({
          title: "AUTH PROBLEM",
          message: e.msg,
          buttonNames: ['OK']
      }).show();
    };
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
Revoke the access token.
Callback return an object with these parameters:
- **success** (*boolean*): response result
- **access_token** (*string*): access token key
- **msg** (*string*): description of the response result
```js
TiDropbox.revokeAccessToken(function(e){
  if(e.success){
    // Logout, do something...
    Titanium.UI.createAlertDialog({
        title: "REVOKE AUTH SUCCESS",
        message: e.msg,
        buttonNames: ['OK']
    }).show();
  }else{
    Titanium.UI.createAlertDialog({
        title: "REVOKE AUTH PROBLEM",
        message: e.msg,
        buttonNames: ['OK']
    }).show();
  };    
});
```

That's all. Simple :)

# Example of use
### File upload
```js
var TiDropbox = require("ti.dropbox").TiDropbox;
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
    TiDropbox.generateAuthUrl(function(e){
      if(e.success){
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
      }else{
        Titanium.UI.createAlertDialog({
            title: "AUTH PROBLEM",
            message: e.msg,
            buttonNames: ['OK']
        }).show();
      };
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
        login();
    };
};
```

### File download
```js
var TiDropbox = require("ti.dropbox").TiDropbox;
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
      if(e.success){
        // I'm logged, now I can call any method (/lib/dropboxAPIv2.js)
        // For example, if I want download Prime_Numbers.txt file from Dropbox App
        var methodStr = "files/download";
        var paramsObj: {
            path: "/Homework/math/Prime_Numbers.txt"
        };        
        TiDropbox.callMethod(methodStr, paramsObj, null, onSuccessCallback, onErrorCallback)
      }else{
        Titanium.UI.createAlertDialog({
            title: "AUTH PROBLEM",
            message: e.msg,
            buttonNames: ['OK']
        }).show();
      };
    });
};

// callback functions
function onSuccessCallback(xhr) {
  Ti.API.debug("onSuccessCallback checkins response-> " + xhr.responseText);

  // Write downloaded data in a file
  if(xhr.responseData){
    var filePath = Titanium.Filesystem.applicationDataDirectory + "myDownloadedFile.txt";
    var f = Titanium.Filesystem.getFile(filePath);
    f.write(xhr.responseData);

    // I check if I saved the file properly
    setTimeout(function(){
      Ti.API.debug(filePath + " exists? ---> " + file.exists());
      if(f.exists()){
        if(OS_IOS){
          Ti.UI.iOS.createDocumentViewer({url:filePath}).show();
        };
      }else{
        Titanium.UI.createAlertDialog({
            title: "DOWNLOAD FAILED",
            message: "Something went wrong in the file writing...",
            buttonNames: ['OK']
        }).show();
      };
    },1000);
  };
};

function onErrorCallback(e) {
    Ti.API.debug("onErrorCallback checkins response-> " + JSON.stringify(e));
    Titanium.UI.createAlertDialog({
        title: "METHOD FAILED",
        message: JSON.stringify(e),
        buttonNames: ['OK']
    }).show();
    if(JSON.stringify(e).indexOf("invalid_access_token")!=-1){
        //The session has expired, I need a new token
        Ti.App.Properties.setString('DROPBOX_TOKENS',null);
        login();
    };
};
```


# Screenshots

<img src="http://astrovicapps.com/git_source/tidropbox/1.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/2.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/3.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/4.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/5.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/6.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/7.png" width="300px" style="float:left; margin-right:1em;">


### Todos

 - OAauth 2 code flow

# Guidelines for pull requests

Every contribution and pull requests are welcome! This repository is a **module/document**. So you can contribute both to the documentation, that to new versions of the module.

### Pull requests for new module version
If you want to create a new module version, to edit or add new methods, **do not edit the [`modules/`](https://github.com/Astrovic/TiDropboxAPIv2/tree/master/modules) folder directly! But you have to delete [`modules/commonjs`](https://github.com/Astrovic/TiDropboxAPIv2/tree/master/modules/commonjs) folder.** You should edit the
source files in [**`/lib`**](https://github.com/Astrovic/TiDropboxAPIv2/tree/master/app/lib) folder instead.

After making your changes, to create a new version of the module you have to follow the following steps:

- Increase the version number in [package.json](https://github.com/Astrovic/TiDropboxAPIv2/tree/master/package.json) file, in the root folder.
- Uses [Titaniumifier](https://github.com/smclab/titaniumifier) to generate the zip module, with the command:

    `$ titaniumifier --in . --out ./dist`
- Import your new **ti.dropbox-commonjs-x.x.x.zip** module in the project. This will create the [**`modules/commonjs`**](https://github.com/Astrovic/TiDropboxAPIv2/tree/master/modules/commonjs) folder you had removed earlier, with the new version of the module.

All done :) Now you can send your pull request.

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
