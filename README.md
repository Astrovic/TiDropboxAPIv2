

# Titanium Appcelerator Javascript Dropbox API v2

I needed a library that would use the new Dropbox API v2.
Not finding any, I decided to create this **module/document**, which uses the [Dropbox API v2 HTTP] .

This module uses OAuth 2.0 authorization token flow, then you must first [create a Dropbox App key].
For each API method, it is available the complete documentation and a test. You can also consult the official documentation directly ;)

Enjoy

Vittorio Sorbera, AstrovicApps
http://www.astrovicapps.com

## Table of contents

- [Download](#download)
- [Requirements](#requirements)
- [tiapp.xml](#tiapp.xml)
- [Methods](#methods)
- [Example of use](#example-of-use)
- [Screenshots](#screenshots)
- [Todos](#todos)
- [Guidelines for pull requests](#guidelines-for-pull-requests)
- [License](#license)

---

## Download
Download the [latest release ZIP-file](https://github.com/Astrovic/TiDropboxAPIv2/releases) and consult the [Titanium Documentation](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_How-tos/Using_Modules/Using_a_Module.html) on how install it.

## Requirements
-  The  `ti.webdialog`  module
-  The  [`ti.deeply`](https://github.com/miniman42/ti.deeply)  module (Android only)
- Dropbox requires a redirect URI set to the Dropbox Console App, in order to get a valid token. This url is the same one you will use in the `redirectUri` parameter of the `TiDropbox.init()` method.
In this project I use the redirect URI https://astrovicapps.com/_apptest/tidropbox_cb.html. You will have to create your own and host it somewhere.
You can use the contents of my **tidropbox_cb.html** file. You just need to replace `const scheme = "dropbox";` with the one used in you **tiapp.xml**:

```html
<!-- tidropbox_cb.html file content -->
<html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <script type="text/javascript">
        const isAndroid = /(android)/i.test(navigator.userAgent);
        const isHuawei = /(huawei)/i.test(navigator.userAgent);
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const scheme = "tidropbox"; // <-- Must be the one used in the tiapp.xml public.mime-type string and android:scheme value, and in app_mime_scheme in TiDropbox.init()
        const host = "dropbox_token";
        var url = scheme + "://" + host +"?" + (code || window.location.hash);
        var intent = "intent://"+host+"?"+ (code || window.location.hash) + "#Intent;scheme="+scheme+";action=android.intent.action.VIEW;end";
        console.log(window.location);
        console.log("isAndroid: --> ", isAndroid);
        console.log("isHuawei: --> ", isHuawei);
        setTimeout(function(){
            document.getElementById("token").href = isAndroid || isHuawei ? intent : url;
            //document.getElementById("write_token").innerText = isAndroid ? intent : url;
            if (isHuawei) {
                window.location = intent;
            } else {
                window.location = isAndroid ? intent : url;
            }
            window.close();
        },100);
        function closeWindow() {
            window.close();
        }
    </script>
  </head>
  <body>
    <div style="text-align:center;">
        <a id="token" href="" onclick="closeWindow()">
            <button>OPEN APP</button>
        </a>
        <!--p id="write_token"></p-->
    </div>
  </body>
</html>
```

## tiapp.xml
The login flow to obtain the token requires the use of the system browser. In order to get back to the app, you need to add an activity to your android manifest, which will be used by the **ti.deeply** module, and a public.mime-type string on iOS.
iOS `public.mime-type` key string, Android `android:scheme` value and `app_mime_scheme` value must be the ones you use in the **tidropbox_cb.html** redirect URI file:

|tidropbox_cb.html|tiapp.xml iOS|tiapp.xml Android|TiDropbox.init()|
|--|--|--|--|
|`scheme` value|`public.mime-type` key string|`android:scheme` value|`app_mime_scheme` value|

```xml
<ios>
  <enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>
  <use-app-thinning>true</use-app-thinning>
  <plist>      
    <key>UTExportedTypeDeclarations</key>
      <array>
        <dict>      			
          <key>UTTypeTagSpecification</key>
          <dict>
            <key>public.mime-type</key>
            <string>tidropbox</string>
          </dict>
        </dict>
      </array>
  </plist>
</ios>
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest xmlns:android="http://schemas.android.com/apk/res/android" >
    <application>
      <!-- ti.dropbox required >>> -->
      <activity android:name="ti.deeply.DeepLinkHandlerActivity" android:exported="true" 
                android:noHistory="true" android:excludeFromRecents="true" android:launchMode="singleTask">
        <intent-filter>
          <action android:name="android.intent.action.VIEW"/>
          <category android:name="android.intent.category.DEFAULT"/>
          <category android:name="android.intent.category.BROWSABLE"/>
          <data android:scheme="tidropbox" android:host="dropbox_token" />
        </intent-filter>      
      </activity>
      <!-- <<< ti.dropbox required -->
    </application>
  </manifest>
</android>

<modules>
  <module platform="commonjs">ti.dropbox</module>
  <module>ti.webdialog</module>
  <module platform="android" version="3.0.0">ti.deeply</module>
</modules>
```

## Methods
- [init(parameters)](#--init)
- [generateAuthUrl(callback)](#--generateauthurl)
- [callMethod(parameters)](#--callmethod)
- [revokeAccessToken(callback)](#--revokeaccesstoken)

###  - init
**`TiDropbox.init(parameters)`**
|Parameters|Type|Required|Description |
|--|--|--|--|
| **APP_KEY** | *String* | ✅ | App key in Dropbox Console App|
| **APP_SECRET** | *String* | ✅ | App secret in Dropbox Console App|
| **redirectUri** | *String* | ✅ | One of your OAuth2 Redirect URIs set to Dropbox Console App |
| **response_type** | *String* | ✅ | `code` or `token`. Token flow expires after 4 hours |
| **app_mime_scheme** | *String* | ✅ | App mime/scheme set to tiapp.xml and used inside your redirect URI page (**https://../tidropbox_cb.html**) to be able to get back to the app after login|

You need a [Dropbox App key], and a `redirectUri` which must be configured on **Redirect URIs** field of your Dropbox App Settings, on *OAuth 2* section.
```js
var TiDropbox = require("ti.dropbox").TiDropbox;
TiDropbox.init({
    APP_KEY: '<YOUR APP KEY HERE>', /*<YOUR APP KEY HERE>*/
    APP_SECRET: '<YOUR APP SECRET HERE>', /*<YOUR APP SECRET HERE>*/
    redirectUri: 'https://astrovicapps.com/_apptest/tidropbox_cb.html', /*<YOUR OAuth2 Redirect URI SET TO DROPBOX APP CONSOLE>*/
    response_type: "code", // "token" or "code". Token flow expires after 4 hours!
    app_mime_scheme: "tidropbox" // *<YOUR APP MIME SCHEME HERE SET TO TIAPP.XML>*/
});
```
### - generateAuthUrl
**`TiDropbox.generateAuthUrl(callback)`**
| Callback parameters| Type |Description |
|--|--|--|
| **success** | *Boolean* | Response result|
| **access_token** | *String* | Access token key|
| **msg** | *String* | Description of the response result |

This allows you to generate a token to be able to invoke methods.

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
### - callMethod
**`TiDropbox.callMethod(parameters)`**
|Parameters|Type|Required|Description |
|--|--|--|--|
| **methodStr** | *String* | ✅ | Represent API target. It contains Dropbox's namespace and method name: `"files/upload"` or `"sharing/share_folder"` or more at [/lib/dropboxAPIv2.js]|
| **paramsObj** | *Object* | ✅ | Parameters object, depends on resource field|
| **fileBin** | *Blob/null* | ✅ | File to upload, depends on resource field |
| **onSuccessCallback** | *Function* | ✅ | Callback on succes |
| **onErrorCallback** | *Function* | ✅ | Callback on error |
| **callMethodXhrObjCallback** | *Function* | | Return directly the *TiDropbox.xhr* object of the current `TiDropbox.callMethod`, so you can invoke all xhr methods you need: abort, onload, onsendstream, ecc.. |

After obtaining a valid token, you can call any method:
```js
// Upload the a.txt file to my app's Dropbox home 
TiDropbox.callMethod({
    methodStr: "files/upload",
    paramsObj: {
        path: "/a.txt",
        mode: "add",
        autorename: true,
        mute: false
    },
    fileBin: Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "a.txt").read(),
    onSuccessCallback: (xhr) => {
        console.log("onSuccessCallback checkins response-> " + xhr.responseText);
    },
    onErrorCallback: (e) => {
        console.error("onErrorCallback checkins response-> " + JSON.stringify(e));
        if (JSON.stringify(e).indexOf("invalid_access_token") != -1) {
            //The session has expired, I need a new token };
            // Do something...			
        }
    },
    callMethodXhrObjCallback: (currentCallMethodXhr) => {
        currentCallMethodXhr.onsendstream = function (e) {
            if (e.progress) {
                console.log(JSON.stringify('Upload progress --> ' + (e.progress * 100) + '%'));
            }
        }
    }
});
```

### - revokeAccessToken
**`TiDropbox.revokeAccessToken(callback)`**
| Callback parameters| Type |Description |
|--|--|--|
| **success** | *Boolean* | Response result|
| **access_token** | *String* | Access token key|
| **msg** | *String* | Description of the response result |

Revoke the access token.
```js
TiDropbox.revokeAccessToken(function (e) {
    if (e.success) {
        // Logout, do something...
        Titanium.UI.createAlertDialog({
            title: "REVOKE AUTH SUCCESS",
            message: e.msg,
            buttonNames: ['OK']
        }).show();
    } else {
        Titanium.UI.createAlertDialog({
            title: "REVOKE AUTH PROBLEM",
            message: e.msg,
            buttonNames: ['OK']
        }).show();
    };
});
```

That's all! :)

# Example of use
### File upload
```js
var TiDropbox = require("ti.dropbox").TiDropbox;
TiDropbox.init({
    APP_KEY: '<YOUR APP KEY HERE>', /*<YOUR APP KEY HERE>*/
    APP_SECRET: '<YOUR APP SECRET HERE>', /*<YOUR APP SECRET HERE>*/
    redirectUri: 'https://astrovicapps.com/_apptest/tidropbox_cb.html', /*<YOUR OAuth2 Redirect URI SET TO DROPBOX APP CONSOLE>*/
    response_type: "code", // "token" or "code". Token flow expires after 4 hours!
    app_mime_scheme: "tidropbox" // *<YOUR APP MIME SCHEME HERE SET TO TIAPP.XML>*/
});

// Check if I have a token
if (Ti.App.Properties.getString('DROPBOX_TOKENS', null)) {
    login();
} else {
    TiDropbox.revokeAccessToken(function () {
        // Logout, do something...
    });
};

function login() {
    TiDropbox.generateAuthUrl(function (e) {
        if (e.success) {
            // I'm logged, now I can call any method (/lib/dropboxAPIv2.js)
            // For example, if I want upload a.txt file on Dropbox App root folder
            fileUpload();
        } else {
            Titanium.UI.createAlertDialog({
                title: "AUTH PROBLEM",
                message: e.msg,
                buttonNames: ['OK']
            }).show();
        };
    });
};

function fileUpload() {

    TiDropbox.callMethod({
        methodStr: "files/upload",
        paramsObj: {
            path: "/a.txt",
            mode: "add",
            autorename: true,
            mute: false
        },
        fileBin: Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "a.txt").read(),
        onSuccessCallback: onSuccessCallback,
        onErrorCallback: onErrorCallback,
        callMethodXhrObjCallback: callMethodXhrObjCallback
    });

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
        if (JSON.stringify(e).indexOf("invalid_access_token") != -1) {
            //The session has expired, I need a new token
            Ti.App.Properties.setString('DROPBOX_TOKENS', null);
            login();
        };
    };

    function callMethodXhrObjCallback(currentCallMethodXhr) {
        currentCallMethodXhr.onsendstream = function (e) {
            Ti.API.debug(JSON.stringify(e));
            if (e.progress) {
                Ti.API.debug(JSON.stringify('Upload progress --> ' + (e.progress * 100) + '%'));
            }
        };
    };
};
```

### File download
```js
var TiDropbox = require("ti.dropbox").TiDropbox;
TiDropbox.init({
    APP_KEY: '<YOUR APP KEY HERE>', /*<YOUR APP KEY HERE>*/
    APP_SECRET: '<YOUR APP SECRET HERE>', /*<YOUR APP SECRET HERE>*/
    redirectUri: 'https://astrovicapps.com/_apptest/tidropbox_cb.html', /*<YOUR OAuth2 Redirect URI SET TO DROPBOX APP CONSOLE>*/
    response_type: "code", // "token" or "code". Token flow expires after 4 hours!
    app_mime_scheme: "tidropbox" // *<YOUR APP MIME SCHEME HERE SET TO TIAPP.XML>*/
});

// Check if I have a token
if (Ti.App.Properties.getString('DROPBOX_TOKENS', null)) {
    login();
} else {
    TiDropbox.revokeAccessToken(function () {
        // Logout, do something...
    });
};

function login() {
    TiDropbox.generateAuthUrl(function () {
        if (e.success) {
            // I'm logged, now I can call any method (/lib/dropboxAPIv2.js)
            // For example, if I want download Prime_Numbers.txt file from Dropbox App
            downloadFile();
        } else {
            Titanium.UI.createAlertDialog({
                title: "AUTH PROBLEM",
                message: e.msg,
                buttonNames: ['OK']
            }).show();
        };
    });
};

function downloadFile() {

    TiDropbox.callMethod({
        methodStr: "files/download",
        paramsObj: {
            path: "/Homework/math/Prime_Numbers.txt"
        },
        fileBin: null,
        onSuccessCallback: onSuccessCallback,
        onErrorCallback: onErrorCallback,
        callMethodXhrObjCallback: callMethodXhrObjCallback
    });

    // callback functions
    function onSuccessCallback(xhr) {
        Ti.API.debug("onSuccessCallback checkins response-> " + xhr.responseText);

        // Write downloaded data in a file
        if (xhr.responseData) {
            var filePath = Titanium.Filesystem.applicationDataDirectory + "myDownloadedFile.txt";
            var f = Titanium.Filesystem.getFile(filePath);
            f.write(xhr.responseData);

            // I check if I saved the file properly
            setTimeout(function () {
                Ti.API.debug(filePath + " exists? ---> " + file.exists());
                if (f.exists()) {
                    if (OS_IOS) {
                        Ti.UI.iOS.createDocumentViewer({
                            url: filePath
                        }).show();
                    };
                } else {
                    Titanium.UI.createAlertDialog({
                        title: "DOWNLOAD FAILED",
                        message: "Something went wrong in the file writing...",
                        buttonNames: ['OK']
                    }).show();
                };
            }, 1000);
        };
    };

    function onErrorCallback(e) {
        Ti.API.debug("onErrorCallback checkins response-> " + JSON.stringify(e));
        Titanium.UI.createAlertDialog({
            title: "METHOD FAILED",
            message: JSON.stringify(e),
            buttonNames: ['OK']
        }).show();
        if (JSON.stringify(e).indexOf("invalid_access_token") != -1) {
            //The session has expired, I need a new token
            Ti.App.Properties.setString('DROPBOX_TOKENS', null);
            login();
        };
    };

    function callMethodXhrObjCallback(currentCallMethodXhr) {
        currentCallMethodXhr.onsendstream = function (e) {
            if (e.progress) {
                console.log(JSON.stringify('Upload progress --> ' + (e.progress * 100) + '%'));
            }
        }
    }
}
```

Download and build this project to test other methods


# Screenshots

<img src="http://astrovicapps.com/git_source/tidropbox/1.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/2.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/3.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/4.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/5.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/6.png" width="300px" style="float:left; margin-right:1em;">

<img src="http://astrovicapps.com/git_source/tidropbox/7.png" width="300px" style="float:left; margin-right:1em;">


### Todos

 - OAauth 2 code flow  ✅ DONE!

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
**Copyright (c) 2016-23 Vittorio Sorbera, AstrovicApps**

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
