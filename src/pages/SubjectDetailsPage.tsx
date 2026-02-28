import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Calculator, ChevronRight, PlayCircle, FileText, ArrowLeft, Brain, BookA, Globe, Newspaper, Microscope, MonitorPlay } from "lucide-react";

const subjectData: Record<string, any> = {
  maths: {
    name: "Mathematics",
    description: "Master quantitative aptitude, algebra, geometry, and advanced mathematics.",
    icon: Calculator,
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-500/10",
    iconColor: "text-blue-500",
    topics: [
      { id: "number-system", name: "Number System", concepts: 5 },
      { id: "average", name: "Average", concepts: 3 },
      { id: "percentage", name: "Percentage", concepts: 4 },
      { id: "profit-loss", name: "Profit and Loss", concepts: 6 },
      { id: "work-time", name: "Work and Time", concepts: 4 },
      { id: "ratio", name: "Ratio and Proportion", concepts: 3 },
      { id: "si", name: "Simple Interest (SI)", concepts: 2 },
      { id: "ci", name: "Compound Interest (CI)", concepts: 3 },
      { id: "lcm-hcf", name: "LCM and HCF", concepts: 3 },
      { id: "fraction-decimal", name: "Fraction and Decimal", concepts: 2 },
      { id: "train", name: "Train", concepts: 3 },
      { id: "speed-distance-time", name: "Speed, Distance and Time", concepts: 4 },
      { id: "boat-streams", name: "Boat and Streams", concepts: 2 },
      { id: "partnership", name: "Partnership", concepts: 2 },
      { id: "algebra", name: "Algebra", concepts: 8 },
      { id: "trigonometry", name: "Trigonometry", concepts: 6 },
      { id: "geometry", name: "Geometry", concepts: 7 },
      { id: "mensuration", name: "Mensuration", concepts: 5 },
      { id: "statistics", name: "Statistics", concepts: 4 },
    ]
  },
  reasoning: {
    name: "Reasoning",
    description: "Enhance your logical, analytical, and verbal reasoning skills.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-500/10",
    iconColor: "text-purple-500",
    topics: [
      { id: "blood-relations", name: "Blood Relations", concepts: 3 },
      { id: "coding-decoding", name: "Coding and Decoding", concepts: 4 },
      { id: "syllogism", name: "Syllogism", concepts: 5 },
    ]
  },
  english: {
    name: "English",
    description: "Improve grammar, vocabulary, reading comprehension, and verbal ability.",
    icon: BookA,
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    topics: [
      { id: "parts-of-speech", name: "Parts of Speech", concepts: 8 },
      { id: "subject-verb-agreement", name: "Subject Verb Agreement", concepts: 4 },
      { id: "tenses", name: "Tenses", concepts: 6 },
      { id: "voice-change", name: "Voice Change", concepts: 3 },
      { id: "narration", name: "Narration", concepts: 4 },
      { id: "synonyms-antonyms", name: "Synonyms and Antonyms", concepts: 5 },
      { id: "idioms-phrases", name: "Idioms and Phrases", concepts: 6 },
      { id: "one-word-substitution", name: "One Word Substitution", concepts: 4 },
      { id: "reading-comprehension", name: "Reading Comprehension", concepts: 5 },
    ]
  },
  gk: {
    name: "General Knowledge",
    description: "Explore history, geography, polity, economics, and general science.",
    icon: Globe,
    color: "from-orange-500 to-amber-500",
    bgLight: "bg-orange-500/10",
    iconColor: "text-orange-500",
    topics: [
      { id: "history", name: "History", concepts: 8 },
      { id: "geography", name: "Geography", concepts: 6 },
      { id: "polity", name: "Polity", concepts: 5 },
    ]
  },
  "current-affairs": {
    name: "Current Affairs",
    description: "Stay updated with the latest national and international events.",
    icon: Newspaper,
    color: "from-rose-500 to-red-500",
    bgLight: "bg-rose-500/10",
    iconColor: "text-rose-500",
    topics: [
      { id: "national", name: "National Events", concepts: 4 },
      { id: "international", name: "International Events", concepts: 4 },
      { id: "sports", name: "Sports", concepts: 2 },
    ]
  },
  "science-tech": {
    name: "Science & Tech",
    description: "Learn about recent advancements in science, space, defense, and technology.",
    icon: Microscope,
    color: "from-indigo-500 to-violet-500",
    bgLight: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    topics: [
      { id: "space", name: "Space Technology", concepts: 3 },
      { id: "defense", name: "Defense Technology", concepts: 2 },
      { id: "biotech", name: "Biotechnology", concepts: 4 },
    ]
  },
  computer: {
    name: "Computer",
    description: "Master computer fundamentals, networking, software, and basic programming.",
    icon: MonitorPlay,
    color: "from-sky-500 to-blue-500",
    bgLight: "bg-sky-500/10",
    iconColor: "text-sky-500",
    topics: [
      { id: "fundamentals", name: "Computer Fundamentals", concepts: 5 },
      { id: "networking", name: "Networking", concepts: 4 },
      { id: "software", name: "Software & OS", concepts: 4 },
    ]
  }
};

export function SubjectDetailsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const location = useLocation();
  const isPracticeMode = location.pathname.startsWith('/practice');
  const subject = subjectId ? subjectData[subjectId] : null;

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Subject Not Found</h2>
        <p className="text-muted-foreground mb-6">The subject you are looking for does not exist or has no topics yet.</p>
        <Link to={isPracticeMode ? "/practice" : "/subjects"} className="glow-button bg-foreground text-background px-6 py-2 rounded-xl font-medium">
          Back to {isPracticeMode ? "Practice" : "Subjects"}
        </Link>
      </div>
    );
  }

  const Icon = subject.icon;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-white/10 bg-background/50 backdrop-blur-xl pt-8 pb-12">
        <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-5`} />
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <Link to={isPracticeMode ? "/practice" : "/subjects"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to {isPracticeMode ? "Practice" : "Subjects"}
          </Link>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className={`w-20 h-20 rounded-2xl ${subject.bgLight} flex items-center justify-center shrink-0`}>
              <Icon className={`w-10 h-10 ${subject.iconColor}`} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{subject.name} {isPracticeMode && "Practice"}</h1>
              <p className="text-muted-foreground max-w-2xl">{subject.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" /> {isPracticeMode ? "Practice Topics" : "Course Topics"}
          </h2>
          <span className="text-sm font-medium text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {subject.topics.length} Topics
          </span>
        </div>

        <div className="grid gap-4">
          {subject.topics.map((topic: any, index: number) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl p-4 sm:p-6 hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{topic.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {topic.concepts} Concepts</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:w-auto w-full">
                  {isPracticeMode ? (
                    <Link 
                      to={`/practice/${subjectId}/${topic.id}`}
                      className="flex-1 sm:flex-none bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors text-center"
                    >
                      Start Practice
                    </Link>
                  ) : (
                    <Link 
                      to={`/learn/${subjectId}/${topic.id}`}
                      className="flex-1 sm:flex-none bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors text-center"
                    >
                      Read Concepts
                    </Link>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
