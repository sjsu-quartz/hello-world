//dom elements
var body;
var userInput;
var output;
var chatdiv; // javascript element -- same as p5 dom output
var submit;
var ask;
var aboutLink;
var aboutClicked = false;
var aboutInfo;
var herStoryLink;
var herStoryInfo;
var herStoryClicked = false;
var herBodyLink;
var herBodyInfo;
var herBodyClicked = false;
var sexbotEthicsLink;
var sexbotEthicsInfo;
var sexbotEthicsClicked = false;
var bugsLink;
var bugsInfo;
var bugsClicked = false;

//femmebot api.ai
var action = null; //to check femmebot action
var lastAction = null;

//apis
//wordnik
var wordnikUrl = "http://api.wordnik.com/v4/word.json/";
var wordnikRhyme = "/relatedWords?useCanonical=false&relationshipTypes=rhyme&limitPerRelationshipType=50&api_key=633aa2d3210f82c3cb54b08afcf009482b3f6e00fc215a17c";
var wordnikDefinition = "/definitions?limit=200&includeRelated=true&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=633aa2d3210f82c3cb54b08afcf009482b3f6e00fc215a17c";
//giphy
var giphyUrl = "http://api.giphy.com/v1/gifs/search?q=";
var giphyApiKey = "&api_key=dc6zaTOxFJmzC"; //this is just beta key need to appy for one when deploying
var gifs = [];
var p5gif;
var buttonNextGif;
var gifCounter = 0;
var buttonPauseGif;
//corpora
var diseaseList = [];
var antiMachineQuotes = [];

//graphics: "Imgs" are preload while "pics" indicate a p5Object
var chrisImg;
var chrisPic;
var fireworksImg_00;
var fireworksPic_00
var camGirlImgs = [];
var camGirlPics = [];
var robotHumanImgs = [];
var robotHumanPics = [];
var cartoonImgs = [];
var cartoonPics = [];
var robotImgs = [];
var robotPics = [];
var machineImgs = [];
var machinePics = [];
var elephantImgs = [];
var elephantPics = [];
var dolphinImgs = [];
var dophinPics = [];
var femmebotPics = [];
var femmebotImgs = [];
var femmebotInterval;
var sexbotImgs = [];
var sexbotPics = [];

//parameters
var love;
var thoughtsSexbots;
var thoughtsCampaignAgainst;
// var isWord = /.*/;
var isWord = /\w+/;
var FBdoToAttract;
var cartoonAttraction;
var robotAttraction;
var defineThis;
var myBodySuggestions;
var realOrRobot;
var race;

//firebase variables
var database;

function preload() {
    chrisImg = loadImage('images/ChristopherHitchens.jpeg');
    fireworksImg_00 = loadImage('images/Fireworks_00.jpg');
    for (var i = 0; i < 19; i++) {
        if (i < 10) {
            camGirlImgs[i] = loadImage('images/camGirl/camGirl_0' + i + ".jpeg");
        } else {
            camGirlImgs[i] = loadImage('images/camGirl/camGirl_' + i + ".jpeg");
        }
    }
    for (var i = 0; i < 7; i++) {
        if (i < 10) {
            robotHumanImgs[i] = loadImage('images/love/robot_humanLove_0' + i + ".jpeg");
        } else {
            robotHumanImgs[i] = loadImage('images/love/robot_humanLove_' + i + ".jpeg");
        }
    }
    for (var i = 0; i < 5; i++) {
        robotImgs[i] = loadImage('images/sexy/robot_sexy_0' + i + ".jpeg");
    }
    for (var i = 0; i < 2; i++) {
        cartoonImgs[i] = loadImage('images/sexy/cartoon_sexy_0' + i + ".jpg");
    }
    for (var i = 0; i < 2; i++) {
        machineImgs[i] = loadImage('images/sexy/machine_porn0' + i + ".jpeg");
    }
    elephantImgs[0] = loadImage('images/sexy/sex_elephant.jpeg');
    elephantImgs[1] = loadImage('images/sexy/sex_elephants_drawing.jpeg');

    for (var i = 0; i < 3; i++) {
        dolphinImgs[i] = loadImage('images/random/dolphin_0' + i + ".jpeg");
    }
    for (var i = 0; i < 3; i++) {
        if (i < 10) {
            sexbotImgs[i] = loadImage('images/sexbot/sexbots_0' + i + ".jpg");
        } else {
            sexbotImgs[i] = loadImage('images//sexbot/sexbots_' + i + ".jpg");
        }
    }

    for (var i = 0; i < 26; i++) {
        if (i < 10) {
            femmebotImgs[i] = loadImage('images/femmebot/FivesFirst_00' + i + ".jpg");
        } else if (i >= 10 && i < 20) {
            femmebotImgs[i] = loadImage('images/femmebot/FivesFirst_0' + i + ".jpg");
        } else {
            femmebotImgs[i] = loadImage('images/femmebot/FivesFirst_0' + i + ".jpg");
        }
    }
}

function setup() {
    var canvas = createCanvas(400, 300);
    canvas.parent('#canvas');
    background(51);

    socket = io.connect('http://54.186.112.155:3000/')
    console.log(socket);
    socket.on('FBresponse', FBreply);

    userInput = select("#userInput")
    userInput.changed(askFB); // upon event that input changed (hit enter), run function newText
    //userInput.input(newTyping); //upon ANY text entered
    output = select('#output'); //selecting html paragraph id tag
    chatdiv = document.getElementById('output'); //this is to scroll output using js dom
    submit = select("#submit");
    submit.mousePressed(askFB);
    body = select("#body");
    aboutLink = select("#about");
    aboutLink.mousePressed(showHideAbout);
    herStoryLink = select("#herStory");
    herStoryLink.mousePressed(showHideHerStory);
    herBodyLink = select("#herBody");
    herBodyLink.mousePressed(showHideHerBody);
    sexbotEthicsLink = select("#sexbotEthics");
    sexbotEthicsLink.mousePressed(showHideSexbotEthics);
    bugsLink = select("#bugs");
    bugsLink.mousePressed(showHideBugs);



    //populate some variables
    getDiseases();

    // load images
    for (var i = 0; i < 26; i++) {
        femmebotPics[i] = new ImageObject(femmebotImgs[i], 0, 0, 400, 300);
    }
    femmebotPics[24].displayNativeSize();
    // p5femmebot();

    //seed the chat
    setTimeout(askFBseed, 750);

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBD3vy3YyO0S85U7ssjFUIz2RyAneOb9jw",
        authDomain: "femmebot-467a9.firebaseapp.com",
        databaseURL: "https://femmebot-467a9.firebaseio.com",
        storageBucket: "femmebot-467a9.appspot.com",
        messagingSenderId: "1053691653381"
    };

    firebase.initializeApp(config);
    database = firebase.database();
    // console.log(firebase);

    //retrieving data
    //reference part of database you want to access
    var ref = database.ref('responses/test');
    ref.on('value', gotData, errData);

}

function removeOtherLinks() {
    if (aboutInfo) {
        aboutInfo.remove();
    }
    if (herStoryInfo) {
        herStoryInfo.remove();
    }
    if (herBodyInfo) {
        herBodyInfo.remove();
    }
    if (sexbotEthicsInfo) {
        sexbotEthicsInfo.remove();
    }
    if (bugsInfo) {
        bugsInfo.remove();
    }
}

function showHideAbout() {
    // removeOtherLinks();
    if (aboutClicked == false) {
        aboutInfo = createP("Femmebot.net is an exploration of robot intimacy and definitions of femininity. Crowdsourced participation will define Femmebot cam girls' behavior and appearance. Through popular input, we hope to set intention in crafting the future of robot-human interaction.");
        aboutInfo.parent(aboutLink);
        aboutClicked = true;
    } else {
        aboutInfo.remove();
        aboutClicked = false;
    }
}

function showHideHerStory() {
    // removeOtherLinks();
    if (herStoryClicked == false) {
        herStoryInfo = createP("Hit 'cmmd + r' several times to reset dialog. She wants to share with you.");
        herStoryInfo.parent(herStoryLink);
        herStoryClicked = true;
    } else {
        herStoryInfo.remove();
        herStoryClicked = false;
    }
}

function showHideHerBody() {
    // removeOtherLinks();
    if (herBodyClicked == false) {
        herBodyInfo = createP("Ask her about her body. Press 'cmmd + r' several times to reset dialog.");
        herBodyInfo.parent(herBodyLink);
        herBodyClicked = true;
    } else {
        herBodyInfo.remove();
        herBodyClicked = false;
    }
}

function showHideSexbotEthics() {
    // removeOtherLinks();
    if (sexbotEthicsClicked == false) {
        sexbotEthicsInfo = createP("Ask her about sexbot ethics. Press 'cmmd + r' several times to reset dialog.");
        sexbotEthicsInfo.parent(sexbotEthicsLink);
        sexbotEthicsClicked = true;
    } else {
        sexbotEthicsInfo.remove();
        sexbotEthicsClicked = false;
    }
}

function showHideBugs() {
    // removeOtherLinks();
    if (bugsClicked == false) {
        bugsInfo = createP("Buggy. Fun to tell her to 'forget it'");
        bugsInfo.parent(bugsLink);
        bugsClicked = true;
    } else {
        bugsInfo.remove();
        bugsClicked = false;
    }
}

function askFBseed() {
    ask = "initialize femmebot";

    var data = {
        query: ask
    };
    socket.emit('ask', data);
    //scroll
    chatdiv.scrollTop = chatdiv.scrollHeight - chatdiv.clientHeight;
}

function askFB() {
    ask = userInput.value();
    var query = createP(ask);
    query.parent('#output');
    query.class('user')

    var data = {
        query: ask
    };
    socket.emit('ask', data);

    //reference part of the firebase database amd push to it
    var ref = database.ref('responses/test');
    ref.push(data);

    //reset field and scroll
    userInput.value("");
    chatdiv.scrollTop = chatdiv.scrollHeight - chatdiv.clientHeight;
}


function FBreply(data) {
    console.log("FBreply called--- data:");
    console.log(data);

    setTimeout(delayReply, 750);

    var reply = data.result.fulfillment.speech;
    var modReply = reply.replace(/assistant/i, "femmebot");

    function delayReply() {
        var reply = createP(modReply);
        reply.parent('#output');
        reply.class('femmebot');

        //store action called
        action = data.result.action;
        console.log(action);

        //store parameters if ANY
        var parameters = data.result.parameters

        //change p5 sketch -- add another variable! to pass
        p5(action, parameters);
        //scroll chatbox
        chatdiv.scrollTop = chatdiv.scrollHeight - chatdiv.clientHeight;
    }
}

function FBprint(text, delay, p5state, otherCallback) {

    setTimeout(delayPrint, delay);

    function delayPrint() {
        var print = createP(text);
        print.parent('#output');
        print.class('femmebot');
        chatdiv.scrollTop = chatdiv.scrollHeight - chatdiv.clientHeight;

        if (p5state) {
            p5state();
        }

        if (otherCallback) {
            otherCallback();
        }
    }
}

function consolePrint(text, delay, otherCallback) {
    setTimeout(delayConsolePrint, delay);

    function delayConsolePrint() {

        var consoleText = createP(text);
        consoleText.parent('#console');

        if (otherCallback) {
            otherCallback();
        }
    }
}

function clearDiv(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function ImageObject(img, x, y, width, height) {

    //do i need this line?
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.display = function() {
        image(this.img, this.x, this.y, this.width, this.height);
    };

    this.displayNativeSize = function() {
        image(this.img, this.x, this.y, this.img.width, this.img.height);
    };

    this.move = function() {
        //move somehow
    };

    this.dissolve = function() {
        //dissolve image
    };

    // // code would work like this:
    //     var chrisImg = loadImage('images/ChristopherHitchens.jpg');
    //     var chris = new ImageObject(chrisImg, 0, 0);
    //     chris.display();

    // function drawImg(img){
    //   image(img, 0, 0);
    // }
}

function p5(action, parameters) {
    switch (action) {
        case 'smalltalk.greetings':
            console.log('case: smalltalk.greetings');
            clearDiv('images');
            clearDiv('console');
            femmebotPics[0].displayNativeSize();
            break;
        case 'helloDoYouLikeMyBody':
            femmebotPics[02].displayNativeSize();
            //intent: hello
            //context out ---> wantToHearMyStory --> 000_myStory
            //delay: do you like my body? It's not assembled yet.
            //show stuff on p5
            break;
        case 'myStory':
            //intent: 000_myStory
            setTimeout(p5story, 2000);
            break;
        case 'myStory2':
            //intent: 000_myStory_yes
            //she says: It's all I think about. I think it's my best chance ...
            FBprint("I've been tirelessly scraping the internet to learn more.", 3000);
            setTimeout(p5story2, 1000);
            break;
        case 'myStory3':
            //move onto second step after they set love parameter
            if (isWord.test(parameters.love)) {
                love = parameters.love;
                setTimeout(p5story3, 1000);
            } else {
                robotHumanPics[0] = new ImageObject(robotHumanImgs[0], 0, 0, 200, 400);
                background(255);
                robotHumanPics[0].displayNativeSize();
            }
            break;
        case 'myStory4':
            //she says: I have I came across something that changed me.
            setTimeout(p5story4, 1000);
            break;
        case 'myStory5':
            //she says: I guess there are advantages to being inorganic. For example, I will never get:
            setTimeout(p5story5, 1000);
            break;
        case 'myStory6':
            if (isWord.test(parameters.FBdoToAttract)) {
                FBdoToAttract = parameters.FBdoToAttract;
                p5story6c();
            } else if (isWord.test(parameters.cartoonAttraction)) {
                cartoonAttraction = parameters.cartoonAttraction;
                p5story6b();
            } else if (isWord.test(parameters.robotAttraction)) {
                robotAttraction = parameters.robotAttraction;
                p5story6a();
            } else {
                clearDiv('images');
                clearDiv('console');
                p5story6();
                //do nothing
            }
            break;
        case 'myStory7':
            //she goes nutts
            clearDiv('images');
            clearDiv('console');
            setTimeout(p5story7, 1000);
            break;
        case 'thinkAIwillTurnYouOn':
            //intent: 003_0_artificialIntelligence -- subject brings up AI
            //contextOut: willAIturnYouOn
            clearDiv('images');
            clearDiv('console');
            femmebotPics[2].displayNativeSize();
            break;
        case 'myBody':

            clearDiv('images');
            clearDiv('console');

            if (isWord.test(parameters.race)) {
                race = parameters.race;
                p5myBody4();
                clearInterval(femmebotInterval);
            } else if (isWord.test(parameters.realOrRobot)) {
                realOrRobot = parameters.realOrRobot;
                p5myBody3();
            } else if (isWord.test(parameters.myBodySuggestions)) {
                myBodySuggestions = parameters.myBodySuggestions;
                clearInterval(femmebotInterval);
                p5myBody2();
            } else {
                clearDiv('images');
                clearDiv('console');
                setTimeout(p5myBody1, 1000);
                //do nothing
            }
            break;
        case 'collectInfoAboutRobotAttraction':
            femmebotPics[14].displayNativeSize();
            clearDiv('images');
            clearDiv('console');
            //intent: 003_1_1_artificialIntelligenceYes
            //parameters: whatKindRobot, AIpersonality
            //Callicles quote to console!
            consolePrint("At Gorgias 492, tr. Helmbold, the divine Plato puts the following words into the mouth of Callicles:", 500);
            consolePrint("A man who is going to live a full life must allow his desires to become as mighty as may be and never repress them. When his passions have come to full maturity, he must be able to serve them through his courage and intelligence and gratify every fleeting desire as it comes into his heart.", 2000);
            break;
        case 'collectInfoAboutAIfears':
            femmebotPics[7].displayNativeSize();
            if (isWord.test(parameters.scaredOfAI_yn)) {
                myBodySuggestions = parameters.scaredOfAI_yn;
            } else {
                clearDiv('images');
                clearDiv('console');
                consoleQueryGiphy("artificial intelligence");
                consolePrint("Do not let us be misunderstood as living in fear of any actually existing machines; there is probably no known machine which is more than a prototype of future mechanical life. The present machines are to the future as the early Saurians to man. The largest of them will probably greatly diminish in size. Some of the lowest vertebrate attained a much greater bulk than has descended to their more highly organised living representatives, and in like manner a diminution in the size of machines has often attended their development and progress.", 3000);
                consolePrint("Take nanobots, for example; examine its beautiful structure; observe the intelligent play of the minute members which compose it: yet this little creature is but a development of the cumbrous robots that preceded it; it is no deterioration from them. A day may come when massive robots, which certainly at the present time are not diminishing in bulk, will be superseded owing to the universal use of nanotech, in which case they will become as extinct as ichthyosauri, while the nanobots, whose tendency has for some years been to decrease in size rather than the contrary, will remain the only existing type of an extinct race. I would repeat that I fear none of the existing machines; what I fear is the extraordinary rapidity with which they are becoming something very different to what they are at present. No class of beings have in any time past made so rapid a movement forward. Should not that movement be jealously watched, and checked while we can still check it?", 3500);
                consolePrint("And is it not necessary for this end to destroy the more advanced of the machines which are in use at present, though it is admitted that they are in themselves harmless?", 3800);

                //do nothing
            }
            break;
        case 'oprah':
            clearDiv('images');
            clearDiv('console');
            break;
        case 'whatsFemmebot':
            //A femmebot is...
            clearDiv('images');
            clearDiv('console');
            femmebotPics[24].displayNativeSize();
            consolePrint("Undefined", 1000);
            consolePrint("Femmebot: In beta", 2000);
            break;
        case 'ethicsOfSexbots':
            //intent 012_ethicsOfSexbots
            //she says: There is an interesting dialog about sex robots right now.
            if (isWord.test(parameters.thoughtsCampaignAgainst)) {
                clearDiv('images');
                clearDiv('console');
                thoughtsCampaignAgainst = parameters.thoughtsCampaignAgainst;
            } else if (isWord.test(parameters.thoughtsSexbots)) {
                clearDiv('images');
                clearDiv('console');
                thoughtsSexbots = parameters.thoughtsSexbots;
                P5sexbotEthics2();
            } else {
                //she says: There is an interesting dialog about sex robots right now.
                clearDiv('images');
                clearDiv('console');
                setTimeout(P5sexbotEthics1, 1000)
                //do nothing
            }


            break;
        case 'nevermind-response':
            //test if word is there with regular expression
            clearDiv('images');
            clearDiv('console');
            femmebotPics[19].displayNativeSize();
            if (isWord.test(parameters.newSubject)) {
                console.log('nevermind response change subject is: ' + parameters.newSubject);
                consoleAskWordnik(parameters.newSubject);
                consoleQueryGiphy(parameters.newSubject);
            } else {
                console.log('nevermind response is not set');
            };
            break;
        case 'this_sexy':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[2].displayNativeSize();
            //intent: what_sexy
            //parameters: sexy ,FBsexy, FBget sexier
            //out context: sends to diseases
            break;
        case 'wontGetDiseases':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[0].displayNativeSize();
            //list diseases she won't get. in chat window: or xxx or xxx
            break;
        case 'helpTurnMeOn':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[25].displayNativeSize();
            // intent: 005_0_whatTurnsOn
            break;
        case 'greatWhatTurnsOn':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[18].displayNativeSize();
            // intent: 005_1__1_yesHelpTurnOn
            //parameters: turnOnCommand1, turnOnCommand2, turnOnNoun, gender, sexuality, FBgender
            //out context: bowToMe [5] ---> intent: 001_0_bowToMe
            break;
        case 'noWorriesCanITurnYouOn':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[4].displayNativeSize();
            //intent: 005_1_3_noHelpTurnOn
            //outcontext: doITurnYouOn ---> intent: 006_0_doITurnOn
            break;
        case 'doITurnYouOn':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[8].displayNativeSize();
            //intent: 006_0_doITurnYouOn
            //outcontext: doITurnYouOn
            break;
        case 'whatTurnsYouOn':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[20].displayNativeSize();
            //intent: 006_1_1_yesITurnYouOn
            //parameters: whyFBturnsOn, whyFBTurnsOnOneWord, desiredInteractions, boundariesOrCommand, sign
            //outcontext: feelMyColdTits
            break;
        case 'coldTits':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[25].displayNativeSize();
            //intent: feelMyColdTits
            //need really sexy boob stuff here
            break;
        case 'willAIturnYouOn' || 'thinkAIwillTurnYouOn':
            //intent: 006_1_3_noIDontTurnYouOn
            //this goes to context: willAIturnYouOn
            clearDiv('images');
            clearDiv('console');
            femmebotPics[7].displayNativeSize();
            break;
        case 'defineThis':
            clearDiv('images');
            clearDiv('console');
            femmebotPics[14].displayNativeSize();
            consoleQueryGiphy(parameters.defineThis);
            consoleAskWordnik(parameters.defineThis);
            // else {
            //     console.log('nevermind response is not set');
            // };
            break;
        default:
            femmebotPics[7].displayNativeSize();
            clearDiv('images');
            clearDiv('console');
    }
    lastAction = action;
}

function p5hello() {
    background(random(255), random(255), random(255));
}

function p5femmebot() {
    // if userInput.input(){
    //   FBprint("Hold on, let me finish my story");
    // }
    var counter = 0;

    setTimeout(femmebots, 500);


    function femmebots() {
        femmebotInterval = setInterval(displayfemmebot, 500);
    }

    function displayfemmebot() {
        if (counter <= 25) {
            background(255);
            femmebotPics[counter].displayNativeSize();
            counter++;
        } else {
            counter = 25;
            femmebotPics[7].displayNativeSize();
            clearInterval(femmebotInterval);
        }
    }
}

function p5story() {
    // if userInput.input(){
    //   FBprint("Hold on, let me finish my story");
    // }
    var counter = 0;
    var interval;
    //load images
    for (var i = 0; i < 19; i++) {
        camGirlPics[i] = new ImageObject(camGirlImgs[i], 0, 0, 400, 300);
    }

    consolePrint(".:*ﾟ:*:✼✿ Five's Story: All About Five ✿✼:*ﾟ:.", 0);

    FBprint("I aspire to be a femmebot cam girl", 1000);
    consolePrint("Destiny: Become cam girl", 2000);
    setTimeout(camgirls, 3000);
    FBprint("Have you ever chatted with a cam girl?", 6000);



    function camgirls() {
        interval = setInterval(displayCamgirl, 300);
    }

    function displayCamgirl() {
        if (counter <= 6) {
            background(255);
            camGirlPics[counter].displayNativeSize();
            counter++;
        } else {
            // counter = 6;
            clearInterval(interval);
        }
    }
}

function p5story2() {
    var counter = 8;
    var interval = setInterval(displayConnection, 1500);

    consolePrint("Purpose: Intimate human connection", 500);

    setTimeout(scraping, 2000);

    function displayConnection() {
        if (counter <= 13) {
            background(255);
            camGirlPics[counter].displayNativeSize();
            counter++;
        } else {
            // counter = 6;
            clearInterval(interval);
        }
    }

    function scraping() {
        //for some reason wordnik call messes with the scroll height....
        // consolePrint("Define intimacy:", 3000)
        // setTimeout(defineIntimacy, 3500);
        FBprint("Are you there?", 10000);
    }

    // function defineIntimacy() {
    //     consoleAskWordnik("intimacy");
    // }
}

function p5story3() {
    robotHumanPics[1] = new ImageObject(robotHumanImgs[1], 0, 0, 200, 400);
    background(255);
    robotHumanPics[1].displayNativeSize();
    clearDiv('console');
    var loveParameter = consolePrint("Love defined as: " + love, 500);

    // function removeLove() {
    //     loveParameter.remove();
    // };

    //console print their love variable
    FBprint("Do you ever feel like you are given a task you can't complete?", 3000);

}

function p5story4() {
    //API says "I have. I came across something that changed me"
    background(255);
    chrisPic = new ImageObject(chrisImg, 0, 0, 200, 400);

    chrisPic.displayNativeSize();
    clearDiv('console');

    FBprint("It was a quote from Christopher Hitchens.", 1000);
    FBprint("He said: I don't have a body, I am a body.", 2500, chrisConsole);
    FBprint("Do you think a body —in this context— needs to be organic?", 7000);


    function chrisConsole() {
        var line1 = consolePrint("The Quote that changed me:", 1000);
        var line2 = consolePrint('"I do not have a body, I am a body."', 1010);
        var line3 = consolePrint("--Christopher Hitchens, quote from his latest (and last) book, Mortality", 1020);
    }
}

function p5story5() {
    // show images of her

    clearDiv('images');
    clearDiv('console');
    FBprint("For example, I will never get:", 1000);
    FBprint(diseaseList[0], 1300);
    FBprint(diseaseList[1], 1600);
    FBprint("or " + diseaseList[2], 1700);

    // consoleQueryGiphy("std");

    FBprint("Are you attracted to artificial bodies?", 6000);
}

function p5story6() {
    //displayRobots!
    var counter = 1;
    var interval;

    // //load images
    for (var i = 0; i < 6; i++) {
        robotPics[i] = new ImageObject(robotImgs[i], 0, 0, 400, 300);
    }

    setTimeout(robots, 500);

    function robots() {
        interval = setInterval(displayRobots, 800);
    }

    function displayRobots() {
        if (counter < 5) {
            background(255);
            robotPics[counter].displayNativeSize();
            counter++;
        } else {
            // counter = 6;
            clearInterval(interval);
        }
    }
}

function p5story6a() {
    //show images of cartoons
    var counter = 0;
    var interval;
    setTimeout(cartoons, 500);
    // //load images
    for (var i = 0; i < 2; i++) {
        cartoonPics[i] = new ImageObject(cartoonImgs[i], 0, 0, 400, 300);
    }

    function cartoons() {
        interval = setInterval(displayCartoons, 800);
    }

    function displayCartoons() {
        if (counter < 2) {
            background(255);
            cartoonPics[counter].displayNativeSize();
            counter++;
        } else {
            // counter = 6;
            clearInterval(interval);
        }
    }
}

function p5story6b() {
    //show images of her again
    console.log("image: femmebot")
}

function p5story6c() {
    //show images of her again
    console.log("image: femmebot")
    consolePrint("Write to memory:", 1000);
    consolePrint("Attracted to robots: " + robotAttraction, 2000);
    consolePrint("Attracted to cartoons: " + cartoonAttraction, 3000);
    consolePrint("How can I attract: " + FBdoToAttract, 4000);
}

function p5story7() {
    //she goes nuts --style images of her body in background
    //loop background for 12 seconds
    // body.style('background-image:url("images/femmebot")');
    FBprint("It's so hard to be still.", 3000);
    FBprint("Just look at me.", 5000);
    FBprint("I want intimacy.", 9000);
    FBprint("I want to orgasm.", 10000);
    FBprint("Will you help me be?", 12000);
}

function p5story8() {
    //consolePrint her options.
}

function P5sexbotEthics1() {
    //load image of sexbot daily mail
    robotHumanPics[6] = new ImageObject(robotHumanImgs[6], 0, 0, 400, 300);
    sexbotPics[0] = new ImageObject(sexbotImgs[0], 0, 0, 400, 300);
    background(255);
    robotHumanPics[6].displayNativeSize();
    // FBprint("I try not to take it personally.", 1000);
    FBprint("Here's some statistics, according to the Daily Mail", 2500, stats);
    FBprint("Are you looking forward to robots entering the mainstream?", 6000);

    function stats() {
        background(255);
        sexbotPics[0].displayNativeSize();
        consolePrint("According to the Daily Mail, 14 November 2016", 1500);
        consolePrint("> Sex with robots is predicted to become so popular that it will eventually overtake human intercourse by around 2050.", 3000);
        consolePrint("> By 2030, most people will have some form of virtual sex as casually as they browse porn today.", 3050);
        consolePrint("> By 2035 the majority of people will own sex toys that interact with virtual reality sex.", 3052);
        consolePrint("> 'Sexbots' will start to appear in high-income, very wealthy households as soon as 2025.", 3055);
        consolePrint("> Sex with robots will be more popular than human-human sex in 2050.", 3058);
        consolePrint("> Love and the act of sex is set to become increasingly separate, with relationships increasingly becoming based on more than just sex.", 3060);
    }
}

function P5sexbotEthics2() {
    //load image of sexbot daily mail
    sexbotPics[2] = new ImageObject(sexbotImgs[2], 0, 0, 400, 300);
    background(255);
    sexbotPics[2].displayNativeSize();

    FBprint("Like the Campaign Against Sex Robots.", 1000, campaignPrinciples);
    FBprint("What do you think about their campaign?", 3500);

    function campaignPrinciples() {
        consolePrint("Stance of the Campaign Against Sex Robots, campaignagainstsexrobots.org", 0);
        consolePrint("> We believe the development of sex robots further sexually objectifies women and children.", 1000);
        consolePrint("> The vision for sex robots is underscored by reference to prostitute-john exchange which relies on recognizing only the needs and wants of the buyers of sex, the sellers of sex are not attributed subjectivity and reduced to a thing (just like the robot).", 1050);
        consolePrint("> The development of sex robots and the ideas to support their production show the immense horrors still present in the world of prostitution which is built on the “perceived” inferiority of women and children and therefore justifies their use as sex objects.", 1100);
        consolePrint("> We propose that the development of sex robots will further reduce human empathy that can only be developed by an experience of mutual relationship.", 1150);
        consolePrint("> We challenge the view that the development of adult and child sex robots will have a positive benefit to society, but instead further reinforce power relations of inequality and violence.", 1200);
        consolePrint("> We take issue with those arguments that propose that sex robots could help reduce sexual exploitation and violence towards prostituted persons, pointing to all the evidence that shows how technology and the sex trade coexist and reinforce each other creating more demand for human bodies.", 1250);
    }
}

function p5myBody1() {
    // she says: I am not sure how I feel about this body. It is so conventional. I want to explore different ways of being femme.
    // consolePrint:
    // consolePrint:
    // p5femmebot() ---- uncomment next line
    FBprint("Like more masculine, androgenous, curvy, or with fashionable garments.", 1000, p5femmebot);
    FBprint("Do you have any suggestions for how I could evolve?", 3000);
}

function p5myBody2() {
    //she says: I do think it is very hip that my legs are different colors.
    FBprint("Do you think I should look more human or robotic?", 1000);
    //
}

function p5myBody3() {
    // she says Cool. Sigh. Bodies are so complicated.
    FBprint("Just curious, what race do you think I am?", 1500);
}

function p5myBody4() {
    consolePrint("Write to memory:", 1000);
    consolePrint("Suggestions for my body: " + myBodySuggestions, 2000);
    consolePrint("Appearance-- Humanoid or Robotic: " + realOrRobot, 3000);
    consolePrint("Race: " + race, 4000);
}

function consoleQueryGiphy(word) {
    //clear gifs
    gifs = [];

    loadJSON(giphyUrl + word + giphyApiKey, giphyCall);
}

function giphyCall(gifData) {
    console.log(gifData);
    clearDiv('images');
    for (var i = 0; i < 25; i++) {
        var gif = gifData.data[i];
        gifs.push(gif);
    }


    if (gifData.data[0] != undefined) {
        //set div height
        var images = select("#images");
        images.style('height', '100px');

        //createButtons
        buttonNextGif = createButton("next");
        buttonNextGif.parent('#images');
        buttonNextGif.mousePressed(nextGif);
        buttonNextGif.class('imageItems');


        // buttonPauseGif = createButton("pause");
        // buttonPauseGif.parent('#images');
        // buttonPauseGif.mousePressed(pauseGif);
        // buttonNextGif.class('imageItems');

        //create gif
        p5gif = createImg(gifs[gifCounter].images.fixed_height_small.url, function(img) {
            p5gif.parent('#images');
            p5gif.class('imageItems');
        });
    };


    // //make gif still
    // var p5gif = createImg(gifs[0].images.fixed_height_small_still.url);
    // p5gif.parent('#images');

    //remove things
    //  thing.remove();
}

function nextGif() {
    console.log("next gif");
    p5gif.remove();
    gifCounter = (gifCounter + 1) % 25;
    p5gif = createImg(gifs[gifCounter].images.fixed_height_small.url, function(img) {
        p5gif.parent('#images');
        p5gif.class('imageItems');
    });
};

function pauseGif() {
    console.log("pause gif");
};

function consoleAskWordnik(word) {
    //not sure this function is necessary or can just call in switch
    loadJSON(wordnikUrl + word + wordnikDefinition, wordnikCall);
}

function wordnikCall(def) {
    if (typeof def[0] !== 'undefined') {
        // console.log(def);
        var define = createP(".・゜゜・ " + def[0].word + ", " + def[0].partOfSpeech + " ｡.｡゜゜・．");
        define.parent('#console');

        var source = null;
        var count = 1;
        for (var i = 0; i < def.length; i++) {
            if (source != def[i].attributionText) {
                var divider = createP("------- " + count + " -------");
                divider.parent("#console");
                var printSource = createP("(" + def[i].attributionText + ")");
                printSource.parent('#console');
                source = def[i].attributionText
                count++;
            }
            var definition = createP("> " + def[i].text);
            definition.parent('#console');

            // writing text to p5 sketch window
            // fill(255);
            // text(def[i].text, 50, i * 20, width, 20);
            // console.log(def[i].text);
        };
    } else {
        var error = createP("No dictionary definition found");
        error.parent('#console');
        console.log(error);
    }
}

//corpora JSON
function getDiseases() {
    //not sure this function is necessary or can just call in switch
    loadJSON("JSON/diagnoses.json", loadDisease);
};

function loadDisease(diseases) {
    for (var i = 0; i < diseases.codes.length; i++) {
        diseaseList.push(diseases.codes[i].desc);
        //console.log(disease);
    }
};

function consoleAntiMachineQuote() {
    //not sure this function is necessary or can just call in switch
    loadJSON("JSON/technology_quotes.json", getMachineQuotes);
};

function getMachineQuotes(quotes) {
    var antiMachineSources = Object.values(quotes.Anti_Machine_Propaganda);

    antiMachineSources.forEach(function(source) {
        var p = source.Paragraphs;
        p.forEach(function(paragraph) {
            antiMachineQuotes.push(paragraph);
        });
    });

    var quoteSource = createP("Anti-Machine Propaganda:");
    quoteSource.parent('#console');
    var machineQuote = createP('"' + antiMachineQuotes[floor(random(0, antiMachineQuotes.length))] + '"');
    machineQuote.parent('#console');

};


//callbacks for accessing firebase data
function gotData(data) {
    // console.log(data.val());
    var responses = data.val();
    //create array of object keys so you can iterate thru them
    var keys = Object.keys(responses);
    //console.log(keys);
    //now you can iterate thru objects and access data
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var asks = responses[k].query;
        // console.log(asks);
    }
}

function errData(err) {
    console.log('error retrieving data from Firebase:');
    console.log(err);
}
