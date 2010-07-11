/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(!dojo._hasResource["org.cometd"]){dojo._hasResource["org.cometd"]=true;if(typeof dojo!=="undefined"){dojo.provide("org.cometd");}else{this.org=this.org||{};org.cometd={};}org.cometd.JSON={};org.cometd.JSON.toJSON=org.cometd.JSON.fromJSON=function(_1){throw "Abstract";};org.cometd.TransportRegistry=function(){var _2=[];var _3={};this.getTransportTypes=function(){return _2.slice(0);};this.findTransportTypes=function(_4,_5){var _6=[];for(var i=0;i<_2.length;++i){var _7=_2[i];if(_3[_7].accept(_4,_5)){_6.push(_7);}}return _6;};this.negotiateTransport=function(_8,_9,_a){for(var i=0;i<_2.length;++i){var _b=_2[i];for(var j=0;j<_8.length;++j){if(_b==_8[j]){var _c=_3[_b];if(_c.accept(_9,_a)===true){return _c;}}}}return null;};this.add=function(_d,_e,_f){var _10=false;for(var i=0;i<_2.length;++i){if(_2[i]==_d){_10=true;break;}}if(!_10){if(typeof _f!=="number"){_2.push(_d);}else{_2.splice(_f,0,_d);}_3[_d]=_e;}return !_10;};this.remove=function(_11){for(var i=0;i<_2.length;++i){if(_2[i]==_11){_2.splice(i,1);var _12=_3[_11];delete _3[_11];return _12;}}return null;};this.reset=function(){for(var i=0;i<_2.length;++i){_3[_2[i]].reset();}};};org.cometd.Cometd=function(_13){var _14=this;var _15=_13||"default";var _16;var _17;var _18;var _19;var _1a;var _1b;var _1c;var _1d;var _1e;var _1f;var _20=false;var _21=new org.cometd.TransportRegistry();var _22;var _23="disconnected";var _24=0;var _25=null;var _26=0;var _27=[];var _28=false;var _29={};var _2a=0;var _2b=null;var _2c=[];var _2d={};var _2e;var _2f=false;var _30=true;function _31(_32,_33,_34){var _35=_33||{};for(var i=2;i<arguments.length;++i){var _36=arguments[i];if(_36===undefined||_36===null){continue;}for(var _37 in _36){var _38=_36[_37];if(_38===_33){continue;}if(_38===undefined){continue;}if(_32&&typeof _38==="object"&&_38!==null){if(_38 instanceof Array){_35[_37]=_31(_32,[],_38);}else{_35[_37]=_31(_32,{},_38);}}else{_35[_37]=_38;}}}return _35;};this._mixin=_31;function _39(_3a,_3b){for(var i=0;i<_3b.length;++i){if(_3a==_3b[i]){return i;}}return -1;};function _3c(_3d){if(_3d===undefined||_3d===null){return false;}return typeof _3d==="string"||_3d instanceof String;};function _3e(_3f){if(_3f===undefined||_3f===null){return false;}return _3f instanceof Array;};function _40(_41){if(_41===undefined||_41===null){return false;}return typeof _41==="function";};function _42(_43,_44){if(window.console){var _45=window.console[_43];if(_40(_45)){_45.apply(window.console,_44);}}};function _46(){_42("warn",arguments);};this._warn=_46;function _47(){if(_16!="warn"){_42("info",arguments);}};this._info=_47;function _48(){if(_16=="debug"){_42("debug",arguments);}};this._debug=_48;function _49(_4a){_48("Configuring cometd object with",_4a);if(_3c(_4a)){_4a={url:_4a};}if(!_4a){_4a={};}_17=_4a.url;if(!_17){throw "Missing required configuration parameter 'url' specifying the Bayeux server URL";}_18=_4a.maxConnections||2;_19=_4a.backoffIncrement||1000;_1a=_4a.maxBackoff||60000;_16=_4a.logLevel||"info";_1b=_4a.reverseIncomingExtensions!==false;_1c=_4a.maxNetworkDelay||10000;_1d=_4a.requestHeaders||{};_1e=_4a.appendMessageTypeToURL!==false;_1f=_4a.autoBatch===true;var _4b=/(^https?:)?(\/\/(([^:\/\?#]+)(:(\d+))?))?([^\?#]*)(.*)?/.exec(_17);_20=_4b[3]&&_4b[3]!=window.location.host;if(_1e){if(_4b[8]!==undefined){_47("Appending message type to URI "+_4b[7]+_4b[8]+" is not supported, disabling 'appendMessageTypeToURL' configuration");_1e=false;}else{var _4c=_4b[7].split("/");var _4d=_4c.length-1;if(_4b[7].match(/\/$/)){_4d-=1;}if(_4c[_4d].indexOf(".")>=0){_47("Appending message type to URI "+_4b[7]+" is not supported, disabling 'appendMessageTypeToURL' configuration");_1e=false;}}}};function _4e(){for(var _4f in _29){var _50=_29[_4f];for(var i=0;i<_50.length;++i){var _51=_50[i];if(_51&&!_51.listener){delete _50[i];_48("Removed subscription",_51,"for channel",_4f);}}}};function _52(_53){if(_23!=_53){_48("Status",_23,"->",_53);_23=_53;}};function _54(){return _23=="disconnecting"||_23=="disconnected";};function _55(){return ++_24;};function _56(_57,_58,_59,_5a,_5b){try{return _58.call(_57,_5a);}catch(x){_48("Exception during execution of extension",_59,x);var _5c=_14.onExtensionException;if(_40(_5c)){_48("Invoking extension exception callback",_59,x);try{_5c.call(_14,x,_59,_5b,_5a);}catch(xx){_47("Exception during execution of exception callback in extension",_59,xx);}}return _5a;}};function _5d(_5e){for(var i=0;i<_2c.length;++i){if(_5e===undefined||_5e===null){break;}var _5f=_1b?_2c.length-1-i:i;var _60=_2c[_5f];var _61=_60.extension.incoming;if(_40(_61)){var _62=_56(_60.extension,_61,_60.name,_5e,false);_5e=_62===undefined?_5e:_62;}}return _5e;};function _63(_64){for(var i=0;i<_2c.length;++i){if(_64===undefined||_64===null){break;}var _65=_2c[i];var _66=_65.extension.outgoing;if(_40(_66)){var _67=_56(_65.extension,_66,_65.name,_64,true);_64=_67===undefined?_64:_67;}}return _64;};function _68(_69){if(_3c(_69)){try{return org.cometd.JSON.fromJSON(_69);}catch(x){_48("Could not convert to JSON the following string","\""+_69+"\"");throw x;}}if(_3e(_69)){return _69;}if(_69===undefined||_69===null){return [];}if(_69 instanceof Object){return [_69];}throw "Conversion Error "+_69+", typeof "+(typeof _69);};function _6a(_6b,_6c){var _6d=_29[_6b];if(_6d&&_6d.length>0){for(var i=0;i<_6d.length;++i){var _6e=_6d[i];if(_6e){try{_6e.callback.call(_6e.scope,_6c);}catch(x){_48("Exception during notification",_6e,_6c,x);var _6f=_14.onListenerException;if(_40(_6f)){_48("Invoking listener exception callback",_6e,x);try{_6f.call(_14,x,_6e.handle,_6e.listener,_6c);}catch(xx){_47("Exception during execution of listener callback",_6e,xx);}}}}}}};function _70(_71,_72){_6a(_71,_72);var _73=_71.split("/");var _74=_73.length-1;for(var i=_74;i>0;--i){var _75=_73.slice(0,i).join("/")+"/*";if(i==_74){_6a(_75,_72);}_75+="*";_6a(_75,_72);}};function _76(_77,_78){return setTimeout(function(){try{_77();}catch(x){_48("Exception invoking timed function",_77,x);}},_78);};function _79(){if(_2b!==null){clearTimeout(_2b);}_2b=null;};function _7a(_7b){_79();var _7c=_2a;if(_2d.interval&&_2d.interval>0){_7c+=_2d.interval;}_2b=_76(_7b,_7c);};var _7d;var _7e;function _7f(_80,_81,_82,_83){for(var i=0;i<_81.length;++i){var _84=_81[i];_84.id=""+_55();if(_25){_84.clientId=_25;}_84=_63(_84);if(_84!==undefined&&_84!==null){_81[i]=_84;}else{_81.splice(i--,1);}}if(_81.length===0){return;}var url=_17;if(_1e){if(!url.match(/\/$/)){url=url+"/";}if(_83){url=url+_83;}}var _85={url:url,sync:_80,messages:_81,onSuccess:function(_86,_87){try{_7d.call(_14,_86,_87,_82);}catch(x){_48("Exception during handling of response",x);}},onFailure:function(_88,_89,_8a){try{_7e.call(_14,_88,_81,_89,_8a,_82);}catch(x){_48("Exception during handling of failure",x);}}};_48("Send, sync="+_80,_85);_22.send(_85,_82);};function _8b(_8c){if(_26>0||_28===true){_27.push(_8c);}else{_7f(false,[_8c],false);}};this.send=_8b;function _8d(){_2a=0;};function _8e(){if(_2a<_1a){_2a+=_19;}};function _8f(){++_26;};function _90(){var _91=_27;_27=[];if(_91.length>0){_7f(false,_91,false);}};function _92(){--_26;if(_26<0){throw "Calls to startBatch() and endBatch() are not paired";}if(_26===0&&!_54()&&!_28){_90();}};function _93(){if(!_54()){var _94={channel:"/meta/connect",connectionType:_22.getType()};if(!_30){_30=true;_94.advice={timeout:0};}_52("connecting");_48("Connect sent",_94);_7f(false,[_94],true,"connect");_52("connected");}};function _95(){_52("connecting");_7a(function(){_93();});};function _96(_97){_25=null;_4e();if(_54()){_21.reset();}_26=0;_28=true;_2e=_97;var _98="1.0";var _99=_21.findTransportTypes(_98,_20);var _9a={version:_98,minimumVersion:"0.9",channel:"/meta/handshake",supportedConnectionTypes:_99};var _9b=_31(false,{},_2e,_9a);_22=_21.negotiateTransport(_99,_98,_20);_48("Initial transport is",_22);_52("handshaking");_48("Handshake sent",_9b);_7f(false,[_9b],false,"handshake");};function _9c(){_52("handshaking");_28=true;_7a(function(){_96(_2e);});};function _9d(_9e){if(_9e.successful){_25=_9e.clientId;var _9f=_21.negotiateTransport(_9e.supportedConnectionTypes,_9e.version,_20);if(_9f===null){throw "Could not negotiate transport with server; client "+_21.findTransportTypes(_9e.version,_20)+", server "+_9e.supportedConnectionTypes;}else{if(_22!=_9f){_48("Transport",_22,"->",_9f);_22=_9f;}}_28=false;_90();_9e.reestablish=_2f;_2f=true;_70("/meta/handshake",_9e);if(!_54()){if(_2d.reconnect!="none"){_8d();_95();}else{_8d();_52("disconnected");}}}else{_70("/meta/handshake",_9e);_70("/meta/unsuccessful",_9e);if(!_54()){if(_2d.reconnect!="none"){_8e();_9c();}else{_8d();_52("disconnected");}}}};function _a0(xhr,_a1){var _a2={successful:false,failure:true,channel:"/meta/handshake",request:_a1,xhr:xhr,advice:{reconnect:"retry",interval:_2a}};_70("/meta/handshake",_a2);_70("/meta/unsuccessful",_a2);if(!_54()){if(_2d.reconnect!="none"){_8e();_9c();}else{_8d();_52("disconnected");}}};function _a3(_a4){_30=_a4.successful;if(_30){_70("/meta/connect",_a4);if(!_54()){if(!_2d.reconnect||_2d.reconnect=="retry"){_8d();_95();}else{_8d();_52("disconnected");}}}else{_47("Connect failed:",_a4.error);_70("/meta/connect",_a4);_70("/meta/unsuccessful",_a4);if(!_54()){var _a5=_2d.reconnect?_2d.reconnect:"retry";switch(_a5){case "retry":_8e();_95();break;case "handshake":_8d();_9c();break;case "none":_8d();_52("disconnected");break;default:_47("Unrecognized advice action",_a5);break;}}}};function _a6(xhr,_a7){_30=false;var _a8={successful:false,failure:true,channel:"/meta/connect",request:_a7,xhr:xhr,advice:{reconnect:"retry",interval:_2a}};_70("/meta/connect",_a8);_70("/meta/unsuccessful",_a8);if(!_54()){var _a9=_2d.reconnect?_2d.reconnect:"retry";switch(_a9){case "retry":_8e();_95();break;case "handshake":_8d();_9c();break;case "none":_8d();_52("disconnected");break;default:_47("Unrecognized advice action",_a9);break;}}};function _aa(_ab){_79();if(_ab){_22.abort();}_25=null;_52("disconnected");_26=0;_27=[];_8d();};function _ac(_ad){if(_ad.successful){_aa(false);_70("/meta/disconnect",_ad);}else{_aa(true);_70("/meta/disconnect",_ad);_70("/meta/unsuccessful",_ad);}};function _ae(xhr,_af){_aa(true);var _b0={successful:false,failure:true,channel:"/meta/disconnect",request:_af,xhr:xhr,advice:{reconnect:"none",interval:0}};_70("/meta/disconnect",_b0);_70("/meta/unsuccessful",_b0);};function _b1(_b2){if(_b2.successful){_70("/meta/subscribe",_b2);}else{_47("Subscription to",_b2.subscription,"failed:",_b2.error);_70("/meta/subscribe",_b2);_70("/meta/unsuccessful",_b2);}};function _b3(xhr,_b4){var _b5={successful:false,failure:true,channel:"/meta/subscribe",request:_b4,xhr:xhr,advice:{reconnect:"none",interval:0}};_70("/meta/subscribe",_b5);_70("/meta/unsuccessful",_b5);};function _b6(_b7){if(_b7.successful){_70("/meta/unsubscribe",_b7);}else{_47("Unsubscription to",_b7.subscription,"failed:",_b7.error);_70("/meta/unsubscribe",_b7);_70("/meta/unsuccessful",_b7);}};function _b8(xhr,_b9){var _ba={successful:false,failure:true,channel:"/meta/unsubscribe",request:_b9,xhr:xhr,advice:{reconnect:"none",interval:0}};_70("/meta/unsubscribe",_ba);_70("/meta/unsuccessful",_ba);};function _bb(_bc){if(_bc.successful===undefined){if(_bc.data){_70(_bc.channel,_bc);}else{_48("Unknown message",_bc);}}else{if(_bc.successful){_70("/meta/publish",_bc);}else{_47("Publish failed:",_bc.error);_70("/meta/publish",_bc);_70("/meta/unsuccessful",_bc);}}};function _bd(xhr,_be){var _bf={successful:false,failure:true,channel:_be.channel,request:_be,xhr:xhr,advice:{reconnect:"none",interval:0}};_70("/meta/publish",_bf);_70("/meta/unsuccessful",_bf);};function _c0(_c1){_c1=_5d(_c1);if(_c1===undefined||_c1===null){return;}if(_c1.advice){_2d=_c1.advice;}var _c2=_c1.channel;switch(_c2){case "/meta/handshake":_9d(_c1);break;case "/meta/connect":_a3(_c1);break;case "/meta/disconnect":_ac(_c1);break;case "/meta/subscribe":_b1(_c1);break;case "/meta/unsubscribe":_b6(_c1);break;default:_bb(_c1);break;}};this.receive=_c0;_7d=function _7d(_c3,_c4,_c5){var _c6=_68(_c4);_48("Received",_c4,"converted to",_c6);_22.complete(_c3,true,_c5);for(var i=0;i<_c6.length;++i){var _c7=_c6[i];_c0(_c7);}};_7e=function _7e(_c8,_c9,_ca,_cb,_cc){var xhr=_c8.xhr;_48("Failed",_c9);_22.complete(_c8,false,_cc);for(var i=0;i<_c9.length;++i){var _cd=_c9[i];var _ce=_cd.channel;switch(_ce){case "/meta/handshake":_a0(xhr,_cd);break;case "/meta/connect":_a6(xhr,_cd);break;case "/meta/disconnect":_ae(xhr,_cd);break;case "/meta/subscribe":_b3(xhr,_cd);break;case "/meta/unsubscribe":_b8(xhr,_cd);break;default:_bd(xhr,_cd);break;}}};function _cf(_d0){var _d1=_29[_d0];if(_d1){for(var i=0;i<_d1.length;++i){if(_d1[i]){return true;}}}return false;};function _d2(_d3,_d4){var _d5={scope:_d3,method:_d4};if(_40(_d3)){_d5.scope=undefined;_d5.method=_d3;}else{if(_3c(_d4)){if(!_d3){throw "Invalid scope "+_d3;}_d5.method=_d3[_d4];if(!_40(_d5.method)){throw "Invalid callback "+_d4+" for scope "+_d3;}}else{if(!_40(_d4)){throw "Invalid callback "+_d4;}}}return _d5;};function _d6(_d7,_d8,_d9,_da){var _db=_d2(_d8,_d9);_48("Adding listener on",_d7,"with scope",_db.scope,"and callback",_db.method);var _dc={channel:_d7,scope:_db.scope,callback:_db.method,listener:_da};var _dd=_29[_d7];if(!_dd){_dd=[];_29[_d7]=_dd;}var _de=_dd.push(_dc)-1;_dc.id=_de;_dc.handle=[_d7,_de];_48("Added listener",_dc,"for channel",_d7,"having id =",_de);return _dc.handle;};function _df(_e0){var _e1=_29[_e0[0]];if(_e1){delete _e1[_e0[1]];_48("Removed listener",_e0);}};this.registerTransport=function(_e2,_e3,_e4){var _e5=_21.add(_e2,_e3,_e4);if(_e5){_48("Registered transport",_e2);if(_40(_e3.registered)){_e3.registered(_e2,this);}}return _e5;};this.getTransportTypes=function(){return _21.getTransportTypes();};this.unregisterTransport=function(_e6){var _e7=_21.remove(_e6);if(_e7!==null){_48("Unregistered transport",_e6);if(_40(_e7.unregistered)){_e7.unregistered();}}return _e7;};this.configure=function(_e8){_49.call(this,_e8);};this.init=function(_e9,_ea){this.configure(_e9);this.handshake(_ea);};this.handshake=function(_eb){_52("disconnected");_2f=false;_96(_eb);};this.disconnect=function(_ec,_ed){if(_54()){return;}if(_ed===undefined){if(typeof _ec!=="boolean"){_ed=_ec;_ec=false;}}var _ee={channel:"/meta/disconnect"};var _ef=_31(false,{},_ed,_ee);_52("disconnecting");_7f(_ec===true,[_ef],false,"disconnect");};this.startBatch=function(){_8f();};this.endBatch=function(){_92();};this.batch=function(_f0,_f1){var _f2=_d2(_f0,_f1);this.startBatch();try{_f2.method.call(_f2.scope);this.endBatch();}catch(x){_48("Exception during execution of batch",x);this.endBatch();throw x;}};this.addListener=function(_f3,_f4,_f5){if(arguments.length<2){throw "Illegal arguments number: required 2, got "+arguments.length;}if(!_3c(_f3)){throw "Illegal argument type: channel must be a string";}return _d6(_f3,_f4,_f5,true);};this.removeListener=function(_f6){if(!_3e(_f6)){throw "Invalid argument: expected subscription, not "+_f6;}_df(_f6);};this.clearListeners=function(){_29={};};this.subscribe=function(_f7,_f8,_f9,_fa){if(arguments.length<2){throw "Illegal arguments number: required 2, got "+arguments.length;}if(!_3c(_f7)){throw "Illegal argument type: channel must be a string";}if(_54()){throw "Illegal state: already disconnected";}if(_40(_f8)){_fa=_f9;_f9=_f8;_f8=undefined;}var _fb=!_cf(_f7);var _fc=_d6(_f7,_f8,_f9,false);if(_fb){var _fd={channel:"/meta/subscribe",subscription:_f7};var _fe=_31(false,{},_fa,_fd);_8b(_fe);}return _fc;};this.unsubscribe=function(_ff,_100){if(arguments.length<1){throw "Illegal arguments number: required 1, got "+arguments.length;}if(_54()){throw "Illegal state: already disconnected";}this.removeListener(_ff);var _101=_ff[0];if(!_cf(_101)){var _102={channel:"/meta/unsubscribe",subscription:_101};var _103=_31(false,{},_100,_102);_8b(_103);}};this.clearSubscriptions=function(){_4e();};this.publish=function(_104,_105,_106){if(arguments.length<1){throw "Illegal arguments number: required 1, got "+arguments.length;}if(!_3c(_104)){throw "Illegal argument type: channel must be a string";}if(_54()){throw "Illegal state: already disconnected";}var _107={channel:_104,data:_105};var _108=_31(false,{},_106,_107);_8b(_108);};this.getStatus=function(){return _23;};this.isDisconnected=_54;this.setBackoffIncrement=function(_109){_19=_109;};this.getBackoffIncrement=function(){return _19;};this.getBackoffPeriod=function(){return _2a;};this.setLogLevel=function(_10a){_16=_10a;};this.registerExtension=function(name,_10b){if(arguments.length<2){throw "Illegal arguments number: required 2, got "+arguments.length;}if(!_3c(name)){throw "Illegal argument type: extension name must be a string";}var _10c=false;for(var i=0;i<_2c.length;++i){var _10d=_2c[i];if(_10d.name==name){_10c=true;break;}}if(!_10c){_2c.push({name:name,extension:_10b});_48("Registered extension",name);if(_40(_10b.registered)){_10b.registered(name,this);}return true;}else{_47("Could not register extension with name",name,"since another extension with the same name already exists");return false;}};this.unregisterExtension=function(name){if(!_3c(name)){throw "Illegal argument type: extension name must be a string";}var _10e=false;for(var i=0;i<_2c.length;++i){var _10f=_2c[i];if(_10f.name==name){_2c.splice(i,1);_10e=true;_48("Unregistered extension",name);var ext=_10f.extension;if(_40(ext.unregistered)){ext.unregistered();}break;}}return _10e;};this.getExtension=function(name){for(var i=0;i<_2c.length;++i){var _110=_2c[i];if(_110.name==name){return _110.extension;}}return null;};this.getName=function(){return _15;};this.getClientId=function(){return _25;};this.getURL=function(){return _17;};this.getTransport=function(){return _22;};org.cometd.Transport=function(){var self=this;var _111;var _112=0;var _113=null;var _114=[];var _115=[];this.registered=function(type,_116){_111=type;};this.unregistered=function(){_111=null;};this.accept=function(_117,_118){throw "Abstract";};this.transportSend=function(_119,_11a){throw "Abstract";};this.transportSuccess=function(_11b,_11c,_11d){if(!_11c.expired){clearTimeout(_11c.timeout);if(_11d&&_11d.length>0){_11b.onSuccess(_11c,_11d);}else{_11b.onFailure(_11c,"Empty HTTP response");}}};this.transportFailure=function(_11e,_11f,_120,_121){if(!_11f.expired){clearTimeout(_11f.timeout);_11e.onFailure(_11f,_120,_121);}};function _122(_123,_124){_124.expired=false;this.transportSend(_123,_124);if(!_123.sync){var _125=_1c;if(_124.longpoll===true){_125+=_2d&&typeof _2d.timeout==="number"?_2d.timeout:0;}_124.timeout=_76(function(){_124.expired=true;if(_124.xhr){_124.xhr.abort();}var _126="Transport "+self.getType()+" exceeded "+_125+" ms max network delay for request "+_124.id;_48(_126);_123.onFailure(_124,"timeout",_126);},_125);}};function _127(_128){if(_113!==null){throw "Concurrent longpoll requests not allowed, request "+_113.id+" not yet completed";}var _129=++_112;var _12a={id:_129,longpoll:true};_122.call(this,_128,_12a);_113=_12a;};function _8b(_12b){var _12c=++_112;var _12d={id:_12c,longpoll:false};if(_114.length<_18-1){_48("Transport sending request",_12c,_12b);_122.call(this,_12b,_12d);_114.push(_12d);}else{_48("Transport queueing request",_12c,_12b);_115.push([_12b,_12d]);}};function _12e(_12f){var _130=_12f.id;if(_113!==null&&_113!==_12f){throw "Longpoll request mismatch, completing request "+_130;}_113=null;};function _131(_132){while(_115.length>0){var _133=_115[0];var _134=_133[0];var _135=_133[1];if(_134.url===_132.url&&_134.sync===_132.sync){_115.shift();_132.messages=_132.messages.concat(_134.messages);_48("Coalesced",_134.messages.length,"messages from request",_135.id);continue;}break;}};function _136(_137,_138){var _139=_39(_137,_114);if(_139>=0){_114.splice(_139,1);}if(_115.length>0){var _13a=_115.shift();var _13b=_13a[0];var _13c=_13a[1];_48("Transport dequeued request",_13c.id);if(_138){if(_1f){_131(_13b);}_8b.call(this,_13b);_48("Transport completed request",_137.id,_13b);}else{setTimeout(function(){_13b.onFailure(_13c,"error");},0);}}};this.getType=function(){return _111;};this.send=function(_13d,_13e){if(_13e){_127.call(this,_13d);}else{_8b.call(this,_13d);}};this.complete=function(_13f,_140,_141){if(_141){_12e.call(this,_13f);}else{_136.call(this,_13f,_140);}};this.abort=function(){for(var i=0;i<_114.length;++i){var _142=_114[i];_48("Aborting request",_142);if(_142.xhr){_142.xhr.abort();}}if(_113){_48("Aborting longpoll request",_113);if(_113.xhr){_113.xhr.abort();}}this.reset();};this.reset=function(){_113=null;_114=[];_115=[];};this.toString=function(){return this.getType();};};org.cometd.LongPollingTransport=function(){var self=this;var _143=true;this.accept=function(_144,_145){return _143||!_145;};this.xhrSend=function(_146){throw "Abstract";};this.transportSend=function(_147,_148){try{var _149=true;_148.xhr=this.xhrSend({transport:this,url:_147.url,sync:_147.sync,headers:_1d,body:org.cometd.JSON.toJSON(_147.messages),onSuccess:function(_14a){if(!_14a||_14a.length===0){_143=false;}self.transportSuccess(_147,_148,_14a);},onError:function(_14b,_14c){_143=false;if(_149){_76(function(){self.transportFailure(_147,_148,_14b,_14c);},0);}else{self.transportFailure(_147,_148,_14b,_14c);}}});_149=false;}catch(x){_143=false;_76(function(){self.transportFailure(_147,_148,"error",x);},0);}};this.reset=function(){org.cometd.LongPollingTransport.prototype.reset();_143=true;};};org.cometd.LongPollingTransport.prototype=new org.cometd.Transport();org.cometd.LongPollingTransport.prototype.constructor=org.cometd.LongPollingTransport;org.cometd.CallbackPollingTransport=function(){var self=this;var _14d=2000;this.accept=function(_14e,_14f){return true;};this.jsonpSend=function(_150){throw "Abstract";};this.transportSend=function(_151,_152){var _153=org.cometd.JSON.toJSON(_151.messages);var _154=_151.url.length+encodeURI(_153).length;if(_154>_14d){var x=_151.messages.length>1?"Too many bayeux messages in the same batch resulting in message too big "+"("+_154+" bytes, max is "+_14d+") for transport "+this.getType():"Bayeux message too big ("+_154+" bytes, max is "+_14d+") "+"for transport "+this.getType();_76(function(){self.transportFailure(_151,_152,"error",x);},0);}else{try{var _155=true;this.jsonpSend({transport:this,url:_151.url,sync:_151.sync,headers:_1d,body:_153,onSuccess:function(_156){self.transportSuccess(_151,_152,_156);},onError:function(_157,_158){if(_155){_76(function(){self.transportFailure(_151,_152,_157,_158);},0);}else{self.transportFailure(_151,_152,_157,_158);}}});_155=false;}catch(xx){_76(function(){self.transportFailure(_151,_152,"error",xx);},0);}}};};org.cometd.CallbackPollingTransport.prototype=new org.cometd.Transport();org.cometd.CallbackPollingTransport.prototype.constructor=org.cometd.CallbackPollingTransport;};}if(!dojo._hasResource["dojo.io.script"]){dojo._hasResource["dojo.io.script"]=true;dojo.provide("dojo.io.script");(function(){var _159=dojo.isIE?"onreadystatechange":"load",_15a=/complete|loaded/;dojo.io.script={get:function(args){var dfd=this._makeScriptDeferred(args);var _15b=dfd.ioArgs;dojo._ioAddQueryToUrl(_15b);dojo._ioNotifyStart(dfd);if(this._canAttach(_15b)){var node=this.attach(_15b.id,_15b.url,args.frameDoc);if(!_15b.jsonp&&!_15b.args.checkString){var _15c=dojo.connect(node,_159,function(evt){if(evt.type=="load"||_15a.test(node.readyState)){dojo.disconnect(_15c);_15b.scriptLoaded=evt;}});}}dojo._ioWatch(dfd,this._validCheck,this._ioCheck,this._resHandle);return dfd;},attach:function(id,url,_15d){var doc=(_15d||dojo.doc);var _15e=doc.createElement("script");_15e.type="text/javascript";_15e.src=url;_15e.id=id;_15e.charset="utf-8";return doc.getElementsByTagName("head")[0].appendChild(_15e);},remove:function(id,_15f){dojo.destroy(dojo.byId(id,_15f));if(this["jsonp_"+id]){delete this["jsonp_"+id];}},_makeScriptDeferred:function(args){var dfd=dojo._ioSetArgs(args,this._deferredCancel,this._deferredOk,this._deferredError);var _160=dfd.ioArgs;_160.id=dojo._scopeName+"IoScript"+(this._counter++);_160.canDelete=false;_160.jsonp=args.callbackParamName||args.jsonp;if(_160.jsonp){_160.query=_160.query||"";if(_160.query.length>0){_160.query+="&";}_160.query+=_160.jsonp+"="+(args.frameDoc?"parent.":"")+dojo._scopeName+".io.script.jsonp_"+_160.id+"._jsonpCallback";_160.frameDoc=args.frameDoc;_160.canDelete=true;dfd._jsonpCallback=this._jsonpCallback;this["jsonp_"+_160.id]=dfd;}return dfd;},_deferredCancel:function(dfd){dfd.canceled=true;if(dfd.ioArgs.canDelete){dojo.io.script._addDeadScript(dfd.ioArgs);}},_deferredOk:function(dfd){var _161=dfd.ioArgs;if(_161.canDelete){dojo.io.script._addDeadScript(_161);}return _161.json||_161.scriptLoaded||_161;},_deferredError:function(_162,dfd){if(dfd.ioArgs.canDelete){if(_162.dojoType=="timeout"){dojo.io.script.remove(dfd.ioArgs.id,dfd.ioArgs.frameDoc);}else{dojo.io.script._addDeadScript(dfd.ioArgs);}}console.log("dojo.io.script error",_162);return _162;},_deadScripts:[],_counter:1,_addDeadScript:function(_163){dojo.io.script._deadScripts.push({id:_163.id,frameDoc:_163.frameDoc});_163.frameDoc=null;},_validCheck:function(dfd){var _164=dojo.io.script;var _165=_164._deadScripts;if(_165&&_165.length>0){for(var i=0;i<_165.length;i++){_164.remove(_165[i].id,_165[i].frameDoc);_165[i].frameDoc=null;}dojo.io.script._deadScripts=[];}return true;},_ioCheck:function(dfd){var _166=dfd.ioArgs;if(_166.json||(_166.scriptLoaded&&!_166.args.checkString)){return true;}var _167=_166.args.checkString;if(_167&&eval("typeof("+_167+") != 'undefined'")){return true;}return false;},_resHandle:function(dfd){if(dojo.io.script._ioCheck(dfd)){dfd.callback(dfd);}else{dfd.errback(new Error("inconceivable dojo.io.script._resHandle error"));}},_canAttach:function(_168){return true;},_jsonpCallback:function(json){this.ioArgs.json=json;}};})();}if(!dojo._hasResource["dojox.cometd"]){dojo._hasResource["dojox.cometd"]=true;dojo.provide("dojox.cometd");dojo.registerModulePath("org","../org");org.cometd.JSON.toJSON=dojo.toJson;org.cometd.JSON.fromJSON=dojo.fromJson;dojox.cometd=new org.cometd.Cometd();dojox.cometd.LongPollingTransport=function(){this.xhrSend=function(_169){var _16a=dojo.rawXhrPost({url:_169.url,sync:_169.sync===true,contentType:"application/json;charset=UTF-8",headers:_169.headers,postData:_169.body,handleAs:"json",load:_169.onSuccess,error:function(_16b){_169.onError(_16b.message,_16a.ioArgs.error);}});return _16a.ioArgs.xhr;};};dojox.cometd.LongPollingTransport.prototype=new org.cometd.LongPollingTransport();dojox.cometd.LongPollingTransport.prototype.constructor=dojox.cometd.LongPollingTransport;dojox.cometd.CallbackPollingTransport=function(){this.jsonpSend=function(_16c){var _16d=dojo.io.script.get({url:_16c.url,sync:_16c.sync===true,callbackParamName:"jsonp",content:{message:_16c.body},load:_16c.onSuccess,error:function(_16e){_16c.onError(_16e.message,_16d.ioArgs.error);}});return undefined;};};dojox.cometd.CallbackPollingTransport.prototype=new org.cometd.CallbackPollingTransport();dojox.cometd.CallbackPollingTransport.prototype.constructor=dojox.cometd.CallbackPollingTransport;dojox.cometd.registerTransport("long-polling",new dojox.cometd.LongPollingTransport());dojox.cometd.registerTransport("callback-polling",new dojox.cometd.CallbackPollingTransport());dojox.cometd._init=dojox.cometd.init;dojox.cometd._unsubscribe=dojox.cometd.unsubscribe;dojox.cometd.unsubscribe=function(_16f,_170,_171){if(typeof _16f==="string"){throw "Deprecated function unsubscribe(string). Use unsubscribe(object) passing as argument the return value of subscribe()";}dojox.cometd._unsubscribe(_16f);};dojox.cometd._metaHandshakeEvent=function(_172){_172.action="handshake";dojo.publish("/cometd/meta",[_172]);};dojox.cometd._metaConnectEvent=function(_173){_173.action="connect";dojo.publish("/cometd/meta",[_173]);};dojox.cometd.addListener("/meta/handshake",dojox.cometd,dojox.cometd._metaHandshakeEvent);dojox.cometd.addListener("/meta/connect",dojox.cometd,dojox.cometd._metaConnectEvent);}
