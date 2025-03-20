import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/Card";
import { Button } from "./components/Button";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const allowedEmails = [
  "mike.fell1997@outlook.de",
  "marvin-schneider97@web.de"
];

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const questions = [
  {
    question: "Wie hoch ist der Körperschaftsteuersatz in Deutschland?",
    answers: ["15%", "25%", "30%", "10%"],
    correct: "15%",
    explanation: "Der Körperschaftsteuersatz beträgt in Deutschland 15%, zuzüglich Solidaritätszuschlag."
  }
];

export default function QuizApp() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => setUser(user));
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => setTimer((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex, user]);

  const login = () => {
    const email = prompt("E-Mail eingeben:");
    const password = prompt("Passwort eingeben:");
    if (!allowedEmails.includes(email)) {
      alert("Diese E-Mail ist nicht berechtigt!");
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Button onClick={login}>Einloggen</Button>
      </div>
    );
  }

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correct) {
      setFeedback("✅ Richtig! " + questions[currentQuestionIndex].explanation);
      setScore(score + 1);
    } else {
      setFeedback("❌ Falsch! " + questions[currentQuestionIndex].explanation);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback("");
    setTimer(15);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Punkte: {score}</h2>
      <Card className="w-full max-w-md p-4 text-center bg-gray-800 border border-gray-700">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">{questions[currentQuestionIndex].question}</h2>
          <p className="text-lg mb-2">⏳ {timer} Sekunden übrig</p>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestionIndex].answers.map((answer) => (
              <Button 
                key={answer} 
                className={`p-3 text-lg ${selectedAnswer === answer ? "bg-gray-600" : "bg-blue-600"}`} 
                onClick={() => handleAnswerClick(answer)}
              >
                {answer}
              </Button>
            ))}
          </div>
          {feedback && <p className="mt-4 text-lg">{feedback}</p>}
          <Button className="mt-4 p-3 bg-green-600" onClick={nextQuestion}>Nächste Frage</Button>
        </CardContent>
      </Card>
    </div>
  );
}

