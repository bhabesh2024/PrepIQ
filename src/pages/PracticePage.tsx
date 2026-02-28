import { useChapterPracticeLogic } from "../hooks/useChapterPracticeLogic";
import { cn } from "../utils/utils";

export function PracticePage() {
  const {
    currentQuestion,
    currentIndex,
    selectedAnswer,
    loading,
    handleAnswerSelect,
    handleNext,
    handlePrev,
    questions
  } = useChapterPracticeLogic("Maths", "Algebra");

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading questions...</div>;
  }

  if (!currentQuestion) {
    return <div className="flex justify-center items-center h-64">No questions found.</div>;
  }

  const isCorrect = selectedAnswer === currentQuestion.answer;

  return (
    <div className="container max-w-4xl py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Chapter Practice</h1>
        <div className="text-sm font-medium text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 mb-6">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.answer;
            const showCorrect = selectedAnswer && isCorrectOption;
            const showIncorrect = isSelected && !isCorrectOption;

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                disabled={!!selectedAnswer}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  !selectedAnswer && "hover:bg-accent hover:text-accent-foreground border-white/10",
                  showCorrect && "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400",
                  showIncorrect && "bg-destructive/10 border-destructive text-destructive",
                  !showCorrect && !showIncorrect && "bg-background/50 border-white/5"
                )}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {selectedAnswer && (
        <div className={cn(
          "glass-card rounded-2xl p-6 mb-6",
          isCorrect ? "bg-emerald-500/5 border-emerald-500/50" : "bg-destructive/5 border-destructive/50"
        )}>
          <h3 className={cn(
            "text-lg font-bold mb-2",
            isCorrect ? "text-emerald-500" : "text-destructive"
          )}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </h3>
          <p className="text-foreground/80">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="glass-card inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-accent/50 transition-colors h-11 px-6 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="glow-button inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-foreground text-background shadow-lg h-11 px-8 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
