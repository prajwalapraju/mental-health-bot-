export const affirmations = [
  "You are stronger than you think and more resilient than you know.",
  "You are capable of amazing things. Trust in your journey and be kind to yourself today.",
  "Every step forward, no matter how small, is progress worth celebrating.",
  "You have the power to create positive change in your life.",
  "Your feelings are valid, and it's okay to take things one day at a time.",
  "You are worthy of love, happiness, and all the good things life has to offer.",
  "Today is a new opportunity to practice self-compassion and growth.",
  "You have overcome challenges before, and you have the strength to overcome them again.",
  "Your mental health matters, and taking care of yourself is not selfish.",
  "You are not alone in your journey, and asking for help is a sign of strength.",
  "Every breath you take is a reminder that you are here, you are alive, and you matter.",
  "Progress, not perfection, is what truly counts on your healing journey.",
  "You have the courage to face whatever comes your way with grace and determination.",
  "Your story is still being written, and the best chapters are yet to come.",
  "You are deserving of peace, joy, and all the beautiful moments life has to offer.",
  "It's okay to rest, to pause, and to give yourself the time and space you need.",
  "You are learning, growing, and becoming stronger with each passing day.",
  "Your sensitivity is a superpower, not a weakness.",
  "You have the right to set boundaries and prioritize your well-being.",
  "Today, choose to be gentle with yourself and celebrate the small victories."
];

export function getRandomAffirmation(): string {
  return affirmations[Math.floor(Math.random() * affirmations.length)];
}

export function getDailyAffirmation(): string {
  // Use the current date as a seed for consistent daily affirmation
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return affirmations[dayOfYear % affirmations.length];
}
