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
  Modal,
  Portal,
  RadioButton,
  IconButton, // Added for potential logout or other actions
} from 'react-native-paper';
import { subjects as allSubjects, teachingRecords as initialRecords, addTeachingRecord, getRecordsForUser, TeachingRecord, Subject } from '../data/dummyData'; // Corrected path assuming data is in app/data
import { useAuth } from '../services/AuthContext'; // Corrected path

const HomeScreen = () => {
  const theme = useTheme();
  const { user, logout } = useAuth(); // Get current user
  const [records, setRecords] = useState<TeachingRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const periods: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    if (user) {
      const userRecords = getRecordsForUser(user.id).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.period - a.period
      );
      setRecords(userRecords);
    }
  }, [user]); // Reload records if user changes or on initial load for the user

  const showModal = () => setModalVisible(true);
  const hideModal = () => {
    setModalVisible(false);
    setSelectedSubjectId('');
    setSelectedPeriod('');
    setDescription('');
    setFormError('');
  };

  const handleAddRecord = () => {
    if (!selectedSubjectId || !selectedPeriod || !description.trim()) {
      setFormError('All fields are required.');
      return;
    }
    if (!user) {
      Alert.alert("Error", "You must be logged in to add records.");
      return;
    }
    setFormError('');

    const newRecordData = {
      userId: user.id,
      date: new Date().toISOString().split('T')[0], // Today's date
      period: parseInt(selectedPeriod, 10),
      subjectId: selectedSubjectId,
      description: description.trim(),
    };

    const addedRecord = addTeachingRecord(newRecordData);
    setRecords(prevRecords => [addedRecord, ...prevRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.period - a.period
    ));
    hideModal();
    Alert.alert('Success', 'Teaching record added successfully.');
  };

  const renderRecordItem = ({ item }: { item: TeachingRecord }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={{ color: theme.colors.primary }}>{item.subjectName} - Period {item.period}</Title>
        <Paragraph style={styles.dateText}>Date: {new Date(item.date).toLocaleDateString()}</Paragraph>
        <Paragraph>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Daily Records
        </Text>
        {/* Optional: Logout button or user display */}
        {/* <IconButton icon="logout" onPress={logout} /> */}
      </View>


      <Button icon="plus-circle" mode="contained" onPress={showModal} style={styles.addButton}>
        Add New Record
      </Button>

      <FlatList
        data={records}
        renderItem={renderRecordItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No records found for {user?.name || 'current user'}. Add one!</Text>}
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
          <ScrollView>
            <Text variant="titleLarge" style={[styles.modalTitle, { color: theme.colors.primary }]}>Add New Teaching Record</Text>

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <Text style={styles.label}>Subject:</Text>
            <RadioButton.Group onValueChange={newValue => setSelectedSubjectId(newValue)} value={selectedSubjectId}>
              {allSubjects.map((subject: Subject) => (
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    flex: 1, // Allows title to center even if an icon button is on one side
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
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
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
    color: 'red', // Consider using theme.colors.error
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
    width: '25%',
  },
  periodRadioButton: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
});

export default HomeScreen;
