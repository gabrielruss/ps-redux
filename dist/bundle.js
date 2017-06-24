!function(t){function e(i){if(r[i])return r[i].exports;var s=r[i]={exports:{},id:i,loaded:!1};return t[i].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var r={};return e.m=t,e.c=r,e.p="/",e(0)}([function(t,e,r){var i=r(1).EventSource;t.exports=i,window&&!window.EventSource&&(window.EventSource=i,console&&console.log("polyfill-eventsource added missing EventSource to window"))},function(t,e){!function(t){function e(t,e,r,i){this.bubbles=!1,this.cancelBubble=!1,this.cancelable=!1,this.data=e||null,this.origin=r||"",this.lastEventId=i||"",this.type=t||"message"}function r(){return!(!window.XDomainRequest||!window.XMLHttpRequest||void 0!==(new XMLHttpRequest).responseType)}if(!t.EventSource||t._eventSourceImportPrefix){var i=(t._eventSourceImportPrefix||"")+"EventSource",s=function(t,e){if(!t||"string"!=typeof t)throw new SyntaxError("Not enough arguments");this.URL=t,this.setOptions(e);var r=this;setTimeout(function(){r.poll()},0)};if(s.prototype={CONNECTING:0,OPEN:1,CLOSED:2,defaultOptions:{loggingEnabled:!1,loggingPrefix:"eventsource",interval:500,bufferSizeLimit:262144,silentTimeout:3e5,getArgs:{evs_buffer_size_limit:262144},xhrHeaders:{Accept:"text/event-stream","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"}},setOptions:function(t){var e,r=this.defaultOptions;for(e in r)r.hasOwnProperty(e)&&(this[e]=r[e]);for(e in t)e in r&&t.hasOwnProperty(e)&&(this[e]=t[e]);this.getArgs&&this.bufferSizeLimit&&(this.getArgs.evs_buffer_size_limit=this.bufferSizeLimit),"undefined"!=typeof console&&"undefined"!=typeof console.log||(this.loggingEnabled=!1)},log:function(t){this.loggingEnabled&&console.log("["+this.loggingPrefix+"]:"+t)},poll:function(){try{if(this.readyState==this.CLOSED)return;this.cleanup(),this.readyState=this.CONNECTING,this.cursor=0,this.cache="",this._xhr=new this.XHR(this),this.resetNoActivityTimer()}catch(t){this.log("There were errors inside the pool try-catch"),this.dispatchEvent("error",{type:"error",data:t.message})}},pollAgain:function(t){var e=this;e.readyState=e.CONNECTING,e.dispatchEvent("error",{type:"error",data:"Reconnecting "}),this._pollTimer=setTimeout(function(){e.poll()},t||0)},cleanup:function(){this.log("evs cleaning up"),this._pollTimer&&(clearInterval(this._pollTimer),this._pollTimer=null),this._noActivityTimer&&(clearInterval(this._noActivityTimer),this._noActivityTimer=null),this._xhr&&(this._xhr.abort(),this._xhr=null)},resetNoActivityTimer:function(){if(this.silentTimeout){this._noActivityTimer&&clearInterval(this._noActivityTimer);var t=this;this._noActivityTimer=setTimeout(function(){t.log("Timeout! silentTImeout:"+t.silentTimeout),t.pollAgain()},this.silentTimeout)}},close:function(){this.readyState=this.CLOSED,this.log("Closing connection. readyState: "+this.readyState),this.cleanup()},ondata:function(){var t=this._xhr;if(t.isReady()&&!t.hasError()){this.resetNoActivityTimer(),this.readyState==this.CONNECTING&&(this.readyState=this.OPEN,this.dispatchEvent("open",{type:"open"}));var e=t.getBuffer();e.length>this.bufferSizeLimit&&(this.log("buffer.length > this.bufferSizeLimit"),this.pollAgain()),0==this.cursor&&e.length>0&&"\ufeff"==e.substring(0,1)&&(this.cursor=1);var r=this.lastMessageIndex(e);if(r[0]>=this.cursor){var i=r[1],s=e.substring(this.cursor,i);this.parseStream(s),this.cursor=i}t.isDone()&&(this.log("request.isDone(). reopening the connection"),this.pollAgain(this.interval))}else this.readyState!==this.CLOSED&&(this.log("this.readyState !== this.CLOSED"),this.pollAgain(this.interval))},parseStream:function(t){t=this.cache+this.normalizeToLF(t);var r,i,s,n,o,a,u=t.split("\n\n");for(r=0;r<u.length-1;r++){for(s="message",n=[],parts=u[r].split("\n"),i=0;i<parts.length;i++)o=this.trimWhiteSpace(parts[i]),0==o.indexOf("event")?s=o.replace(/event:?\s*/,""):0==o.indexOf("retry")?(a=parseInt(o.replace(/retry:?\s*/,"")),isNaN(a)||(this.interval=a)):0==o.indexOf("data")?n.push(o.replace(/data:?\s*/,"")):0==o.indexOf("id:")?this.lastEventId=o.replace(/id:?\s*/,""):0==o.indexOf("id")&&(this.lastEventId=null);if(n.length){var l=new e(s,n.join("\n"),window.location.origin,this.lastEventId);this.dispatchEvent(s,l)}}this.cache=u[u.length-1]},dispatchEvent:function(t,e){var r=this["_"+t+"Handlers"];if(r)for(var i=0;i<r.length;i++)r[i].call(this,e);this["on"+t]&&this["on"+t].call(this,e)},addEventListener:function(t,e){this["_"+t+"Handlers"]||(this["_"+t+"Handlers"]=[]),this["_"+t+"Handlers"].push(e)},removeEventListener:function(t,e){var r=this["_"+t+"Handlers"];if(r)for(var i=r.length-1;i>=0;--i)if(r[i]===e){r.splice(i,1);break}},_pollTimer:null,_noactivityTimer:null,_xhr:null,lastEventId:null,cache:"",cursor:0,onerror:null,onmessage:null,onopen:null,readyState:0,urlWithParams:function(t,e){var r=[];if(e){var i,s,n=encodeURIComponent;for(i in e)e.hasOwnProperty(i)&&(s=n(i)+"="+n(e[i]),r.push(s))}return r.length>0?t.indexOf("?")==-1?t+"?"+r.join("&"):t+"&"+r.join("&"):t},lastMessageIndex:function(t){var e=t.lastIndexOf("\n\n"),r=t.lastIndexOf("\r\r"),i=t.lastIndexOf("\r\n\r\n");return i>Math.max(e,r)?[i,i+4]:[Math.max(e,r),Math.max(e,r)+2]},trimWhiteSpace:function(t){var e=/^(\s|\u00A0)+|(\s|\u00A0)+$/g;return t.replace(e,"")},normalizeToLF:function(t){return t.replace(/\r\n|\r/g,"\n")}},r()){s.isPolyfill="IE_8-9";var n=s.prototype.defaultOptions;n.xhrHeaders=null,n.getArgs.evs_preamble=2056,s.prototype.XHR=function(t){request=new XDomainRequest,this._request=request,request.onprogress=function(){request._ready=!0,t.ondata()},request.onload=function(){this._loaded=!0,t.ondata()},request.onerror=function(){this._failed=!0,t.readyState=t.CLOSED,t.dispatchEvent("error",{type:"error",data:"XDomainRequest error"})},request.ontimeout=function(){this._failed=!0,t.readyState=t.CLOSED,t.dispatchEvent("error",{type:"error",data:"XDomainRequest timed out"})};var e={};if(t.getArgs){var r=t.getArgs;for(var i in r)r.hasOwnProperty(i)&&(e[i]=r[i]);t.lastEventId&&(e.evs_last_event_id=t.lastEventId)}request.open("GET",t.urlWithParams(t.URL,e)),request.send()},s.prototype.XHR.prototype={useXDomainRequest:!0,_request:null,_ready:!1,_loaded:!1,_failed:!1,isReady:function(){return this._request._ready},isDone:function(){return this._request._loaded},hasError:function(){return this._request._failed},getBuffer:function(){var t="";try{t=this._request.responseText||""}catch(e){}return t},abort:function(){this._request&&this._request.abort()}}}else s.isPolyfill="XHR",s.prototype.XHR=function(t){request=new XMLHttpRequest,this._request=request,t._xhr=this,request.onreadystatechange=function(){request.readyState>1&&t.readyState!=t.CLOSED&&(200==request.status||request.status>=300&&request.status<400?t.ondata():(request._failed=!0,t.readyState=t.CLOSED,t.dispatchEvent("error",{type:"error",data:"The server responded with "+request.status}),t.close()))},request.onprogress=function(){},request.open("GET",t.urlWithParams(t.URL,t.getArgs),!0);var e=t.xhrHeaders;for(var r in e)e.hasOwnProperty(r)&&request.setRequestHeader(r,e[r]);t.lastEventId&&request.setRequestHeader("Last-Event-Id",t.lastEventId),request.send()},s.prototype.XHR.prototype={useXDomainRequest:!1,_request:null,_failed:!1,isReady:function(){return this._request.readyState>=2},isDone:function(){return 4==this._request.readyState},hasError:function(){return this._failed||this._request.status>=400},getBuffer:function(){var t="";try{t=this._request.responseText||""}catch(e){}return t},abort:function(){this._request&&this._request.abort()}};t[i]=s}}(this)}]);
//# sourceMappingURL=bundle.js.map