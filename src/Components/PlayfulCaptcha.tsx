import React, { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

const PlayfulCaptcha: React.FC = () => {
  const [position, setPosition] = useState<Position>({
    x: window.innerWidth / 2 - 50, // Center horizontally
    y: window.innerHeight / 2 - 25, // Center vertically
  });
  const [windowSize, setWindowSize] = useState<Position>({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ x: window.innerWidth, y: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const boxCenterX = position.x + 50; // Adjust for center of box
    const boxCenterY = position.y + 25; // Adjust for center of box

    const distanceX = boxCenterX - mouseX;
    const distanceY = boxCenterY - mouseY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const threshold = 150; // Detection radius

    if (distance < threshold) {
      const directionX = distanceX / distance; // Normalized direction
      const directionY = distanceY / distance;

      // Adjust movement strength based on proximity
      const movementStrength = Math.max((threshold - distance) / 5, 10);

      const newX = Math.min(
        Math.max(position.x + directionX * movementStrength, 50),
        windowSize.x - 100
      );
      const newY = Math.min(
        Math.max(position.y + directionY * movementStrength, 50),
        windowSize.y - 50
      );

      setPosition({ x: newX, y: newY });
    }
  };

  const handleClick = () => {
    alert("Captcha verified! 🎉");
  };

  return (
    <div
      className="absolute w-24 h-12 bg-green-500 rounded-lg flex items-center justify-center text-center text-white font-semibold cursor-pointer"
      style={{ top: position.y, left: position.x }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      I'm CAPTCHA!
    </div>
  );
};

export default PlayfulCaptcha;
