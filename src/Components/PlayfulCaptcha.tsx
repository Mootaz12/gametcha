import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "../context/GameContext";

interface Position {
  x: number;
  y: number;
}

const PlayfulCaptcha: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setStartNewGame } = useGameContext(); // Access the context's function
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      setPosition({
        x: containerRect.width / 2 - 50, // Center horizontally within the box
        y: containerRect.height / 2 - 25, // Center vertically within the box
      });
    }
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isClicked) return; // Stop moving after click

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    const boxCenterX = position.x + 50; // Adjust for center of box
    const boxCenterY = position.y + 25; // Adjust for center of box

    const distanceX = boxCenterX - mouseX;
    const distanceY = boxCenterY - mouseY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const threshold = 100; // Detection radius

    if (distance < threshold) {
      const directionX = distanceX / distance; // Normalized direction
      const directionY = distanceY / distance;

      const movementStrength = Math.max((threshold - distance) / 5, 10);

      const newX = Math.min(
        Math.max(position.x + directionX * movementStrength, 0),
        containerRect.width - 100
      );
      const newY = Math.min(
        Math.max(position.y + directionY * movementStrength, 0),
        containerRect.height - 50
      );

      setPosition({ x: newX, y: newY });
    }
  };

  const handleClick = () => {
    setIsClicked(true);

    // Wait for the message to display before transitioning to the next game
    setTimeout(() => {
      setStartNewGame(true); // Trigger the next game
    }, 2000); // Show the success message for 2 seconds
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-200 overflow-hidden"
    >
      {!isClicked ? (
        <div
          className="absolute w-24 h-12 bg-green-500 rounded-lg flex items-center justify-center text-center text-white font-semibold cursor-pointer"
          style={{ top: position.y, left: position.x }}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          I'm CAPTCHA!
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 text-xl font-semibold text-blue-700">
          🎉 Congrats! You cleaned a piece of garbage from the ocean! 🌊
        </div>
      )}
    </div>
  );
};

export default PlayfulCaptcha;
