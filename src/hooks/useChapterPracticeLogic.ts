import { useState, useEffect } from "react";
import { QuestionsAPI } from "../lib/api";

type Question = {
  id: number;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
};

export function useChapterPracticeLogic(subject: string, topic: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const data = await QuestionsAPI.fetchBySubject(subject, topic);
        setQuestions(data);
      } catch (error) {
        console.error("Failed to load questions", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [subject, topic]);

  const handleAnswerSelect = (answer: string) => {
    if (!selectedAnswer) {
      setSelectedAnswer(answer);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedAnswer(null);
    }
  };

  return {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex],
    selectedAnswer,
    loading,
    handleAnswerSelect,
    handleNext,
    handlePrev,
  };
}
