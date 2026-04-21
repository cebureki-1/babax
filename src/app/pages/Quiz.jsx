import { useState } from "react";
import { CheckCircle, XCircle, Trophy, RotateCcw, Lightbulb } from "lucide-react";

const quizData = [
  {
    question: "Какое действие больше всего экономит электроэнергию?",
    options: [
      "Использование энергосберегающих ламп",
      "Постоянное включение и выключение телевизора",
      "Окраска стен в темные цвета"
    ],
    correct: 0,
    points: 10,
    advice: "Светодиодные лампы потребляют до 80% меньше энергии!"
  },
  {
    question: "Что происходит с пластиковой бутылкой, если ее не переработать?",
    options: [
      "Она разложится за год",
      "Она будет распадаться на микропластик 450+ лет",
      "Она превратится в удобрение"
    ],
    correct: 1,
    points: 10,
    advice: "Пластик не исчезает, он просто становится мельче и попадает в воду."
  },
  {
    question: "Что означает маркировка «петля Мёбиуса» на упаковке?",
    options: [
      "Товар токсичен",
      "Упаковку можно переработать",
      "Товар сделан в Европе"
    ],
    correct: 1,
    points: 10,
    advice: "Материал (или его часть) продукции является повторно переработанным или, наоборот, применяемые материалы могут быть вторично использованы после утилизации"
  },
  {
    question: "Оставлять зарядку в розетке без телефона — это...",
    options: [
      "Безопасно и не тратит ток",
      "Трата энергии (пассивное потребление)",
      "Полезно для срока службы зарядки"
    ],
    correct: 1,
    points: 10,
    advice: "Даже если телефон не подключен, блок питания потребляет небольшое количество энергии."
  },
  {
    question: "Какую сумку вы используете для походов в магазин?",
    options: [
      "Каждый раз покупаю новый пластиковый пакет",
      "Использую бумажные пакеты",
      "Хожу со своей многоразовой сумкой/шоппером"
    ],
    correct: 2,
    points: 10,
    advice: "Бумажные пакеты — лучше пластика, но на них тратится дерево"
  },
  {
    question: "Как вы поступаете с ненужной одеждой?",
    options: [
      "Выбрасываю в обычный мусор",
      "Сдаю в переработку или фонды",
      "Оставляю в шкафу"
    ],
    correct: 1,
    points: 10,
    advice: "Передача одежды в фонды дает вещам вторую жизнь и сокращает количество текстильного мусора!"
  }
];

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    
    setSelectedAnswer(index);
    const isCorrect = index === quizData[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + quizData[currentQuestion].points);
    }
    
    setAnswers([
      ...answers,
      {
        question: currentQuestion,
        selected: index,
        correct: quizData[currentQuestion].correct,
        isCorrect: isCorrect,
      }
    ]);
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const maxScore = quizData.reduce((sum, q) => sum + q.points, 0);
  const scorePercentage = (score / maxScore) * 100;

  if (quizCompleted) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Викторина завершена!
              </h1>
              <p className="text-gray-600 mb-6">Ваш результат</p>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-6">
                <p className="text-5xl font-bold text-gray-900 mb-2">
                  {score} / {maxScore}
                </p>
                <p className="text-lg text-gray-600">баллов ({scorePercentage.toFixed(0)}%)</p>
              </div>

              {scorePercentage === 100 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <p className="text-green-800 font-medium">
                    🎉 Отлично! Вы настоящий эко-эксперт!
                  </p>
                </div>
              )}
              {scorePercentage >= 70 && scorePercentage < 100 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-blue-800 font-medium">
                    👏 Хороший результат! Продолжайте в том же духе!
                  </p>
                </div>
              )}
              {scorePercentage < 70 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <p className="text-yellow-800 font-medium">
                    💪 Есть куда расти! Изучите советы ниже.
                  </p>
                </div>
              )}

              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors mx-auto font-medium"
              >
                <RotateCcw className="w-5 h-5" />
                Пройти заново
              </button>
            </div>
          </div>

          {/* Review Answers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Обзор ответов
            </h2>
            <div className="space-y-6">
              {quizData.map((question, index) => {
                const userAnswer = answers.find((a) => a.question === index);
                const isCorrect = userAnswer?.isCorrect;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ваш ответ: <span className={isCorrect ? "text-green-700" : "text-red-700"}>{question.options[userAnswer?.selected]}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-gray-600">
                            Правильный ответ: <span className="text-green-700">{question.options[question.correct]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white rounded-lg p-3 ml-9">
                      <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{question.advice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Эко-викторина</h1>
          <p className="text-gray-600">Проверьте свои знания об экологии и энергосбережении</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Вопрос {currentQuestion + 1} из {quizData.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              Баллы: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correct;
              const showCorrect = showResult && isCorrect;
              const showIncorrect = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : showIncorrect
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  } ${selectedAnswer !== null ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">{option}</span>
                    {showCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {showIncorrect && <XCircle className="w-6 h-6 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Advice */}
          {showResult && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900 mb-1">Совет:</p>
                  <p className="text-sm text-yellow-800">{question.advice}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              {currentQuestion < quizData.length - 1 ? "Следующий вопрос" : "Завершить викторину"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
