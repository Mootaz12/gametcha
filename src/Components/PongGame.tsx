import React, { useEffect, useState } from "react";

const PongGame: React.FC = () => {
  const boardWidth = 800;
  const boardHeight = 500;
  let context: CanvasRenderingContext2D;
  let board: HTMLCanvasElement;

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<string>("");

  const playerWidth = 40;
  const playerHeight = 120;
  const ballRadius = 10;

  const player1 = {
    x: 2,
    y: boardHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0,
  };

  const player2 = {
    x: boardWidth - playerWidth - 2,
    y: boardHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0,
  };

  const ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    radius: ballRadius,
    velocityX: Math.random() > 0.5 ? 3 : -3,
    velocityY: Math.random() * 2 - 1,
    speed: 0.5,
  };

  // Function to detect collision between a circle (ball) and a rectangle (paddle)
  const detectCircleRectCollision = (circle: any, rect: any) => {
    // Find the closest point on the paddle to the ball
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    // Calculate the distance from the ball to the closest point on the paddle
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    // Check if the distance is less than the radius of the ball
    return (
      distanceX * distanceX + distanceY * distanceY <
      circle.radius * circle.radius
    );
  };

  const stopGame = (message: string) => {
    setGameOver(message);
  };

  const animate = (): void => {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, boardWidth, boardHeight);

    if (gameOver) {
      return;
    }

    // Solid background color (no image)
    context.fillStyle = "#000"; // Black background
    context.fillRect(0, 0, boardWidth, boardHeight);

    // AI Movement
    const aiSpeed = 2;
    const aiOffset = 11;
    const ballFutureY = ball.y + ball.velocityY * aiOffset;

    if (ballFutureY < player2.y + player2.height / 2) {
      player2.velocityY = -aiSpeed;
    } else if (ballFutureY > player2.y + player2.height / 2) {
      player2.velocityY = aiSpeed;
    }

    player2.y += player2.velocityY;

    if (player2.y < 0) player2.y = 0;
    else if (player2.y + player2.height > boardHeight)
      player2.y = boardHeight - player2.height;

    // Player movement
    if (player1.velocityY !== 0) {
      player1.y += player1.velocityY;
    }

    if (player1.y < 0) {
      player1.y = 0;
    } else if (player1.y + player1.height > boardHeight) {
      player1.y = boardHeight - player1.height;
    }

    // Draw paddles with neon glow effect and oceanic colors
    context.fillStyle = "#FF6F00"; // Ocean-inspired neon (coral)
    context.shadowColor = "#FF6F00";
    context.shadowBlur = 20;
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    context.fillStyle = "#00FF00"; // AI paddle neon color (seafoam green)
    context.shadowColor = "#00FF00";
    context.shadowBlur = 20;
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Midline with ocean wave style
    context.strokeStyle = "#FFFFFF";
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(boardWidth / 2, 0);
    context.lineTo(boardWidth / 2, boardHeight);
    context.stroke();

    // Update ball position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Draw ball (white, circle)
    context.fillStyle = "#FFFFFF"; // White ball color
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();

    // Ball collision with boundaries
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= boardHeight) {
      ball.velocityY *= -1;
    }

    // Ball collision with paddles
    if (detectCircleRectCollision(ball, player1)) {
      ball.velocityX = Math.abs(ball.velocityX);
      ball.velocityY =
        ((ball.y - (player1.y + player1.height / 2)) / (player1.height / 2)) *
        4;
      ball.velocityX *= 1.1;
      ball.velocityY *= 1.1;
    } else if (detectCircleRectCollision(ball, player2)) {
      ball.velocityX = -Math.abs(ball.velocityX);
      ball.velocityY =
        ((ball.y - (player2.y + player2.height / 2)) / (player2.height / 2)) *
        4;
      ball.velocityX *= 1.1;
      ball.velocityY *= 1.1;
    }

    // Ball out of bounds
    if (ball.x - ball.radius < 0) {
      stopGame("Game Over");
      return;
    } else if (ball.x + ball.radius > boardWidth) {
      stopGame("You Won!");
      return;
    }
  };

  const movePlayer = (e: any): void => {
    if (e.key === "ArrowUp") player1.velocityY = -5;
    else if (e.key === "ArrowDown") player1.velocityY = 5;

    if (e.key === "p" || e.key === "Escape") {
      setIsPaused(!isPaused);
    }
  };

  const stopMovingPlayer = (e: any): void => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      player1.velocityY = 0;
    }
  };

  const handleMouseMove = (e: any) => {
    const mouseY = e.clientY - board.getBoundingClientRect().top;
    player1.y = mouseY - player1.height / 2;
  };

  useEffect(() => {
    board = document.getElementById("board") as HTMLCanvasElement;
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d") as CanvasRenderingContext2D;

    animate();

    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopMovingPlayer);
    board.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("keydown", movePlayer);
      document.removeEventListener("keyup", stopMovingPlayer);
      board.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameOver]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-800 via-teal-500 to-orange-400">
      <div className="text-center text-white">
        <div className="relative mt-6">
          <canvas
            id="board"
            style={{
              border: "4px solid #fff",
              display: "block",
              margin: "auto",
              background: "#000", // Fallback if image isn't loaded
            }}
          />
          {gameOver && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white">
              {gameOver}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PongGame;
