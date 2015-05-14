//videochat.js

//'use strict';

angular.module('codeColab.videochat',[])

.controller('videochatCtrl',function($scope){

var CHANNEL_ID = 'chat-codecolab';
var SESSION_ID = 'vidchat';    // room-id

var USER_ID         = 'initiator';    // user-id
var SESSION    = {         // media-type
    audio: true,
    video: true
};
var EXTRA      = {};       // empty extra-data

var connection = new RTCMultiConnection(CHANNEL_ID);

$scope.$watch('selectRepo', function(){
  //console.log('selectRepo watch',$scope.selectRepo.name);
  //SESSION_ID = $scope.selectRepo.name;
  CHANNEL_ID = $scope.selectRepo.name;
  connection = new RTCMultiConnection(CHANNEL_ID);
});

connection.sessionid = SESSION_ID;

//connection.userid = USER_ID;
connection.extra = EXTRA;

var firebaseURL = 'https://glaring-fire-1858.firebaseio.com/';

var remoteMediaStreams = document.getElementById('video-chats');
var localMediaStream = document.getElementById('local-media-stream');
var ctrlJoin = document.getElementById('setup-new-meeting');
var ctrlLeave = document.getElementById('leave-current-meeting');

connection.session = {
    audio: true,
    video: true
};

connection.onstream = function(e) {
    console.log('connection.onstream e = ',e);
    if(e.type === 'local'){
      localMediaStream.insertBefore(e.mediaElement, localMediaStream.firstChild);
       e.mediaElement.className = 'my-video';
    }else if(e.type === 'remote'){
      remoteMediaStreams.insertBefore(e.mediaElement, remoteMediaStreams.firstChild);
      e.mediaElement.className = 'their-video';
    }
    
};

connection.openSignalingChannel = function (config) {
    config.channel = config.channel || this.channel;
    
    var socket = new Firebase(firebaseURL + config.channel);
    socket.channel = config.channel;
    
    socket.on('child_added', function (data) {
        config.onmessage(data.val());
    });
    
    socket.send = function(data) {
        this.push(data);
    };
    
    config.onopen && setTimeout(config.onopen, 1);
    socket.onDisconnect().remove();
    return socket;
};

function afterEach(setTimeoutInteval, numberOfTimes, callback, startedTimes) {
    startedTimes = (startedTimes || 0) + 1;
    if (startedTimes >= numberOfTimes) return;

    setTimeout(function() {
        callback();
        afterEach(setTimeoutInteval, numberOfTimes, callback, startedTimes);
    }, setTimeoutInteval);
}

connection.onspeaking = function(e){
  e.mediaElement.volume = 0.7;
}

connection.onsilence = function(e){
  e.mediaElement.volume = 0.01;
}

connection.onunmute = function(event) {
    // event.isAudio == audio-only-stream
    // event.audio == has audio tracks

    if (event.isAudio || event.session.audio) {
        // set volume=0
        event.mediaElement.volume = 0;

        // steadily increase volume
        afterEach(200, 5, function() {
            event.mediaElement.volume += .20;
        });
    }
};


document.getElementById('setup-new-meeting').onclick = function(){
  // setup signaling channel
  //console.log('firebaseURL connection.channel',firebaseURL,connection.channel)
  console.log('connection.sessionid',connection.sessionid);
  var roomFirebase = new Firebase(firebaseURL + connection.channel + '-session');
  roomFirebase.once('value', function (data) {
    console.log('roomFirebase data.val',data.val);
    var sessionDescription = data.val();

    // checking for room; if not available "open" otherwise "join"
    if (sessionDescription === null) {
        connection.open({
            sessionid: connection.sessionid,
            captureUserMediaOnDemand: false,
            dontTransmit: true,
            onMediaCaptured: function() {
                // storing room on server
                roomFirebase.set(connection.sessionDescription);
                
                // if room owner leaves; remove room from the server
                roomFirebase.onDisconnect().remove();
            }
        });
    } else {
        // you can join with only audio or audio+video
        var joinWith = {
            audio: true,
            video: true
        };
        
        // pure "sessionDescription" object is passed over "join" method
        // 2nd parameter is optional which allows you customize how to join the session
        connection.join(sessionDescription, joinWith);

    }
  });
  ctrlJoin.className = 'hidden';
  ctrlLeave.className = 'shown';
}


document.getElementById('leave-current-meeting').onclick = function(){
  connection.leave();
  connection.close();
  connection.disconnect();
  ctrlJoin.className = 'shown';
  ctrlLeave.className = 'hidden';
}



});