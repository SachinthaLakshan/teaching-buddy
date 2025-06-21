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
