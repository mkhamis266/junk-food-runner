$(document).ready(function () {
  const canvasContainer = document.querySelector(".container");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Set the canvas dimensions to match its parent container
  canvas.width = canvasContainer.clientWidth;
  canvas.height = canvasContainer.clientHeight - 100;

  // Add an event listener to adjust the canvas size when the window is resized
  window.addEventListener("resize", () => {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight - 100;
  });

  const player = { x: canvas.width / 2, y: canvas.height / 2, size: 30, minSize: 30, maxSize: 150, score: 0 };
  const junkFood = [];
  const junkFoodImages = document.querySelectorAll(".junkFoodImg");
  let junkFoodInternal = null;
  const healthyFood = [];
  const healthFoodImages = document.querySelectorAll(".healthFoodImg");
  const timer = { seconds: 60, interval: null };
  let isDragging = false;

  // Create junk food and healthy food items
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

  // function createHealthyFood() {
  //   const food = {
  //     x: Math.random() * canvas.width,
  //     y: Math.random() * canvas.height,
  //     isJunkFood: false,
  //   };
  //   healthyFood.push(food);
  //   setTimeout(() => {
  //     const index = healthyFood.indexOf(food);
  //     if (index !== -1) {
  //       healthyFood.splice(index, 1);
  //     }
  //   }, 3000); // Disappear after 3 seconds
  // }

  // Game loop
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and move junk food
    for (let i = 0; i < junkFood.length; i++) {
      const food = junkFood[i];
      food.x += food.speedX;
      food.y += food.speedY;

      // ctx.fillStyle = "red";
      // ctx.fillRect(food.x - 10, food.y - 10, 20, 20);

      ctx.drawImage(food.image, food.x - 10, food.y - 10, 30, 30);

      // Check for collisions with player
      if (food.x >= player.x - player.size / 2 && food.x <= player.x + player.size / 2 && food.y >= player.y - player.size / 2 && food.y <= player.y + player.size / 2) {
        if (food.isJunkFood) {
          if (player.size < player.maxSize) {
            player.size += 5;
          }
          player.score -= 5;
        } else {
          if (player.size > player.minSize) {
            player.size -= 5;
          }
          player.score += 10;
        }
        junkFood.splice(i, 1);
      }

      // Remove junk food when it goes out of the screen
      if ((food.isJunkFood && (food.y > canvas.height || food.x < -20 || food.x > canvas.width + 20)) || (!food.isJunkFood && (food.x < -20 || food.x > canvas.width + 20 || food.y < -20 || food.y > canvas.height + 20))) {
        junkFood.splice(i, 1);
      }
    }

    // Draw and move healthy food
    // for (let i = 0; i < healthyFood.length; i++) {
    //   const food = healthyFood[i];
    //   ctx.fillStyle = "green";
    //   ctx.fillRect(food.x - 10, food.y - 10, 20, 20);

    //   // Check for collisions with player
    //   if (food.x >= player.x - player.size / 2 && food.x <= player.x + player.size / 2 && food.y >= player.y - player.size / 2 && food.y <= player.y + player.size / 2) {
    //     if (player.size > player.minSize) {
    //       player.size -= 5;
    //     }
    //     player.score += 10;
    //     healthyFood.splice(i, 1);
    //   }
    // }

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

    // Draw score
    document.getElementById("score").textContent = `Score: ${Math.max(0, Math.floor(player.score))}`;

    // Timer
    requestAnimationFrame(update);
  }

  // Start the game
  document.getElementById("startButton").addEventListener("click", function () {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.size = 30;
    player.score = 0;
    junkFood.length = 0;
    healthyFood.length = 0;
    timer.seconds = 60;
    document.getElementById("startButton").disabled = true;
    timer.interval = setInterval(countDown, 1000);
    junkFoodInternal = setInterval(createJunkFood, 500);
    // setInterval(createHealthyFood, 5000); // Create healthy food every 5 seconds
    update();
  });

  function countDown() {
    timer.seconds--;
    document.getElementById("timer").textContent = `Time: ${timer.seconds}`;
    if (timer.seconds <= 0) {
      clearInterval(timer.interval);
      clearInterval(junkFoodInternal);
      alert(`Game Over! Your Score: ${Math.max(0, Math.floor(player.score))}`);
      document.getElementById("startButton").disabled = false;
      return;
    }
  }

  // Handle touch events for player movement
  canvas.addEventListener("touchstart", function (e) {
    isDragging = true;
  });

  canvas.addEventListener("touchmove", function (e) {
    if (isDragging) {
      const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;

      // Update player position based on touch input
      player.x = touchX;
      player.y = touchY;
    }
  });

  canvas.addEventListener("touchend", function (e) {
    isDragging = false;
  });
});
