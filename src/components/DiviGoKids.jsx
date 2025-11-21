import React, { useState, useEffect } from 'react';
import { Check, X, Star, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';

// Animasyon stilleri
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes slideDown {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes slideIn {
    from {
      transform: translateX(-100px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes scaleIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(10deg);
    }
  }
`;
document.head.appendChild(style);

// Export generateQuestions for testing
export const generateQuestions = (stage, level) => {
  const qs = [];

  if (level === 1) {
    // Level 1: Basit bölme işlemleri
    const divisor = stage <= 6 ? stage + 1 : stage - 1; // 2-10 arası bölenler

    for (let i = 0; i < 10; i++) {
      const correctAnswer = Math.floor(Math.random() * 10) + 1;
      const dividend = divisor * correctAnswer; // Tam bölünebilir sayı
      const wrongAnswers = [];

      while (wrongAnswers.length < 3) {
        const wrong = correctAnswer + Math.floor(Math.random() * 6) - 3;
        if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
          wrongAnswers.push(wrong);
        }
      }

      const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      qs.push({
        dividend,
        divisor,
        correctAnswer,
        answers
      });
    }
  } else if (level === 2) {
    // Level 2: İki basamaklı sayıları bölme
    for (let i = 0; i < 10; i++) {
      let divisor, correctAnswer;

      if (stage <= 6) {
        divisor = Math.floor(Math.random() * 4) + 2; // 2-5 arası bölen
        correctAnswer = Math.floor(Math.random() * 15) + 5; // 5-19 arası sonuç
      } else {
        divisor = Math.floor(Math.random() * 4) + 6; // 6-9 arası bölen
        correctAnswer = Math.floor(Math.random() * 10) + 10; // 10-19 arası sonuç
      }

      const dividend = divisor * correctAnswer;
      const wrongAnswers = [];

      while (wrongAnswers.length < 3) {
        const wrong = correctAnswer + Math.floor(Math.random() * 8) - 4;
        if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
          wrongAnswers.push(wrong);
        }
      }

      const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      qs.push({
        dividend,
        divisor,
        correctAnswer,
        answers
      });
    }
  } else if (level === 3) {
    // Level 3: Üç basamaklı sayıları bölme
    for (let i = 0; i < 10; i++) {
      let divisor, correctAnswer;

      if (stage <= 6) {
        divisor = Math.floor(Math.random() * 4) + 2; // 2-5 arası bölen
        correctAnswer = Math.floor(Math.random() * 50) + 20; // 20-69 arası sonuç
      } else {
        divisor = Math.floor(Math.random() * 4) + 6; // 6-9 arası bölen
        correctAnswer = Math.floor(Math.random() * 50) + 50; // 50-99 arası sonuç
      }

      const dividend = divisor * correctAnswer;
      const wrongAnswers = [];

      while (wrongAnswers.length < 3) {
        const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
        if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
          wrongAnswers.push(wrong);
        }
      }

      const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      qs.push({
        dividend,
        divisor,
        correctAnswer,
        answers
      });
    }
  } else if (level === 4) {
    // Level 4: Karışık zorlukta bölme işlemleri
    for (let i = 0; i < 10; i++) {
      let divisor, correctAnswer;

      if (stage <= 6) {
        divisor = Math.floor(Math.random() * 8) + 11; // 11-18 arası bölen
        correctAnswer = Math.floor(Math.random() * 20) + 10; // 10-29 arası sonuç
      } else {
        divisor = Math.floor(Math.random() * 10) + 11; // 11-20 arası bölen
        correctAnswer = Math.floor(Math.random() * 30) + 20; // 20-49 arası sonuç
      }

      const dividend = divisor * correctAnswer;
      const wrongAnswers = [];

      while (wrongAnswers.length < 3) {
        const wrong = correctAnswer + Math.floor(Math.random() * 16) - 8;
        if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
          wrongAnswers.push(wrong);
        }
      }

      const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      qs.push({
        dividend,
        divisor,
        correctAnswer,
        answers
      });
    }
  }

  return qs;
};

// Export star calculation for testing
export const calculateStars = (score) => {
  return score >= 9 ? 3 : score >= 7 ? 2 : score >= 5 ? 1 : 0;
};

const DiviGoKids = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [stageStars, setStageStars] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Ses efektleri çalma
  const playSound = (type) => {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'correct') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'wrong') {
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'click') {
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'complete') {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);
        osc.start(audioContext.currentTime + i * 0.15);
        osc.stop(audioContext.currentTime + i * 0.15 + 0.3);
      });
    }
  };

  // localStorage'dan verileri yükle
  useEffect(() => {
    const saved = localStorage.getItem('diviGoKidsProgress');
    if (saved) {
      setStageStars(JSON.parse(saved));
    }
  }, []);

  // stageStars değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (Object.keys(stageStars).length > 0) {
      localStorage.setItem('diviGoKidsProgress', JSON.stringify(stageStars));
    }
  }, [stageStars]);

  const startStage = (stage) => {
    const qs = generateQuestions(stage, currentLevel);
    setQuestions(qs);
    setCurrentStage(stage);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      if (currentQuestion < 9) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        const stars = calculateStars(finalScore);

        const key = `level${currentLevel}_stage${currentStage}`;
        const currentStars = stageStars[key] || 0;

        if (stars > currentStars) {
          setStageStars({
            ...stageStars,
            [key]: stars
          });
        }

        if (stars > 0) {
          setShowConfetti(true);
          playSound('complete');
          setTimeout(() => setShowConfetti(false), 3000);
        }

        setCurrentScreen('result');
      }
    }, 1500);
  };

  // Home Screen
  if (currentScreen === 'home') {
    const divisionSymbols = ['÷', ':', '/', '÷', ':', '÷', ':', '÷'];
    const pizzaSlices = ['🍕', '🎂', '🍰', '🍪', '🍎', '🍊'];

    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-400 to-blue-500 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Yüzen daireler */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`circle-${i}`}
              className="absolute bg-white rounded-full opacity-20"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}

          {/* Bölme sembolleri */}
          {divisionSymbols.map((symbol, i) => (
            <div
              key={`symbol-${i}`}
              className="absolute text-white opacity-30 font-bold text-4xl md:text-6xl"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                animation: `float ${Math.random() * 8 + 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            >
              {symbol}
            </div>
          ))}

          {/* Pizza & Kek Dilimleri (paylaşma/bölme teması) */}
          {pizzaSlices.map((emoji, i) => (
            <div
              key={`emoji-${i}`}
              className="absolute text-4xl md:text-5xl opacity-40"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-3xl w-full">
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl md:rounded-[3rem] p-8 md:p-16 shadow-2xl animate-[scaleIn_0.8s_ease-out]">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-8 animate-[slideDown_0.6s_ease-out] drop-shadow-lg">
              DiviGo Kids
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white mb-8 md:mb-12 animate-[fadeIn_1s_ease-in] drop-shadow-md">
              Division mit Spaß lernen! 🎯
            </p>

            <button
              onClick={() => {
                playSound('click');
                setCurrentScreen('levels');
              }}
              className="bg-gradient-to-b from-yellow-400 to-orange-500 text-white text-2xl md:text-4xl font-bold px-10 py-5 md:px-16 md:py-8 rounded-2xl md:rounded-3xl shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 animate-[slideUp_0.8s_ease-out]"
            >
              Spielen!
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="mt-6 md:mt-8 bg-white bg-opacity-30 backdrop-blur-sm text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 mx-auto"
            >
              <Volume2 size={24} className="md:w-8 md:h-8" />
              <span className="text-lg md:text-xl font-bold">
                Sound: {soundEnabled ? 'An' : 'Aus'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Level Auswahl Screen
  if (currentScreen === 'levels') {
    const levelInfo = [
      {
        name: 'Level 1',
        desc: 'Einfache Division',
        bgGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
        cardColor: 'from-emerald-500 to-teal-500',
        emoji: '🌱'
      },
      {
        name: 'Level 2',
        desc: 'Zweistellige Zahlen',
        bgGradient: 'from-blue-400 via-indigo-400 to-purple-400',
        cardColor: 'from-blue-500 to-indigo-500',
        emoji: '🚀'
      },
      {
        name: 'Level 3',
        desc: 'Dreistellige Zahlen',
        bgGradient: 'from-purple-400 via-pink-400 to-rose-400',
        cardColor: 'from-purple-500 to-pink-500',
        emoji: '⭐'
      },
      {
        name: 'Level 4',
        desc: 'Fortgeschritten',
        bgGradient: 'from-orange-400 via-red-400 to-pink-400',
        cardColor: 'from-orange-500 to-red-500',
        emoji: '🏆'
      }
    ];

    const currentLevelInfo = levelInfo[currentLevel - 1];

    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentLevelInfo.bgGradient} p-4 md:p-8 relative overflow-hidden`}>
        {/* Arka plan dekoratif öğeler */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-10"
              style={{
                width: `${Math.random() * 150 + 100}px`,
                height: `${Math.random() * 150 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <button
              onClick={() => {
                playSound('click');
                setCurrentScreen('home');
              }}
              className="bg-white bg-opacity-30 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-xl hover:scale-110 transition-transform"
            >
              <ArrowLeft size={24} className="text-white md:w-8 md:h-8" />
            </button>

            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl px-6 py-3 md:px-8 md:py-4 shadow-xl">
              <div className="text-2xl md:text-3xl font-bold text-white text-center">
                {currentLevelInfo.emoji} {currentLevelInfo.name}
              </div>
              <div className="text-sm md:text-lg text-white text-center opacity-90">
                {currentLevelInfo.desc}
              </div>
            </div>

            <div className="w-12 md:w-16"></div>
          </div>

          {/* Stages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 max-w-7xl mx-auto mb-8 md:mb-12">
            {[...Array(12)].map((_, i) => {
              const stageNum = i + 1;
              const stars = stageStars[`level${currentLevel}_stage${stageNum}`] || 0;

              return (
                <button
                  key={i}
                  onClick={() => {
                    playSound('click');
                    startStage(stageNum);
                  }}
                  className="bg-white bg-opacity-85 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.8)] hover:scale-110 hover:bg-opacity-95 active:scale-95 transition-all duration-300 flex flex-col items-center gap-2 md:gap-3 border-4 border-white"
                  style={{
                    boxShadow: '0 10px 40px 0 rgba(0, 0, 0, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${currentLevelInfo.cardColor} flex items-center justify-center shadow-2xl`}
                    style={{
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), inset 0 -2px 10px rgba(0, 0, 0, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                      {stageNum}
                    </span>
                  </div>

                  <div className="text-sm md:text-base font-bold text-gray-800 drop-shadow-sm">
                    Stage {stageNum}
                  </div>

                  <div className="flex gap-1 md:gap-1.5">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="relative">
                        <Star
                          size={window.innerWidth < 768 ? 20 : 26}
                          className={`${
                            s <= stars
                              ? 'fill-yellow-400 text-yellow-500'
                              : 'text-gray-300'
                          } transition-all duration-300`}
                          style={s <= stars ? {
                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
                            transform: 'translateZ(10px)'
                          } : {
                            filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))'
                          }}
                        />
                        {s <= stars && (
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                              transform: 'scale(1.5)',
                              pointerEvents: 'none'
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level Navigation */}
          <div className="flex justify-center items-center gap-4 md:gap-8">
            <button
              onClick={() => {
                playSound('click');
                setCurrentLevel(Math.max(1, currentLevel - 1));
              }}
              className={`bg-white bg-opacity-30 backdrop-blur-md rounded-full p-3 md:p-4 shadow-xl transition-all duration-300 ${currentLevel === 1 ? 'opacity-30' : 'hover:scale-110 hover:bg-opacity-40'}`}
              disabled={currentLevel === 1}
            >
              <ArrowLeft size={28} className="text-white md:w-10 md:h-10" />
            </button>

            <div className="flex gap-2 md:gap-3 items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full px-6 py-3 md:px-8 md:py-4 shadow-xl">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    playSound('click');
                    setCurrentLevel(level);
                  }}
                  className={`w-3 h-3 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                    currentLevel === level
                      ? 'bg-white scale-125 shadow-lg'
                      : 'bg-white bg-opacity-40 hover:bg-opacity-60'
                  }`}
                ></button>
              ))}
            </div>

            <button
              onClick={() => {
                playSound('click');
                setCurrentLevel(Math.min(4, currentLevel + 1));
              }}
              className={`bg-white bg-opacity-30 backdrop-blur-md rounded-full p-3 md:p-4 shadow-xl transition-all duration-300 ${currentLevel === 4 ? 'opacity-30' : 'hover:scale-110 hover:bg-opacity-40'}`}
              disabled={currentLevel === 4}
            >
              <ArrowRight size={28} className="text-white md:w-10 md:h-10" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (currentScreen === 'quiz') {
    if (questions.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-300 to-pink-200 flex items-center justify-center">
          <div className="text-2xl text-white">Laden...</div>
        </div>
      );
    }
    const q = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-300 to-pink-200 p-4 md:p-8 relative flex flex-col">
        {showFeedback && selectedAnswer === q.correctAnswer && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-[fall_2s_linear]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                <div
                  className={`w-2 h-2 md:w-3 md:h-3 ${['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400'][Math.floor(Math.random() * 4)]}`}
                  style={{
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            playSound('click');
            setCurrentScreen('levels');
          }}
          className="absolute top-4 left-4 md:top-8 md:left-8 bg-white rounded-full p-2 md:p-4 shadow-lg hover:scale-110 transition-transform z-20"
        >
          <ArrowLeft size={20} className="text-purple-600 md:w-8 md:h-8" />
        </button>

        <div className="w-full max-w-3xl mx-auto mb-6 md:mb-8 pt-14 md:pt-2">
          <div className="bg-white rounded-full h-3 md:h-8 overflow-hidden shadow-lg">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm md:text-2xl font-bold text-white">
            Frage {currentQuestion + 1} von 10
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center w-full px-2 pb-20 md:pb-8">
          <div className="w-full max-w-xl md:max-w-2xl">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl mb-6 md:mb-8 animate-[slideIn_0.5s_ease-out]">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center text-gray-800 animate-[scaleIn_0.6s_ease-out] break-words">
                {q.dividend} : {q.divisor} = ?
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-5">
              {q.answers.map((answer, idx) => {
                const isCorrect = answer === q.correctAnswer;
                const isSelected = answer === selectedAnswer;

                let bgColor = 'from-blue-400 to-blue-600';
                if (showFeedback && isSelected) {
                  bgColor = isCorrect ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(answer)}
                    disabled={showFeedback}
                    className={`bg-gradient-to-b ${bgColor} text-white text-3xl sm:text-4xl md:text-5xl font-bold py-6 md:py-10 rounded-2xl md:rounded-3xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 disabled:cursor-not-allowed relative ${isSelected && showFeedback ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                  >
                    {answer}
                    {showFeedback && isSelected && (
                      <div className="absolute top-2 right-2 md:top-3 md:right-3">
                        {isCorrect ? (
                          <Check size={28} className="text-white md:w-10 md:h-10" />
                        ) : (
                          <X size={28} className="text-white md:w-10 md:h-10" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center md:relative md:bottom-auto">
          <div className="inline-block bg-yellow-400 rounded-full px-4 py-2 md:px-8 md:py-4 shadow-lg">
            <span className="text-base md:text-2xl lg:text-3xl font-bold text-gray-800">
              ⭐ Richtige Antworten: {score}/{currentQuestion + (showFeedback ? 1 : 0)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Ergebnis Screen
  if (currentScreen === 'result') {
    const stars = calculateStars(score);

    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-orange-300 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-[fall_3s_linear]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                <div
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]}`}
                ></div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-16 shadow-2xl max-w-2xl w-full text-center animate-[scaleIn_0.8s_ease-out] relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 md:mb-8 animate-[slideDown_0.5s_ease-out]">Gut gemacht!</h2>

          <div className="text-3xl md:text-5xl font-bold text-gray-700 mb-6 md:mb-8 animate-[fadeIn_1s_ease-in]">
            {score} von 10 richtig
          </div>

          <div className="flex justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                size={window.innerWidth < 768 ? 48 : 64}
                className={`${i <= stars ? 'fill-yellow-400 text-yellow-400 animate-[spin_1s_ease-in-out]' : 'text-gray-300'}`}
                style={{animationDelay: `${i * 0.2}s`}}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={() => {
                playSound('click');
                setCurrentScreen('levels');
              }}
              className="bg-gradient-to-b from-blue-400 to-blue-600 text-white text-xl md:text-3xl font-bold px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              Zurück zu Levels
            </button>

            {currentStage < 12 && (
              <button
                onClick={() => {
                  playSound('click');
                  startStage(currentStage + 1);
                }}
                className="bg-gradient-to-b from-green-400 to-green-600 text-white text-xl md:text-3xl font-bold px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl shadow-lg hover:scale-105 transition-transform"
              >
                Nächste Stage
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DiviGoKids;
