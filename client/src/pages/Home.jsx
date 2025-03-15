import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const quizImages = [
  "/images/quiz1.png",
  "/images/quiz2.png",
  "/images/quiz3.png",
];

const questions = [
  "Ready to test your knowledge?",
  "Challenge yourself with exciting quizzes!",
  "Compete, learn, and have fun!",
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Auto-change questions every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="relative w-full h-screen text-white overflow-hidden">
      {/* Background Image Slider */}
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={3000}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        {quizImages.map((image, index) => (
          <div key={index} className="w-full h-screen">
            <img
              src={image}
              alt="Quiz Background"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        ))}
      </Carousel>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Quizo
        </motion.h1>

        {/* Auto-Sliding Questions */}
        <motion.p
          key={currentQuestion}
          className="text-lg md:text-2xl mt-4 max-w-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 1 }}
        >
          {questions[currentQuestion]}
        </motion.p>

        {/* Start Button */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            className="px-6 py-3 text-lg bg-yellow-500 hover:bg-yellow-600 shadow-xl text-white rounded-md transition"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </button>
        </motion.div>
      </div>
    </div>
  );
}
