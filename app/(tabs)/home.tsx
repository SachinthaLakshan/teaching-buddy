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
        <Paragraph style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>Date: {new Date(item.date).toLocaleDateString()}</Paragraph>
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
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.colors.onSurfaceDisabled }]}>No records found for {user?.name || 'current user'}. Add one!</Text>}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.modalContentContainer, { backgroundColor: theme.colors.elevation.level3 }]} // Use elevation for modal background
          // Consider adding animationType="slide" or "fade" if desired, though Paper Modal has its own.
        >
          <Card style={styles.modalCard}>
            <Card.Title
              title="Add New Teaching Record"
              titleVariant="headlineSmall"
              titleStyle={{color: theme.colors.primary, textAlign: 'center'}}
              right={(props) => <IconButton {...props} icon="close-circle-outline" onPress={hideModal} />}
            />
            <Card.Content>
              <ScrollView>
                {formError ? <Text style={[styles.errorText, {color: theme.colors.error}]}>{formError}</Text> : null}

                <View style={styles.formSection}>
                  <Text variant="titleMedium" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>Select Subject</Text>
                  <RadioButton.Group onValueChange={newValue => setSelectedSubjectId(newValue)} value={selectedSubjectId}>
                    <View style={styles.radioGroupContainer}>
                    {allSubjects.map((subject: Subject) => (
                      <View key={subject.id} style={styles.radioButtonItemContainer}>
                        <RadioButton.Item
                          label={subject.name}
                          value={subject.id}
                          style={styles.radioButtonItem}
                          labelStyle={{fontSize: 14}}
                          position="leading" // Icon on the left, label on the right
                        />
                      </View>
                    ))}
                    </View>
                  </RadioButton.Group>
                </View>

                <View style={styles.formSection}>
                  <Text variant="titleMedium" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>Select Period</Text>
                  <RadioButton.Group onValueChange={newValue => setSelectedPeriod(newValue)} value={selectedPeriod}>
                    <View style={styles.periodContainer}>
                      {periods.map(p => (
                        <View key={p} style={styles.periodRadioButtonWrapper}>
                           <Chip
                            selected={selectedPeriod === String(p)}
                            onPress={() => setSelectedPeriod(String(p))}
                            style={[styles.periodChip, selectedPeriod === String(p) ? {backgroundColor: theme.colors.primaryContainer} : {}]}
                            textStyle={[styles.periodChipText, selectedPeriod === String(p) ? {color: theme.colors.onPrimaryContainer} : {}]}
                           >
                            {String(p)}
                           </Chip>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>

                <View style={styles.formSection}>
                  <Text variant="titleMedium" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>Description of Work</Text>
                  <TextInput
                    label="Detailed description"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={5}
                    style={styles.input}
                    outlineStyle={{borderRadius: theme.roundness}}
                  />
                </View>
              </ScrollView>
            </Card.Content>
            <Card.Actions style={styles.modalActions}>
              <Button mode="outlined" onPress={hideModal} style={styles.button} textColor={theme.colors.primary}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleAddRecord} style={styles.button} buttonColor={theme.colors.primary}>
                Save Record
              </Button>
            </Card.Actions>
          </Card>
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
    flex: 1,
  },
  addButton: {
    marginBottom: 16,
    paddingVertical: 6, // Add some padding to the button
    borderRadius: 20, // Make it more pill-shaped
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2, // Use theme.elevation.level if preferred
    borderRadius: 12, // Consistent rounding
  },
  dateText: {
    fontSize: 12,
    // color removed - will be applied inline
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    // color removed - will be applied inline
  },
  // Modal Styles
  modalContentContainer: { // This is the style for the Modal component itself from Paper
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Padding around the card
  },
  modalCard: {
    width: '100%', // Card takes full width of the modal container
    maxWidth: 500, // Max width for larger screens
    borderRadius: 16, // Softer radius for the card
    elevation: 5,
  },
  modalTitle: { // This style is now part of Card.Title
    // marginBottom: 20,
    // textAlign: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    // fontSize: 16, // Using variant="titleMedium" now
    // fontWeight: 'bold', // Handled by variant
    marginBottom: 8,
  },
  radioGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButtonItemContainer: {
     width: '50%', // Two items per row
  },
  radioButtonItem: {
    paddingVertical: 4,
    paddingHorizontal: 0, // Let internal padding of RadioButton.Item work
  },
  input: {
    // marginBottom: 12, // Handled by formSection margin
  },
  button: {
    marginHorizontal: 8, // Spacing for buttons in Card.Actions
    minWidth: 100,
  },
  modalActions: {
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingRight: 8,
  },
  errorText: {
    // color: theme.colors.error, // Applied inline
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  periodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Or 'space-around' for even spacing
    // marginBottom: 10, // Handled by formSection
  },
  periodRadioButtonWrapper: { // This now wraps Chips
    marginRight: 8,
    marginBottom: 8,
  },
  periodChip: {
    // Add specific styles for Chip if needed, e.g., custom padding
  },
  periodChipText: {
    // Style for text inside the chip
  },
  periodRadioButton: { // No longer used, replaced by Chips
    // paddingHorizontal: 0,
    // marginHorizontal: 0,
  },
});

export default HomeScreen;
