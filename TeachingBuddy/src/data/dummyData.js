export const users = [
  {
    id: '1',
    email: 'teacher1@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'John Doe',
  },
  {
    id: '2',
    email: 'teacher2@example.com',
    password: 'password456',
    name: 'Jane Smith',
  },
];

export const subjects = [
  { id: 'sub1', name: 'Mathematics' },
  { id: 'sub2', name: 'Science' },
  { id: 'sub3', name: 'English' },
  { id: 'sub4', name: 'History' },
  { id: 'sub5', name: 'Geography' },
  { id: 'sub6', name: 'Art' },
];

export const teachingRecords = [
  {
    id: 'rec1',
    userId: '1',
    date: '2024-07-15', // YYYY-MM-DD
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
  {
    id: 'rec4',
    userId: '2',
    date: '2024-07-16',
    period: 3,
    subjectId: 'sub4',
    subjectName: 'History',
    description: 'Ancient Civilizations: Egypt. Discussed pyramids and pharaohs.',
  },
  {
    id: 'rec5',
    userId: '1',
    date: '2024-07-17',
    period: 1,
    subjectId: 'sub1',
    subjectName: 'Mathematics',
    description: 'Chapter 5: Algebra - Solving linear equations. Practice problems from the textbook.',
  },
];

// Function to get records for a user (simulating a more complex backend)
export const getRecordsForUser = (userId) => {
  return teachingRecords.filter(record => record.userId === userId);
};

// Function to add a new record (simulating a more complex backend)
// In a real app, this would involve API calls and state management updates.
export const addTeachingRecord = (newRecord) => {
  const record = {
    id: `rec${teachingRecords.length + 1}`, // Simple ID generation
    ...newRecord,
    subjectName: subjects.find(s => s.id === newRecord.subjectId)?.name || 'Unknown Subject'
  };
  teachingRecords.push(record);
  return record;
};
