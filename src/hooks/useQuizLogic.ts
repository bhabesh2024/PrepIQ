import { useState, useEffect, useCallback } from "react";
import { QuestionsAPI } from "../lib/api";

type QuestionStatus = "not_visited" | "visited" | "answered" | "marked_for_review";

type QuizQuestion = {
  id: number;
  text: string;
  options: string[];
  answer: string;
};

type QuizState = {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<number, string>;
  status: Record<number, QuestionStatus>;
  timeLeft: number;
  isFinished: boolean;
  score: number | null;
};

export function useQuizLogic(subject: string, initialTime: number = 3600) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    answers: {},
    status: {},
    timeLeft: initialTime,
    isFinished: false,
    score: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const data = await QuestionsAPI.fetchBySubject(subject);
        const initialStatus: Record<number, QuestionStatus> = {};
        data.forEach((q: any) => {
          initialStatus[q.id] = "not_visited";
        });
        if (data.length > 0) {
          initialStatus[data[0].id] = "visited";
        }
        setState((prev) => ({
          ...prev,
          questions: data,
          status: initialStatus,
        }));
      } catch (error) {
        console.error("Failed to load quiz questions", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [subject]);

  useEffect(() => {
    if (state.isFinished || loading) return;

    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, timeLeft: 0, isFinished: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isFinished, loading]);

  const handleAnswer = (answer: string) => {
    setState((prev) => {
      const currentQ = prev.questions[prev.currentIndex];
      return {
        ...prev,
        answers: { ...prev.answers, [currentQ.id]: answer },
        status: { ...prev.status, [currentQ.id]: "answered" },
      };
    });
  };

  const clearAnswer = () => {
    setState((prev) => {
      const currentQ = prev.questions[prev.currentIndex];
      const newAnswers = { ...prev.answers };
      delete newAnswers[currentQ.id];
      return {
        ...prev,
        answers: newAnswers,
        status: { ...prev.status, [currentQ.id]: "visited" },
      };
    });
  };

  const navigateTo = (index: number) => {
    setState((prev) => {
      if (index < 0 || index >= prev.questions.length) return prev;
      const nextQ = prev.questions[index];
      const currentStatus = prev.status[nextQ.id];
      
      const newStatus = { ...prev.status };
      if (currentStatus === "not_visited") {
        newStatus[nextQ.id] = "visited";
      }

      return {
        ...prev,
        currentIndex: index,
        status: newStatus,
      };
    });
  };

  const markForReviewAndNext = () => {
    setState((prev) => {
      const currentQ = prev.questions[prev.currentIndex];
      const newStatus = { ...prev.status, [currentQ.id]: "marked_for_review" };
      
      const nextIndex = prev.currentIndex + 1 < prev.questions.length ? prev.currentIndex + 1 : prev.currentIndex;
      const nextQ = prev.questions[nextIndex];
      if (newStatus[nextQ.id] === "not_visited") {
        newStatus[nextQ.id] = "visited";
      }

      return {
        ...prev,
        currentIndex: nextIndex,
        status: newStatus,
      };
    });
  };

  const submitQuiz = useCallback(() => {
    setState((prev) => {
      let correct = 0;
      let wrong = 0;
      prev.questions.forEach((q) => {
        const ans = prev.answers[q.id];
        if (ans) {
          if (ans === q.answer) correct++;
          else wrong++;
        }
      });
      const score = correct * 1 - wrong * 0.25;
      return { ...prev, isFinished: true, score };
    });
  }, []);

  return {
    ...state,
    loading,
    currentQuestion: state.questions[state.currentIndex],
    handleAnswer,
    clearAnswer,
    navigateTo,
    markForReviewAndNext,
    submitQuiz,
  };
}
