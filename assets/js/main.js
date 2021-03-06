var quizcount;
var secondsperquiz;
var totalsec;

var correct;

var rightanswers = 0;
var currentquestion = 1;

var nextbtn = document.getElementById("nextbtn")
answerbtns = $("#btncontainer").find("button");

function startinterval() {
  timerId = setInterval(() => {
    if (totalsec < 2) {
      Swal.fire("No Time Left");
      notimeleft();
    }
    totalsec--;
    ptimeleft.innerHTML = `Time-Left:${totalsec}`;
    localStorage.setItem("saveeddata", JSON.stringify({
      totalsec,
      quizcount,
      rightanswers,
      currentquestion,
    }));
  }, 1000);
}

$("#btncontainer")
  .find("button")
  .click(function () {
    this.classList.remove("btn-light");
    if (this.innerHTML == correct) {
      this.classList.add("btn-success");
      rightanswers++;
    } else this.classList.add("btn-danger");
    disablebtns();
    nextbtn.classList.remove("disabled");
  });

fetch("https://restcountries.com/v3.1/all")
  .then((Response) => Response.json())
  .then((data) => {
    countries = data;
  });




function resetbtns() {
  $("#btncontainer")
    .find("button")
    .removeClass("btn-danger btn-success disabled");
  $("#btncontainer").find("button").addClass("btn-light");
  $("#btncontainer").find("button").html("")
}
function disablebtns() {
  $("#btncontainer").find("button").addClass("disabled");
}

var qninput = document.getElementById("qninput");
var spqinput = document.getElementById("spqinput");

document.getElementById("startbtn").addEventListener("click", () => {
  if (qninput.value > 0 && spqinput.value > 0) {
    quizcount = qninput.value;
    secondsperquiz = spqinput.value;
    totalsec = quizcount * secondsperquiz;
    maincontainer.classList.remove("d-none");
    settings.classList.add("d-none");
    generate();
    startinterval()
  } else
    Swal.fire({
      icon: "error",
      title: "Fill data",
      text: "You must feel all data",
    });
});

function notimeleft() {
  maincontainer.classList.add("d-none");
  scorediv.classList.remove("d-none");
  score.innerHTML = `result:${rightanswers}/${quizcount}`;
  localStorage.removeItem("saveeddata")
  clearInterval(timerId);
}

nextbtn.addEventListener("click", function () {
  resetbtns();
  generate();
  currentquestion++;
  pcurrentquestion.innerHTML = `Current question ${currentquestion}/${quizcount}`;
  if (currentquestion > quizcount) {
    Swal.fire({
      icon: "success",
      title: "you finished all",
    });
    clearInterval(timerId);
    notimeleft();
  }
});
resetbtn.addEventListener("click", function () {
  qninput.value = "";
  spqinput.value = "";
  rightanswers = 0;
  currentquestion = 1;
  scorediv.classList.add("d-none");
  settings.classList.remove("d-none");
  resetbtns();
});

function generate() {
  //bezi olkeler lazim olan datani qaytarmir  goto yoxdu =(
  pcurrentquestion.innerHTML = `Current question ${currentquestion}/${quizcount}`;
  try {
    nextbtn.classList.add("disabled");
    ri = getRandomInt(countries.length);
    country = countries[ri];
    imgdiv.innerHTML = `<img style="width:40vh" src="${country.flags.svg}" alt=""></img>`;
    correct = `${country.name.common}`;
    choices = [country.name.common,
    countries[getRandomInt(countries.length)].name.common,
    countries[getRandomInt(countries.length)].name.common,
    countries[getRandomInt(countries.length)].name.common
    ]

    choices.sort();

    answerbtns[0].innerHTML=choices[0]
    answerbtns[1].innerHTML=choices[1]
    answerbtns[2].innerHTML=choices[2]
    answerbtns[3].innerHTML=choices[3]
} catch (error) { }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

try {
  saveeddata = JSON.parse(localStorage.getItem("saveeddata"));
  if (saveeddata != null) {
    if (saveeddata.totalsec != 0 && saveeddata.currentquestion <= saveeddata.quizcount) {
      totalsec = saveeddata.totalsec
      quizcount = saveeddata.quizcount;
      rightanswers = saveeddata.rightanswers
      currentquestion = saveeddata.currentquestion
      settings.classList.add("d-none")
      maincontainer.classList.remove("d-none")
      generate();
      startinterval()
    }
  }
} catch (error) { }