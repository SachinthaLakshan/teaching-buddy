import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Card,
  Title,
  Paragraph,
  IconButton,
  Modal,
  Portal,
  Provider as PaperProvider, // Renamed to avoid conflict if used elsewhere
  Dialog,
  RadioButton,
} from 'react-native-paper';
import { subjects as allSubjects, teachingRecords, addTeachingRecord, getRecordsForUser } from '../../data/dummyData';
// For a real app, user context would be used to get current user ID
const MOCK_USER_ID = '1'; // Assuming user '1' is logged in for now

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [records, setRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(''); // Store as string
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const periods = [1, 2, 3, 4, 5, 6, 7, 8]; // Example periods

  useEffect(() => {
    // Load records for the current user
    const userRecords = getRecordsForUser(MOCK_USER_ID).sort((a, b) => new Date(b.date) - new Date(a.date) || b.period - a.period);
    setRecords(userRecords);
  }, []);

  const showModal = () => setModalVisible(true);
  const hideModal = () => {
    setModalVisible(false);
    // Reset form
    setSelectedSubject('');
    setSelectedPeriod('');
    setDescription('');
    setFormError('');
  };

  const handleAddRecord = () => {
    if (!selectedSubject || !selectedPeriod || !description.trim()) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');

    const newRecordData = {
      userId: MOCK_USER_ID,
      date: new Date().toISOString().split('T')[0], // Today's date
      period: parseInt(selectedPeriod, 10),
      subjectId: selectedSubject,
      description: description.trim(),
    };

    const addedRecord = addTeachingRecord(newRecordData); // Add to dummy data
    setRecords(prevRecords => [addedRecord, ...prevRecords].sort((a, b) => new Date(b.date) - new Date(a.date) || b.period - a.period));
    hideModal();
    Alert.alert('Success', 'Teaching record added successfully.');
  };

  const renderRecordItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={{ color: theme.colors.primary }}>{item.subjectName} - Period {item.period}</Title>
        <Paragraph style={styles.dateText}>Date: {new Date(item.date).toLocaleDateString()}</Paragraph>
        <Paragraph>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    // PaperProvider is needed for Modal, Dialog etc. If already at App root, this might be redundant
    // However, for screen-level components that use Portal, it's often included.
    // Let's assume App.js will have the main PaperProvider.
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
        Daily Teaching Records
      </Text>

      <Button icon="plus-circle" mode="contained" onPress={showModal} style={styles.addButton}>
        Add New Record
      </Button>

      <FlatList
        data={records}
        renderItem={renderRecordItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No records found. Add one!</Text>}
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
          <ScrollView>
            <Text variant="titleLarge" style={[styles.modalTitle, { color: theme.colors.primary }]}>Add New Teaching Record</Text>

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <Text style={styles.label}>Subject:</Text>
            <RadioButton.Group onValueChange={newValue => setSelectedSubject(newValue)} value={selectedSubject}>
              {allSubjects.map(subject => (
                <RadioButton.Item key={subject.id} label={subject.name} value={subject.id} />
              ))}
            </RadioButton.Group>

            <Text style={styles.label}>Period:</Text>
            <RadioButton.Group onValueChange={newValue => setSelectedPeriod(newValue)} value={selectedPeriod}>
               <View style={styles.periodContainer}>
                {periods.map(p => (
                  <View key={p} style={styles.radioButtonWrapper}>
                    <RadioButton.Item label={String(p)} value={String(p)} style={styles.periodRadioButton} />
                  </View>
                ))}
              </View>
            </RadioButton.Group>


            <TextInput
              label="Description of Work Done"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddRecord} style={styles.button}>
              Save Record
            </Button>
            <Button mode="outlined" onPress={hideModal} style={styles.button}>
              Cancel
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 3,
  },
  dateText: {
    fontSize: 12,
    color: 'grey',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'grey',
  },
  // Modal Styles
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%', // Ensure modal is scrollable if content is long
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  periodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  radioButtonWrapper: {
    width: '25%', // Adjust for 4 items per row roughly
  },
   periodRadioButton: {
    paddingHorizontal: 0, // Reduce padding to fit more items
    marginHorizontal: 0,
  },
});

export default HomeScreen;
