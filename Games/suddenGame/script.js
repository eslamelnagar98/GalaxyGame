var Scores;
var picSrcHole = "/img/batlogo.jpg"; // the image not to be clicked
var picSrcBuggs = "/img/jokerlogo.jpg"; // the image to be clicked
var timerId, imgTimerId; // timer ids
var nameEntered;
var gameImgsPath = "/Games/suddenGame";
var GameScore; //final GameScore //M.Shawky
$( function(){

    Scores = JSON.parse(localStorage.getItem("CommunityScores")) || [];

    $("#welcomeScreen").dialog({
        resizable : false,
        width : 400,
        modal : true,
        draggable : false,
        show : {
            effect: "blind",
            duration: 1000
        },
        hide : {
            effect: "explode",
            duration: 1000
        },
        buttons : {
            "Play" : function(){
                if($("#usrName").val()){
                    $(this).dialog("close");
                }
            },
            "Controls" : function(){
                $(this).children('p').html("Only the mouse is required, you need to click images quickly").css("text-align","center");
            }
        }
    });
    
    $("#scoreScreen").dialog({
        autoOpen : false,
        resizable : false,
        modal : true,
        width : 650,
        show : {
            effect : "explode",
            duration : 500
        },
        hide : {
            effect:"blind",
            duration : 500
        },
        buttons : {
            "Share Score" : function(){
                var scoreObj = {
                    name : $("#usrName").val(),
                    game : "Sudden Game",
                    score : GameScore,
                    date : new Date().toLocaleString()
                }
                Scores.push(scoreObj);
                localStorage.setItem("CommunityScores",JSON.stringify(Scores));
                $('.ui-button:contains(Share Score)').hide();
            },
            "Play again" : function(){
                $(this).dialog("close");
            },
            "Another User" : function(){
                $(this).dialog("close");
                $("#welcomeScreen").dialog('open');
                $('.ui-button:contains(Share Score)').show();
            },
            "Home": function(){
                $(this).dialog("close");
                $('.ui-button:contains(Share Score)').show();
                location = "/index.html"
            },
            "Support Us" : function(){
                $('.ui-button:contains(Share Score)').show();
                location = "/Games/Payment Page/payment.html";
            }
        }
    })
});

$(".titleDiv").children('p').click(function(){
    alert("Enjoy the game!!");
})

$(".gameImgs").click(function(){
    if($(this).attr('src') == (gameImgsPath+picSrcBuggs)){
        $(this).effect('shake','left', 100);
        var count = parseInt($("#score").html().split(' ')[1]);
        count++;
        $("#score").html("Score: " + count);
    }
})

$("#btnStart").click(function(){
    if(!$("#difficulty").val()){
        alert("Choose game difficulty");
        } 
    else if($("#btnStart").val() == "Start Game" && $("#usrName").val()){
        $("#btnStart").val("Reset");
        var speed = $("#difficulty").val();
        switch(speed){
            case null :
                speed = 800;
                break;
            case 'easy':
               speed = 1000; 
                break;
            case 'medium':
                speed = 800;
                break;
            case 'hard':
                speed = 600;
                break;
        }
        imgTimerId = setInterval(randomizeImgs,speed);
        decrementTimer();
    }
    else if(!$("#usrName").val()){
        $("#welcomeScreen").dialog("open");
    }
    else if ($("#btnStart").val() == "Reset"){
        stopFunction();
        $("#btnStart").val("Start Game");
    }

})

function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeImgs(){
    var buggsId;
    for(var i=0; i<$(".gameDiv").children('img').length; i++){
        if($(".gameDiv").children('img')[i].src.replace(/http:\/\/[0-9]+\.0\.0\.1:[0-9]+/,'') == (gameImgsPath + picSrcBuggs)){
            buggsId = parseInt($(".gameDiv").children('img')[i].getAttribute('id').slice(3,4));
        }
    }
    for(var i=0; i<$(".gameImgs").length; i++){
        $(".gameImgs")[i].src = (gameImgsPath+picSrcHole);            
    }
    
    do{
        var newBuggsId = getRandomNumber(1,8);
    }  
    while(newBuggsId == buggsId);
    $("#img" + newBuggsId).attr('src',(gameImgsPath + picSrcBuggs));
}

function decrementTimer(){
    timerId = setTimeout(function decrement(){
        var min = parseInt($("#timer").html().split(' ')[1].split(':')[0]);
        var sec = parseInt($("#timer").html().split(' ')[1].split(':')[1]);
        if(sec == 0){
            sec = 59;
            min--;
        }
        else if(sec < 10){
            sec--;
            sec = '0' + sec;
        }
        else{
            sec--;
        }
        
        $("#timer").html("Timer: "+min+":"+sec);
        
        if(min == 0 & sec == 0){
            $("#btnStart").val("Start Game");
            $("#scoreScreen").dialog("open").html('Your score is ' + parseInt($("#score").html().split(' ')[1])).css("text-align","center");
            GameScore = parseInt($("#score").html().split(' ')[1]);
            stopFunction();
        }
        else{
            timerId = setTimeout(decrement,1000);           
        }

    },1000)
}

function stopFunction(){
    clearTimeout(timerId);
    clearInterval(imgTimerId);
    $("#timer").html("Timer: 0:20");
    $("#score").html("Score: 0");
    for(var i=0; i<$(".gameImgs").length; i++){
        $(".gameImgs")[i].src = (gameImgsPath + picSrcHole);            
    }
}




