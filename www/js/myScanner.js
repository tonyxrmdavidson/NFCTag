var dojo = {
         dirty: false,
         members: [

         ],
         register: [

         ]
}
var isIn;
var count = localStorage.getItem('isIn');
if(count){
    isIn = count;
}else{
    isIn = 0;
}
var username;
var password;
var onlineLogin;
var baseURL = 'https://coderdojosignin-wexgroovy16.c9users.io:8080';
//var baseURL = 'http://192.168.1.3:8080';
document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        $(".loader").hide();
        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
        }, false );
}

function login(form){
    if(onlineLogin == 'online'){
        username = $("input#username").val();
        password = $("input#password").val();
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            username: username,
            password: password
        });
        if(username == ''){username = '****'; password ='****'}
        $.ajax({
            url: baseURL+'/auth',
            username : username,
            password : password,
            type: 'GET',
            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {withCredentials: true},
            beforeSend: function (xhr) {xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));},
            success: function(data) {
                $.mobile.changePage( "#homepage", { transition: "fade" }); },
            error: handleAjaxError
        });
        function handleAjaxError(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                $(".error").remove();
                $.mobile.changePage( "#signin", { transition: "slide" });
                var template = "<div class='error'>Login Failed! Your Id or Password is wrong.<br>Please try again.</div>"
                $("#loginForm").prepend(template).css( "color", "red" );
            }
            else if(jqXHR.status == 503){
                $(".error").remove();
                $.mobile.changePage( "#signin", { transition: "slide" });
                var template = "<div class='error'>Service unavailable.<br>Please try again later.</div>"
                $("#loginForm").prepend(template).css( "color", "red" );
            }
        }
    }
    else{
        $.mobile.changePage( "#homepage", { transition: "slide" });
    }
};


$("#signin").on("pageshow", function(event){
    if(navigator.onLine){
            onlineLogin = 'online';
            document.getElementById("onlineLogin").innerHTML = "You are online : Please input credentials";
            $(".onlineLogin2").hide();
    }else{
            onlineLogin = 'offline';
            document.getElementById("onlineLogin").innerHTML = "You are offline :";
            $("#username").prop('disabled', true);
            $("#password").prop('disabled', true);
            $("#onlineLogin").removeClass("onlineLogin");
            $("#onlineLogin").addClass("onlineLogin1");
    }
//   $.ajax({
//      url: baseURL,
//      success: function(result){
//      },
//      error: function(result){
//        var res = result;
//        var resJSON = JSON.parse(res.responseText);
//        var status = resJSON.status;
//        if(status == 401 || status == 200){
//            onlineLogin = 'online';
//            document.getElementById("onlineLogin").innerHTML = "You are online : Please input credentials";
//            $(".onlineLogin2").hide();
//        }else{
//            onlineLogin = 'offline';
//            document.getElementById("onlineLogin").innerHTML = "You are offline :";
//            $("#username").prop('disabled', true);
//            $("#password").prop('disabled', true);
//            $("#onlineLogin").removeClass("onlineLogin");
//            $("#onlineLogin").addClass("onlineLogin1");
//        }
//      }
//   });
});

$('#homepage').on('pageshow', function(){
    $('.allMembers').remove();
    loadDojo();
    $("body").append(Mustache.render(MustacheTemplates.members, dojo));
    $('#allMembers').off().on('pagebeforeshow', function(){
        for(m = 0; m < dojo.members.length; m++){
            var mem = dojo.members[m];
            if(mem.signedIn){
                $('#status'+mem.memberId).css("width", "100%").css('background-color', '#00ff00');
            }
        }
        saveDojo(dojo, 0);
    });
    $('.listMember').off().on('click', function(e){
        var memberId = $(this).attr('id');
        var thisMember;
        for(m = 0; m < dojo.members.length; m++){
            thisMember = dojo.members[m];
            if(thisMember.memberId == memberId){
                if(thisMember.membership == 'Mentor'){
                    swal({title:'Details',html:'ID : '+thisMember.memberId+'<br>'+ 'Name : '+thisMember.name+'<br>'+'Group : '+thisMember.group+'<br>'+'Mobile : '+thisMember.mobile+'<br>'+'Email : '+thisMember.email,type:'info'});
                }else{
                    swal({title:'Details',html:'ID : '+thisMember.memberId+'<br>'+ 'Name : '+thisMember.name+'<br>'+'Group : '+thisMember.group+'<br>'+'Parent : '+thisMember.parent+'<br>'+'Parent Mobile : '+thisMember.parentMobile+'<br>'+'Parent Email : '+thisMember.parentEmail,type:'info'});
                }
            }
        }
    });
    $('.listMember').off().on('taphold', function(e){
        var time = formatTimeStamp(2);
        var date = formatTimeStamp(1);
        var memberId = $(this).attr('id');
        for(m = 0; m < dojo.members.length; m++){
            var tapholdThisMember = dojo.members[m];
            if(memberId == tapholdThisMember.memberId){
                var status = tapholdThisMember.signedIn;
                if(status){
                    swal({
                        title: 'OUT',
                        html:'ID : '+tapholdThisMember.memberId+'<br>'+ 'Name : '+tapholdThisMember.name+'<br>',
                        type: 'question',
                        showCancelButton: true,
                        cancelButtonColor: '#3085d6',
                        cancelButtonText: 'Sign Out',
                        confirmButtonText: 'Cancel',
                        showCloseButton: true
                    }).then(function () {
                        swal.closeModal();
                      }, function (dismiss) {
                        if (dismiss === 'cancel') {
                            $('#status'+tapholdThisMember.memberId).css("width", "100%").css('background-color', '#ff0000');
                            var reg = {
                                'memberId': tapholdThisMember.memberId,
                                'name': tapholdThisMember.name,
                                'date': tapholdThisMember.date,
                                'timeIn': tapholdThisMember.timeIn,
                                'timeOut': time
                            };
                            if(dojo.newRegister){
                                dojo.newRegister.unshift(reg);
                            }else{
                                dojo.newRegister = [];
                                dojo.newRegister.unshift(reg);
                            }
                            tapholdThisMember.signedIn = false;
                            tapholdThisMember.timeIn = null;
                            tapholdThisMember.date = null;
                            isIn--;
                            dojo.isIn = isIn;
                            var intString = isIn.toString();
                            $('#spanCount').text(intString);
                            saveDojo(dojo, 0);
                        }
                    });
                }else{
                    swal({
                        title: 'IN',
                        html:'ID : '+tapholdThisMember.memberId+'<br>'+ 'Name : '+tapholdThisMember.name+'<br>',
                        type: 'question',
                        showCancelButton: true,
                        cancelButtonColor: '#3085d6',
                        cancelButtonText: 'Sign In',
                        confirmButtonText: 'Cancel',
                        showCloseButton: true
                    }).then(function () {
                        swal.closeModal();
                      }, function (dismiss) {
                        if (dismiss === 'cancel') {
                            $('#status'+tapholdThisMember.memberId).css("width", "100%").css('background-color', '#00ff00');
                            tapholdThisMember.signedIn = true;
                            tapholdThisMember.timeIn =time;
                            tapholdThisMember.date = date;
                            isIn++;
                            dojo.isIn = isIn;
                            var intString = isIn.toString();
                            $('#spanCount').text(intString);
                            saveDojo(dojo, 0);
                        }
                    });
                }
                break;
            }
        }
    });
});

function memberOut(res){
    var time = formatTimeStamp(2);
    var date = formatTimeStamp(1);
    var thisId = res;
    for(m = 0; m < dojo.members.length; m++){
        var thisMember = dojo.members[m];
        if(thisMember.memberId == thisId){
            if(thisMember.signedIn){
                swal({  title:'OUT',
                        html:'ID : '+thisMember.memberId+'<br>'+ 'Name : '+thisMember.name,
                        type:'success',
                        timer: 1200,
                        showConfirmButton: false,
                        onClose: function(n){
                            $('#status'+thisMember.memberId).css("width", "100%").css('background-color', '#ff0000');
                            var reg = {
                                'memberId': thisMember.memberId,
                                'name': thisMember.name,
                                'date': thisMember.date,
                                'timeIn': thisMember.timeIn,
                                'timeOut': time
                            };
                            if(dojo.newRegister){
                                dojo.newRegister.unshift(reg);
                            }else{
                                dojo.newRegister = [];
                                dojo.newRegister.unshift(reg);
                            }
                            dojo.members[m].signedIn = false;
                            dojo.members[m].timeIn = null;
                            dojo.members[m].date = null;
                            isIn--;
                            dojo.isIn = isIn;
                            var intString = isIn.toString();
                            $('#spanCount').text(intString);
                            saveDojo(dojo, 2);
                        }
                }).catch(function () {});
            }else{
                swal({title:'',html:'Member not signed in',type:'info'});
            }
            break;
        }else{
            swal({title:'',html:'Member not found',type:'info'});
        }
    }
}

function memberIn(res){
    var time = formatTimeStamp(2);
    var date = formatTimeStamp(1);
    var thisId = res;
    for(m = 0; m < dojo.members.length; m++){
        var thisMember = dojo.members[m];
        if(thisMember.memberId == thisId){
                if(!thisMember.signedIn){
                    swal({  title:'IN',
                            html:'ID : '+thisMember.memberId+'<br>'+ 'Name : '+thisMember.name,type:'success',
                            timer: 1200,
                            showConfirmButton: false,
                            onClose: function(n){
                                $('#status'+thisMember.memberId).css("width", "100%").css('background-color', '#00ff00');
                                dojo.members[m].signedIn = true;
                                dojo.members[m].timeIn = time;
                                dojo.members[m].date = date;
                                isIn++;
                                dojo.isIn = isIn;
                                var intString = isIn.toString();
                                $('#spanCount').text(intString);
                                saveDojo(dojo, 1);
                            }
                    }).catch(function(){});
                }else{
                    swal({title:'',html:'Member already in',type:'info'});
                }
            break;
        }else{
            swal({title:'',html:'Member not found',type:'info'});
        }
    }
}

function scanIn(){
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(result.cancelled){
                swal({title:'',html:'Scan cancelled',type:'info'});
            }else{
                var barcode = result.text;
                var res = barcode.split(",");
                memberIn(res[0]);
             }
      },
      function (error) {
          swal('',"Scanning failed: " + error,'error');
      },
      {
          'preferFrontCamera' : false, // iOS and Android 
          'showFlipCameraButton' : true, // iOS and Android
          'prompt' : "CoderDojo Regester : SCANNING IN", // Android
          'resultDisplayDuration' : 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          'formats' : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          'disableSuccessBeep' : false // iOS and Android 
      }
   );
}

function scanOut(){
    var date = formatTimeStamp(1);
    var time = formatTimeStamp(2);
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(result.cancelled){
                swal({title:'',html:'Scan cancelled',type:'info'});
            }else{
                var barcode = result.text;
                var res = barcode.split(",");
                memberOut(res[0]);
            }
      },
      function (error) {
          swal('',"Scanning failed: " + error,'error');
      },
      {
          'preferFrontCamera' : false, // iOS and Android 
          'showFlipCameraButton' : true, // iOS and Android
          'prompt' : "CoderDojo Regester : SCANNING OUT", // Android
          'resultDisplayDuration' : 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          'formats' : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          'disableSuccessBeep' : false // iOS and Android 
      }
   );
}
function saveDojo(dojo, check){
    console.log(dojo);
    localStorage.setItem('dojo',JSON.stringify(dojo));
    localStorage.setItem('isIn',isIn);
    if(check == 1){
        scanIn();
    }else if(check == 2){
        scanOut();
    }
}

function loadDojo(){
    var dojoString = localStorage.getItem('dojo');
    if(dojoString){
        dojo = JSON.parse(dojoString);
    }
    var count = localStorage.getItem('isIn');
    if(count){
        isIn = count;
    }
}

$(document).ready(function () {
    document.addEventListener('pause', function(){
        saveDojo(dojo, 0);
    }, false);
    document.addEventListener('resume', function(){
        loadDojo();
    } , false);
});

$('#scanIn').on('click', scanIn);
$('#scanOut').on('click', scanOut);
$('#syncButton').on('click', sync);

function formatTimeStamp(index){
    var dateTime = Math.floor(Date.now());
    var intTime = new Date(dateTime);
    var dateString;
    var day,monthText,monthNum,year,hour,minutes,seconds;
    var monthArray = new Array(12);
    monthArray[0] = "JAN";
    monthArray[1] = "FEB";
    monthArray[2] = "MAR";
    monthArray[3] = "ARP";
    monthArray[4] = "MAY";
    monthArray[5] = "JUN";
    monthArray[6] = "JUL";
    monthArray[7] = "AUG";
    monthArray[8] = "SEP";
    monthArray[9] = "OCT";
    monthArray[10] = "NOV";
    monthArray[11] = "DEC";
    monthText = monthArray[intTime.getMonth()];
    day = intTime.getDate();
    monthNum = intTime.getMonth();
    monthNum = monthNum + 1;
    if(monthNum < 10) monthNum = '0'+monthNum;
    year = intTime.getFullYear();
    hour = intTime.getHours();
    if(hour < 10) hour = '0'+hour;
    minutes = intTime.getMinutes();
    if(minutes < 10) minutes = '0'+minutes;
    seconds = intTime.getSeconds();
    if(seconds < 10) seconds = '0'+seconds;
    dateString = [
    				day+'-'+monthText+'-'+year+' '+hour+':'+minutes+':'+seconds,
    				day+'-'+monthText+'-'+year,
    				hour+':'+minutes+':'+seconds,
    			 	day+'/'+monthNum+'/'+year
    			 ];
    return dateString[index];
}

$('#sync').on('pagebeforeshow', function(event){
    $('#syncButton').hide();
    updateSyncMessages();
});

function updateSyncMessages() {
    var online;
    $.get(baseURL,{username: username, password: password}, function(data, status){
        if (status == 'success'){
            online = 'online';
            $('.sync.warning').removeClass('offline');
        }
        $('.sync.warning').addClass(online);
        $('.sync.warning #online').text(online);
     });
    if(online != 'online'){
        online = 'offline';
        $('.sync.warning').removeClass('online');
    }
    $('.sync.warning').addClass(online);
    $('.sync.warning #online').text(online);

    if(isIn == 0 && !dojo.newRegister){
        $('#syncButton').show();
        $('p.sync.alert').text('No local changes, but you can update from the server');
    }else if(isIn == 0 && dojo.newRegister){
        $('#syncButton').show()
        $('p.sync.alert').text('You have changes to be uploaded to the server');
    }else {
        $('p.sync.alert').text('You need to have everyone signed out before you can upload the register');
        $('#syncButton').hide();
    }
}

$('#homePageSyncButton').on('click',function(){
    $.mobile.changePage( "#sync", { transition: "fade" });
})

function sync(){
     $(".loader").show();
     $.ajaxSetup({
         crossDomain: true,
         xhrFields: {
             withCredentials: true
         },
         username: username,
         password: password
     });
     $.ajax(
        {
            type: 'POST',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            url: baseURL + '/sync',
            crossDomain: true,
            xhrFields: {withCredentials: true},
            beforeSend: function (xhr) {xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));},
            data: JSON.stringify(dojo),
            dataType: 'json',
            error: function(xhr){$(".loader").hide(); swal('',"An error occured: " + xhr.status + " " + xhr.statusText);}
        }
     ).done( function(data) {
			  dojo =  dojoSort(data);
        }
     );
}

$('#allMembers').on('pagebeforeshow',function(){
    var groups = ['appInventor','javascript','robotics','scratch1','scratch2','others',];
    for(g = 0; g < groups.length; g++){
        $('.members1-'+groups[g]).addClass('ui-');
    }
});


function dojoSort(dojo){
    dojo.dirty = false;
    dojo.membersIn = [];
    dojo.isIn = isIn;
    dojo.membersIn.push({'list': [{'group': 'appInventor', 'mentors': [],'ninjas': []}], 'next': 'javasript', 'previous': 'others'});
    dojo.membersIn.push({'list': [{'group': 'javascript', 'mentors': [],'ninjas': []}], 'next': 'robotics', 'previous': 'appInventor'});
    dojo.membersIn.push({'list': [{'group': 'robotics', 'mentors': [],'ninjas': []}], 'next': 'scratch1', 'previous': 'javascript'});
    dojo.membersIn.push({'list': [{'group': 'scratch1', 'mentors': [],'ninjas': []}], 'next': 'scratch2', 'previous': 'robotics'});
    dojo.membersIn.push({'list': [{'group': 'scratch2', 'mentors': [],'ninjas': []}], 'next': 'others', 'previous': 'scratch1'});
    dojo.membersIn.push({'list': [{'group': 'others', 'mentors': [],'ninjas': []}], 'next': 'appInventor', 'previous': 'scratch2'});
    dojo.groups = [];
    dojo.groups.push({'list': [{'group': 'appInventor', 'mentors': [],'ninjas': []}]});
    dojo.groups.push({'list': [{'group': 'javascript', 'mentors': [],'ninjas': []}]});
    dojo.groups.push({'list': [{'group': 'robotics', 'mentors': [],'ninjas': []}]});
    dojo.groups.push({'list': [{'group': 'scratch1', 'mentors': [],'ninjas': []}]});
    dojo.groups.push({'list': [{'group': 'scratch2', 'mentors': [],'ninjas': []}]});
    dojo.groups.push({'list': [{'group': 'others', 'mentors': [],'ninjas': []}]});
    for(dm = 0; dm < dojo.members.length; dm++){
        var member = dojo.members[dm];
        var memberIn = member.signedIn;
        if(!memberIn){
            member.signedIn = false;
        }else{
            isIn++;
            dojo.isIn = isIn;
        }
        var mem = member.membership+member.group;
        switch(mem) {
            case 'MentorApp Inventor': dojo.groups[0].list[0].mentors.push(member); break;
            case 'NinjaApp Inventor': dojo.groups[0].list[0].ninjas.push(member); break;
            case 'MentorJavascript':dojo.groups[1].list[0].mentors.push(member); break;
            case 'NinjaJavascript': dojo.groups[1].list[0].ninjas.push(member); break;
            case 'MentorRobotics': dojo.groups[2].list[0].mentors.push(member); break;
            case 'NinjaRobotics': dojo.groups[2].list[0].ninjas.push(member); break;
            case 'MentorScratch 1': dojo.groups[3].list[0].mentors.push(member); break;
            case 'NinjaScratch 1': dojo.groups[3].list[0].ninjas.push(member); break;
            case 'MentorScratch 2':dojo.groups[4].list[0].mentors.push(member); break;
            case 'NinjaScratch 2': dojo.groups[4].list[0].ninjas.push(member); break;
            case 'MentorSuport': dojo.groups[5].list[0].mentors.push(member); break;
            case 'Ninja': dojo.groups[5].list[0].ninjas.push(member);
        }
    }
    $(".loader").hide();
    saveDojo(dojo, 0);
    return dojo
}