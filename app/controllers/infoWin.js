var args = arguments[0] || {};
var method = args.method || {};
var isTablet = $.containerView.isTablet;
$.containerView.transform = Ti.UI.create2DMatrix().scale(0);
$.testParamsLbl.text = method['testParams'];
$.showTestParamsLbl.visible = method['testParams'] ? true : false;

var animation = Ti.UI.createAnimation();
animation.transform = Ti.UI.create2DMatrix();
animation.duration = 500;
$.containerView.animate(animation);


var apiDocUrl = "https://www.dropbox.com/developers/documentation/http/documentation#"+args.selectedMethod.replace(/\//g,"-");
var html =
  '<!DOCTYPE html>'+
  '<html lang="en">'+
  '<head>'+
  '    <title>TiDropbox</title>'+
  '    <meta charset="utf-8">'+
  '    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">';
if(isTablet){
  html +=
  '</head>';
}else{
  html +=
  '    <style>'+
  '      h1 {font-size:20px}'+
  '      h3 {font-size:15px}'+
  '      ul {font-size:12px}'+
  '      li {font-size:12px}'+
  '    </style>'+
  '</head>';
};
html += '<body style="font-family:Helvetica, Arial, sans-serif">';
html += "<h1>"+args.selectedMethod+"</h1>"
html += '<a href="'+apiDocUrl+'"><h3>Show in Dropbox documentation</h3></a>';
html += '<table border="0" cellspacing="0" cellpadding="0">';
for(var prop in method){
  if(method.hasOwnProperty(prop)){
    if(prop === "parameters"){
      console.log("parameters:");
      html += "<tr><td><ul><li><strong>" + prop + "</strong></li><ul>";
      for(var i in method[prop]){
        if(method[prop][i].parameters){
          console.log("\t+--" + method[prop][i].name + " ("+method[prop][i].type+"): " + method[prop][i].desc);
          console.log("\t\t*** parameters ***");
          html += "<li><strong>" + method[prop][i].name + " </strong><em>"+method[prop][i].type+"</em>: " + method[prop][i].desc +"</li><ul>";
          for(var j in method[prop][i].parameters){
            if(method[prop][i].parameters[j].parameters){
              console.log("\t\t+----" + method[prop][i].parameters[j].name + " ("+method[prop][i].parameters[j].type+"): " + method[prop][i].parameters[j].desc);
              console.log("\t\t\t*** parameters ***");
              html += "<li><strong>" + method[prop][i].parameters[j].name+ " </strong> <em>" + method[prop][i].parameters[j].type + "</em>: " + method[prop][i].parameters[j].desc+"</li><ul>";
              for(var k in method[prop][i].parameters[j].parameters){
                console.log("\t\t\t+------" + method[prop][i].parameters[j].parameters[k].name + " ("+method[prop][i].parameters[j].parameters[k].type+"): " + method[prop][i].parameters[j].parameters[k].desc);
                html += "<li><strong>" + method[prop][i].parameters[j].parameters[k].name+ " </strong> <em>" + method[prop][i].parameters[j].parameters[k].type + "</em>: " + method[prop][i].parameters[j].parameters[k].desc+"</li>";
              }
              html += "</ul>";
            }else{
              console.log("\t\t+----" + method[prop][i].parameters[j].name + " ("+method[prop][i].parameters[j].type+"): " + method[prop][i].parameters[j].desc);
              html += "<li><strong>" + method[prop][i].parameters[j].name+ " </strong> <em>" + method[prop][i].parameters[j].type + "</em>: " + method[prop][i].parameters[j].desc+"</li>";
            }
          }
          html += "</ul>";
        }else{
          console.log("\t+--" + method[prop][i].name + " ("+method[prop][i].type+"): " + method[prop][i].desc);
          html += "<li><strong>" + method[prop][i].name+ " </strong> <em>" + method[prop][i].type + "</em>: " + method[prop][i].desc+"</li>";
        }
      }
      html += "</ul></ul></td></tr>";
    }else{
      console.log(prop + ": " + JSON.stringify(method[prop]));
      if((prop!="testParams") && (prop!="returnParameters")){
        html += "<tr><td><ul><li><strong>" + prop + ": </strong> " +  method[prop] + "</li></ul></td></tr>";
      };
    }
  }
};
html += "</table></body></html>";
console.log(html);

$.wv.html = html;

function showHideTestParams(e){
  $.testParamsContainer.visible = !$.testParamsContainer.visible;
  $.showTestParamsLbl.text = $.testParamsContainer.visible ? "Hide test params" : "Show test params";
}

function closeWin(e){
  $.infoWin.close();
}

function onLoad(e){
  $.wv.setScalesPageToFit(true);
}
