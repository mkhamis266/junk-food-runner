$(document).ready(function () {
  let canvasContainer;
  let canvas;
  let ctx;

  // Game state variables
  let isDraggingPlayer = false;
  let lives = 3;
  let isGameInitiated = false;
  // Set canvas dimensions and handle window resize
  function setCanvasDimensions() {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight - 40;
  }

  window.addEventListener("resize", setCanvasDimensions);

  let player;
  const junkFood = [];
  const junkFoodImages = document.querySelectorAll(".junkFoodImg");
  let junkFoodInternal = null;
  const timer = { seconds: 30, interval: null };

  // Create junk food items
  function createJunkFood() {
    const directions = ["top", "left", "right"];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const food = {
      isJunkFood: true,
      image: junkFoodImages[Math.floor(Math.random() * junkFoodImages.length)],
    };

    switch (direction) {
      case "top":
        food.x = Math.random() * canvas.width;
        food.y = -20;
        food.speedX = 0;
        food.speedY = Math.random() * 2 + 1;
        break;
      case "left":
        food.x = -20;
        food.y = Math.random() * canvas.height;
        food.speedX = Math.random() * 2 + 1;
        food.speedY = 0;
        break;
      case "right":
        food.x = canvas.width + 20;
        food.y = Math.random() * canvas.height;
        food.speedX = -Math.random() * 2 - 1;
        food.speedY = 0;
        break;
    }

    junkFood.push(food);
  }

  // Game loop
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawJunkFood();
    drawPlayer();
    requestAnimationFrame(update);
  }

  function drawJunkFood() {
    for (let i = 0; i < junkFood.length; i++) {
      const food = junkFood[i];
      food.x += food.speedX;
      food.y += food.speedY;

      ctx.drawImage(food.image, food.x - 10, food.y - 10, 30, 30);

      if (checkCollisionWithPlayer(food)) {
        handleFoodCollision(food);
        junkFood.splice(i, 1);
      }

      if (isOutOfBounds(food)) {
        junkFood.splice(i, 1);
      }
    }
  }

  function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
  }

  function drawLives() {
    $("#lives").html(`<img src="img/lives/${lives}.png" height="40" alt="" /> <span>: ${lives}</span>`);
  }

  function checkCollisionWithPlayer(food) {
    return food.x >= player.x - player.size / 2 && food.x <= player.x + player.size / 2 && food.y >= player.y - player.size / 2 && food.y <= player.y + player.size / 2;
  }

  function handleFoodCollision(food) {
    if (food.isJunkFood) {
      lives--;
      drawLives();
      if (lives <= 0) {
        gameOver();
      }
    }
  }

  function isOutOfBounds(food) {
    return (food.isJunkFood && (food.y > canvas.height || food.x < -20 || food.x > canvas.width + 20)) || (!food.isJunkFood && (food.x < -20 || food.x > canvas.width + 20 || food.y < -20 || food.y > canvas.height + 20));
  }

  function gotoInstructionsPage() {
    $("#startPage").hide();
    $("#instructionsPage").show();
  }

  function startGame() {
    $("#instructionsPage").hide();
    $("#gamePage").show();
    setGame();
    update();
  }

  function setGame() {
    canvasContainer = document.querySelector(".canvasContainer");
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    player = { x: canvas.width / 2, y: canvas.height / 2, size: 30, minSize: 30, maxSize: 50, score: 0 };
    // Event listeners
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    setCanvasDimensions();
    timer.interval = setInterval(countDown, 1000);
    junkFoodInternal = setInterval(createJunkFood, 500);
  }

  function playAgain() {
    $("#finalPage").hide();
    $("#startPage").show();
  }

  function countDown() {
    timer.seconds--;
    document.getElementById("timer").textContent = `${timer.seconds < 10 ? "0" + timer.seconds : timer.seconds} sec`;
    if (timer.seconds <= 0) {
      gameOver();
    }
  }

  function gameOver() {
    resetGame();
    $("#gamePage").hide();
    $("#finalPage").show();
  }

  function resetGame() {
    clearInterval(timer.interval);
    clearInterval(junkFoodInternal);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.size = 30;
    junkFood.length = 0;
    timer.seconds = 30;
    lives = 3;
    drawLives();
    document.getElementById("timer").textContent = `Time: ${timer.seconds}`;
    isExplodePlayer = false;
  }

  function handleTouchStart(e) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;

    if (isInsidePlayerBounds(touchX, touchY)) {
      isDraggingPlayer = true;
    }
  }

  function handleTouchMove(e) {
    if (isDraggingPlayer) {
      const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;

      // Update player position based on touch input within canvas bounds
      player.x = Math.max(player.size / 2, Math.min(canvas.width - player.size / 2, touchX));
      player.y = Math.max(player.size / 2, Math.min(canvas.height - player.size / 2, touchY));
    }
  }

  function handleTouchEnd() {
    isDraggingPlayer = false;
  }

  function isInsidePlayerBounds(x, y) {
    return x >= player.x - player.size / 2 && x <= player.x + player.size / 2 && y >= player.y - player.size / 2 && y <= player.y + player.size / 2;
  }

  $(document).on("contextmenu", function (e) {
    e.preventDefault();
  });

  $(document).on("dblclick", function (e) {
    e.preventDefault();
  });

  /* handle buttons */
  $("#gotoInstructionsButton").on("click", gotoInstructionsPage);
  $("#startButton").on("click", startGame);
  $("#playAgainButton").on("click", playAgain);
});
