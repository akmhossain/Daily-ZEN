function on() {
  document.getElementById("overlay").style.display = "block";

}

function exit() {
  document.getElementById("overlay").style.display = "none";
}

function Start() {
  let time = document.getElementById("minInput").value;
  document.getElementById("minInput").style.display = "none";
  let buttons = document.getElementsByClassName("overlayBtns");
  for (let button of buttons) {button.style.display = "none";}
  const gif = document.getElementById("breatheGIF")
  gif.style.display = 'block';
  const baseSrc = 'breatheGIF.gif';
  gif.src = baseSrc + '?t=' + new Date().getTime();
  time = time * 60 * 1000; 
  let times = Math.round(time/9000);
  time = times * 9000; 

  setTimeout(breathe, time);
}

function breathe() {
  document.getElementById("minInput").style.display = "block";
  let buttons = document.getElementsByClassName("overlayBtns");
  for (let button of buttons) {button.style.display = "block";}
  document.getElementById("breatheGIF").style.display = "none";
  exit();
}

// ZEN DRAWING
let symmetry = 6; // number of symmetrical slices
const angle = (2 * Math.PI) / symmetry;

const canvas = document.getElementById("drawingPad");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'forestgreen';

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

toolbar.addEventListener('click', e => {
if (e.target.id === 'clear-btn') {
  ctx.clearRect(0,0,canvas.width,canvas.height);
}
});

toolbar.addEventListener('input', e => {
if(e.target.id === 'stroke') {
  ctx.strokeStyle = e.target.value;
}
if (e.target.id === 'lineWidth') {
  lineWidth = e.target.value;
}
if (e.target.id === 'lines') {
  symmetry = e.target.value;
}
});

canvas.addEventListener('mousedown', (e) => {
isPainting = true;
const rect = canvas.getBoundingClientRect();
prevX = e.clientX - rect.left - canvas.width / 2;
prevY = e.clientY - rect.top - canvas.height / 2;
});

const draw = (e) => {
if(!isPainting) {
  return;
}

const rect = canvas.getBoundingClientRect();
const x = e.clientX - rect.left - canvas.width/2;
const y = e.clientY - rect.top - canvas.height/2;

ctx.save(); // Save canvas state
ctx.translate(canvas.width / 2, canvas.height / 2); // Move origin to center
ctx.lineWidth = lineWidth;
ctx.lineCap = 'round';

for (let i = 0; i < symmetry; i++) {
  ctx.rotate((2*Math.PI) / symmetry); // changes based on radial symmetry
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Mirror the stroke
  ctx.save();
  ctx.scale(1, -1);
  ctx.beginPath();
  ctx.moveTo(prevX, -prevY);
  ctx.lineTo(x, -y);
  ctx.stroke();
  ctx.restore();
}

ctx.restore(); // Restore canvas state
prevX = x;
prevY = y;
}

canvas.addEventListener('mouseup', (e) => {
isPainting = false;
});

canvas.addEventListener('mousemove', draw);

// END OF ZEN DRAWING 


// ZEN QUOTES
const quoteBtn = document.getElementById("quoteBtn");
const quoteOutput = document.getElementById("quoteOutput");

quoteBtn.addEventListener("click", () => {
const proxyURL = "https://api.allorigins.win/get?url=";
const targetURL = "https://zenquotes.io/api/random";
const fetchURL = proxyURL + encodeURIComponent(`${targetURL}?t=${Date.now()}`);

fetch(fetchURL)
  .then(response => {
    if (response.ok) return response.json();
    throw new Error("Quote fetch failed.");
  })
  .then(data => {
    const quoteData = JSON.parse(data.contents);
    const quote = quoteData[0];

    // Check for error message from API
    if (quote.q.includes("Too many requests")) {
      quoteOutput.innerText = "Daily quote limit reached.";
    } else {
      quoteOutput.innerText = `"${quote.q}" — ${quote.a}`;
    }
  })
  .catch(error => {
    console.error(error);
    quoteOutput.innerText = "Could not fetch a new quote. Please try again.";
  });
});


