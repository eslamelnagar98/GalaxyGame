///<reference path="./typings/globals/jquery/index.d.ts"/>

var Moves; //number of moves
var Scores; //local storage of scores
var Target, DropTarget, DropDivTarget,DragDivTarget; //image and grid (object and id)
var originalLeft, originalTop; //original position
var originalLeftArr = [], originalTopArr = []; //array for orginal positions
var imgRandomArr = []; //array for random numbers between 1-16
var randomNumber; //random number created
var rightPositions = 0; //number of successful drags
var imageFolder; //the folder of the selected image
var gameImgsPath = "/Games/puzzleGame/";

$(function(){

    //get number of moves done at the beginning "30"
    Moves = parseInt($("#No_Of_Moves").html().split(' ')[1]);
    
    Scores = JSON.parse(localStorage.getItem('CommunityScores')) || [];

    //animation for the game title at the top
    setInterval(function(){
        $("#title").css('border', '2px solid ' + getRandomColor())
    },500)
    
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
                if(!$("#usrName").val()){
                    alert("Please enter your name")
                }   
                else{
                    $(this).dialog("close");
                }
            },
            "Controls" : function(){
                $(this).children('p').html("Try to put the image parts in the right position, take care you are limited with certain number of moves").css({"text-align":"center","margin-top":10})
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
                    game : "Puzzle Photo",
                    score : (30 - Moves),
                    date : new Date().toLocaleString()
                }
                Scores.push(scoreObj);
                localStorage.setItem("CommunityScores",JSON.stringify(Scores));
                $('.ui-button:contains(Share Score)').hide();
            },
            "Play again" : function(){
                $(this).dialog("close");
                $("#btnReset").trigger('click');
            },
            "Another User" : function(){
                $(this).dialog("close");
                $("#welcomeScreen").dialog("open");
                $("#btnReset").trigger('click');
                $('.ui-button:contains(Share Score)').show();
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


    $("#playAgainScreen").dialog({
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
            "Play again" : function(){
                $(this).dialog("close");
                resetGame();
            },
            "Home": function(){
                $(this).dialog("close");
                location = "/index.html";
            },
            "Support Us" : function(){
                location = "/Games/Payment Page/payment.html";
            }
        }
    }); 
    
    //click event on the start button 
    $("#btnStart").on("click",(function(){
        if(!$("usrName").val()){
            $("#welcomeScree").dialog("open");
        }
        else if($("#selectImg").val() == null)
            {
                alert("You have to choose an image");
                return !event;
            }
            
        //get the original posion of photos at the beginning
        for(var i=0; i<16; i++){
            originalLeftArr.push($("#_"+(i+1)).position().left);
            originalTopArr.push($("#_"+(i+1)).position().top);
        }
        
        var selectedImage = parseInt($("#selectImg").val().split(' ')[1]);
        
        //detect the selected option of images
        switch(selectedImage){
            case 1:
                imageFolder = gameImgsPath+"/img1/";
                break;
            case 2:
                imageFolder = gameImgsPath+"/img2/";
                break;
            case 3:
                imageFolder = gameImgsPath+"/img3/";
                break;
        }
        
        $("#winImage").attr('src',imageFolder+"0.jpg")
        $("#winImage").offset({top:$("#CenterImagge").offset().top, left:$("#CenterImagge").offset().left});
        
        for(var i=0; i<16; i++){
            do{
                randomNumber = getRandomNumber(1,16); //create a random number and check if created before
            }
            while(checkNumber(randomNumber,imgRandomArr));
            
            $(`.${i+1}`).attr('src', imageFolder+randomNumber+".jpg");
            $(`.${i+1}`).attr('id', "_"+randomNumber);
            imgRandomArr.push(randomNumber);
        }
        // switch between the start and reset buttons
        $("#btnStart").attr("disabled", true); 
        $("#btnReset").attr("disabled", false);
    }));
    
    //click event on the reset button 
    $("#btnReset").on("click",function(){
        //reset the moves and switch between the start and reset buttons
        resetGame();
        
        //when resetting hide the grids, show the whole image and do fireworks at the back-ground
        $(".Puzzle_Img_Div").css("opacity",1);
        $("#winImage").animate({opacity: 0},0);
        $("body").css("background-image", "none");
    });
    
    //draggable functionality for the pics
    $(".Puzzle_Img_Div" ).draggable({
        start : function (event , ui){
            if(!checkMoves())
                return !event;  
            else if($("#selectImg").val() == null){
                alert("You have to choose an image");
                return !event;
            }
            else if($("#usrName").val() == ""){
                alert("Please enter your name");
                return !event;
            }
            else{
                Target = document.getElementById(this.id); //image dropped object
                Target.style.zIndex=100; 
                originalLeft = this.offsetLeft;
                originalTop = this.offsetTop;
            }
            $("#bodyDiv").droppable("enable");
        }
    });

    //droppable functionality for the grids
    $(".Pictures_in_Div").droppable({
        drop: function (event, ui) {
            DropTarget = document.getElementById(this.id); //drop area obj
            DropDivTarget= parseInt(DropTarget.getAttribute('id').replace('Img','')); //drop area id
            DragDivTarget = parseInt(Target.getAttribute('id').split('_')[1]); //image dropped id
            if(DropDivTarget==DragDivTarget){
                if(parseInt(Target.classList[1]) <= 6){
                    $(`#${Target.getAttribute('id')}`).offset({ top:DropTarget.offsetTop ,left:DropTarget.offsetLeft-12});
                }
                else{
                    $(`#${Target.getAttribute('id')}`).offset({ top:DropTarget.offsetTop ,left:DropTarget.offsetLeft});  
                }
                rightPositions++;//increment the number of successful drags
            }
            else if(DropDivTarget!=DragDivTarget){
                $(`#${Target.getAttribute('id')}`).offset({ top:originalTop ,left:originalLeft}); //revert the pic
            }
            $("#No_Of_Moves").html("Moves: " + --Moves); //update the number of moves
            Target.style.zIndex=1; 
            
            if(rightPositions == 16){
                $(".Puzzle_Img_Div").animate({opacity: 0},500); //hide image parts
                $("#winImage").animate({opacity: 1, zIndex : 1},250); //show the wining image 
                $("body").css("background-image", "url(fireworks.gif)"); //make celebration
                setTimeout($("#scoreScreen").dialog("open").children('p').html("Congratulations!!<br>You made it in " + (30-Moves) + " moves."),3000);
            }
            else if(Moves <= 0)
            {
                $("#playAgainScreen").dialog("open");
            }     
        },
        over : function(event, ui){
            $("#bodyDiv").droppable("disable"); //avoid bubbling
        },
    });
    
    //prevent dropping on any area except the grids
    $("#bodyDiv").droppable({
        drop: function(event, ui){
            $(`#${Target.getAttribute('id')}`).offset({ top:originalTop ,left:originalLeft});
        }
    })
    
    //function to get a random number between two numbers
    function getRandomNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    //function to get a random color
    function getRandomColor(){
        var colors = ["red","blue","green","yellow","black","orange"];
        return colors[getRandomNumber(0,colors.length-1)];
    }

    //function to check if a number exists in an array
    function checkNumber(number, arr){
        for(var i=0; i<arr.length; i++){
            if(arr[i] == number){
                return 1;
            }
        }
        return 0;
    }
    
    //function to check the number of moves made
    function checkMoves(){
        if(Moves > 0)
            return 1;
        return 0;
    }

    function resetGame(){
            $("#No_Of_Moves").html("Moves: 30");
            $("#btnStart").attr("disabled", false);
            $("#btnReset").attr("disabled", true);

            for(var i=0; i<16; i++){
                $(`.${i+1}`).offset({top:originalTopArr[i], left:originalLeftArr[i]});

            imgRandomArr = [];

            rightPositions = 0;

            Moves=30;
        }
    }
});

function displayScores(){
    var scoreList = JSON.parse(localStorage.getItem("CommunityScores"));
    for(var i=0; i<scoreList.length; i++)
        console.log(`Player ${scoreList[i].name} scored ${scoreList[i].score} in ${scoreList[i].game} on ${scoreList[i].date}`);
}