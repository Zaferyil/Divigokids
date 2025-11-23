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

  // Bölme soruları üretme (sonuç her zaman tam sayı)
  const generateQuestions = (stage, level) => {
    const qs = [];

    if (level === 1) {
      // Level 1: Basit bölme işlemleri
      const divisor = stage <= 6 ? stage + 1 : stage - 1; // 2-10 arası bölenler

      for (let i = 0; i < 10; i++) {
        const correctAnswer = Math.floor(Math.random() * 10) + 1;
        const dividend = divisor * correctAnswer; // Tam bölünebilir sayı
        const wrongAnswers = [];

        let attempts = 0;
        while (wrongAnswers.length < 3 && attempts < 50) {
          attempts++;
          const wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
          if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
          }
        }

        // Yeterli yanlış cevap bulunamadıysa, manuel olarak ekle
        while (wrongAnswers.length < 3) {
          const fallback = wrongAnswers.length === 0 ? correctAnswer + 1 :
                          wrongAnswers.length === 1 ? correctAnswer + 2 : correctAnswer - 1;
          if (fallback > 0 && fallback !== correctAnswer && !wrongAnswers.includes(fallback)) {
            wrongAnswers.push(fallback);
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

        let attempts = 0;
        while (wrongAnswers.length < 3 && attempts < 50) {
          attempts++;
          const wrong = correctAnswer + Math.floor(Math.random() * 12) - 6;
          if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
          }
        }

        while (wrongAnswers.length < 3) {
          const fallback = wrongAnswers.length === 0 ? correctAnswer + 1 :
                          wrongAnswers.length === 1 ? correctAnswer + 2 : correctAnswer - 1;
          if (fallback > 0 && fallback !== correctAnswer && !wrongAnswers.includes(fallback)) {
            wrongAnswers.push(fallback);
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

        let attempts = 0;
        while (wrongAnswers.length < 3 && attempts < 50) {
          attempts++;
          const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
          if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
          }
        }

        while (wrongAnswers.length < 3) {
          const fallback = wrongAnswers.length === 0 ? correctAnswer + 3 :
                          wrongAnswers.length === 1 ? correctAnswer + 5 : correctAnswer - 3;
          if (fallback > 0 && fallback !== correctAnswer && !wrongAnswers.includes(fallback)) {
            wrongAnswers.push(fallback);
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

        let attempts = 0;
        while (wrongAnswers.length < 3 && attempts < 50) {
          attempts++;
          const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
          if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
          }
        }

        while (wrongAnswers.length < 3) {
          const fallback = wrongAnswers.length === 0 ? correctAnswer + 4 :
                          wrongAnswers.length === 1 ? correctAnswer + 7 : correctAnswer - 4;
          if (fallback > 0 && fallback !== correctAnswer && !wrongAnswers.includes(fallback)) {
            wrongAnswers.push(fallback);
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
        const stars = finalScore >= 9 ? 3 : finalScore >= 7 ? 2 : finalScore >= 5 ? 1 : 0;

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
        name: 'STARTER',
        desc: 'Einfache Division',
        bgGradient: 'from-lime-400 via-green-400 to-emerald-500',
        cardGradient: 'from-lime-400 to-green-500',
        glowColor: 'rgba(132, 204, 22, 0.4)',
        emoji: '🌟',
        icon: '🎯'
      },
      {
        name: 'CHAMPION',
        desc: 'Zweistellige Zahlen',
        bgGradient: 'from-cyan-400 via-blue-500 to-indigo-600',
        cardGradient: 'from-cyan-400 to-blue-600',
        glowColor: 'rgba(34, 211, 238, 0.4)',
        emoji: '⚡',
        icon: '🚀'
      },
      {
        name: 'HERO',
        desc: 'Dreistellige Zahlen',
        bgGradient: 'from-fuchsia-400 via-purple-500 to-pink-600',
        cardGradient: 'from-fuchsia-400 to-purple-600',
        glowColor: 'rgba(232, 121, 249, 0.4)',
        emoji: '💎',
        icon: '⭐'
      },
      {
        name: 'LEGEND',
        desc: 'Meister Level!',
        bgGradient: 'from-amber-400 via-orange-500 to-red-600',
        cardGradient: 'from-amber-400 to-red-600',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        emoji: '👑',
        icon: '🏆'
      }
    ];

    const currentLevelInfo = levelInfo[currentLevel - 1];

    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentLevelInfo.bgGradient} p-4 md:p-8 relative overflow-hidden`}>
        {/* Animierte Hintergrund Elemente */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={`bg-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${currentLevelInfo.glowColor} 0%, transparent 70%)`,
                animation: `float ${Math.random() * 8 + 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(40px)',
              }}
            ></div>
          ))}

          {/* Sterne Animation */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-white text-2xl opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 6 + 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Header mit mega Style */}
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <button
              onClick={() => {
                playSound('click');
                setCurrentScreen('home');
              }}
              className="bg-white text-gray-800 rounded-2xl p-3 md:p-4 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
              style={{
                boxShadow: `0 0 30px ${currentLevelInfo.glowColor}`
              }}
            >
              <ArrowLeft size={28} className="md:w-10 md:h-10" />
            </button>

            <div className="flex-1 mx-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl px-6 py-4 md:px-10 md:py-6 shadow-2xl border-4 border-white text-center"
                style={{
                  boxShadow: `0 0 40px ${currentLevelInfo.glowColor}, inset 0 0 30px rgba(255, 255, 255, 0.2)`
                }}
              >
                <div className="text-5xl md:text-7xl mb-2">
                  {currentLevelInfo.emoji}
                </div>
                <div className="text-2xl md:text-4xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] tracking-wider">
                  {currentLevelInfo.name}
                </div>
                <div className="text-sm md:text-xl text-white font-bold opacity-90 mt-1">
                  {currentLevelInfo.desc}
                </div>
              </div>
            </div>

            <div className="w-14 md:w-20"></div>
          </div>

          {/* Stages Grid - Gaming Style */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto mb-8 md:mb-12">
            {[...Array(12)].map((_, i) => {
              const stageNum = i + 1;
              const stars = stageStars[`level${currentLevel}_stage${stageNum}`] || 0;

              return (
                <div
                  key={i}
                  className="relative rounded-2xl md:rounded-3xl p-[4px] hover:scale-110 active:scale-95 transition-all duration-300 animate-[fadeIn_0.5s_ease-out]"
                  style={{
                    background: `linear-gradient(135deg, ${
                      currentLevel === 1 ? '#84cc16, #22c55e, #10b981' :
                      currentLevel === 2 ? '#22d3ee, #3b82f6, #6366f1' :
                      currentLevel === 3 ? '#e879f9, #a855f7, #ec4899' :
                      '#fbbf24, #f97316, #ef4444'
                    })`,
                    boxShadow: `0 8px 30px ${currentLevelInfo.glowColor}, 0 0 20px ${currentLevelInfo.glowColor}`,
                    animationDelay: `${i * 0.05}s`
                  }}
                >
                  <button
                    onClick={() => {
                      playSound('click');
                      startStage(stageNum);
                    }}
                    className="w-full bg-gradient-to-br from-white to-gray-50 rounded-[14px] md:rounded-[22px] p-3 md:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-2"
                  >
                    {/* Stage Nummer Box */}
                    <div
                      className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br ${currentLevelInfo.cardGradient} flex items-center justify-center shadow-2xl relative overflow-hidden`}
                      style={{
                        boxShadow: `0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px ${currentLevelInfo.glowColor}`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black opacity-20"></div>
                      <span className="relative text-3xl md:text-5xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] tracking-tight">
                        {stageNum}
                      </span>
                    </div>

                    {/* Stars - Größer und 3D */}
                    <div className="flex gap-0.5 md:gap-1 mt-1">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className="relative">
                          <Star
                            size={window.innerWidth < 768 ? 16 : 22}
                            className={`${
                              s <= stars
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-gray-300'
                            } transition-all duration-300`}
                            style={s <= stars ? {
                              filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))',
                            } : {
                              filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))'
                            }}
                          />
                          {s <= stars && (
                            <div
                              className="absolute inset-0 rounded-full animate-pulse"
                              style={{
                                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)',
                                transform: 'scale(1.8)',
                                pointerEvents: 'none'
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Level Navigation - Modern Gaming Style */}
          <div className="flex justify-center items-center gap-4 md:gap-6">
            <button
              onClick={() => {
                playSound('click');
                setCurrentLevel(Math.max(1, currentLevel - 1));
              }}
              className={`bg-white rounded-2xl p-3 md:p-5 shadow-2xl transition-all duration-300 ${
                currentLevel === 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:scale-110 active:scale-95'
              }`}
              disabled={currentLevel === 1}
              style={{
                boxShadow: currentLevel === 1 ? 'none' : `0 8px 30px ${currentLevelInfo.glowColor}`
              }}
            >
              <ArrowLeft size={32} className="text-gray-800 md:w-12 md:h-12" />
            </button>

            {/* Level Dots - Größer und colorful */}
            <div className="flex gap-3 md:gap-4 items-center bg-white bg-opacity-20 backdrop-blur-xl rounded-full px-6 py-4 md:px-10 md:py-5 shadow-2xl border-2 border-white"
              style={{
                boxShadow: `0 0 30px ${currentLevelInfo.glowColor}`
              }}
            >
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    playSound('click');
                    setCurrentLevel(level);
                  }}
                  className={`transition-all duration-300 rounded-full flex items-center justify-center font-bold ${
                    currentLevel === level
                      ? 'w-10 h-10 md:w-14 md:h-14 bg-white text-gray-800 scale-110 shadow-xl text-lg md:text-2xl'
                      : 'w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-40 hover:bg-opacity-60 text-white text-sm md:text-lg'
                  }`}
                  style={currentLevel === level ? {
                    boxShadow: `0 0 20px ${currentLevelInfo.glowColor}`
                  } : {}}
                >
                  {level}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                playSound('click');
                setCurrentLevel(Math.min(4, currentLevel + 1));
              }}
              className={`bg-white rounded-2xl p-3 md:p-5 shadow-2xl transition-all duration-300 ${
                currentLevel === 4
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:scale-110 active:scale-95'
              }`}
              disabled={currentLevel === 4}
              style={{
                boxShadow: currentLevel === 4 ? 'none' : `0 8px 30px ${currentLevelInfo.glowColor}`
              }}
            >
              <ArrowRight size={32} className="text-gray-800 md:w-12 md:h-12" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (currentScreen === 'quiz' && questions.length > 0) {
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
    const stars = score >= 9 ? 3 : score >= 7 ? 2 : score >= 5 ? 1 : 0;

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
