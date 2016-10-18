(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.ti || (g.ti = {})).dropbox = f()}})(function(){var define,module,exports;return (function e(t,n,r){function o(i,u){if(!n[i]){if(!t[i]){var a=typeof require=="function"&&require;if(!u&&a)return a.length===2?a(i,!0):a(i);if(s&&s.length===2)return s(i,!0);if(s)return s(i);var f=new Error("Cannot find module '"+i+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[i].exports}var i=Array.prototype.slice;Function.prototype.bind||Object.defineProperty(Function.prototype,"bind",{enumerable:!1,configurable:!0,writable:!0,value:function(e){function r(){return t.apply(this instanceof r&&e?this:e,n.concat(i.call(arguments)))}if(typeof this!="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var t=this,n=i.call(arguments,1);return r.prototype=Object.create(t.prototype),r.prototype.contructor=r,r}});var s=typeof require=="function"&&require;for(var u=0;u<r.length;u++)o(r[u]);return o})({1:[function(require,module,exports){
/**
 * this code was inspired by the work done by Adam Płócieniak
 * available at https://github.com/adasq/dropbox-v2-api/blob/master/dist/api.json
 **/

exports.dropboxAPIv2 = {
    "oauth2/authorize": {
        "uri": "https://www.dropbox.com/oauth2/authorize",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "GET",
        "parameters": [{
            "name": "response_type",
            "type": "String",
            "desc": "The grant type requested, either token or code."
        }, {
            "name": "client_id",
            "type": "String",
            "desc": "The app's key, found in the App Console (https://www.dropbox.com/developers/apps)"
        }, {
            "name": "redirect_uri",
            "type": "String",
            "desc": "Where to redirect the user after authorization has completed. This must be the exact URI registered in the App Console; even 'localhost' must be listed if it is used for testing. All redirect URIs must be HTTPS except for localhost URIs. A redirect URI is required for the token flow, but optional for the code flow. If the redirect URI is omitted, the code will be presented directly to the user and they will be invited to enter the information in your app"
        }, {
            "name": "state",
            "type": "String",
            "desc": "Up to 500 bytes of arbitrary data that will be passed back to your redirect URI. This parameter should be used to protect against cross-site request forgery (CSRF). See Sections 4.4.1.8 and 4.4.2.5 of the OAuth 2.0 threat model spec."
        }, {
            "name": "require_role",
            "type": "String",
            "desc": "If this parameter is specified, the user will be asked to authorize with a particular type of Dropbox account, either work for a team account or personal for a personal account. Your app should still verify the type of Dropbox account after authorization since the user could modify or remove the require_role parameter"
        }, {
            "name": "force_reapprove",
            "type": "Boolean",
            "desc": "Whether or not to force the user to approve the app again if they've already done so. If false (default), a user who has already approved the application may be automatically redirected to the URI specified by redirect_uri. If true, the user will not be automatically redirected and will have to approve the app again."
        }, {
            "name": "disable_signup",
            "type": "Boolean",
            "desc": "When true (default is false) users will not be able to sign up for a Dropbox account via the authorization page. Instead, the authorization page will show a link to the Dropbox iOS app in the App Store. This is only intended for use when necessary for compliance with App Store policies."
        }],
        "returnParameters": []
    },
    "auth/token/revoke": {
        "uri": "https://api.dropboxapi.com/2/auth/token/revoke",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [],
        "returnParameters": []
    },
    "files/alpha/get_metadata": {
        "uri": "https://api.dropboxapi.com/2/files/alpha/get_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path of a file or folder on Dropbox."
        }, {
            "name": "include_media_info",
            "type": "Boolean",
            "desc": "If true, FileMetadata.media_info is set for photo and video. The default for this field is False."
        }, {
            "name": "include_deleted",
            "type": "Boolean",
            "desc": "If true,   will be returned for deleted file or folder, otherwise LookupError.not_found will be returned. The default for this field is False."
        }, {
            "name": "include_has_explicit_shared_members",
            "type": "Boolean",
            "desc": "If true, the results will include a flag for each file indicating whether or not  that file has any explicit members. The default for this field is False."
        }, {
            "name": "include_property_templates",
            "type": "List of (String(min_length=1, pattern=\"(/|ptid:).*\"), )?",
            "desc": "If true, FileMetadata.property_groups is set for files with custom properties. This field is optional."
        }],
        "returnParameters": []
    },
    "files/alpha/upload": {
        "uri": "https://content.dropboxapi.com/2/files/alpha/upload",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/Homework/math/Matrices.txt",
            "mode": "add",
            "autorename": true,
            "mute": false,
            "property_groups": [{
                "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa",
                "fields": [{
                    "name": "Security Policy",
                    "value": "Confidential"
                }]
            }]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to save the file."
        }, {
            "name": "mode",
            "type": "WriteMode",
            "desc": "Selects what to do if the file already exists. The default for this union is add.",
            "parameters": [{
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "add",
            "type": "Void",
            "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
        }, {
            "name": "overwrite",
            "type": "Void",
            "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
        }, {
            "name": "update",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
        }, {
            "name": "client_modified",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
        }, {
            "name": "mute",
            "type": "Boolean",
            "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
        }, {
            "name": "property_groups",
            "type": "List of (PropertyGroup, )?",
            "desc": "List of custom properties to add to file. This field is optional.",
            "parameters": [{
                "name": "template_id",
                "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
                "desc": "A unique identifier for a property template type."
            }, {
                "name": "fields",
                "type": "List of (PropertyField, )",
                "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
                "parameters": [{
                    "name": "name",
                    "type": "String",
                    "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
                }, {
                    "name": "value",
                    "type": "String",
                    "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
                }]
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "A unique identifier for a property template type."
        }, {
            "name": "fields",
            "type": "List of (PropertyField, )",
            "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
            "parameters": [{
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "name",
            "type": "String",
            "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
        }, {
            "name": "value",
            "type": "String",
            "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
        }],
        "returnParameters": []
    },
    "files/copy": {
        "uri": "https://api.dropboxapi.com/2/files/copy",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "from_path": "/Homework/math",
            "to_path": "/Homework/algebra",
            "allow_shared_folder": false,
            "autorename": false
        },
        "parameters": [{
            "name": "from_path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to be copied or moved."
        }, {
            "name": "to_path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox that is the destination."
        }],
        "returnParameters": []
    },
    "files/copy_reference/get": {
        "uri": "https://api.dropboxapi.com/2/files/copy_reference/get",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/video.mp4"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the file or folder you want to get a copy reference to."
        }],
        "returnParameters": []
    },
    "files/copy_reference/save": {
        "uri": "https://api.dropboxapi.com/2/files/copy_reference/save",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "copy_reference": "z1X6ATl6aWtzOGq0c3g5Ng",
            "path": "/video.mp4"
        },
        "parameters": [{
            "name": "copy_reference",
            "type": "String",
            "desc": "A copy reference returned by  ."
        }, {
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")",
            "desc": "Path in the user's Dropbox that is the destination."
        }],
        "returnParameters": []
    },
    "files/create_folder": {
        "uri": "https://api.dropboxapi.com/2/files/create_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "autorename": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to create."
        }],
        "returnParameters": []
    },
    "files/delete": {
        "uri": "https://api.dropboxapi.com/2/files/delete",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to delete."
        }],
        "returnParameters": []
    },
    "files/delete_batch": {
        "uri": "https://api.dropboxapi.com/2/files/delete_batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "entries": [
              {
                "path": "/Homework/math/Prime_Numbers.txt"
              }
            ]
        },
        "parameters": [{
            "name": "entries",
            "type": "List of DeleteArg",
            "desc": "",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to delete."
              }],
        }],
        "returnParameters": []
    },
    "files/download": {
        "uri": "https://content.dropboxapi.com/2/files/download",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/Homework/math/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path of the file to download."
        }, {
            "name": "rev",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")?",
            "desc": "Deprecated. Please specify revision in path instead This field is optional."
        }],
        "returnParameters": []
    },
    "files/get_metadata": {
        "uri": "https://api.dropboxapi.com/2/files/get_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path of a file or folder on Dropbox."
        }, {
            "name": "include_media_info",
            "type": "Boolean",
            "desc": "If true, FileMetadata.media_info is set for photo and video. The default for this field is False."
        }, {
            "name": "include_deleted",
            "type": "Boolean",
            "desc": "If true,   will be returned for deleted file or folder, otherwise LookupError.not_found will be returned. The default for this field is False."
        }, {
            "name": "include_has_explicit_shared_members",
            "type": "Boolean",
            "desc": "If true, the results will include a flag for each file indicating whether or not  that file has any explicit members. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/get_preview": {
        "uri": "https://content.dropboxapi.com/2/files/get_preview",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/word.docx"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path of the file to preview."
        }, {
            "name": "rev",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")?",
            "desc": "Deprecated. Please specify revision in path instead This field is optional."
        }],
        "returnParameters": []
    },
    "files/get_temporary_link": {
        "uri": "https://api.dropboxapi.com/2/files/get_temporary_link",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/video.mp4"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the file you want a temporary link to."
        }],
        "returnParameters": []
    },
    "files/get_thumbnail": {
        "uri": "https://content.dropboxapi.com/2/files/get_thumbnail",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/image.jpg",
            "format": "jpeg",
            "size": "w64h64"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the image file you want to thumbnail."
        }, {
            "name": "format",
            "type": "ThumbnailFormat",
            "desc": "The format for the thumbnail image, jpeg (default) or png. For  images that are photos, jpeg should be preferred, while png is  better for screenshots and digital arts. The default for this union is jpeg.",
            "parameters": [{
                "name": "jpeg",
                "type": "Void",
                "desc": ""
            }, {
                "name": "png",
                "type": "Void",
                "desc": ""
            }]
        }, {
            "name": "jpeg",
            "type": "Void",
            "desc": ""
        }, {
            "name": "png",
            "type": "Void",
            "desc": ""
        }, {
            "name": "size",
            "type": "ThumbnailSize",
            "desc": "The size for the thumbnail image. The default for this union is w64h64.",
            "parameters": [{
                "name": "w32h32",
                "type": "Void",
                "desc": "32 by 32 px."
            }, {
                "name": "w64h64",
                "type": "Void",
                "desc": "64 by 64 px."
            }, {
                "name": "w128h128",
                "type": "Void",
                "desc": "128 by 128 px."
            }, {
                "name": "w640h480",
                "type": "Void",
                "desc": "640 by 480 px."
            }, {
                "name": "w1024h768",
                "type": "Void",
                "desc": "1024 by 768"
            }]
        }, {
            "name": "w32h32",
            "type": "Void",
            "desc": "32 by 32 px."
        }, {
            "name": "w64h64",
            "type": "Void",
            "desc": "64 by 64 px."
        }, {
            "name": "w128h128",
            "type": "Void",
            "desc": "128 by 128 px."
        }, {
            "name": "w640h480",
            "type": "Void",
            "desc": "640 by 480 px."
        }, {
            "name": "w1024h768",
            "type": "Void",
            "desc": "1024 by 768"
        }],
        "returnParameters": []
    },
    "files/list_folder": {
        "uri": "https://api.dropboxapi.com/2/files/list_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "recursive": false,
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)?|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the folder you want to see the contents of."
        }, {
            "name": "recursive",
            "type": "Boolean",
            "desc": "If true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders. The default for this field is False."
        }, {
            "name": "include_media_info",
            "type": "Boolean",
            "desc": "If true, FileMetadata.media_info is set for photo and video. The default for this field is False."
        }, {
            "name": "include_deleted",
            "type": "Boolean",
            "desc": "If true, the results will include entries for files and folders that used to exist but were deleted. The default for this field is False."
        }, {
            "name": "include_has_explicit_shared_members",
            "type": "Boolean",
            "desc": "If true, the results will include a flag for each file indicating whether or not  that file has any explicit members. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/list_folder/continue": {
        "uri": "https://api.dropboxapi.com/2/files/list_folder/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String(min_length=1)",
            "desc": "The cursor returned by your last call to   or  ."
        }],
        "returnParameters": []
    },
    "files/list_folder/get_latest_cursor": {
        "uri": "https://api.dropboxapi.com/2/files/list_folder/get_latest_cursor",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "recursive": false,
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)?|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the folder you want to see the contents of."
        }, {
            "name": "recursive",
            "type": "Boolean",
            "desc": "If true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders. The default for this field is False."
        }, {
            "name": "include_media_info",
            "type": "Boolean",
            "desc": "If true, FileMetadata.media_info is set for photo and video. The default for this field is False."
        }, {
            "name": "include_deleted",
            "type": "Boolean",
            "desc": "If true, the results will include entries for files and folders that used to exist but were deleted. The default for this field is False."
        }, {
            "name": "include_has_explicit_shared_members",
            "type": "Boolean",
            "desc": "If true, the results will include a flag for each file indicating whether or not  that file has any explicit members. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/list_folder/longpoll": {
        "uri": "https://notify.dropboxapi.com/2/files/list_folder/longpoll",
        "requiresAuthHeader": false,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu",
            "timeout": 30
        },
        "parameters": [{
            "name": "cursor",
            "type": "String(min_length=1)",
            "desc": "A cursor as returned by   or  . Cursors retrieved by setting ListFolderArg.include_media_info to true are not supported."
        }, {
            "name": "timeout",
            "type": "UInt64",
            "desc": "A timeout in seconds. The request will block for at most this length of time, plus up to 90 seconds of random jitter added to avoid the thundering herd problem. Care should be taken when using this parameter, as some network infrastructure does not support long timeouts. The default for this field is 30."
        }],
        "returnParameters": []
    },
    "files/list_revisions": {
        "uri": "https://api.dropboxapi.com/2/files/list_revisions",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/root/word.docx",
            "limit": 10
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the file you want to see the revisions of."
        }, {
            "name": "limit",
            "type": "UInt64",
            "desc": "The maximum number of revision entries returned. The default for this field is 10."
        }],
        "returnParameters": []
    },
    "files/move": {
        "uri": "https://api.dropboxapi.com/2/files/move",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "from_path": "/Homework/math",
            "to_path": "/Homework/algebra",
            "allow_shared_folder": false,
            "autorename": false
        },
        "parameters": [{
            "name": "from_path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to be copied or moved."
        }, {
            "name": "to_path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox that is the destination."
        }],
        "returnParameters": []
    },
    "files/permanently_delete": {
        "uri": "https://api.dropboxapi.com/2/files/permanently_delete",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to delete."
        }],
        "returnParameters": []
    },
    "files/properties/add": {
        "uri": "https://api.dropboxapi.com/2/files/properties/add",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/my_awesome/word.docx",
            "property_groups": [{
                "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa",
                "fields": [{
                    "name": "Security Policy",
                    "value": "Confidential"
                }]
            }]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "A unique identifier for the file."
        }, {
            "name": "property_groups",
            "type": "List of (PropertyGroup, )",
            "desc": "Filled custom property templates associated with a file.",
            "parameters": [{
                "name": "template_id",
                "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
                "desc": "A unique identifier for a property template type."
            }, {
                "name": "fields",
                "type": "List of (PropertyField, )",
                "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
                "parameters": [{
                    "name": "name",
                    "type": "String",
                    "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
                }, {
                    "name": "value",
                    "type": "String",
                    "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
                }]
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "A unique identifier for a property template type."
        }, {
            "name": "fields",
            "type": "List of (PropertyField, )",
            "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
            "parameters": [{
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "name",
            "type": "String",
            "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
        }, {
            "name": "value",
            "type": "String",
            "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
        }],
        "returnParameters": []
    },
    "files/properties/overwrite": {
        "uri": "https://api.dropboxapi.com/2/files/properties/overwrite",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/my_awesome/word.docx",
            "property_groups": [{
                "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa",
                "fields": [{
                    "name": "Security Policy",
                    "value": "Confidential"
                }]
            }]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "A unique identifier for the file."
        }, {
            "name": "property_groups",
            "type": "List of (PropertyGroup, )",
            "desc": "Filled custom property templates associated with a file.",
            "parameters": [{
                "name": "template_id",
                "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
                "desc": "A unique identifier for a property template type."
            }, {
                "name": "fields",
                "type": "List of (PropertyField, )",
                "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
                "parameters": [{
                    "name": "name",
                    "type": "String",
                    "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
                }, {
                    "name": "value",
                    "type": "String",
                    "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
                }]
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "A unique identifier for a property template type."
        }, {
            "name": "fields",
            "type": "List of (PropertyField, )",
            "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
            "parameters": [{
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "name",
            "type": "String",
            "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
        }, {
            "name": "value",
            "type": "String",
            "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
        }],
        "returnParameters": []
    },
    "files/properties/remove": {
        "uri": "https://api.dropboxapi.com/2/files/properties/remove",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/my_awesome/word.docx",
            "property_template_ids": [
                "ptid:1a5n2i6d3OYEAAAAAAAAAYa"
            ]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "A unique identifier for the file."
        }, {
            "name": "property_template_ids",
            "type": "List of (String(min_length=1, pattern=\"(/|ptid:).*\"), )",
            "desc": "A list of identifiers for a property template created by route properties/template/add."
        }],
        "returnParameters": []
    },
    "files/properties/template/get": {
        "uri": "https://api.dropboxapi.com/2/files/properties/template/get",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa"
        },
        "parameters": [{
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "An identifier for property template added by route properties/template/add."
        }],
        "returnParameters": []
    },
    "files/properties/template/list": {
        "uri": "https://api.dropboxapi.com/2/files/properties/template/list",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [],
        "returnParameters": []
    },
    "files/properties/update": {
        "uri": "https://api.dropboxapi.com/2/files/properties/update",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/my_awesome/word.docx",
            "update_property_groups": [{
                "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa",
                "add_or_update_fields": [{
                    "name": "Security Policy",
                    "value": "Confidential"
                }],
                "remove_fields": []
            }]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "A unique identifier for the file."
        }, {
            "name": "update_property_groups",
            "type": "List of (PropertyGroupUpdate, )",
            "desc": "Filled custom property templates associated with a file.",
            "parameters": [{
                "name": "template_id",
                "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
                "desc": "A unique identifier for a property template."
            }, {
                "name": "add_or_update_fields",
                "type": "List of (PropertyField, )?",
                "desc": "List of property fields to update if the field already exists. If the field doesn't exist, add the field to the property group. This field is optional.",
                "parameters": [{
                    "name": "name",
                    "type": "String",
                    "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
                }, {
                    "name": "value",
                    "type": "String",
                    "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
                }]
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }, {
                "name": "remove_fields",
                "type": "List of (String, )?",
                "desc": "List of property field names to remove from property group if the field exists. This field is optional."
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "A unique identifier for a property template."
        }, {
            "name": "add_or_update_fields",
            "type": "List of (PropertyField, )?",
            "desc": "List of property fields to update if the field already exists. If the field doesn't exist, add the field to the property group. This field is optional.",
            "parameters": [{
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "name",
            "type": "String",
            "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
        }, {
            "name": "value",
            "type": "String",
            "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
        }, {
            "name": "remove_fields",
            "type": "List of (String, )?",
            "desc": "List of property field names to remove from property group if the field exists. This field is optional."
        }],
        "returnParameters": []
    },
    "files/restore": {
        "uri": "https://api.dropboxapi.com/2/files/restore",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/root/word.docx",
            "rev": "a1c10ce0dd78"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the file you want to restore."
        }, {
            "name": "rev",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "The revision to restore for the file."
        }],
        "returnParameters": []
    },
    "files/save_url": {
        "uri": "https://api.dropboxapi.com/2/files/save_url",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/a.txt",
            "url": "http://example.com/a.txt"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")",
            "desc": "The path in Dropbox where the URL will be saved to."
        }, {
            "name": "url",
            "type": "String",
            "desc": "The URL to be saved."
        }],
        "returnParameters": []
    },
    "files/save_url/check_job_status": {
        "uri": "https://api.dropboxapi.com/2/files/save_url/check_job_status",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "files/search": {
        "uri": "https://api.dropboxapi.com/2/files/search",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "",
            "query": "prime numbers",
            "start": 0,
            "max_results": 100,
            "mode": "filename"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)?|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path in the user's Dropbox to search. Should probably be a folder."
        }, {
            "name": "query",
            "type": "String",
            "desc": "The string to search for. The search string is split on spaces into multiple tokens. For file name searching, the last token is used for prefix matching (i.e. \"bat c\" matches \"bat cave\" but not \"batman car\")."
        }, {
            "name": "start",
            "type": "UInt64",
            "desc": "The starting index within the search results (used for paging). The default for this field is 0."
        }, {
            "name": "max_results",
            "type": "UInt64",
            "desc": "The maximum number of search results to return. The default for this field is 100."
        }, {
            "name": "mode",
            "type": "SearchMode",
            "desc": "The search mode (filename, filename_and_content, or deleted_filename). Note that searching file content is only available for Dropbox Business accounts. The default for this union is filename.",
            "parameters": [{
                "name": "filename",
                "type": "Void",
                "desc": "Search file and folder names."
            }, {
                "name": "filename_and_content",
                "type": "Void",
                "desc": "Search file and folder names as well as file contents."
            }, {
                "name": "deleted_filename",
                "type": "Void",
                "desc": "Search for deleted file and folder names."
            }]
        }, {
            "name": "filename",
            "type": "Void",
            "desc": "Search file and folder names."
        }, {
            "name": "filename_and_content",
            "type": "Void",
            "desc": "Search file and folder names as well as file contents."
        }, {
            "name": "deleted_filename",
            "type": "Void",
            "desc": "Search for deleted file and folder names."
        }],
        "returnParameters": []
    },
    "files/upload": {
        "uri": "https://content.dropboxapi.com/2/files/upload",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/Homework/math/Matrices.txt",
            "mode": "add",
            "autorename": true,
            "mute": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to save the file."
        }, {
            "name": "mode",
            "type": "WriteMode",
            "desc": "Selects what to do if the file already exists. The default for this union is add.",
            "parameters": [{
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "add",
            "type": "Void",
            "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
        }, {
            "name": "overwrite",
            "type": "Void",
            "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
        }, {
            "name": "update",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
        }, {
            "name": "client_modified",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
        }, {
            "name": "mute",
            "type": "Boolean",
            "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/upload_session/append": {
        "uri": "https://content.dropboxapi.com/2/files/upload_session/append",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "session_id": "1234faaf0678bcde",
            "offset": 0
        },
        "parameters": [{
            "name": "session_id",
            "type": "String",
            "desc": "The upload session ID (returned by  )."
        }, {
            "name": "offset",
            "type": "UInt64",
            "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
        }],
        "returnParameters": []
    },
    "files/upload_session/append_v2": {
        "uri": "https://content.dropboxapi.com/2/files/upload_session/append_v2",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "cursor": {
                "session_id": "1234faaf0678bcde",
                "offset": 0
            },
            "close": false
        },
        "parameters": [{
            "name": "cursor",
            "type": "UploadSessionCursor",
            "desc": "Contains the upload session ID and the offset.",
            "parameters": [{
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by  )."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }]
        }, {
            "name": "session_id",
            "type": "String",
            "desc": "The upload session ID (returned by  )."
        }, {
            "name": "offset",
            "type": "UInt64",
            "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
        }, {
            "name": "close",
            "type": "Boolean",
            "desc": "If true, the current session will be closed, at which point you won't be able to call   anymore with the current session. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/upload_session/finish": {
        "uri": "https://content.dropboxapi.com/2/files/upload_session/finish",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "cursor": {
                "session_id": "1234faaf0678bcde",
                "offset": 0
            },
            "commit": {
                "path": "/Homework/math/Matrices.txt",
                "mode": "add",
                "autorename": true,
                "mute": false
            }
        },
        "parameters": [{
            "name": "cursor",
            "type": "UploadSessionCursor",
            "desc": "Contains the upload session ID and the offset.",
            "parameters": [{
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by  )."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }]
        }, {
            "name": "session_id",
            "type": "String",
            "desc": "The upload session ID (returned by  )."
        }, {
            "name": "offset",
            "type": "UInt64",
            "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
        }, {
            "name": "commit",
            "type": "CommitInfo",
            "desc": "Contains the path and other optional modifiers for the commit.",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to save the file."
            }, {
                "name": "mode",
                "type": "WriteMode",
                "desc": "Selects what to do if the file already exists. The default for this union is add.",
                "parameters": [{
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }, {
                "name": "autorename",
                "type": "Boolean",
                "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
            }, {
                "name": "client_modified",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
            }, {
                "name": "mute",
                "type": "Boolean",
                "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to save the file."
        }, {
            "name": "mode",
            "type": "WriteMode",
            "desc": "Selects what to do if the file already exists. The default for this union is add.",
            "parameters": [{
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "add",
            "type": "Void",
            "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
        }, {
            "name": "overwrite",
            "type": "Void",
            "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
        }, {
            "name": "update",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
        }, {
            "name": "client_modified",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
        }, {
            "name": "mute",
            "type": "Boolean",
            "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/upload_session/finish_batch": {
        "uri": "https://api.dropboxapi.com/2/files/upload_session/finish_batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "entries": [{
                "cursor": {
                    "session_id": "1234faaf0678bcde",
                    "offset": 0
                },
                "commit": {
                    "path": "/Homework/math/Matrices.txt",
                    "mode": {
                        ".tag": "add"
                    },
                    "autorename": true,
                    "mute": false
                }
            }]
        },
        "parameters": [{
            "name": "entries",
            "type": "List of (UploadSessionFinishArg, max_items=1000)",
            "desc": "Commit information for each file in the batch.",
            "parameters": [{
                "name": "cursor",
                "type": "UploadSessionCursor",
                "desc": "Contains the upload session ID and the offset.",
                "parameters": [{
                    "name": "session_id",
                    "type": "String",
                    "desc": "The upload session ID (returned by  )."
                }, {
                    "name": "offset",
                    "type": "UInt64",
                    "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
                }]
            }, {
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by  )."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }, {
                "name": "commit",
                "type": "CommitInfo",
                "desc": "Contains the path and other optional modifiers for the commit.",
                "parameters": [{
                    "name": "path",
                    "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                    "desc": "Path in the user's Dropbox to save the file."
                }, {
                    "name": "mode",
                    "type": "WriteMode",
                    "desc": "Selects what to do if the file already exists. The default for this union is add.",
                    "parameters": [{
                        "name": "add",
                        "type": "Void",
                        "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                    }, {
                        "name": "overwrite",
                        "type": "Void",
                        "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                    }, {
                        "name": "update",
                        "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                        "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                    }]
                }, {
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }, {
                    "name": "autorename",
                    "type": "Boolean",
                    "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
                }, {
                    "name": "client_modified",
                    "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                    "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
                }, {
                    "name": "mute",
                    "type": "Boolean",
                    "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
                }, {
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to save the file."
            }, {
                "name": "mode",
                "type": "WriteMode",
                "desc": "Selects what to do if the file already exists. The default for this union is add.",
                "parameters": [{
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }, {
                "name": "autorename",
                "type": "Boolean",
                "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
            }, {
                "name": "client_modified",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
            }, {
                "name": "mute",
                "type": "Boolean",
                "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
            }, {
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by  )."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }, {
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to save the file."
            }, {
                "name": "mode",
                "type": "WriteMode",
                "desc": "Selects what to do if the file already exists. The default for this union is add.",
                "parameters": [{
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }, {
                "name": "autorename",
                "type": "Boolean",
                "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
            }, {
                "name": "client_modified",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
            }, {
                "name": "mute",
                "type": "Boolean",
                "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "cursor",
            "type": "UploadSessionCursor",
            "desc": "Contains the upload session ID and the offset.",
            "parameters": [{
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by  )."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }]
        }, {
            "name": "session_id",
            "type": "String",
            "desc": "The upload session ID (returned by  )."
        }, {
            "name": "offset",
            "type": "UInt64",
            "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
        }, {
            "name": "commit",
            "type": "CommitInfo",
            "desc": "Contains the path and other optional modifiers for the commit.",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to save the file."
            }, {
                "name": "mode",
                "type": "WriteMode",
                "desc": "Selects what to do if the file already exists. The default for this union is add.",
                "parameters": [{
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }, {
                "name": "autorename",
                "type": "Boolean",
                "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
            }, {
                "name": "client_modified",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
            }, {
                "name": "mute",
                "type": "Boolean",
                "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to save the file."
        }, {
            "name": "mode",
            "type": "WriteMode",
            "desc": "Selects what to do if the file already exists. The default for this union is add.",
            "parameters": [{
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "add",
            "type": "Void",
            "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
        }, {
            "name": "overwrite",
            "type": "Void",
            "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
        }, {
            "name": "update",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
        }, {
            "name": "client_modified",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
        }, {
            "name": "mute",
            "type": "Boolean",
            "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/upload_session/finish_batch/check": {
        "uri": "https://api.dropboxapi.com/2/files/upload_session/finish_batch/check",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "files/upload_session/start": {
        "uri": "https://content.dropboxapi.com/2/files/upload_session/start",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "close": false
        },
        "parameters": [{
            "name": "close",
            "type": "Boolean",
            "desc": "If true, the current session will be closed, at which point you won't be able to call   anymore with the current session. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/add_file_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/add_file_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "members": [{
                ".tag": "email",
                "email": "justin@example.com"
            }],
            "custom_message": "This is a custom message about ACME.doc",
            "quiet": false,
            "access_level": "viewer",
            "add_message_as_comment": false
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "File to which to add members."
        }, {
            "name": "members",
            "type": "List of (MemberSelector, )",
            "desc": "Members to add. Note that even an email address is given, this may result in a user being directy added to the membership if that email is the user's main account email.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "custom_message",
            "type": "String?",
            "desc": "Message to send to added members in their invitation. This field is optional."
        }, {
            "name": "quiet",
            "type": "Boolean",
            "desc": "Whether added members should be notified via device notifications of their invitation. The default for this field is False."
        }, {
            "name": "access_level",
            "type": "AccessLevel",
            "desc": "AccessLevel union object, describing what access level we want to give new members. The default for this union is viewer.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
        }, {
            "name": "editor",
            "type": "Void",
            "desc": "The collaborator can both view and edit the shared folder."
        }, {
            "name": "viewer",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder."
        }, {
            "name": "viewer_no_comment",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder and does not have any access to comments."
        }, {
            "name": "add_message_as_comment",
            "type": "Boolean",
            "desc": "If the custom message should be added as a comment on the file. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/add_folder_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/add_folder_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "members": [{
                "member": {
                    ".tag": "email",
                    "email": "justin@example.com"
                },
                "access_level": {
                    ".tag": "editor"
                }
            }, {
                "member": {
                    ".tag": "dropbox_id",
                    "dropbox_id": "dbid:AAEufNrMPSPe0dMQijRP0N_aZtBJRm26W4Q"
                },
                "access_level": {
                    ".tag": "viewer"
                }
            }],
            "quiet": false,
            "custom_message": "Documentation for launch day"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "members",
            "type": "List of (AddMember, )",
            "desc": "The intended list of members to add.  Added members will receive invites to join the shared folder.",
            "parameters": [{
                "name": "member",
                "type": "MemberSelector",
                "desc": "The member to add to the shared folder.",
                "parameters": [{
                    "name": "dropbox_id",
                    "type": "String(min_length=1)",
                    "desc": "Dropbox account, team member, or group ID of member."
                }, {
                    "name": "email",
                    "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                    "desc": "E-mail address of member."
                }]
            }, {
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }, {
                "name": "access_level",
                "type": "AccessLevel",
                "desc": "The access level to grant member to the shared folder.  AccessLevel.owner is disallowed. The default for this union is viewer.",
                "parameters": [{
                    "name": "owner",
                    "type": "Void",
                    "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
                }, {
                    "name": "editor",
                    "type": "Void",
                    "desc": "The collaborator can both view and edit the shared folder."
                }, {
                    "name": "viewer",
                    "type": "Void",
                    "desc": "The collaborator can only view the shared folder."
                }, {
                    "name": "viewer_no_comment",
                    "type": "Void",
                    "desc": "The collaborator can only view the shared folder and does not have any access to comments."
                }]
            }, {
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }, {
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }, {
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "The member to add to the shared folder.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "access_level",
            "type": "AccessLevel",
            "desc": "The access level to grant member to the shared folder.  AccessLevel.owner is disallowed. The default for this union is viewer.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
        }, {
            "name": "editor",
            "type": "Void",
            "desc": "The collaborator can both view and edit the shared folder."
        }, {
            "name": "viewer",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder."
        }, {
            "name": "viewer_no_comment",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder and does not have any access to comments."
        }, {
            "name": "quiet",
            "type": "Boolean",
            "desc": "Whether added members should be notified via email and device notifications of their invite. The default for this field is False."
        }, {
            "name": "custom_message",
            "type": "String(min_length=1)?",
            "desc": "Optional message to display to added members in their invitation. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/change_file_member_access": {
        "uri": "https://api.dropboxapi.com/2/sharing/change_file_member_access",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            },
            "access_level": "viewer_no_comment"
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "File for which we are changing a member's access."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "The member whose access we are changing.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "access_level",
            "type": "AccessLevel",
            "desc": "The new access level for the member.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
        }, {
            "name": "editor",
            "type": "Void",
            "desc": "The collaborator can both view and edit the shared folder."
        }, {
            "name": "viewer",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder."
        }, {
            "name": "viewer_no_comment",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder and does not have any access to comments."
        }],
        "returnParameters": []
    },
    "sharing/check_job_status": {
        "uri": "https://api.dropboxapi.com/2/sharing/check_job_status",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "sharing/check_remove_member_job_status": {
        "uri": "https://api.dropboxapi.com/2/sharing/check_remove_member_job_status",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "sharing/check_share_job_status": {
        "uri": "https://api.dropboxapi.com/2/sharing/check_share_job_status",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "sharing/create_shared_link": {
        "uri": "https://api.dropboxapi.com/2/sharing/create_shared_link",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/Math/Prime_Numbers.txt",
            "short_url": false
        },
        "parameters": [{
            "name": "path",
            "type": "String",
            "desc": "The path to share."
        }, {
            "name": "short_url",
            "type": "Boolean",
            "desc": "Whether to return a shortened URL. The default for this field is False."
        }, {
            "name": "pending_upload",
            "type": "PendingUploadMode?",
            "desc": "If it's okay to share a path that does not yet exist, set this to either PendingUploadMode.file or PendingUploadMode.folder to indicate whether to assume it's a file or folder. This field is optional.",
            "parameters": [{
                "name": "file",
                "type": "Void",
                "desc": "Assume pending uploads are files."
            }, {
                "name": "folder",
                "type": "Void",
                "desc": "Assume pending uploads are folders."
            }]
        }, {
            "name": "file",
            "type": "Void",
            "desc": "Assume pending uploads are files."
        }, {
            "name": "folder",
            "type": "Void",
            "desc": "Assume pending uploads are folders."
        }],
        "returnParameters": []
    },
    "sharing/create_shared_link_with_settings": {
        "uri": "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Prime_Numbers.txt",
            "settings": {
                "requested_visibility": "public"
            }
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to be shared by the shared link"
        }, {
            "name": "settings",
            "type": "SharedLinkSettings?",
            "desc": "The requested settings for the newly created shared link This field is optional.",
            "parameters": [{
                "name": "requested_visibility",
                "type": "RequestedVisibility?",
                "desc": "The requested access for this shared link. This field is optional.",
                "parameters": [{
                    "name": "public",
                    "type": "Void",
                    "desc": "Anyone who has received the link can access it. No login required."
                }, {
                    "name": "team_only",
                    "type": "Void",
                    "desc": "Only members of the same team can access the link. Login is required."
                }, {
                    "name": "password",
                    "type": "Void",
                    "desc": "A link-specific password is required to access the link. Login is not required."
                }]
            }, {
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }, {
                "name": "link_password",
                "type": "String?",
                "desc": "If requested_visibility is RequestedVisibility.password this is needed to specify the password to access the link. This field is optional."
            }, {
                "name": "expires",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "Expiration time of the shared link. By default the link won't expire. This field is optional."
            }, {
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }]
        }, {
            "name": "requested_visibility",
            "type": "RequestedVisibility?",
            "desc": "The requested access for this shared link. This field is optional.",
            "parameters": [{
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }]
        }, {
            "name": "public",
            "type": "Void",
            "desc": "Anyone who has received the link can access it. No login required."
        }, {
            "name": "team_only",
            "type": "Void",
            "desc": "Only members of the same team can access the link. Login is required."
        }, {
            "name": "password",
            "type": "Void",
            "desc": "A link-specific password is required to access the link. Login is not required."
        }, {
            "name": "link_password",
            "type": "String?",
            "desc": "If requested_visibility is RequestedVisibility.password this is needed to specify the password to access the link. This field is optional."
        }, {
            "name": "expires",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "Expiration time of the shared link. By default the link won't expire. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/get_file_metadata": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_file_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "actions": []
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "The file to query."
        }, {
            "name": "actions",
            "type": "List of (FileAction, )?",
            "desc": "File actions to query. This field is optional.",
            "parameters": [{
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the file."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Add a member with view permissions."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Add a member with view permissions but no comment permissions."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this file."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership to the file."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link to the file."
            }]
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the file."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Add a member with view permissions."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Add a member with view permissions but no comment permissions."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this file."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership to the file."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link to the file."
        }],
        "returnParameters": []
    },
    "sharing/get_file_metadata/batch": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_file_metadata/batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "files": [
                "id:3kmLmQFnf1AAAAAAAAAAAw",
                "id:VvTaJu2VZzAAAAAAAAAADQ"
            ],
            "actions": []
        },
        "parameters": [{
            "name": "files",
            "type": "List of (String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\"), max_items=100)",
            "desc": "The files to query."
        }, {
            "name": "actions",
            "type": "List of (FileAction, )?",
            "desc": "File actions to query. This field is optional.",
            "parameters": [{
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the file."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Add a member with view permissions."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Add a member with view permissions but no comment permissions."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this file."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership to the file."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link to the file."
            }]
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the file."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Add a member with view permissions."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Add a member with view permissions but no comment permissions."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this file."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership to the file."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link to the file."
        }],
        "returnParameters": []
    },
    "sharing/get_folder_metadata": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_folder_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "actions": []
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "actions",
            "type": "List of (FolderAction, )?",
            "desc": "This is a list indicating whether the returned folder data will include a boolean value  FolderPermission.allow that describes whether the current user can perform the  FolderAction on the folder. This field is optional.",
            "parameters": [{
                "name": "change_options",
                "type": "Void",
                "desc": "Change folder options, such as who can be invited to join the folder."
            }, {
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the folder."
            }, {
                "name": "invite_editor",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read and write permission."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership in the folder."
            }, {
                "name": "unmount",
                "type": "Void",
                "desc": "Unmount the folder."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this folder."
            }, {
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link for folder."
            }]
        }, {
            "name": "change_options",
            "type": "Void",
            "desc": "Change folder options, such as who can be invited to join the folder."
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the folder."
        }, {
            "name": "invite_editor",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read and write permission."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership in the folder."
        }, {
            "name": "unmount",
            "type": "Void",
            "desc": "Unmount the folder."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this folder."
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link for folder."
        }],
        "returnParameters": []
    },
    "sharing/get_shared_link_file": {
        "uri": "https://content.dropboxapi.com/2/sharing/get_shared_link_file",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "CONTENT",
        "testParams": {
            "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0",
            "path": "/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "url",
            "type": "String",
            "desc": "URL of the shared link."
        }, {
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")?",
            "desc": "If the shared link is to a folder, this parameter can be used to retrieve the metadata for a specific file or sub-folder in this folder. A relative path should be used. This field is optional."
        }, {
            "name": "link_password",
            "type": "String?",
            "desc": "If the shared link has a password, this parameter can be used. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/get_shared_link_metadata": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_shared_link_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0",
            "path": "/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "url",
            "type": "String",
            "desc": "URL of the shared link."
        }, {
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")?",
            "desc": "If the shared link is to a folder, this parameter can be used to retrieve the metadata for a specific file or sub-folder in this folder. A relative path should be used. This field is optional."
        }, {
            "name": "link_password",
            "type": "String?",
            "desc": "If the shared link has a password, this parameter can be used. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/get_shared_links": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_shared_links",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": ""
        },
        "parameters": [{
            "name": "path",
            "type": "String?",
            "desc": "See   description. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/list_file_members": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_file_members",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "include_inherited": true,
            "limit": 100
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "The file for which you want to see members."
        }, {
            "name": "actions",
            "type": "List of (MemberAction, )?",
            "desc": "The actions for which to return permissions on a member This field is optional.",
            "parameters": [{
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Allow the member to keep a copy of the folder when removing."
            }, {
                "name": "make_editor",
                "type": "Void",
                "desc": "Make the member an editor of the folder."
            }, {
                "name": "make_owner",
                "type": "Void",
                "desc": "Make the member an owner of the folder."
            }, {
                "name": "make_viewer",
                "type": "Void",
                "desc": "Make the member a viewer of the folder."
            }, {
                "name": "make_viewer_no_comment",
                "type": "Void",
                "desc": "Make the member a viewer of the folder without commenting permissions."
            }, {
                "name": "remove",
                "type": "Void",
                "desc": "Remove the member from the folder."
            }]
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Allow the member to keep a copy of the folder when removing."
        }, {
            "name": "make_editor",
            "type": "Void",
            "desc": "Make the member an editor of the folder."
        }, {
            "name": "make_owner",
            "type": "Void",
            "desc": "Make the member an owner of the folder."
        }, {
            "name": "make_viewer",
            "type": "Void",
            "desc": "Make the member a viewer of the folder."
        }, {
            "name": "make_viewer_no_comment",
            "type": "Void",
            "desc": "Make the member a viewer of the folder without commenting permissions."
        }, {
            "name": "remove",
            "type": "Void",
            "desc": "Remove the member from the folder."
        }, {
            "name": "include_inherited",
            "type": "Boolean",
            "desc": "Whether to include members who only have access from a parent shared folder. The default for this field is True."
        }, {
            "name": "limit",
            "type": "UInt32",
            "desc": "Number of members to return max per query. Defaults to 100 if no limit is specified. The default for this field is 100."
        }],
        "returnParameters": []
    },
    "sharing/list_file_members/batch": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_file_members/batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "files": [
                "id:3kmLmQFnf1AAAAAAAAAAAw",
                "id:VvTaJu2VZzAAAAAAAAAADQ"
            ],
            "limit": 10
        },
        "parameters": [{
            "name": "files",
            "type": "List of (String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\"), max_items=100)",
            "desc": "Files for which to return members."
        }, {
            "name": "limit",
            "type": "UInt32",
            "desc": "Number of members to return max per query. Defaults to 10 if no limit is specified. The default for this field is 10."
        }],
        "returnParameters": []
    },
    "sharing/list_file_members/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_file_members/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "The cursor returned by your last call to  list_file_members or list_file_members/batch."
        }],
        "returnParameters": []
    },
    "sharing/list_folder_members": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_folder_members",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "actions": [],
            "limit": 10
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "actions",
            "type": "List of (MemberAction, )?",
            "desc": "This is a list indicating whether each returned member will include a boolean value MemberPermission.allow that describes whether the current user can perform the MemberAction on the member. This field is optional.",
            "parameters": [{
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Allow the member to keep a copy of the folder when removing."
            }, {
                "name": "make_editor",
                "type": "Void",
                "desc": "Make the member an editor of the folder."
            }, {
                "name": "make_owner",
                "type": "Void",
                "desc": "Make the member an owner of the folder."
            }, {
                "name": "make_viewer",
                "type": "Void",
                "desc": "Make the member a viewer of the folder."
            }, {
                "name": "make_viewer_no_comment",
                "type": "Void",
                "desc": "Make the member a viewer of the folder without commenting permissions."
            }, {
                "name": "remove",
                "type": "Void",
                "desc": "Remove the member from the folder."
            }]
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Allow the member to keep a copy of the folder when removing."
        }, {
            "name": "make_editor",
            "type": "Void",
            "desc": "Make the member an editor of the folder."
        }, {
            "name": "make_owner",
            "type": "Void",
            "desc": "Make the member an owner of the folder."
        }, {
            "name": "make_viewer",
            "type": "Void",
            "desc": "Make the member a viewer of the folder."
        }, {
            "name": "make_viewer_no_comment",
            "type": "Void",
            "desc": "Make the member a viewer of the folder without commenting permissions."
        }, {
            "name": "remove",
            "type": "Void",
            "desc": "Remove the member from the folder."
        }, {
            "name": "limit",
            "type": "UInt32",
            "desc": "The maximum number of results that include members, groups and invitees to return per request. The default for this field is 1000."
        }],
        "returnParameters": []
    },
    "sharing/list_folder_members/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_folder_members/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "The cursor returned by your last call to list_folder_members."
        }],
        "returnParameters": []
    },
    "sharing/list_folders": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_folders",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "limit": 100,
            "actions": []
        },
        "parameters": [{
            "name": "limit",
            "type": "UInt32",
            "desc": "The maximum number of results to return per request. The default for this field is 1000."
        }, {
            "name": "actions",
            "type": "List of (FolderAction, )?",
            "desc": "This is a list indicating whether each returned folder data entry will include a boolean field FolderPermission.allow that describes whether the current user can perform the `FolderAction` on the folder. This field is optional.",
            "parameters": [{
                "name": "change_options",
                "type": "Void",
                "desc": "Change folder options, such as who can be invited to join the folder."
            }, {
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the folder."
            }, {
                "name": "invite_editor",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read and write permission."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership in the folder."
            }, {
                "name": "unmount",
                "type": "Void",
                "desc": "Unmount the folder."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this folder."
            }, {
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link for folder."
            }]
        }, {
            "name": "change_options",
            "type": "Void",
            "desc": "Change folder options, such as who can be invited to join the folder."
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the folder."
        }, {
            "name": "invite_editor",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read and write permission."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership in the folder."
        }, {
            "name": "unmount",
            "type": "Void",
            "desc": "Unmount the folder."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this folder."
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link for folder."
        }],
        "returnParameters": []
    },
    "sharing/list_folders/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_folders/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "The cursor returned by the previous API call specified in the endpoint description."
        }],
        "returnParameters": []
    },
    "sharing/list_mountable_folders": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_mountable_folders",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "limit": 100,
            "actions": []
        },
        "parameters": [{
            "name": "limit",
            "type": "UInt32",
            "desc": "The maximum number of results to return per request. The default for this field is 1000."
        }, {
            "name": "actions",
            "type": "List of (FolderAction, )?",
            "desc": "This is a list indicating whether each returned folder data entry will include a boolean field FolderPermission.allow that describes whether the current user can perform the `FolderAction` on the folder. This field is optional.",
            "parameters": [{
                "name": "change_options",
                "type": "Void",
                "desc": "Change folder options, such as who can be invited to join the folder."
            }, {
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the folder."
            }, {
                "name": "invite_editor",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read and write permission."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership in the folder."
            }, {
                "name": "unmount",
                "type": "Void",
                "desc": "Unmount the folder."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this folder."
            }, {
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link for folder."
            }]
        }, {
            "name": "change_options",
            "type": "Void",
            "desc": "Change folder options, such as who can be invited to join the folder."
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the folder."
        }, {
            "name": "invite_editor",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read and write permission."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership in the folder."
        }, {
            "name": "unmount",
            "type": "Void",
            "desc": "Unmount the folder."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this folder."
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link for folder."
        }],
        "returnParameters": []
    },
    "sharing/list_mountable_folders/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_mountable_folders/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "The cursor returned by the previous API call specified in the endpoint description."
        }],
        "returnParameters": []
    },
    "sharing/list_received_files": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_received_files",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "limit": 100,
            "actions": []
        },
        "parameters": [{
            "name": "limit",
            "type": "UInt32",
            "desc": "Number of files to return max per query. Defaults to 100 if no limit is specified. The default for this field is 100."
        }, {
            "name": "actions",
            "type": "List of (FileAction, )?",
            "desc": "File actions to query. This field is optional.",
            "parameters": [{
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the file."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Add a member with view permissions."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Add a member with view permissions but no comment permissions."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this file."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership to the file."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link to the file."
            }]
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the file."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Add a member with view permissions."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Add a member with view permissions but no comment permissions."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this file."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership to the file."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link to the file."
        }],
        "returnParameters": []
    },
    "sharing/list_received_files/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_received_files/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "AzJJbGlzdF90eXBdofe9c3RPbGlzdGFyZ3NfYnlfZ2lkMRhcbric7Rdog9emfGRlc2MCRWxpbWl0BGRId"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "Cursor in ListFilesResult.cursor"
        }],
        "returnParameters": []
    },
    "sharing/list_shared_links": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_shared_links",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams":

        {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")?",
            "desc": "See   description. This field is optional."
        }, {
            "name": "cursor",
            "type": "String?",
            "desc": "The cursor returned by your last call to  . This field is optional."
        }, {
            "name": "direct_only",
            "type": "Boolean?",
            "desc": "See   description. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/modify_shared_link_settings": {
        "uri": "https://api.dropboxapi.com/2/sharing/modify_shared_link_settings",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0",
            "settings": {
                "requested_visibility": "public"
            },
            "remove_expiration": false
        },
        "parameters": [{
            "name": "url",
            "type": "String",
            "desc": "URL of the shared link to change its settings"
        }, {
            "name": "settings",
            "type": "SharedLinkSettings",
            "desc": "Set of settings for the shared link.",
            "parameters": [{
                "name": "requested_visibility",
                "type": "RequestedVisibility?",
                "desc": "The requested access for this shared link. This field is optional.",
                "parameters": [{
                    "name": "public",
                    "type": "Void",
                    "desc": "Anyone who has received the link can access it. No login required."
                }, {
                    "name": "team_only",
                    "type": "Void",
                    "desc": "Only members of the same team can access the link. Login is required."
                }, {
                    "name": "password",
                    "type": "Void",
                    "desc": "A link-specific password is required to access the link. Login is not required."
                }]
            }, {
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }, {
                "name": "link_password",
                "type": "String?",
                "desc": "If requested_visibility is RequestedVisibility.password this is needed to specify the password to access the link. This field is optional."
            }, {
                "name": "expires",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "Expiration time of the shared link. By default the link won't expire. This field is optional."
            }, {
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }]
        }, {
            "name": "requested_visibility",
            "type": "RequestedVisibility?",
            "desc": "The requested access for this shared link. This field is optional.",
            "parameters": [{
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }]
        }, {
            "name": "public",
            "type": "Void",
            "desc": "Anyone who has received the link can access it. No login required."
        }, {
            "name": "team_only",
            "type": "Void",
            "desc": "Only members of the same team can access the link. Login is required."
        }, {
            "name": "password",
            "type": "Void",
            "desc": "A link-specific password is required to access the link. Login is not required."
        }, {
            "name": "link_password",
            "type": "String?",
            "desc": "If requested_visibility is RequestedVisibility.password this is needed to specify the password to access the link. This field is optional."
        }, {
            "name": "expires",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "Expiration time of the shared link. By default the link won't expire. This field is optional."
        }, {
            "name": "remove_expiration",
            "type": "Boolean",
            "desc": "If set to true, removes the expiration of the shared link. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/mount_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/mount_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID of the shared folder to mount."
        }],
        "returnParameters": []
    },
    "sharing/relinquish_file_membership": {
        "uri": "https://api.dropboxapi.com/2/sharing/relinquish_file_membership",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw"
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "The path or id for the file."
        }],
        "returnParameters": []
    },
    "sharing/relinquish_folder_membership": {
        "uri": "https://api.dropboxapi.com/2/sharing/relinquish_folder_membership",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "leave_a_copy": false
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "leave_a_copy",
            "type": "Boolean",
            "desc": "Keep a copy of the folder's contents upon relinquishing membership. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/remove_file_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/remove_file_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            }
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "File from which to remove members."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "Member to remove from this file. Note that even if an email is specified, it may result in the removal of a user (not an invitee) if the user's main account corresponds to that email address.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }],
        "returnParameters": []
    },
    "sharing/remove_file_member_2": {
        "uri": "https://api.dropboxapi.com/2/sharing/remove_file_member_2",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            }
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "File from which to remove members."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "Member to remove from this file. Note that even if an email is specified, it may result in the removal of a user (not an invitee) if the user's main account corresponds to that email address.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }],
        "returnParameters": []
    },
    "sharing/remove_folder_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/remove_folder_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            },
            "leave_a_copy": false
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "The member to remove from the folder.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "leave_a_copy",
            "type": "Boolean",
            "desc": "If true, the removed user will keep their copy of the folder after it's unshared, assuming it was mounted. Otherwise, it will be removed from their Dropbox. Also, this must be set to false when kicking a group."
        }],
        "returnParameters": []
    },
    "sharing/revoke_shared_link": {
        "uri": "https://api.dropboxapi.com/2/sharing/revoke_shared_link",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0"
        },
        "parameters": [{
            "name": "url",
            "type": "String",
            "desc": "URL of the shared link."
        }],
        "returnParameters": []
    },
    "sharing/share_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/share_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/example/workspace",
            "member_policy": "team",
            "acl_update_policy": "editors",
            "shared_link_policy": "members",
            "force_async": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")",
            "desc": "The path to the folder to share. If it does not exist, then a new one is created."
        }, {
            "name": "member_policy",
            "type": "MemberPolicy",
            "desc": "Who can be a member of this shared folder. Only applicable if the current user is on a team. The default for this union is anyone.",
            "parameters": [{
                "name": "team",
                "type": "Void",
                "desc": "Only a teammate can become a member."
            }, {
                "name": "anyone",
                "type": "Void",
                "desc": "Anyone can become a member."
            }]
        }, {
            "name": "team",
            "type": "Void",
            "desc": "Only a teammate can become a member."
        }, {
            "name": "anyone",
            "type": "Void",
            "desc": "Anyone can become a member."
        }, {
            "name": "acl_update_policy",
            "type": "AclUpdatePolicy",
            "desc": "Who can add and remove members of this shared folder. The default for this union is owner.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "Only the owner can update the ACL."
            }, {
                "name": "editors",
                "type": "Void",
                "desc": "Any editor can update the ACL. This may be further restricted to editors on the same team."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "Only the owner can update the ACL."
        }, {
            "name": "editors",
            "type": "Void",
            "desc": "Any editor can update the ACL. This may be further restricted to editors on the same team."
        }, {
            "name": "shared_link_policy",
            "type": "SharedLinkPolicy",
            "desc": "The policy to apply to shared links created for content inside this shared folder.  The current user must be on a team to set this policy to SharedLinkPolicy.members. The default for this union is anyone.",
            "parameters": [{
                "name": "anyone",
                "type": "Void",
                "desc": "Links can be shared with anyone."
            }, {
                "name": "members",
                "type": "Void",
                "desc": "Links can only be shared among members of the shared folder."
            }]
        }, {
            "name": "anyone",
            "type": "Void",
            "desc": "Links can be shared with anyone."
        }, {
            "name": "members",
            "type": "Void",
            "desc": "Links can only be shared among members of the shared folder."
        }, {
            "name": "force_async",
            "type": "Boolean",
            "desc": "Whether to force the share to happen asynchronously. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/transfer_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/transfer_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "to_dropbox_id",
            "type": "String(min_length=1)",
            "desc": "A account or team member ID to transfer ownership to."
        }],
        "returnParameters": []
    },
    "sharing/unmount_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/unmount_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "to_dropbox_id": "dbid:AAEufNrMPSPe0dMQijRP0N_aZtBJRm26W4Q"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }],
        "returnParameters": []
    },
    "sharing/unshare_file": {
        "uri": "https://api.dropboxapi.com/2/sharing/unshare_file",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw"
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "The file to unshare."
        }],
        "returnParameters": []
    },
    "sharing/unshare_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/unshare_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "leave_a_copy": false
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "leave_a_copy",
            "type": "Boolean",
            "desc": "If true, members of this shared folder will get a copy of this folder after it's unshared. Otherwise, it will be removed from their Dropbox. The current user, who is an owner, will always retain their copy. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/update_folder_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/update_folder_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            },
            "access_level": "editor"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "The member of the shared folder to update.  Only the MemberSelector.dropbox_id may be set at this time.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "access_level",
            "type": "AccessLevel",
            "desc": "The new access level for member. AccessLevel.owner is disallowed.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
        }, {
            "name": "editor",
            "type": "Void",
            "desc": "The collaborator can both view and edit the shared folder."
        }, {
            "name": "viewer",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder."
        }, {
            "name": "viewer_no_comment",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder and does not have any access to comments."
        }],
        "returnParameters": []
    },
    "sharing/update_folder_policy": {
        "uri": "https://api.dropboxapi.com/2/sharing/update_folder_policy",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "member_policy": "team",
            "acl_update_policy": "owner",
            "shared_link_policy": "members"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "member_policy",
            "type": "MemberPolicy?",
            "desc": "Who can be a member of this shared folder. Only applicable if the current user is on a team. This field is optional.",
            "parameters": [{
                "name": "team",
                "type": "Void",
                "desc": "Only a teammate can become a member."
            }, {
                "name": "anyone",
                "type": "Void",
                "desc": "Anyone can become a member."
            }]
        }, {
            "name": "team",
            "type": "Void",
            "desc": "Only a teammate can become a member."
        }, {
            "name": "anyone",
            "type": "Void",
            "desc": "Anyone can become a member."
        }, {
            "name": "acl_update_policy",
            "type": "AclUpdatePolicy?",
            "desc": "Who can add and remove members of this shared folder. This field is optional.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "Only the owner can update the ACL."
            }, {
                "name": "editors",
                "type": "Void",
                "desc": "Any editor can update the ACL. This may be further restricted to editors on the same team."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "Only the owner can update the ACL."
        }, {
            "name": "editors",
            "type": "Void",
            "desc": "Any editor can update the ACL. This may be further restricted to editors on the same team."
        }, {
            "name": "shared_link_policy",
            "type": "SharedLinkPolicy?",
            "desc": "The policy to apply to shared links created for content inside this shared folder. The current user must be on a team to set this policy to SharedLinkPolicy.members. This field is optional.",
            "parameters": [{
                "name": "anyone",
                "type": "Void",
                "desc": "Links can be shared with anyone."
            }, {
                "name": "members",
                "type": "Void",
                "desc": "Links can only be shared among members of the shared folder."
            }]
        }, {
            "name": "anyone",
            "type": "Void",
            "desc": "Links can be shared with anyone."
        }, {
            "name": "members",
            "type": "Void",
            "desc": "Links can only be shared among members of the shared folder."
        }],
        "returnParameters": []
    },
    "users/get_account": {
        "uri": "https://api.dropboxapi.com/2/users/get_account",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "account_id": "dbid:AAH4f99T0taONIb-OurWxbNQ6ywGRopQngc"
        },
        "parameters": [{
            "name": "account_id",
            "type": "String(min_length=40, max_length=40)",
            "desc": "A user's account identifier."
        }],
        "returnParameters": []
    },
    "users/get_account_batch": {
        "uri": "https://api.dropboxapi.com/2/users/get_account_batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "account_ids": [
                "dbid:AAH4f99T0taONIb-OurWxbNQ6ywGRopQngc",
                "dbid:AAH1Vcz-DVoRDeixtr_OA8oUGgiqhs4XPOQ"
            ]
        },
        "parameters": [{
            "name": "account_ids",
            "type": "List of (String(min_length=40, max_length=40), min_items=1)",
            "desc": "List of user account identifiers.  Should not contain any duplicate account IDs."
        }],
        "returnParameters": []
    },
    "users/get_current_account": {
        "uri": "https://api.dropboxapi.com/2/users/get_current_account",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [],
        "returnParameters": []
    },
    "users/get_space_usage": {
        "uri": "https://api.dropboxapi.com/2/users/get_space_usage",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [],
        "returnParameters": []
    }
}

},{}],2:[function(require,module,exports){
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
            if(JSON.stringify(e).indexOf("invalid_access_token")!=-1){
              Ti.App.Properties.setString('DROPBOX_TOKENS',null);
            };
            revokeAuth_callback({
                access_token: null,
                success : false,
                msg: "Invalid or expired access token"
            });
        };

        // Remove cookies
        if(Ti.Platform.osname != "android"){
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
      		Ti.API.debug("Ti.Network.removeSystemCookie('"+Alloy.Globals.gateway+"','/','"+Alloy.Globals.net.shibCookie+"')");
      		Ti.Network.removeSystemCookie(Alloy.Globals.gateway,"/",Alloy.Globals.net.shibCookie);
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


    TiDropbox.callMethod = function(methodStr, paramsObj, fileBin, onSuccess_callback, onError_callback) {

        var urlEndpoint = dropboxAPIv2[methodStr].uri + "?reject_cors_preflight=true"; //&authorization=Bearer%20"+TiDropbox.ACCESS_TOKEN;
        //urlEndpoint = "https://api.dropboxapi.com/2/files/list_folder?authorization=Bearer%20"+TiDropbox.ACCESS_TOKEN+"&args=%7B%0A%20%20%22path%22%3A%20%22%22%2C%0A%20%20%22recursive%22%3A%20false%2C%0A%20%20%22include_media_info%22%3A%20false%2C%0A%20%20%22include_deleted%22%3A%20false%2C%0A%20%20%22include_has_explicit_shared_members%22%3A%20false%0A%7D&reject_cors_preflight=true";
        Ti.API.debug("\n\n******\ncallMethod: methodStr--> " + methodStr);
        Ti.API.debug("callMethod: urlEndpoint--> " + urlEndpoint);
        Ti.API.debug("TiDropbox.ACCESS_TOKEN --> " + TiDropbox.ACCESS_TOKEN);
        try {

            if (TiDropbox.xhr == null) {
                TiDropbox.xhr = Titanium.Network.createHTTPClient();
                TiDropbox.xhr.timeout = 10000;
            }

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

            TiDropbox.xhr.ondatastream = function(e) {
                Ti.API.debug("TiDropbox ondatastream " + JSON.stringify(e));
            };

            TiDropbox.xhr.onload = function(_xhr) {
                Ti.API.debug("TiDropbox response: " + TiDropbox.xhr.responseText);
                if (onSuccess_callback) {
                    onSuccess_callback(TiDropbox.xhr);
                }
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
                    Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "application/json");');
                    TiDropbox.xhr.setRequestHeader("Content-Type", "application/json");
                  };
                  break;
                case "CONTENT":
                  Ti.API.debug('TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", '+JSON.stringify(paramsObj)+');');
                  TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", JSON.stringify(paramsObj));
                  if(methodStr.indexOf("upload")!=-1){
                    Ti.API.debug('TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", "application/octet-stream");');
                    TiDropbox.xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    if(dropboxAPIv2[methodStr].requiresReadableStream && fileBin){
                      Ti.API.debug('TiDropbox.xhr.send(fileBin);');
                      TiDropbox.xhr.send(fileBin);
                      return;
                    };
                  }else if(methodStr.indexOf("download")!=-1){
                    //Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");');
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");
                    TiDropbox.xhr.send();
                    return;
                  }else if(methodStr.indexOf("files/get_")!=-1){
                    //Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");');
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    TiDropbox.xhr.send();
                    return;
                  };
                  break;
              };
            //};
            if(paramsObj){
              Ti.API.debug('TiDropbox.xhr.send('+JSON.stringify(paramsObj)+');');
              TiDropbox.xhr.send(JSON.stringify(paramsObj));
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
            top: (Ti.Platform.osname != "android") ? "20dp" : "0dp",
            //modal: true,
            //fullscreen: true,
            width: '100%',
            backgroundColor: "rgb(255,255,255,0.5)"
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
            autoDetect: [Ti.UI.AUTODETECT_NONE]
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
        view.animate(animation);
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


        if (e.url.indexOf('#access_token') != -1) {
            var token = e.url.split("=")[1];
            token = token.substring(0, token.indexOf("&"));
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
        } else if (e.url.indexOf('#error=access_denied') != -1) {
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

},{"../lib/dropboxAPIv2":1}]},{},[2])(2)
});