const canvas = document.getElementById('run_game');
const context = canvas.getContext('2d');

// ball initial position//
let ball_x = canvas.width / 2;
let ball_y = canvas.height / 2;
// ball speed//
let ball_xSpeed = 8;
let ball_ySpeed = 6;
// player and computer score//
let playerScore = 0;
let computerScore = 0;
// total score needed to win a startGame//
const winningScore = 10;
// frames//
let WinScreen = false;
let pauseScreen = false;
//score to reset after every startGame//
let scoreSaved = false;
// paddle info//
//common height and width for both paddles//
const common_padH = 100;
const common_padW = 10;
//Computer x,y//
let ai_padY = 120;
let ai_padX = 0;
//Player x,y//
let player_padX = canvas.width - common_padW;
let player_padY = 120;
//Difficulty settings for computer paddle
let easy = "Easy";
let med = "Medium";
let hard = "Hard";

let easyMode = false;
let medMode = true; // startGame starts with middle however user can change difficulty mid-startGame.
let hardMode = false;

let name = ""; //
let saveData = []; // only used for debugging not really needed in the startGame.
// Audio for ball hitting the wall and paddle//
ball_hit_border = new Audio('border.wav');
ball_hit_paddle = new Audio('paddle.wav');

window.onload = function () {
    // mainLoop();
    startGame();
    loadDatabase();
};
//start game//
function startGame() {
    const charTable = [];
    document.querySelector('#play-btn').addEventListener('click', () => {
        //
        document.querySelector('#menu-page').style.display = 'none';
        document.querySelector('.col-md-4').style.visibility = 'visible';
        document.querySelector('#restart').style.display = 'block';
        document.querySelector('#restart').style.visibility = 'visible';
        context.fillStyle = '#bcff80';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "32px Bungee";
        context.fillText("Press ENTER to begin.", 20, 150);
        context.fillStyle = "#716f6b";
        context.strokeRect(0, 0, canvas.width, canvas.height);

        gettingName(charTable);

    });
    document.querySelector('#high-scores-button').addEventListener('click', () => {
        let highScoresList = document.getElementById("records");

        document.querySelector('#menu-page').style.display = 'none';
        document.querySelector('.col-md-4').style.visibility = 'visible';
        // document.querySelector('.restart').style.display = 'block';
        document.querySelector('#restart').style.visibility = 'visible';
        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        // displaying highscore table//
        if (highScoresList.style.display === 'block') {
            highScoresList.style.display = 'none';
        } else {
            highScoresList.style.display = 'block';

        }
    });
}
// asking user to enter name
function gettingName(charTable) {
    document.addEventListener('keydown', function (e) {
        let repeat = true;
        let input = e.key;
        if (input === "Enter") {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "#bcff80";
            context.fillText("Enter Player name", 20, 90);
            context.fillText("Type name and press Enter:", 20, 140);
            context.background = "#848484";
            context.fillStyle = "#bcff80";
            document.body.addEventListener('keydown', function (e) { //run this only if key entered earlier was enter.
                let user_input = e.keyCode || e.key;
                if (user_input >= 48 && user_input <= 90 || user_input === 13 || user_input === 8 || user_input === 32 ||
                    user_input >= 96 && user_input <= 105) { //restrict input chars to alphanumeric, enter, space and backspace
                    switch (user_input) {
                        case 8: //backspace
                            charTable.pop();
                            break;
                        case 13: //enter


                            if(charTable.length ===0 || charTable[0] === ' ' || charTable[0] === '  '){
                                name = 'Default';
                                startCanvas();
                            }
                            else {
                                startCanvas();
                            }
                            repeat = false;
                            break;

                        default:
                            // name is restrict to 9 characters. so it name does not cross the net and display in the computer side.
                            if (charTable.length <= 9) {
                                charTable.push(e.key);
                            }

                            break;
                    }
                    if (repeat) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.fillText("Enter Player name", 20, 90);
                        context.fillText("Type name and press Enter:", 20, 140);
                        //context.fillStyle = "white";
                        context.background = "#848484";
                        context.font = "32px Bungee";
                        //find out how to change colour of one text
                        // context.fillText(e.key,60,280);

                        name = (charTable.join('')).toString();
                        context.fillText(name, 60, 240);

                    }
                }
            });
        }
    })
}

// this function creates all objects.
function displayAll() {
    context.strokeStyle = '#dcd5db';
    createPad(0, 0, canvas.width, canvas.height, 'black');

    // showing the win screen //
    if (WinScreen) {
        context.fillStyle = 'white';

        if (playerScore >= winningScore) {
            context.fillText(name + " wins", canvas.width / 2 - 130, canvas.height / 4);

        } else if (computerScore >= winningScore) {
            context.fillText("Computer wins", canvas.width / 2 - 130, canvas.height / 4);

        }

        //  saving and send data to database.
        if (!scoreSaved) {

            saveData.push("Player - " + name + " Score - " + playerScore + " AI - " + computerScore + ".");
            console.log(saveData.toString());

            sendScore(name, playerScore, computerScore);
            //count++;
            saveData.length = 0;
            scoreSaved = true;


        }

        context.fillText("CLICK TO PLAY AGAIN", canvas.width / 2 - 140, canvas.height / 4 * 3);
        return;

    }

    if (pauseScreen) {
        context.fillStyle = 'white';
        context.fillText("GAME PAUSED", canvas.width / 2 - 130, canvas.height / 4);
        context.fillText("CLICK TO CONTINUE", canvas.width / 2 - 140, canvas.height / 4 * 3);
        return;
    }

    drawingNet();

    // player paddle //
    createPad(player_padX, player_padY,
        common_padW, common_padH, 'cyan');

    // ai paddle //
    createPad(ai_padX, ai_padY, common_padW, common_padH, 'red');

    // ball //
    createCircle(ball_x, ball_y, 8, 'yellow');

    // players//
    context.fillStyle = 'red';
    context.fillText(name, canvas.width / 5.5, canvas.height / 5.5);
    context.fillText(playerScore, canvas.width / 4, canvas.height / 4);
    context.fillStyle = 'cyan';
    context.fillText("Computer", canvas.width / 4 * 2.5, canvas.height / 5.5);
    context.fillText(computerScore, canvas.width / 4 * 3, canvas.height / 4);
    // context.fillStyle = 'white';


    document.querySelector('#pause').style.visibility = 'visible';
    document.querySelector('#easy').style.visibility = 'visible';
    document.querySelector('#medium').style.visibility = 'visible';
    document.querySelector('#hard').style.visibility = 'visible';

}

// this function returns the position of the mouse.//
function mousePosition(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        y: mouseY
    };
}
// links to easy button//
function levelEasy() {
    easyMode = true;
    medMode = false;
    hardMode = false;
    WinScreen = false;
}
// links to medium button//
function levelMed() {
    easyMode = false;
    medMode = true;
    hardMode = false;
    WinScreen = false;

}
// links to hard button//
function levelHard() {
    easyMode = false;
    medMode = false;
    hardMode = true;
    WinScreen = false;
}

// this functions loops the display and moves the objects
function startCanvas() {
    const framesPerSecond = 50;
    setInterval(function() {
        movingLoop();
        displayAll();
    }, 1000/framesPerSecond);


    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        ai_padY = e.touches[0].pageY - (common_padH / 2);
    });

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove',
        function (evt) {
            const mousePos = mousePosition(evt);
            ai_padY = mousePos.y - (common_padH / 2);
        });
}


function handleMouseClick(evt) {
    if (WinScreen) {
        playerScore = 0;
        computerScore = 0;
        scoreSaved = false;

        if (easy) {
            easyMode = true;
            medMode = false;
            hardMode = false;

            if (WinScreen) {
                WinScreen = false;
            }
            else if (pauseScreen) {
                ballStop();
                pauseScreen = false;
            }
            }
        }
        if (med) {
            easyMode = false;
            medMode = true;
            hardMode = false;

            if (WinScreen) {
                WinScreen = false;
            }
            else if (pauseScreen) {
                ballStop();
                pauseScreen = false;
            }
        }
        if (hard) {
            easyMode = false;
            medMode = false;
            hardMode = true;
            if (WinScreen) {
                WinScreen = false;
            } else if (pauseScreen) {
                ballStop();
                pauseScreen = false;
            }

            ballReset();
            WinScreen = false;
        } else if (pauseScreen) {
            ballStop();
            pauseScreen = false;
        }

}
// creating ball in the canvas.//
function createCircle(centerX, centerY, radius, drawColor) {
    context.fillStyle = drawColor;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    context.fill();
}
// creating paddle//
function createPad(leftX, topY, width, height, drawColor) {
    context.fillStyle = drawColor;
    context.fillRect(leftX, topY, width, height);
}
// reset ball//
function ballReset() {
    if (playerScore >= winningScore ||
        computerScore >= winningScore) {
        WinScreen = true;
    }
    ball_xSpeed = -ball_xSpeed;
    ball_ySpeed = 3;
    ball_x = canvas.width / 2;
    ball_y = canvas.height / 2;

}

function ballStop() {
    if (pause) {
        pauseScreen = true;
    }
}


function aiMovement() {
    // Computer on easy setting.
    if(easyMode === true) {
        let paddle2YCenter = player_padY + (common_padH/2);
        if(paddle2YCenter < ball_y - 35) {
            player_padY = player_padY + 5;
        } else if(paddle2YCenter > ball_y + 35) {
            player_padY = player_padY - 5;
        }
    }
    //Medium setting
    else if(medMode === true) {
        let paddle2YCenter = player_padY + (common_padH/2);
        if(paddle2YCenter < ball_y - 35) {
            player_padY = player_padY + 8;
        } else if(paddle2YCenter > ball_y + 35) {
            player_padY = player_padY - 8;
        }
    }
    //Hard setting
    else if(hardMode === true) {
        let paddle2YCenter = player_padY + (common_padH/2);
        if(paddle2YCenter < ball_y - 35) {
            player_padY = player_padY + 18;
        } else if(paddle2YCenter > ball_y + 35) {
            player_padY = player_padY - 18;
        }
    }
}
// detecting collision and moving the ball.Collision was inspired from https://blog.mycode.website/react-pong/.
function movingLoop() {
    let movingballY;
    if (WinScreen) {
        return;
    }
    if (pauseScreen) {
        return;
    }
    aiMovement();

    ball_x += ball_xSpeed;
    ball_y += ball_ySpeed;

    if (ball_x < 0) {
        if (ball_y > ai_padY &&
            ball_y < ai_padY + common_padH) {
            ball_xSpeed = -ball_xSpeed;
            ball_hit_paddle.play();

            movingballY = ball_y - (ai_padY + common_padH / 2);
            ball_ySpeed = movingballY * 0.28;
        } else {
            computerScore++;
            ballReset();
        }
    } else if (ball_x > canvas.width) {
        if (ball_y > player_padY &&
            ball_y < player_padY + common_padH) {
            ball_xSpeed = -ball_xSpeed;
            ball_hit_paddle.play();

            movingballY = ball_y - (player_padY + common_padH / 2);
            ball_ySpeed = movingballY * 0.28;
        } else {
            playerScore++;
            ballReset();
        }
    }
    if (ball_y < 0) {
        ball_ySpeed = -ball_ySpeed;
        ball_hit_border.play();
    } else if (ball_y > canvas.height) {
        ball_ySpeed = -ball_ySpeed;
        ball_hit_border.play();
    }
}
// drawing net//
function drawingNet() {
    for (let i = 0; i < canvas.height; i += 50) {
        createPad(canvas.width / 2 - 1, i, 2, 15, 'white');
    }
}

// XMLHttpRequest to send data to database//
function sendScore(name, plScore, aiScore) {

    const hr = new XMLHttpRequest();
    const url = "postscore.php"; //php file for sending data
    const send_data = "name=" + name + "&plScore=" + plScore + "&computerScore=" + aiScore;
    hr.open("POST", url, true); // opening the data
    // Set content type header information for sending url encoded variables in the request
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.send(send_data); // processing of sending data.
}

//loading data from the php file//
function loadDatabase() {
    const hr = new XMLHttpRequest();
    const url = "getscore.php"; // php file for receiving data

    hr.open("POST", url, true); //loading file
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // this function check for a steady connection and the retrieves the data.
    hr.onreadystatechange = function () {
        if (hr.readyState === 4 && hr.status === 200) {
            let return_data = hr.responseText;
            //retrieves the data and assign it to the records div.
            document.getElementById("records").innerHTML = return_data;
            console.log(document.querySelector('#records').innerHTML);
        }
        else{
            console.log("Connection to file is not stable.\n")
        }
    };

    hr.send(); // execute the request for retrieving data.
}




