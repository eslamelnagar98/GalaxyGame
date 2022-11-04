$(function() {
    
    Scores = JSON.parse(localStorage.getItem("CommunityScores")) || [];

    var score1 = 0,
        score2 = 0;
    var GameOver = false;
    var cfrm;
    var msg;
    var leftObsArr = [];
    var rightObsArr = [];
    var obs_timer_left;
    var obs_timer_right;
    var _calcDistanceInterval;
    var rocket_width_height = 50;
    var obstcle_width_height = 20;
    var grid_width_height = 609;
    var Obs = function() {
        this.bullet = $("<div></div>");
        var b = this.bullet;
        b.addClass("obs");
        $("#space").append(b);
    };

    $("#welcomeScreen").dialog({
        resizable : false,
        width : 400,
        modal : true,
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
                if(!$("#usrName1").val() || !$("#usrName2").val()){
                    alert("Please enter both your names")
                }   
                else{
                    $(this).dialog("close");
                    startGame();
                }
            },
            "Controls" : function(){
                $(this).children('p').html("<b>Player '1'</b> on the right <b>Up/Down</b> <br><b>Player '2'</b> on the left <b>W/S</b>").css({"text-align":"center","margin-top":10})
            }
        }
    }); 

    $("#scoreScreen").dialog({
        autoOpen : false,
        resizable : false,
        modal : true,
        width : 500,
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
                var playerOneName = $("#usrName1").val();
                var playerTwoName = $("#usrName2").val();
                var winner, winnerScore;

                if (score1 > score2)        
                {
                    winner = playerOneName;
                    winnerScore = score1;
                }
                else if (score1 == score2)
                {
                    winner = "Draw";
                }              
                else
                {
                    winner = playerTwoName;
                    winnerScore = score2;
                }             

                if(winner != "Draw"){
                    var scoreObj = {
                        name : winner,
                        game : "Space Race",
                        score : winnerScore,
                        date : new Date().toLocaleString()
                    }
                    Scores.push(scoreObj);
                    localStorage.setItem("CommunityScores",JSON.stringify(Scores));
                    $('.ui-button:contains(Share Score)').hide();
                }
            },
            "Play again" : function(){
                reSet();
                $(this).dialog("close");
                $('.ui-button:contains(Share Score)').show();
                GameOver = false;
            },     
            "Home": function(){
                $(this).dialog("close");
                $('.ui-button:contains(Share Score)').show();
                location = "/index.html";              
            },
            "Support Us" : function(){
                $('.ui-button:contains(Share Score)').show();
                location = "/Games/Payment Page/payment.html";
            }
        }
    });

    function startGame() {
        document.addEventListener("keydown", control)
        startTime();
        //initialize each array with 10 obs objects
        for (var i = 0; i < 10; i++) {
            GenerateLeftObs();
            GenerateRightObs();
        }
        animateObs();
        calcDistanceInterval();
    };
    function startTime() {
        $("#timer").animate({ height: 0 }, 40000, function() {
            GameIsOver();
            $("#timer").css("background-color", "rgb(62, 207, 252)");
        })
        var warningTimer = setInterval(function() {
            if (parseInt($("#timer").css("height")) <= 60) {
                $("#timer").css("background-color", "red");
                clearInterval(warningTimer);
            }
        }, 30)
    }
    function control(event) {
        if (!GameOver) {
            if (event.key == "ArrowUp")
                moveUp("player1")
            else if (event.key == "ArrowDown")
                moveDown("player1")
            else if (event.key == "w")
                moveUp("player2")
            else if (event.key == "s")
                moveDown("player2")
        }
    }
    function moveUp(player) {
        var playerBottom = parseInt(getComputedStyle(document.getElementById(player)).bottom);
        if (playerBottom >= (grid_width_height - rocket_width_height)) {
            document.getElementById(player).style.bottom = "0px";
            if (player == "player1") {
                $("#score1").html(++score1);
            } else if (player == "player2") {
                $("#score2").html(++score2);
            }
        } else {
            document.getElementById(player).style.bottom = (playerBottom + 20) + "px";
        }
    }
    function calculateDistance(x1, y1, x2, y2) {
        var distance = Math.floor(Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2)));
        if (distance < (rocket_width_height / 2) + (obstcle_width_height / 2))
            return true;
    }
    function moveDown(player) {
        var playerBottom = parseInt(getComputedStyle(document.getElementById(player)).bottom);
        if (playerBottom <= 0)
            document.getElementById(player).style.bottom = "0px";
        else 
            document.getElementById(player).style.bottom = (playerBottom - 20) + "px";
    }
    function GameIsOver() {
        var playerOneName = $("#usrName1").val();
        var playerTwoName = $("#usrName2").val();
        if (score1 > score2) 
            msg = playerOneName +" won";
         else if (score1 == score2) 
            msg = "Draw";
         else 
            msg = playerTwoName +" won";
        $("#scoreScreen").children('p').html("Good game ," + msg);
        $("#scoreScreen").dialog("open");
        // reSet();
        // cfrm = confirm(msg + " Do you want to play again?");
        // if (cfrm) 
        //     GameOver = false;
        clearInterval(obs_timer_left);
        clearInterval(obs_timer_right);
        clearInterval(_calcDistanceInterval);
    }
    function reSet() {
        score1 = score2 = 0;
        $("#score1").html(" ");
        $("#score2").html(" ");
        GameOver = true;
        $("#timer").css("height", "150px");
        $("#player1").css("bottom", "0px");
        $("#player2").css("bottom", "0px");
        startTime();
        animateObs();
        calcDistanceInterval();
    }
    function GenerateLeftObs() {
        var obs_Object = new Obs();
        var random_left = Math.round(Math.random() * 400);
        var random_bottom = Math.round(Math.random() * 450);
        $(obs_Object.bullet).css({
            left: "-" + random_left + "px",
            top: random_bottom + "px"
        });
        leftObsArr.push(obs_Object);
    };
    function GenerateRightObs() {
        var obs_Object = new Obs();
        var random_left = Math.round(Math.random() * 400);
        var random_bottom = Math.round(Math.random() * 450);
        $(obs_Object.bullet).css({
            right: "-" + random_left + "px",
            top: random_bottom + "px"
        });
        rightObsArr.push(obs_Object);
    };
    function animateObs() {
        obs_timer_left = setInterval(function() {
            for (var i in leftObsArr) {
                var left_value = parseInt(leftObsArr[i].bullet.css("left")) + 20;
                leftObsArr[i].bullet.css("left", left_value);
                if (left_value > grid_width_height) {
                    leftObsArr[i].bullet.remove();
                    leftObsArr.splice(i, 1);
                    GenerateLeftObs();
                }
            }
        }, 500);
        obs_timer_right = setInterval(function() {
            for (i in rightObsArr) {
                var right_value = parseInt(rightObsArr[i].bullet.css("right")) + 20;
                rightObsArr[i].bullet.css("right", right_value);
                if (right_value > grid_width_height) {
                    rightObsArr[i].bullet.remove();
                    rightObsArr.splice(i, 1);
                    GenerateRightObs();
                }
            }
        }, 300);
    }
    function calcDistanceInterval() {
        _calcDistanceInterval = setInterval(function() {
            for (i in rightObsArr) {
                var right_left_value = parseInt(rightObsArr[i].bullet.css("left"));
                var right_bottom_value = parseInt(rightObsArr[i].bullet.css("bottom"));
                detectCollision("player1", right_left_value , right_bottom_value);
                detectCollision("player2", right_left_value , right_bottom_value);
            }
            for (var i in leftObsArr) {
                var left_value = parseInt(leftObsArr[i].bullet.css("left"));
                var left_bottom_value = parseInt(leftObsArr[i].bullet.css("bottom"));
                detectCollision("player1", left_value-20 , left_bottom_value-10);
                detectCollision("player2", left_value -20, left_bottom_value-10);
            }
        }, 30)
    }
    function detectCollision(player, left_val, bottom_val) {
        var playerBottom = parseInt(getComputedStyle(document.getElementById(player)).bottom);
        var playerLeft = parseInt(getComputedStyle(document.getElementById(player)).left);
        var collision = calculateDistance(playerLeft, playerBottom,left_val,bottom_val);
        if (collision) {
            $("#" + player).animate({ "bottom": "0" }, 500)
        }
    }
})