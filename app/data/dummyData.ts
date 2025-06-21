export interface User {
  id: string;
  email: string;
  password?: string; // Password should ideally not be stored like this
  name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface TeachingRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  period: number;
  subjectId: string;
  subjectName: string;
  description: string;
}

export const users: User[] = [
  {
    id: '1',
    email: 'teacher1@example.com',
    password: 'password123',
    name: 'John Doe',
  },
  {
    id: '2',
    email: 'teacher2@example.com',
    password: 'password456',
    name: 'Jane Smith',
  },
];

export const subjects: Subject[] = [
  { id: 'sub1', name: 'Mathematics' },
  { id: 'sub2', name: 'Science' },
  { id: 'sub3', name: 'English' },
  { id: 'sub4', name: 'History' },
  { id: 'sub5', name: 'Geography' },
  { id: 'sub6', name: 'Art' },
];

let teachingRecordsDB: TeachingRecord[] = [
  {
    id: 'rec1',
    userId: '1',
    date: '2024-07-15',
    period: 1,
    subjectId: 'sub1',
    subjectName: 'Mathematics',
    description: 'Chapter 5: Algebra - Introduction to variables and expressions. Completed exercises 5.1 and 5.2.',
  },
  {
    id: 'rec2',
    userId: '1',
    date: '2024-07-15',
    period: 2,
    subjectId: 'sub2',
    subjectName: 'Science',
    description: 'Topic: Photosynthesis. Explained the process and conducted a small quiz.',
  },
  {
    id: 'rec3',
    userId: '1',
    date: '2024-07-16',
    period: 1,
    subjectId: 'sub3',
    subjectName: 'English',
    description: 'Grammar: Tenses. Focused on past and present simple. Homework assigned.',
  },
];

export const getRecordsForUser = (userId: string): TeachingRecord[] => {
  return teachingRecordsDB.filter(record => record.userId === userId);
};

export const addTeachingRecord = (newRecordData: Omit<TeachingRecord, 'id' | 'subjectName'>): TeachingRecord => {
  const subject = subjects.find(s => s.id === newRecordData.subjectId);
  const record: TeachingRecord = {
    id: `rec${teachingRecordsDB.length + 1 + Date.now()}`, // More unique ID
    ...newRecordData,
    subjectName: subject?.name || 'Unknown Subject',
  };
  teachingRecordsDB.push(record);
  teachingRecordsDB.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.period - a.period);
  return record;
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (newUser: User): User | null => {
  if (findUserByEmail(newUser.email)) {
    return null; // User already exists
  }
  const userWithId = { ...newUser, id: `user${users.length + 1 + Date.now()}` };
  users.push(userWithId);
  return userWithId;
};

// --- Lesson Plan Data Structures and Functions ---

export interface LessonPlan {
  id: string;
  userId: string;
  title: string;
  subjectId: string;
  subjectName: string;
  date: string; // YYYY-MM-DD, or a general creation/target date
  objectives: string[];
  activities: string[];
  assessment: string;
  notes?: string; // Optional field for additional notes
}

let lessonPlansDB: LessonPlan[] = [
  {
    id: 'lp1',
    userId: '1',
    title: 'Introduction to Algebra',
    subjectId: 'sub1',
    subjectName: 'Mathematics',
    date: '2024-08-01',
    objectives: [
      'Understand the concept of variables.',
      'Form simple algebraic expressions.',
      'Solve basic linear equations with one variable.',
    ],
    activities: [
      'Lecture and examples (15 mins)',
      'Group work: Translating word problems to expressions (20 mins)',
      'Individual practice: Solving equations worksheet (15 mins)',
    ],
    assessment: 'Completion of worksheet problems. Observation during group work.',
    notes: 'Ensure to have enough manipulatives for visual learners during group work.'
  },
  {
    id: 'lp2',
    userId: '1',
    title: 'The Solar System',
    subjectId: 'sub2',
    subjectName: 'Science',
    date: '2024-08-05',
    objectives: [
      'Identify the planets in our solar system.',
      'Describe key characteristics of each planet.',
      'Understand the concept of orbits.',
    ],
    activities: [
      'Video: Journey through the Solar System (10 mins)',
      'Interactive model building (25 mins)',
      'Planet facts matching game (15 mins)',
    ],
    assessment: 'Quiz on planet names and one key fact. Participation in model building.',
  },
];

export const getLessonPlansForUser = (userId: string): LessonPlan[] => {
  return lessonPlansDB.filter(lp => lp.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addLessonPlan = (newPlanData: Omit<LessonPlan, 'id' | 'subjectName'>): LessonPlan => {
  const subject = subjects.find(s => s.id === newPlanData.subjectId);
  const plan: LessonPlan = {
    id: `lp${lessonPlansDB.length + 1 + Date.now()}`, // More unique ID
    ...newPlanData,
    subjectName: subject?.name || 'Unknown Subject',
  };
  lessonPlansDB.push(plan);
  // Sort again if maintaining a specific order in the DB array is important
  lessonPlansDB.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return plan;
};
