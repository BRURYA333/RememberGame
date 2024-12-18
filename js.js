//מערך כרטיסי  המשחק
const cards = [
    {
        src: 'images/BIRD.png',
        id: 1,

    },
    {
        src: 'images/CAT.png',
        id: 2,

    },
    {
        src: 'images/DOG.png',
        id: 3,

    },
    {
        src: 'images/DOLPHIN.png',
        id: 4,

    },
    {
        src: 'images/FOX.png',
        id: 5,

    },
    {
        src: 'images/FROG.png',
        id: 6,

    },
    {
        src: 'images/GIRAFFE.png',
        id: 7,

    },
    {
        src: 'images/GOOSELING.png',
        id: 8,

    },
    {
        src: 'images/HEDGEHOG.png',
        id: 9,

    },
    {
        src: 'images/LION.png',
        id: 10,

    },
    {
        src: 'images/OUL.png',
        id: 11,

    },
    {
        src: 'images/PENGUINE.png',
        id: 12,

    },
    {
        src: 'images/RABBIT.png',
        id: 13,

    },
    {
        src: 'images/sheep.jpg',
        id: 14,

    },
    {
        src: 'images/SNAKE.png',
        id: 15,

    },
    {
        src: 'images/SQUIREL.png',
        id: 16,

    },
    {
        src: 'images/turtle.png',
        id: 17,

    },
    {
        src: 'images/WHALE.png',
        id: 18,

    },
    {
        src: 'images/ZEBRA.png',
        id: 19,
    }
    ,
    {
        src: 'images/BALL.png',
        id: 20,
    }

];

let darga = sessionStorage.getItem("darga");
let number_of_card_pairs, first_open, last_open, block_click_on_card;
restart_game();

//פונקציה להתחלת המשחק. הפונקציה מאפסת את הנצחונות והדרגה
//הפונק' בונה מערך רנדולמלי עפ"י הדרגה המבוקשת
function restart_game() {
    switch_player();
    count_complete = 0;
    number_of_card_pairs = darga == 0 ? 2 : darga == 1 ? 6 : darga == 2 ? 10 : 20;
    const pairs_of_cards = recreate_pairs_cards_array_randomly();
    create_cards_on_doc(pairs_of_cards);
    recreate_players_on_doc();
}

//פונקציה שיוצרת מערך מעורבב של הכרטיסים, הפונקציה משכפלת את הכרטיסים.
function recreate_pairs_cards_array_randomly() {
    const pairs_of_cards = [];
    shuffled_cards = shuffle(cards);
    for (item of shuffled_cards) {
        if (pairs_of_cards.length < (number_of_card_pairs * 2)) {
            pairs_of_cards.push(item);
            const pair = {};
            pair.src = item.src;
            pair.id = (item.id + 100);
            pairs_of_cards.push(pair);
        }
    }
    return shuffle(pairs_of_cards);
}
//פונקצית ערבוב
function shuffle(array) {
    const newArray = [...array];
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}

//יצירת הכרטיסים על הדף, ובחירת הדרגה
function create_cards_on_doc(pairs_of_cards) {
    const parent_of_items_div = document.querySelector("#parent_of_items");
    parent_of_items_div.classList.add("darga_" + darga);
    parent_of_items_div.innerHTML = '';
    for (item of pairs_of_cards) {
        const btn = document.createElement("button");
        btn.id = "card_" + item.id;
        btn.setAttribute("style", `background-image:url(${item.src})`)
        btn.onclick = onclick_card;

        btn.classList.add("card");
        parent_of_items_div.append(btn);
    }
}

//פונקציה המגדירה את הכרטיסים הנבחרים
function onclick_card(event) {
    if (block_click_on_card)//ה"בלוק" - מגדיר את ההמתנה לאחר בחירת שני הכרטיסים.
    {
        return;
    }
    const card = document.querySelector(`#${event.target.id}`);
    if (first_open == undefined) {
        first_open = card;
        first_open.classList.add("show");
        first_open.setAttribute('disabled', 'true');
    } else if (last_open == undefined) {
        last_open = card;
        last_open.classList.add("show");
        last_open.setAttribute('disabled', 'true');
        if (cards_are_match(first_open, last_open)) {
            const current_player = sessionStorage.getItem("current_player");
            const players = JSON.parse(sessionStorage.getItem("players"));
            for (player of players) {
                if (player.name == current_player) {
                    player.score += 10;
                }
            };
            sessionStorage.setItem("players", JSON.stringify(players));
            recreate_players_on_doc();
            count_complete++;
            mark_card_as_complete(first_open);
            mark_card_as_complete(last_open);
            first_open = undefined;
            last_open = undefined;
            if (count_complete == number_of_card_pairs) {
                setTimeout(() => {
                    redirect_to_congrats_page();
                }, 200);
            };
        } else {
            switch_player();
            block_click_on_card = true;
            setTimeout(() => {
                first_open.classList.remove("show");
                first_open.removeAttribute('disabled');
                last_open.classList.remove("show");
                last_open.removeAttribute('disabled');
                first_open = undefined;
                last_open = undefined;
                block_click_on_card = false;
            }, 1000);
        }
    }
}

function mark_card_as_complete(card) {
    card.classList.add("complete");
    card.onclick = undefined;
}

function cards_are_match(first_open, last_open) {
    var url1 = first_open.style.backgroundImage;
    var url2 = last_open.style.backgroundImage;
    return url1 === url2;
}

function redirect_to_congrats_page() {
    currentUrl = window.location.href;
    newUrl = currentUrl.split('/').slice(0, -1).join('/') + '/congrats.html'
    window.location.href = newUrl;
}

function recreate_players_on_doc() {
    const parent_of_players_div = document.querySelector("#parent_of_players");
    parent_of_players_div.innerHTML = '';
    const current_player = sessionStorage.getItem("current_player");
    const current_player_div = document.createElement("div");
    current_player_div.classList.add("current_player");
    current_player_div.innerHTML = 'שחקן נוכחי: ' + current_player;
    parent_of_players_div.append(current_player_div);

    //לולאה שמייצרת div לכל שחקן
    const players = JSON.parse(sessionStorage.getItem("players"));
    const players_as_html = players.map((player) => {
        const div = document.createElement("div");
        div.classList.add("player");
        div.innerHTML = 'שחקן: ' + player.name + '  ניקוד: ' + player.score;
        return div;
    });

    const players_div = document.createElement("div");
    players_div.classList.add("players");
    for (item of players_as_html) {
        players_div.append(item);
    }
    //הצגת השחקנים והניקוד על המסך
    parent_of_players_div.append(players_div);
}

function switch_player() {
    const current_player = sessionStorage.getItem("current_player");
    const players_names = JSON.parse(sessionStorage.getItem("players"))
        .map(player => player.name);
    index = players_names.indexOf(current_player);
    if (index >= 0 && index < players_names.length - 1)
        nextPlayer = players_names[index + 1];
    else
        nextPlayer = players_names[0];
    sessionStorage.setItem("current_player", nextPlayer);
    recreate_players_on_doc();
}
