/**
 *这是GoogleMapAPI3的离线JS版本，只用于学习和研究使用。
 *不包含地图数据，需要的可以自己下载或自己制作。 
 *author:liongis
 *mail:LionGIS@163.com
 *QQ:1366940902
 *BLOG:http://liongis.cnblogs.com 
 *date:2012-4-10    
**/
window.google = window.google || {};
google.maps = google.maps || {};
(function() {
  serverUrl+=serverUrl.indexOf("?")>0?"?":"&";
  function getScript(src) {
    document.write('<' + 'script src="' + src + '"' +
                   ' type="text/javascript"><' + '/script>');
  }
  
  var modules = google.maps.modules = {};
  google.maps.__gjsload__ = function(name, text) {
    modules[name] = text;
  };

  google.maps.Load = function(apiLoad) {
    delete google.maps.Load;    
    apiLoad([null, [[[serverUrl, serverUrl]]], ["zh-CN", "US", null, null, null, null, "mapfiles/", null, null, null], ["MapJS/mapfiles/api-3/15/5", "3.15.5"], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], loadScriptTime);
  };
  var loadScriptTime = (new Date).getTime();
  getScript("MapJS/mapfiles/api-3/15/5/main.js");
})();
