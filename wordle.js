//variables 
var FINALWORD = "";
var split_word = [];
guess_number = 0;
const board = document.getElementById("board");
guess_input = document.getElementById('wguess');
guess_button = document.getElementById('submitbutton');
not_enough_letters = document.getElementById("popup");
game_over_screen = document.getElementById('GO_screen');
you_won_screen = document.getElementById('won_screen');

//Get a random word with array
// words = ["METRE", "ROSET", "MASSE", "COBIA", "SKIRR", "FROZE", "DICTA", "CRANE", "BEKAH", "SCALL"];

// function getRandomWord() {
//     index = Math.floor(Math.random() * words.length);
//     return words[index];
// }

// FINALWORD = getRandomWord();
// console.log("The correct word is: " + FINALWORD);


//object to get a API word
const get_word = {
    api_url: "https://random-word-api.herokuapp.com/word?length=5",

    requestData: function() {
        fetch(this.api_url)
            .then(response => response.json())
            .then(data => {
                const new_word = data[0];
                create_word(new_word);
            })
            .catch(error => {
                alert(error);
                console.log(error);
            });
    }
};


//populating the FINALWORD
function create_word(word) {
    FINALWORD = word.toUpperCase();
    console.log("The correct word is: " + FINALWORD);

}


//creating the grid with a .forEach used
// also using an array
function create_board() {
    const boxes = [];
    for (i = 1; i <= 30; i++) {
        boxes.push(i);
    }

    boxes.forEach((box_num) => {
        const box = document.createElement("div");
        box.classList.add("box");
        box.setAttribute("id", box_num);
        board.appendChild(box);
    });
}


//execute what happens when the user enters a word
// uses an event handler
guess_button.addEventListener("click", function() {
    //make sure letters become upper case
    guess = guess_input.value.toUpperCase();

    //display error message if word is not 5 letters
    if (guess.length != 5) {
        not_enough_letters.style.display = "flex";

        //let the error message dissapear 
        setTimeout(() => {
            not_enough_letters.style.display = "none";
        }, 2000);
        guess_input.value = "";
    }
    else {
        not_enough_letters.style.display = "none";
        guess_number++;
        //call function to display the word in the grid
        displayword(guess, guess_number);
        guess_input.value = "";
    }
});


//enables the user to be able to use the enter key instead of the submit button
// uses an event handler
guess_input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        guess_button.click();
    }
});


//display the word in the appropriate grid based on the number of the word
function displayword(word, number) {
    tempfinal = FINALWORD.split('');
    tempword = word.split('');
    correct_word = 0;

    //test for correct letters in correct places
    for (i = 0; i < word.length; i++) {
        this_box = board.children[i + (number - 1) * 5];
        this_box.textContent = word[i];

        //check if the letter in this iteration is correct
        if (FINALWORD[i] == word[i]) {
            this_box.classList.add("correct_place");
            tempfinal[i] = '-';
            tempword[i] = '/';
        }

        //keeps track of the number of correct letters to determine if te whole
        //  word is correct
        if (this_box.classList.contains("correct_place")) {
            correct_word++;
        }
    }

    //test for correct letters in wrong places
    for (i = 0; i < word.length; i++) {
        this_box = board.children[i + (number - 1) * 5];
        index = tempfinal.indexOf(tempword[i]);
        if (index != -1) {
            this_box.classList.add("correct_letter");
            tempfinal[index] = '-';
        }
    }

    //check the word with a slight delay 
    // uses arrow function
    setTimeout(() => {
        check_word(correct_word, number);
    }, 800);
}


//display message if the user wins or loses
function check_word(correct_letters, guess_number) {
    if (correct_letters == 5) {
        you_won_screen.style.display = 'flex';
    }
    else if (guess_number == 6) {
        game_over_screen.style.display = 'flex';
    }
}


//object to restart the game
const RestartGame = {
    //define restart button variables
    retry_button: document.getElementById('retrybutton'),
    play_again_button: document.getElementById('play_again_button'),

    initialize: function() {
        this.event_handlers();
    },

    //add event handlers
    event_handlers: function() {
        this.retry_button.addEventListener("click", () => {
            this.reinitialize_game();
        });

        this.play_again_button.addEventListener("click", () => {
            this.reinitialize_game();
        });
    },

    //reinitialize the game with a new word
    reinitialize_game: function() {
        board.innerHTML = '';
        game_over_screen.style.display = 'none';
        you_won_screen.style.display = 'none';
        guess_number = 0;

        create_board();
        get_word.requestData();
    }
}


//getting a word
get_word.requestData();

//call the function to create the board
create_board();

//reinitialize the game
RestartGame.initialize();


