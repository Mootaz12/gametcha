import React, { useState, useRef } from "react";

interface CustomCaptchaProps {
  children: React.ReactNode; // Allow child components
}

const CustomCaptcha: React.FC<CustomCaptchaProps> = ({ children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expansionWidth, setExpansionWidth] = useState(288);
  const [isExpanding, setIsExpanding] = useState(true);
  const [caught, setCaught] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasMoved, setHasMoved] = useState(false); // Track if the box has moved
  const [showBox, setShowBox] = useState(false); // Track when to show the black box
  const checkboxRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = () => {
    if (!isLoading && !caught) {
      if (isConfirming) {
        setCaught(true);
        setIsChecked(true);
        setIsLoading(false);
        setIsConfirming(false);

        // Trigger the sliding animation
        setTimeout(() => {
          setHasMoved(true); // Move the tickbox card
          setTimeout(() => {
            setShowBox(true); // Show the black box after sliding animation ends
          }, 700); // Match the sliding animation duration
        }, 300);
      } else {
        setIsLoading(true);
        setIsConfirming(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!caught && isConfirming && checkboxRef.current) {
      const rect = checkboxRef.current.getBoundingClientRect();
      const distance = Math.hypot(
        rect.left + rect.width / 2 - e.clientX,
        rect.top + rect.height / 2 - e.clientY
      );

      const isMouseOnCheckbox =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (distance < 50 || isMouseOnCheckbox) {
        if (isExpanding) {
          setExpansionWidth((prev) => {
            if (prev >= 600) {
              setIsExpanding(false);
              return prev - 20;
            }
            return prev + 30;
          });
        } else {
          setExpansionWidth((prev) => {
            if (prev <= 288) {
              setIsExpanding(true);
              return prev + 10;
            }
            return prev - 30;
          });
        }
      }
    }
  };

  return (
    <div className="relative">
      <div
        className={`transition-all duration-700 ${
          hasMoved ? "translate-y-[-250px]" : ""
        }`}
      >
        <div
          className="flex justify-between items-center p-4 bg-gray-100 border border-gray-300 rounded-md shadow-md transition-all duration-300"
          style={{ width: `${expansionWidth}px` }}
          onMouseMove={handleMouseMove}
        >
          <label className="flex items-center gap-5 cursor-pointer">
            <div
              ref={checkboxRef}
              className={`w-7 aspect-square border-2 rounded-sm flex items-center justify-center transition-all duration-300 ${
                isChecked
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
              onClick={handleCheckboxChange}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              ) : (
                isChecked && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )
              )}
            </div>
            <span className="whitespace-nowrap text-lg text-gray-700">
              {caught
                ? "YOU CAUGHT ME!"
                : isConfirming
                ? "Are you sure?"
                : "I'm not a robot"}
            </span>
          </label>
          <div className="flex flex-col items-center">
            <img
              src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
              alt="reCAPTCHA logo"
              className="w-[50px] aspect-square"
            />
            <span>reCAPTCHA</span>
          </div>
        </div>
      </div>

      {/* Black Box Underneath */}
      {showBox && (
        <div className="absolute m-auto inset-0 top-20 w-[600px] h-[400px] bg-black border border-gray-300 rounded-md shadow-md transition-opacity duration-1000 ease-in flex items-center justify-center">
          {children ? (
            children
          ) : (
            <p className="text-white">Success! You solved the CAPTCHA.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCaptcha;
