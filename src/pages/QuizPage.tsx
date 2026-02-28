import { useQuizLogic } from "../hooks/useQuizLogic";
import { cn } from "../utils/utils";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function QuizPage() {
  const {
    questions,
    currentIndex,
    currentQuestion,
    answers,
    status,
    timeLeft,
    isFinished,
    score,
    loading,
    handleAnswer,
    clearAnswer,
    navigateTo,
    markForReviewAndNext,
    submitQuiz,
  } = useQuizLogic("Maths", 3600);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading quiz...</div>;
  }

  if (isFinished) {
    return (
      <div className="container max-w-4xl py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-8">Quiz Completed!</h1>
        <div className="p-8 rounded-2xl border bg-card text-card-foreground shadow-lg inline-block">
          <div className="text-6xl font-extrabold text-primary mb-4">{score}</div>
          <p className="text-xl text-muted-foreground">Total Score</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container max-w-7xl py-8 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mock Test</h1>
          <div className="flex items-center gap-2 text-lg font-mono glass-card px-4 py-2 rounded-xl">
            <Clock className="h-5 w-5 text-purple-500" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {currentQuestion && (
          <div className="glass-card rounded-3xl p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Question {currentIndex + 1}</h2>
              <span className="text-sm text-muted-foreground">
                {status[currentQuestion.id] === "marked_for_review" && (
                  <span className="flex items-center text-amber-500">
                    <AlertCircle className="h-4 w-4 mr-1" /> Marked for Review
                  </span>
                )}
              </span>
            </div>
            
            <p className="text-lg mb-8">{currentQuestion.text}</p>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex items-center",
                      isSelected
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-500"
                        : "bg-background/50 border-white/10 hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className={cn(
                      "h-5 w-5 rounded-full border flex items-center justify-center mr-4",
                      isSelected ? "border-indigo-500 bg-indigo-500 text-white" : "border-muted-foreground"
                    )}>
                      {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-current" />}
                    </div>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="glass-card inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-accent/50 transition-colors h-11 px-6 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={clearAnswer}
              disabled={!answers[currentQuestion?.id]}
              className="glass-card inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-accent/50 transition-colors h-11 px-6 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markForReviewAndNext}
              className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:bg-amber-500/20 h-11 px-6"
            >
              Mark for Review & Next
            </button>
            <button
              onClick={() => navigateTo(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1}
              className="glow-button inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-foreground text-background shadow-lg h-11 px-8 disabled:opacity-50"
            >
              Save & Next
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="glass-card rounded-3xl p-6 sticky top-24">
          <h3 className="font-semibold mb-4 text-lg">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2 mb-8">
            {questions.map((q, idx) => {
              const qStatus = status[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => navigateTo(idx)}
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-medium transition-colors border",
                    currentIndex === idx && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-background",
                    qStatus === "not_visited" && "bg-background/50 border-white/10 text-muted-foreground",
                    qStatus === "visited" && "bg-destructive/10 border-destructive/50 text-destructive",
                    qStatus === "answered" && "bg-emerald-500/10 border-emerald-500/50 text-emerald-500",
                    qStatus === "marked_for_review" && "bg-amber-500/10 border-amber-500/50 text-amber-500"
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-3 text-sm mb-8">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-md bg-emerald-500/20 border border-emerald-500/50" /> Answered
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-md bg-destructive/10 border border-destructive/50" /> Not Answered
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-md bg-background/50 border border-white/10" /> Not Visited
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-md bg-amber-500/20 border border-amber-500/50" /> Marked for Review
            </div>
          </div>

          <button
            onClick={submitQuiz}
            className="glow-button w-full inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-foreground text-background shadow-lg h-12 px-4"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}
