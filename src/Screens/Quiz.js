import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import data from '../Data/Data.json';

export default function Quiz() {
  const quizData = data;

  const [questions, setQuestions] = useState(quizData.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(60);
  const [showTimer, setShowTimer] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const navigation = useNavigation();
  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0 && !showTimer) {
        setRemainingTime(remainingTime - 1);
      } else if (showTimer && countdown > 0) {
        setCountdown(countdown - 1);
      } else if (showTimer && countdown === 0) {
        moveNextQuestion();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [remainingTime, showTimer, countdown]);

  useEffect(() => {
    if (remainingTime === 0) {
      moveNextQuestion();
    }
  }, [remainingTime]);

  const moveNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setRemainingTime(60);
      setShowTimer(false);
      setCountdown(5);
    } else {
      navigation.navigate('QuizResult', {
        score,
        totalQuestions: questions.length,
      });
    }
  };

  const handleAnswer = (option, answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowTimer(true);

    if (answerIndex === questions[currentQuestionIndex].answerIndex) {
      setScore(score + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>
        {showTimer
          ? `Next Question In: ${countdown} seconds`
          : `Time Remaining: ${remainingTime} seconds`}
      </Text>
      <Text style={styles.question}>
        Question {currentQuestionIndex + 1}:{' '}
        {questions[currentQuestionIndex].question}
      </Text>
      {questions[currentQuestionIndex].options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            selectedAnswer === index && styles.selectedOption,
          ]}
          onPress={() => handleAnswer(option, index)}
          disabled={selectedAnswer !== null || showTimer}>
          <Text style={styles.optionNumber}>{index + 1}.</Text>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 16,
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  selectedOption: {
    backgroundColor: 'lightgreen',
  },
  optionNumber: {
    marginRight: 5,
    fontSize: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
});
