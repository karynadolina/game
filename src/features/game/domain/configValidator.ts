import type {
  GameConfig,
  Question,
  ConfigValidationError,
  ConfigValidationResult,
} from './types';

const validateQuestion = (question: Question, index: number): ConfigValidationError[] => {
  const errors: ConfigValidationError[] = [];

  if (!question.id || typeof question.id !== 'string') {
    errors.push({
      type: 'invalidData',
      message: `Question at index ${index} has invalid or missing id`,
    });
  }

  if (!question.text || typeof question.text !== 'string') {
    errors.push({
      type: 'invalidData',
      message: `Question "${question.id || index}" has invalid or missing text`,
      questionId: question.id,
    });
  }

  if (!Array.isArray(question.answers) || question.answers.length < 2) {
    errors.push({
      type: 'invalidData',
      message: `Question "${question.id || index}" must have at least 2 answers`,
      questionId: question.id,
    });
    return errors;
  }

  const hasCorrectAnswer = question.answers.some((answer) => answer.isCorrect);
  if (!hasCorrectAnswer) {
    errors.push({
      type: 'noCorrectAnswer',
      message: `Question "${question.id}" has no correct answer`,
      questionId: question.id,
    });
  }

  const answerIds = new Set<string>();
  question.answers.forEach((answer, answerIndex) => {
    if (!answer.id || typeof answer.id !== 'string') {
      errors.push({
        type: 'invalidData',
        message: `Answer at index ${answerIndex} in question "${question.id}" has invalid id`,
        questionId: question.id,
      });
    } else if (answerIds.has(answer.id)) {
      errors.push({
        type: 'duplicateId',
        message: `Duplicate answer id "${answer.id}" in question "${question.id}"`,
        questionId: question.id,
      });
    } else {
      answerIds.add(answer.id);
    }

    if (!answer.text || typeof answer.text !== 'string') {
      errors.push({
        type: 'invalidData',
        message: `Answer "${answer.id || answerIndex}" in question "${question.id}" has invalid text`,
        questionId: question.id,
      });
    }
  });

  if (typeof question.timeLimit !== 'number' || question.timeLimit <= 0) {
    errors.push({
      type: 'invalidData',
      message: `Question "${question.id}" has invalid timeLimit`,
      questionId: question.id,
    });
  }

  return errors;
};

export const validateConfig = (config: unknown): ConfigValidationResult => {
  const errors: ConfigValidationError[] = [];

  if (!config || typeof config !== 'object') {
    return {
      isValid: false,
      errors: [{
        type: 'invalidData',
        message: 'Config must be a valid object',
      }],
    };
  }

  const gameConfig = config as GameConfig;

  if (!Array.isArray(gameConfig.questions) || gameConfig.questions.length === 0) {
    return {
      isValid: false,
      errors: [{
        type: 'empty',
        message: 'Config must contain at least one question',
      }],
    };
  }

  if (!Array.isArray(gameConfig.prizeLevels) || gameConfig.prizeLevels.length === 0) {
    return {
      isValid: false,
      errors: [{
        type: 'empty',
        message: 'Config must contain prize levels',
      }],
    };
  }

  const questionIds = new Set<string>();
  gameConfig.questions.forEach((question, index) => {
    const questionErrors = validateQuestion(question, index);
    errors.push(...questionErrors);

    if (question.id) {
      if (questionIds.has(question.id)) {
        errors.push({
          type: 'duplicateId',
          message: `Duplicate question id "${question.id}"`,
          questionId: question.id,
        });
      } else {
        questionIds.add(question.id);
      }
    }
  });

  if (gameConfig.prizeLevels.length !== gameConfig.questions.length) {
    errors.push({
      type: 'mismatchedLevels',
      message: `Prize levels count (${gameConfig.prizeLevels.length}) doesn't match questions count (${gameConfig.questions.length})`,
    });
  }

  gameConfig.prizeLevels.forEach((level, index) => {
    if (typeof level.amount !== 'number' || level.amount < 0) {
      errors.push({
        type: 'invalidData',
        message: `Prize level at index ${index} has invalid amount`,
      });
    }
    if (typeof level.questionIndex !== 'number') {
      errors.push({
        type: 'invalidData',
        message: `Prize level at index ${index} has invalid questionIndex`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
