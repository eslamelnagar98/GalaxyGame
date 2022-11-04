///<reference path="../../typings/globals/jquery/index.d.ts" />



$(".Navbar ul li a").mouseenter(function()
{
    $(this).css("color","#BF900F");
})
$(".Navbar ul li a").mouseleave(function()
{
    $(this).css("color","antiquewhite");
})
$(".Navbar h1,img").click(function()
{
    window.location="/index.html";
})
$(".FirstCard .startGame").click(function()
{
    window.location = "/Games/Star-Wars/star-Wars.html";
})
$(".SecondCard .startGame").click(function()
{
    window.location = "/Games/puzzleGame/Puzzle.html";
})
$(".ThirdCard .startGame").click(function()
{
    window.location = "/Games/suddenGame/Sudden-Game.html";
})
$(".FouthCard .startGame").click(function()
{
    window.location = "/Games/Space-Race/Space-Race.html";
})

// First Card Animation 
$(".FirstCard").mouseenter(function()
{
    $(this).animate({"top":"60px"},400,function()
    {
        $(".FirstCardInfo").animate({"top":"300px"},700);
        
    } )
    
})
$(".FirstCard").mouseleave(function()
{
    $(this).animate({"top":"80px"},300,function()
    {
        $(".FirstCardInfo").animate({"top":"600px"},300);
    })
})


// Second card animation 

$(".SecondCard").mouseenter(function()
{
    $(this).animate({"top":"60px"},400,function()
    {
        $(".SecondCardInfo").animate({"top":"300px"},700);
        
    } )
    
})
$(".SecondCard").mouseleave(function()
{
    $(this).animate({"top":"80px"},300,function()
    {
        $(".SecondCardInfo").animate({"top":"600px"},300);
    })
})


// Third Card Animation 
$(".ThirdCard").mouseenter(function()
{
    $(this).animate({"top":"710px"},400,function()
    {
        $(".ThirdCardInfo").animate({"top":"300px"},700);
        
    } )
    
})
$(".ThirdCard").mouseleave(function()
{
    $(this).animate({"top":"750px"},300,function()
    {
        $(".ThirdCardInfo").animate({"top":"600px"},300);
    })
})


// Fourth Card Animation

$(".FouthCard").mouseenter(function()
{
    $(this).animate({"top":"710px"},400,function()
    {
        $(".FourthCardInfo").animate({"top":"300px"},700);
        
    } )
    
})
$(".FouthCard").mouseleave(function()
{
    $(this).animate({"top":"750px"},300,function()
    {
        $(".FourthCardInfo").animate({"top":"600px"},300);
    })
});
var CommunityData= JSON.parse(localStorage.getItem('CommunityScores'));
var communityHeight = 800;
var communityFooterTop = 1050;
function DisplayCommunityData(Gamename){
    if(CommunityData!=null){
        communityHeight = 800;
        communityFooterTop = 1050;
        for( var i = 0 ; i<CommunityData.length; i++){
            $(".layerCommunityContent").css({height: communityHeight});
            $(".communityContent").css({height: communityHeight+200});
            $(".Footer").css({top: communityFooterTop});
            if(CommunityData[i]['game'] == Gamename){
                var data = $("<div class='Post'><h3>"+ CommunityData[i]['game']
                            +"</h3><h4 id='playerName'>"+CommunityData[i]['name']
                            +"</h4><h4 id='playerScore'>Score : "+CommunityData[i]['score']
                            +"</h4><p>"+CommunityData[i]['date']+"</p></div>");
                $(".layerCommunityContent").append(data);
                if(i>5){
                    communityHeight+=150; communityFooterTop+=150;
                    $(".layerCommunityContent").css({
                        height: communityHeight
                    })
                    $(".communityContent").css({
                        height: communityHeight+200
                    })
                    $(".Footer").css({
                        top: communityFooterTop
                    })
                }
            }
        }
    }
    else
    {
        alert("There Is no Any Data");
    }
}
$(".gamesNavbar ul li a").click(function()
{
    $(".layerCommunityContent").html(" ");
    DisplayCommunityData($(this).text());
    return false;
})
$(".gamesNavbar a").mouseenter(function()
{
    $(event.target).css({border:"solid 2px #ffffff",color:"#BF900F"}); 
})
$(".gamesNavbar a").mouseleave(function()
{
    $(event.target).css({border:"none",color:"#ffffff"});  
})

$(".FourthCardInfo a,.ThirdCardInfo a,.SecondCardInfo a,.FirstCardInfo a").mouseenter(function()
{
    $(event.target).css({border:"solid 2px #ffffff",color:"#BF900F"}); 
})
$(".FourthCardInfo a,.ThirdCardInfo a,.SecondCardInfo a,.FirstCardInfo a").mouseleave(function()
{
    $(event.target).css({border:"solid 2px #FFC828",color:"#ffffff"}); 
})

var availableTags = [
    "star-Wars",
    "Puzzle",
    "Sudden-Game",
    "Space-Race"];

  $("#searchBox").autocomplete({
    source: availableTags,
    select:function(event, ui) {
        if(ui.item.value=="star-Wars")
        {
            location="/Games/Star-Wars/star-Wars.html"; 
        }
        else if(ui.item.value=="Puzzle")
        {
            location="Games/puzzleGame/Puzzle.html";
        }
        else if(ui.item.value=="Sudden-Game")
        {
            location="/Games/suddenGame/Sudden-Game.html";
        }
        else if(ui.item.value=="Space-Race")
        {
            location="/Games/Space-Race/Space-Race.html";
        }
        
        
    }
    
  });




