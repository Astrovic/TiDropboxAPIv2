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

    var window;
    var dropboxAPIv2 = require("../lib/dropboxAPIv2").dropboxAPIv2;
    var OS_IOS = (Ti.Platform.osname != "android");
    var OS_ANDROID = !OS_IOS;

    TiDropbox.init = function(clientId, redirectUri) {
        TiDropbox.clientId = clientId;
        TiDropbox.redirectUri = redirectUri;
        TiDropbox.ACCESS_TOKEN = Ti.App.Properties.getString('DROPBOX_TOKENS',null);
        TiDropbox.xhr = null;
        TiDropbox.API_URL = "https://api.dropboxapi.com/2/";
    };

    TiDropbox.revokeAccessToken = function(revokeAuth_callback) {
        TiDropbox.callMethod("auth/token/revoke", null, null, onSuccess_self, onFailed_self);

        function onSuccess_self() {
            Titanium.UI.createAlertDialog({
                title: "auth/token/revoke",
                message: "LOGOUT SUCCESS",
                buttonNames: ['OK']
            }).show();
            Ti.App.Properties.setString('DROPBOX_TOKENS',null);
            revokeAuth_callback({
                access_token: null,
                success : true,
                msg: "Access token successfully revoked"
            });
        };

        function onFailed_self(e) {
            Titanium.UI.createAlertDialog({
                title: "auth/token/revoke",
                message: JSON.stringify(e),
                buttonNames: ['OK']
            }).show();
            //if(JSON.stringify(e).indexOf("invalid_access_token")!=-1){
              Ti.App.Properties.setString('DROPBOX_TOKENS',null);
            //};
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

        showAuthorizeUI(
            String.format('https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=%s&redirect_uri=%s',
                TiDropbox.clientId,
                TiDropbox.redirectUri)
        );
        return;
    };


    TiDropbox.callMethod = function(methodStr, paramsObj, fileBin, onSuccess_callback, onError_callback, callMethodXhrObj_callback) {

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
                if(TiDropbox.xhr.responseText){
                  errorMsg = TiDropbox.xhr.responseText.replace(/\"/g,"'").replace(/\\/g,"'");
                  //errorMsg = TiDropbox.xhr.statusText + "\n" + errorMsg;
                }else if(TiDropbox.xhr.responseData){
                  errorMsg = TiDropbox.xhr.responseData;
                };
                if (onError_callback) {
                    onError_callback(errorMsg);
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


    /**
     * code to display the familiar web login dialog we all know and love
     */
    function showAuthorizeUI(pUrl) {
        window = Ti.UI.createWindow({
            top: (OS_IOS) ? "20dp" : "0dp",
            //modal: true,
            //fullscreen: true,
            width: '100%',
            backgroundColor: "rgb(255,255,255,0.5)",
            navBarHidden : true
        });
        var transform = Ti.UI.create2DMatrix().scale(0);
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
        webView.addEventListener('load', authorizeUICallback);
        view.add(webView);

        closeLabel.addEventListener('click', function(){
          if (TiDropbox.auth_callback != undefined) {
              TiDropbox.auth_callback({
                  access_token: null,
                  success : false,
                  msg : "No access token... try again"
              });
          }
          destroyAuthorizeUI();
        });
        window.add(closeLabel);

        window.add(view);

        var animation = Ti.UI.createAnimation();
        animation.transform = Ti.UI.create2DMatrix();
        animation.duration = 500;
        setTimeout(function(){
          view.animate(animation);
        },OS_IOS ? 10 : 1000);
    };



    /**
     * unloads the UI used to have the user authorize the application
     */
    function destroyAuthorizeUI() {
        Ti.API.debug('destroyAuthorizeUI');
        // if the window doesn't exist, exit
        if (window == null) {
            return;
        }

        // remove the UI
        try {
            Ti.API.debug('destroyAuthorizeUI:webView.removeEventListener');
            webView.removeEventListener('load', authorizeUICallback);
            Ti.API.debug('destroyAuthorizeUI:window.close()');
            window.close();
        } catch (ex) {
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
            var token = e.url.match(/[?&]access_token=([^&]*)/)[1];
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
