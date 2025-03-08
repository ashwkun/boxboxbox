export type MoodRating = 
  | 'LOVED_IT' // 😍 (5.0) - Absolutely amazing
  | 'ENJOYED_IT' // 😊 (4.0) - Really good
  | 'MEH' // 😐 (3.0) - It was okay
  | 'DISAPPOINTED' // 😕 (2.0) - Not what I expected
  | 'REGRET' // 😫 (1.0) - Waste of time

export interface Rating {
  mood: MoodRating;
  wouldRewatch: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const MOOD_DETAILS = {
  LOVED_IT: {
    emoji: '😍',
    label: 'Loved it!',
    description: 'Absolutely amazing',
    value: 5.0
  },
  ENJOYED_IT: {
    emoji: '😊',
    label: 'Enjoyed it',
    description: 'Really good',
    value: 4.0
  },
  MEH: {
    emoji: '😐',
    label: 'Meh',
    description: 'It was okay',
    value: 3.0
  },
  DISAPPOINTED: {
    emoji: '😕',
    label: 'Disappointed',
    description: 'Not what I expected',
    value: 2.0
  },
  REGRET: {
    emoji: '😫',
    label: 'Regret',
    description: 'Waste of time',
    value: 1.0
  }
} as const;

// Helper function to get numerical value from mood rating
export const getMoodValue = (mood: MoodRating): number => {
  return MOOD_DETAILS[mood].value;
};

// Helper function to get mood from numerical value
export const getMoodFromValue = (value: number): MoodRating => {
  let minDiff = Number.MAX_VALUE;
  let closestMood: MoodRating = 'MEH';

  (Object.entries(MOOD_DETAILS) as [MoodRating, typeof MOOD_DETAILS[MoodRating]][]).forEach(([mood, details]) => {
    const diff = Math.abs(details.value - value);
    if (diff < minDiff) {
      minDiff = diff;
      closestMood = mood;
    }
  });

  return closestMood;
}; 