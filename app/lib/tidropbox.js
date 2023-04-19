/**
 *
 * this code was inspired by the work done by David Riccitelli
 * and Aaron K. Saunders, Clearly Innovative Inc
 *
 * Copyright 2016 Vittorio Sorbera, astrovicApps
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     <a href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a>
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TiDropbox = {};

(function() {

    var webView, Deeply;
    var dropboxAPIv2 = require("../lib/dropboxAPIv2").dropboxAPIv2;
    var OS_IOS = (Ti.Platform.osname != "android");
    var OS_ANDROID = !OS_IOS;
    if (OS_ANDROID) {
        Deeply = require('ti.deeply');
        Deeply.setCallback(function (e) {
            Ti.API.debug('Deep link called');            
            androidDeepLink(e);
        });
    }

    TiDropbox.init = function(params) {
        TiDropbox.APP_KEY = params.APP_KEY;
        TiDropbox.APP_SECRET = params.APP_SECRET;
        TiDropbox.redirectUri = params.redirectUri;
        TiDropbox.response_type = params.response_type || "code"; // "token" or "code"
        TiDropbox.app_mime_scheme = params.app_mime_scheme;
        TiDropbox.ACCESS_TOKEN = Ti.App.Properties.getString('DROPBOX_TOKENS',null);
        TiDropbox.ACCESS_REFRESH_TOKEN = Ti.App.Properties.getString('DROPBOX_REFRESH_TOKENS', null);
        TiDropbox.xhr = null;
        TiDropbox.API_URL = "https://api.dropboxapi.com/2/";
    };

    TiDropbox.revokeAccessToken = function(revokeAuth_callback) {
        TiDropbox.callMethod({
            methodStr: "auth/token/revoke",
            paramsObj: null,
            fileBin: null,
            onSuccessCallback: onSuccess_self,
            onErrorCallback: onFailed_self
        });

        Ti.App.Properties.setString('DROPBOX_TOKENS', null);
        Ti.App.Properties.setString('DROPBOX_REFRESH_TOKENS', null);

        function onSuccess_self() {
            /*Titanium.UI.createAlertDialog({
                title: "auth/token/revoke",
                message: "LOGOUT SUCCESS",
                buttonNames: ['OK']
            }).show();*/           
            revokeAuth_callback({
                access_token: null,
                success : true,
                msg: "Access token successfully revoked"
            });
        };

        function onFailed_self(e) {
            /*Titanium.UI.createAlertDialog({
                title: "auth/token/revoke",
                message: JSON.stringify(e),
                buttonNames: ['OK']
            }).show();*/            
            revokeAuth_callback({
                access_token: null,
                success : false,
                msg: "Invalid or expired access token"
            });
        };

        // Remove cookies
        if(OS_IOS){
      		var path = Titanium.Filesystem.applicationDataDirectory;
      		var searchKey = path.search('Documents');
      		path = path.substring(0, searchKey);
      		path = path + 'Library/Cookies/';
            //path = path + 'SystemData/com.apple.SafariViewService/Library/Cookies';// + Ti.App.id;
      		var f = Ti.Filesystem.getFile(path);
      		Ti.API.debug("cookie path ---> " + path);
      		Ti.API.debug("cookie path exists() ---> " + f.exists());
      		if(f.exists()){
      			f.deleteDirectory(true);
      		};
      		f=null;            
      	}else if(OS_ANDROID){
      		Ti.Network.removeAllSystemCookies();
      	};
    };
    /**
     * displays the familiar web login dialog we all know and love
     *
     * @params auth_callback method called when successful
     *
     */
    TiDropbox.generateAuthUrl = function(auth_callback) {

        if (auth_callback != undefined) {
            TiDropbox.auth_callback = auth_callback;
        }

        if(!Ti.Network.online){
          if (TiDropbox.auth_callback != undefined) {
              TiDropbox.auth_callback({
                  access_token: null,
                  success : false,
                  msg : "No internet connection"
              });
          }
          return;
        };

        var url;
        if (TiDropbox.response_type === "code") {
            url = 'https://www.dropbox.com/oauth2/authorize?response_type=code&token_access_type=offline&client_id=%s&redirect_uri=%s&force_reauthentication=true';
        } else {
            url = 'https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=%s&redirect_uri=%s&force_reauthentication=true';
        }
        showAuthorizeUI(
            String.format(
                url,
                TiDropbox.APP_KEY,
                TiDropbox.redirectUri)
        );
        return;
    };


    TiDropbox.callMethod = function(params) {

        var methodStr, paramsObj, fileBin, onSuccess_callback, onError_callback, callMethodXhrObj_callback;
        methodStr = params.methodStr;
        paramsObj = params.paramsObj;
        fileBin = params.fileBin;
        onSuccess_callback = params.onSuccessCallback;
        onError_callback = params.onErrorCallback;
        callMethodXhrObj_callback = params.callMethodXhrObjCallback;
        
        var urlEndpoint = dropboxAPIv2[methodStr].uri + "?reject_cors_preflight=true"; //&authorization=Bearer%20"+TiDropbox.ACCESS_TOKEN;
        //urlEndpoint = "https://api.dropboxapi.com/2/files/list_folder?authorization=Bearer%20"+TiDropbox.ACCESS_TOKEN+"&args=%7B%0A%20%20%22path%22%3A%20%22%22%2C%0A%20%20%22recursive%22%3A%20false%2C%0A%20%20%22include_media_info%22%3A%20false%2C%0A%20%20%22include_deleted%22%3A%20false%2C%0A%20%20%22include_has_explicit_shared_members%22%3A%20false%0A%7D&reject_cors_preflight=true";
        Ti.API.debug("\n\n******\ncallMethod: methodStr--> " + methodStr);
        Ti.API.debug("callMethod: urlEndpoint--> " + urlEndpoint);
        Ti.API.debug("TiDropbox.ACCESS_TOKEN --> " + TiDropbox.ACCESS_TOKEN);
        try {

            //if (TiDropbox.xhr == null) {
                TiDropbox.xhr = Titanium.Network.createHTTPClient();
                TiDropbox.xhr.timeout = 10000;
            //}

            TiDropbox.xhr.onerror = function(e) {
                Ti.API.error("TiDropbox ERROR " + e.error);
                Ti.API.error("TiDropbox ERROR " + TiDropbox.xhr.location);
                Ti.API.error("TiDropbox ERROR " + JSON.stringify(e));
                Ti.API.error(JSON.stringify(TiDropbox.xhr.responseText));
                Ti.API.error(JSON.stringify(TiDropbox.xhr.responseData));
                var errorMsg = TiDropbox.xhr.statusText + "\n" + e;
                
                if (e.code === 401) {
                     Ti.API.error("TiDropbox ERROR: token expired, try refresh it");
                     TiDropbox.refreshOauth2Token(function(e){
                        if (e.success) {                            
                            TiDropbox.callMethod({
                                methodStr: "auth/token/revoke",
                                paramsObj: null,
                                fileBin: null,
                                onSuccessCallback: onSuccess_self,
                                onErrorCallback: onFailed_self,
                                callMethodXhrObjCallback: callMethodXhrObj_callback
                            });                            
                        } else {
                            if (TiDropbox.xhr.responseText) {
                                errorMsg = TiDropbox.xhr.responseText.replace(/\"/g, "'").replace(/\\/g, "'");
                                //errorMsg = TiDropbox.xhr.statusText + "\n" + errorMsg;
                            } else if (TiDropbox.xhr.responseData) {
                                errorMsg = TiDropbox.xhr.responseData;
                            };
                            if (onError_callback) {
                                onError_callback(errorMsg);
                            }
                        }
                     })
                } else {
                    if (TiDropbox.xhr.responseText) {
                        errorMsg = TiDropbox.xhr.responseText.replace(/\"/g, "'").replace(/\\/g, "'");
                        //errorMsg = TiDropbox.xhr.statusText + "\n" + errorMsg;
                    } else if (TiDropbox.xhr.responseData) {
                        errorMsg = TiDropbox.xhr.responseData;
                    };
                    if (onError_callback) {
                        onError_callback(errorMsg);
                    }
                }                
            };

            TiDropbox.xhr.onload = function(_xhr) {
                Ti.API.debug("TiDropbox response: " + TiDropbox.xhr.responseText);
                if (onSuccess_callback) {
                    onSuccess_callback(TiDropbox.xhr);
                }
            };

            // return directly the current callMethod xhr object, so you can invoke all xhr methods you need: abort, onload, onsendstream, ecc..
            if(callMethodXhrObj_callback){
              callMethodXhrObj_callback(TiDropbox.xhr);
            };

            TiDropbox.xhr.open("POST", urlEndpoint);
            // Check required Headers
            if(dropboxAPIv2[methodStr].requiresAuthHeader){
              Ti.API.debug('TiDropbox.xhr.setRequestHeader("Authorization", "Bearer '+ TiDropbox.ACCESS_TOKEN+'");');
              TiDropbox.xhr.setRequestHeader("Authorization", "Bearer " + TiDropbox.ACCESS_TOKEN);
            };
            //if(paramsObj){
              switch(dropboxAPIv2[methodStr].endpointType){
                case "RPC":
                  if(paramsObj){
                    Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type",'+(OS_IOS ? '"application/json"' : '"text/plain; charset=dropbox-cors-hack"')+');');
                    TiDropbox.xhr.setRequestHeader("Content-Type", OS_IOS ? "application/json" : "text/plain; charset=dropbox-cors-hack");
                  }else if(OS_ANDROID){
                    Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "");');
                    TiDropbox.xhr.setRequestHeader("Content-Type", '');
                  };
                  break;
                case "CONTENT":
                  Ti.API.debug('TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", '+JSON.stringify(paramsObj)+');');
                  TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", JSON.stringify(paramsObj));
                  if(methodStr.indexOf("upload")!=-1){
                    Ti.API.debug('TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", '+(OS_IOS ? '"application/octet-stream"' : '"text/plain; charset=dropbox-cors-hack"')+');');
                    TiDropbox.xhr.setRequestHeader("Content-Type", OS_IOS ? "application/octet-stream" : "text/plain; charset=dropbox-cors-hack");
                    if(dropboxAPIv2[methodStr].requiresReadableStream && fileBin){
                      Ti.API.debug('TiDropbox.xhr.send(fileBin);');
                      TiDropbox.xhr.send(fileBin);
                      return;
                    };
                  }else if(methodStr.indexOf("download")!=-1){
                    //Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");');
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");
                    if(OS_ANDROID){
                      Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "");');
                      TiDropbox.xhr.setRequestHeader("Content-Type", '');
                    };
                    TiDropbox.xhr.send();
                    return;
                  }else if(methodStr.indexOf("files/get_")!=-1){
                    //Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");');
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    if(OS_ANDROID){
                      Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "");');
                      TiDropbox.xhr.setRequestHeader("Content-Type", '');
                    };
                    TiDropbox.xhr.send();
                    return;
                  };
                  break;
              };
            //};
            if(paramsObj){
              Ti.API.debug('TiDropbox.xhr.send('+JSON.stringify(paramsObj)+');');
              TiDropbox.xhr.send(JSON.stringify(paramsObj));
            }else if(OS_ANDROID){
              var _paramsObj = {
                body: null
              };
              Ti.API.debug('TiDropbox.xhr.send('+""+');');
              TiDropbox.xhr.send();
            }else{
              Ti.API.debug('TiDropbox.xhr.send();');
              TiDropbox.xhr.send();
            };
        } catch (err) {
            Titanium.UI.createAlertDialog({
                title: "Error",
                message: String(err),
                buttonNames: ['OK']
            }).show();
        }
    };

    TiDropbox.generateOauth2Token = function (code,generateOauth2Token_callback) {
        console.log("TiDropbox.generateOauth2Token!!!");
        var xhr = Titanium.Network.createHTTPClient();
        var urlEndpoint = "https://api.dropbox.com/oauth2/token?code=" + code +
                            "&grant_type=authorization_code&redirect_uri=" + TiDropbox.redirectUri + 
                            "&client_id=" + TiDropbox.APP_KEY + "&client_secret=" + TiDropbox.APP_SECRET;
        xhr.timeout = 10000;
        
        xhr.onload = function (e) {
            Ti.API.debug("TiDropbox.generateOauth2Token: " + xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            var token = response.access_token;
            var refresh_token = response.refresh_token;
            
            TiDropbox.ACCESS_TOKEN = token;
            Ti.App.Properties.setString('DROPBOX_TOKENS', TiDropbox.ACCESS_TOKEN);
            Ti.App.Properties.setString('DROPBOX_REFRESH_TOKENS', refresh_token);
            Ti.API.debug('tidropbox_token: ' + token);
            Ti.API.debug('tidropbox_refresh_token: ' + refresh_token);
            console.log(response)
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: token,
                    success: true,
                    msg: "Ok, you have an access token"
                });
            }

            destroyAuthorizeUI();
        };
        
        xhr.onerror = function (e) {
            console.log(e);
            Ti.API.error("TiDropbox.generateOauth2Token: " + xhr.responseText);            
            generateOauth2Token_callback({
                access_token: null,
                success: false,
                msg: "Invalid or expired access token"
            });
        };

        console.log(urlEndpoint);
        xhr.open("POST", urlEndpoint);        
        
        var base64encodeString = Ti.Utils.base64encode(TiDropbox.APP_KEY + ":" + TiDropbox.APP_SECRET).toString();
        console.log(base64encodeString);
        /*xhr.setRequestHeader(
            "Authorization",
            "Basic " + base64encodeString
        );*/
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send();        
    };

    TiDropbox.refreshOauth2Token = function (refreshOauth2Token_callback) {
        console.log("TiDropbox.refreshOauth2Token!!!");
        var refresh_token = Ti.App.Properties.getString('DROPBOX_REFRESH_TOKENS',"");
        var xhr = Titanium.Network.createHTTPClient();
        var urlEndpoint = "https://api.dropbox.com/oauth2/token?" +
            "grant_type=refresh_token&refresh_token=" + refresh_token +
            "&client_id=" + TiDropbox.APP_KEY + "&client_secret=" + TiDropbox.APP_SECRET;
        xhr.timeout = 10000;

        xhr.onload = function (e) {
            Ti.API.debug("TiDropbox.refreshOauth2Token: " + xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            var token = response.access_token;

            TiDropbox.ACCESS_TOKEN = token;
            Ti.App.Properties.setString('DROPBOX_TOKENS', TiDropbox.ACCESS_TOKEN);
            Ti.API.debug('tidropbox_token: ' + token);
            refreshOauth2Token_callback({
                success: true,
                msg: "Ok, you have an access token"
            });
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: token,
                    success: true,
                    msg: "Ok, you have an access token"
                });
            }            
        };

        xhr.onerror = function (e) {
            console.log(e);
            Ti.API.error("TiDropbox.refreshOauth2Token: " + xhr.responseText);

            // Can't refresh token, so try login again
            TiDropbox.generateAuthUrl(function (e) {
                Ti.API.debug("generateAuthUrl checkins response-> " + JSON.stringify(e));
                if (e.success) {
                    refreshOauth2Token_callback({
                        success: true,
                        msg: "Ok, you have an access token"
                    });
                } else {
                    Ti.App.Properties.setString('DROPBOX_TOKENS', null);
                    Ti.App.Properties.setString('DROPBOX_REFRESH_TOKENS', null);
                    refreshOauth2Token_callback({
                        success: false,
                        msg: "Invalid or expired access token"
                    });
                }
            });
        };

        console.log(urlEndpoint);
        xhr.open("POST", urlEndpoint);

        /*xhr.setRequestHeader(
            "Authorization",
            "Basic " + Ti.Utils.base64encode(TiDropbox.APP_KEY + ":" + TiDropbox.APP_SECRET)
        );*/
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send();
    };


    /**
     * code to display the familiar web login dialog we all know and love
     */
    function showAuthorizeUI(pUrl) {
        /*window = Ti.UI.createWindow({
            top: (OS_IOS) ? "20dp" : "0dp",
            //modal: true,
            //fullscreen: true,
            width: '100%',
            backgroundColor: "rgb(255,255,255,0.5)",
            navBarHidden : true
        });
        var transform = Ti.UI.createMatrix2D().scale(0);
        view = Ti.UI.createView({
            top: "50dp",
            left: "5dp",
            right: "5dp",
            bottom: "5dp",
            border: 5,
            backgroundColor: '#fff',
            borderColor: "#0bb1d5",
            borderRadius: 20,
            borderWidth: 5,
            zIndex: -1,
            transform: transform
        });
        closeLabel = Ti.UI.createLabel({
            textAlign: 'center',
            font: {
                fontWeight: 'bold',
                fontSize: '20sp'
            },
            text: 'X',
            top: "5dp",
            right: "5dp",
            width: "40dp",
            height: "40dp",
            backgroundColor: '#fff',
            borderColor: "#0bb1d5",
            borderRadius: 20,
            borderWidth: 5,
            color: "#0bb1d5"
        });
        window.open();

        webView = Ti.UI.createWebView({
            top: "5dp",
            right: "5dp",
            bottom: "5dp",
            left: "5dp",
            url: pUrl,
            autoDetect: [Ti.UI.AUTODETECT_NONE],
            ignoreSslError : true
        });
        
        Ti.API.debug('Setting:[' + Ti.UI.AUTODETECT_NONE + ']');
        webView.addEventListener('beforeload',
            function(e) {
                if (e.url.indexOf(TiDropbox.redirectUri) != -1 || e.url.indexOf('https://www.dropbox.com/') != -1) {
                    Titanium.API.debug(e);
                    authorizeUICallback(e);
                    webView.stopLoading = true;
                }
            });
        if (OS_IOS) {
            webView.addEventListener('load', authorizeUICallback);
        } else {
            webView.addEventListener('open', authorizeUICallback);
        }
        webView.addEventListener('close', closeAuthorizeUI);
        view.add(webView);                
        
        closeLabel.addEventListener('click', closeAuthorizeUI);
        window.add(closeLabel);

        window.add(view);

        var animation = Ti.UI.createAnimation();
        animation.transform = Ti.UI.createMatrix2D();
        animation.duration = 500;
        setTimeout(function(){
          view.animate(animation);
        },OS_IOS ? 10 : 1000);*/

        webView = require('ti.webdialog');
        if (OS_IOS) {

            webView.open({
                url: pUrl + "&callbackURL=" + TiDropbox.app_mime_scheme + "://", //'https://example.com/oauth?callbackURL=myapp://'
            });

            Ti.App.iOS.addEventListener('handleurl', handleurl);
            webView.addEventListener('close', iOSwebViewOnCloseCallback);
            return;

            var authSession = webView.createAuthenticationSession({
                url: pUrl + "&callbackURL=" + TiDropbox.app_mime_scheme + "://", //'https://example.com/oauth?callbackURL=myapp://',
                scheme: TiDropbox.app_mime_scheme
            });

            authSession.addEventListener('callback', function (e) {
                console.log("authSession callback");
                console.log(e);
                if (!e.success) {
                    Ti.API.error('Error authenticating: ' + e.error);
                    closeAuthorizeUI();
                    return;
                }
                Ti.API.info('Callback URL: ' + e.callbackURL);

                if (TiDropbox.response_type === "code") {
                    var code = e.callbackURL.match(/dropbox_token\?([^&]*)/)[1];
                    //  Adesso dovrei richiedere il token con l'api /oauth2/token
                    TiDropbox.generateOauth2Token(code, function (e) {
                        console.log("TiDropbox.generateOauth2Token callback");
                        console.log(e);
                        if (!e.success) {
                            Ti.API.error('Error authenticating: ' + e.error);
                            closeAuthorizeUI();
                            return;
                        } else {
                            authorizeUICallback({
                                url: e.callbackURL
                            })
                        }
                    })
                } else {
                    authorizeUICallback({
                        url: e.callbackURL
                    })
                }
            });

            authSession.start(); // Or cancel() to cancel it manually.
        } else {
            webView.open({
                url: pUrl + "&callbackURL=" + TiDropbox.app_mime_scheme
            });

            //Ti.App.addEventListener("resumed", androidDeepLink);
            webView.addEventListener('close', androidWebViewOnCloseCallback);
        }
    };

    function iOSwebViewOnCloseCallback() {
        Ti.API.debug("TiDropbox iOSwebViewOnCloseCallback");
        Ti.App.iOS.fireEvent('handleurl');
    };

    function androidWebViewOnCloseCallback() {
        Ti.API.debug("TiDropbox androidWebViewOnCloseCallback");
        //Ti.App.addEventListener("resumed", resumed);
    };

    var handleurlCalled = false;   
    function handleurl(e) {       
        // check if it's alredy trigged to avoid double call
        if (handleurlCalled) {
            console.warn("TiDropbox: handleurl already trigged!")  
            return;
        }
        handleurlCalled =  true;
        setTimeout(() => {
            handleurlCalled = false;
        }, 1000);

        Ti.API.debug('handleurl');
        console.log(e);

        if (webView.isOpen()) {
            webView.close();
        }

        var callbackURL;
        try {
            callbackURL = e.launchOptions.url;
        } catch (error) {
            callbackURL = null;
        }

        if (!callbackURL) {
            Ti.API.error('Error handleurl: no callbackURL');
            closeAuthorizeUI();
            return;
        }
        Ti.API.info('Callback URL: ' + callbackURL);
        useCallbackURL(callbackURL);
    }

    function useCallbackURL(callbackURL) {
        if (TiDropbox.response_type === "code") {
            var code = callbackURL.match(/dropbox_token\?([^&]*)/)[1];
            //  Adesso dovrei richiedere il token con l'api /oauth2/token
            TiDropbox.generateOauth2Token(code, function (e) {
                console.log("TiDropbox.generateOauth2Token callback");
                console.log(e);
                if (!e.success) {
                    Ti.API.error('Error authenticating: ' + e.error);
                    closeAuthorizeUI();
                    return;
                } else {
                    authorizeUICallback({
                        url: callbackURL
                    })
                }
            })
        } else {
            authorizeUICallback({
                url: callbackURL
            })
        }
    }

    function closeAuthorizeUI() {
        if (TiDropbox.auth_callback != undefined) {
            TiDropbox.auth_callback({
                access_token: null,
                success: false,
                msg: "No access token... try again"
            });
        }
        destroyAuthorizeUI();
    }

    function androidDeepLink(e) {
        console.log("androidDeepLink intent data --->");
        console.log(e);
        console.log("<--- androidDeepLink intent data");
        var callbackURL = e.data;

        
       
        if (callbackURL && callbackURL.indexOf(TiDropbox.app_mime_scheme) > -1) {
            useCallbackURL(callbackURL);
            return;
            var currIntent = Titanium.Android.currentActivity.intent;
            if (currIntent.hasExtra("dropbox_token")) {
                console.log('currIntent.hasExtras("data")');
                //var notifData = currIntent.getStringExtra("fcm_data");
                currIntent.putExtra("data", null);
            } else {
                console.log('currIntent has NOT Extras ("data")');
            }
            Titanium.Android.currentActivity.intent.data = null;
        } else {
            Ti.API.error('Error androidDeepLink: no callbackURL');
            closeAuthorizeUI();
            return;
        }
    }

    /**
     * unloads the UI used to have the user authorize the application
     */
    function destroyAuthorizeUI() {
        Ti.API.debug('destroyAuthorizeUI');        
        // remove the UI
        try {
            Ti.API.debug('destroyAuthorizeUI: webView.removeEventListener');
            if (OS_IOS) {
                Ti.API.debug('destroyAuthorizeUI: Ti.App.iOS.handleurl.removeEventListener');
                Ti.App.iOS.removeEventListener('handleurl', handleurl);
                webView.removeEventListener('close', iOSwebViewOnCloseCallback);
            } else {  
                Ti.API.debug('destroyAuthorizeUI: Ti.App.removeEventListener resumed');
                //Ti.App.removeEventListener("resumed", androidDeepLink);
                webView.removeEventListener('close', androidWebViewOnCloseCallback);
            }
            //Ti.API.debug('destroyAuthorizeUI: window.close()');
            //window.close();
            if (webView.isOpen()) {
                webView.close();
            }            
        } catch (ex) {
            console.error(ex);
            Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
        }
    };


    /**
     * fires event when login fails
     * <code>tidropbox_access_denied</code>
     *
     * fires event when login successful
     * <code>tidropbox_token</code>
     *
     * executes callback if specified when creating object
     */
    function authorizeUICallback(e) {
        Ti.API.debug('authorizeUILoaded ' + e.url);
        Titanium.API.debug(e);


        if (e.url.indexOf('access_token') != -1) {
            var token;
            try {
                token = e.url.match(/[?&]access_token=([^&]*)/)[1];
            } catch (error) {
                try {
                    token = e.url.match(/[?#]access_token=([^&]*)/)[1];
                } catch (error) {
                    token = e.url.match(/access_token=([^&]*)/)[1];
                }
            }
            TiDropbox.ACCESS_TOKEN = token;
            Ti.App.Properties.setString('DROPBOX_TOKENS',TiDropbox.ACCESS_TOKEN);
            Ti.API.debug('tidropbox_token: ' + token);
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: token,
                    success : true,
                    msg : "Ok, you have an access token"
                });
            }

            destroyAuthorizeUI();

        } else if ('https://www.dropbox.com/' == e.url) {
            Ti.API.debug('tidropbox_logout');
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: null,
                    success : false,
                    msg : "No access token... try again"
                });
            }
            destroyAuthorizeUI();
        } else if (e.url.indexOf('error=access_denied') != -1) {
            Ti.API.debug('tidropbox_access_denied, you need a new token');
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: null,
                    success : false,
                    msg : 'Access denied, you need a new token'
                });
            }
            destroyAuthorizeUI();
        }
    };

})();

exports.TiDropbox = TiDropbox;