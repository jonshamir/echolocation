"use strict";!function(e){function n(i){if(t[i])return t[i].exports;var a=t[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,n),a.l=!0,a.exports}var t={};n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="/",n(n.s=3)}([function(e,n){!function(e){var n=function(n){return null!=n||n!=e},t=function(e,n){for(var t=a._callbacks[e],i=0;i<t.length;i++)t[i].apply(window,n)},i=function(e){for(var n=0,t=e.length-1;t>e.length-6;t--)n+=e[t];return n/5},a=window.Compass={method:e,watch:function(e){var n=++a._lastId;return a.init(function(t){if("phonegap"==t)a._watchers[n]=a._nav.compass.watchHeading(e);else if("webkitOrientation"==t){var i=function(n){e(n.webkitCompassHeading)};a._win.addEventListener("deviceorientation",i),a._watchers[n]=i}else if("orientationAndGPS"==t){var o,i=function(n){o=-n.alpha+a._gpsDiff,o<0?o+=360:o>360&&(o-=360),e(o)};a._win.addEventListener("deviceorientation",i),a._watchers[n]=i}}),n},unwatch:function(e){return a.init(function(n){"phonegap"==n?a._nav.compass.clearWatch(a._watchers[e]):("webkitOrientation"==n||"orientationAndGPS"==n)&&a._win.removeEventListener("deviceorientation",a._watchers[e]),delete a._watchers[e]}),a},needGPS:function(e){return a._callbacks.needGPS.push(e),a},needMove:function(e){return a._callbacks.needMove.push(e),a},noSupport:function(e){return!1===a.method?e():n(a.method)||a._callbacks.noSupport.push(e),a},init:function(e){return n(a.method)?void e(a.method):(a._callbacks.init.push(e),a._initing?void 0:(a._initing=!0,a._nav.compass?a._start("phonegap"):a._win.DeviceOrientationEvent?(a._checking=0,a._win.addEventListener("deviceorientation",a._checkEvent),setTimeout(function(){!1!==a._checking&&a._start(!1)},500)):a._start(!1),a))},_lastId:0,_watchers:{},_win:window,_nav:navigator,_callbacks:{init:[],noSupport:[],needGPS:[],needMove:[]},_initing:!1,_gpsDiff:e,_start:function(e){a.method=e,a._initing=!1,t("init",[e]),a._callbacks.init=[],!1===e&&t("noSupport",[]),a._callbacks.noSupport=[]},_checking:!1,_checkEvent:function(e){a._checking+=1;var t=!1;n(e.webkitCompassHeading)?a._start("webkitOrientation"):n(e.alpha)&&a._nav.geolocation?a._gpsHack():a._checking>1?a._start(!1):t=!0,t||(a._checking=!1,a._win.removeEventListener("deviceorientation",a._checkEvent))},_gpsHack:function(){var e=!0,o=[],r=[];t("needGPS");var c=function(e){o.push(e.alpha)};a._win.addEventListener("deviceorientation",c);var s=function(s){var l=s.coords;n(l.heading)&&(e&&(e=!1,t("needMove")),l.speed>1?(r.push(l.heading),r.length>=5&&o.length>=5&&(a._win.removeEventListener("deviceorientation",c),a._nav.geolocation.clearWatch(d),a._gpsDiff=i(r)+i(o),a._start("orientationAndGPS"))):r=[])},l=function(){a._win.removeEventListener("deviceorientation",c),a._start(!1)},d=a._nav.geolocation.watchPosition(s,l,{enableHighAccuracy:!0})}}}()},function(e,n){},function(e,n){},function(e,n,t){function i(e){if(E&&!(Math.floor(e)>=h-2&&Math.floor(e)<=h+2)){h=e;var n=c(e),t=-Math.sin(n),i=Math.cos(n);console.log(t,i),l.setListenerOrientation(t,i,0,0,0,1)}}function a(){if(E)for(var e=0;e<p.length;e++){var n=geolib.getBearing({latitude:f,longitude:v},{latitude:p[e].lat,longitude:p[e].long}),t=geolib.getDistance({latitude:f,longitude:v},{latitude:p[e].lat,longitude:p[e].long})*M,i=Math.sin(c(n))*S,a=-Math.cos(c(n))*S;u[e].setPosition(i,a,0),u[e].setGain(200/(t*t)),console.log(p[e].name),console.log(n+":"+o(n)),console.log(i,a)}}function o(e){return e>=337.5||e<22.5?"N":e>=22.5&&e<67.5?"NE":e>=67.5&&e<112.5?"E":e>=112.5&&e<157.5?"SE":e>=157.5&&e<202.5?"S":e>=202.5&&e<247.5?"SW":e>=247.5&&e<292.5?"W":e>=292.5&&e<337.5?"NW":"error"}function r(){s=new(window.AudioContext||window.webkitAudioContext),l=new ResonanceAudio(s,{ambisonicOrder:1}),l.setRoomProperties(b,k.outside);for(var e=[],n=0;n<p.length;n++)d[n]=document.createElement("audio"),d[n].src=p[n].src,d[n].load(),d[n].loop=!0,d[n].crossOrigin="anonymous",e[n]=s.createMediaElementSource(d[n]),u[n]=l.createSource(),e[n].connect(u[n].input);l.output.connect(s.destination),E=!0}function c(e){return e*(Math.PI/180)}t(1),t(2),t(0);var s=void 0,l=void 0,d=[],u=[],h=0,f=31.771947,v=35.204153,g=[{name:"Jaffa Gate / Old City",id:"oldcity",lat:31.776598,long:35.227609,src:"./assets/song.wav"},{name:"Beit Hansen",id:"hansen",lat:31.767683,long:35.217123,src:"./assets/piano.wav"},{name:"The Knesset",id:"knesset",lat:31.77663,long:35.205471,src:"./assets/trumpet.wav"},{name:"Mahane Yehuda Market",id:"market",lat:31.784851,long:35.212643,src:"./assets/drums.wav"},{name:"Yad Vashem / Mt. Herzl",id:"herzl",lat:31.774192,long:35.176195,src:"./assets/violin.wav"},{name:"Teddy Stadium",id:"teddy",lat:31.750973,long:35.190621,src:"./assets/bird1.wav"},{name:"Ammunition Hill",id:"hill",lat:31.798014,long:35.227671,src:"./assets/bird2.wav"},{name:"The Israel Museum",id:"museum",lat:31.771947,long:35.204153,src:"./assets/song.wav"}],m=["knesset","hansen","herzl","market"],p=g.filter(function(e){return-1!=m.indexOf(e.id)}),_=["oldcity","teddy","hill","museum"],w=g.filter(function(e){return-1!=_.indexOf(e.id)}),b={width:2,height:2,depth:2},k={brick:{left:"brick-bare",right:"brick-bare",up:"brick-bare",down:"wood-panel",front:"brick-bare",back:"brick-bare"},curtains:{left:"curtain-heavy",right:"curtain-heavy",up:"wood-panel",down:"wood-panel",front:"curtain-heavy",back:"curtain-heavy"},marble:{left:"marble",right:"marble",up:"marble",down:"marble",front:"marble",back:"marble"},outside:{left:"transparent",right:"transparent",up:"transparent",down:"grass",front:"transparent",back:"transparent"}},E=!1,y=!1,L=!1,M=.02,S=1,P=function(){r(),Compass.watch(function(e){document.getElementById("heading").innerHTML=o(e),i(e)});for(var e=0;e<p.length;e++)!function(e){var n=document.createElement("button");n.innerHTML=p[e].name,n.classList.add("hint"),n.onclick=function(n){d[e].paused?(n.target.classList.add("active"),d[e].play()):(n.target.classList.remove("active"),d[e].pause())},document.getElementById("hints").append(n)}(e);for(var e=0;e<w.length;e++)!function(e){var n=document.createElement("button");n.innerHTML=w[e].name,n.classList.add("option"),n.onclick=function(n){"museum"==w[e].id?alert("Correct!"):alert("Wrong!")},document.getElementById("options").append(n)}(e);document.getElementById("play").addEventListener("click",function(e){s.resume(),E&&(L?y?(d.forEach(function(e){e.pause()}),y=!1,e.target.innerHTML="Play All"):(a(),d.forEach(function(e){e.play()}),y=!0,e.target.innerHTML="Pause All"):(e.target.innerHTML="Play All",document.getElementById("hints").classList.remove("hidden"),document.getElementById("options").classList.remove("hidden"),L=!0),document.getElementById("play").addEventListener("touchstart",function(e){e.target.classList.add("active")}),document.getElementById("play").addEventListener("touchend",function(e){e.target.classList.remove("active")}))})};window.addEventListener("load",P)}]);