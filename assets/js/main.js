var quizcount;
var secondsperquiz;
var totalsec;

var correct;

var rightanswers = 0;
var currentquestion = 1;

answerbtns = $("#btncontainer").find("button");

try {
  saveeddata = JSON.parse(localStorage.getItem("saveeddata"));
  if (saveeddata != null) {
    if (saveeddata.totalsec != 0) {
      alert("restore");
    }
  }
} catch (error) {}

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
    answerbtns[0].innerHTML = `${country.name.common}`;
    answerbtns[1].innerHTML = `${countries[ri + 1].name.common}`;
    answerbtns[2].innerHTML = `${countries[ri + 2].name.common}`;
    answerbtns[3].innerHTML = `${countries[ri + 3].name.common}`;
  } catch (error) {}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
