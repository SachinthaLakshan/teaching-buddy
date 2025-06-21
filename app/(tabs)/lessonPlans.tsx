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
  IconButton,
  Divider,
  Chip, // For displaying objectives/activities as tags
  List, // For objectives/activities list
  RadioButton, // For subject selection in modal
} from 'react-native-paper';
import {
  LessonPlan,
  getLessonPlansForUser,
  addLessonPlan,
  subjects as allSubjects, // Re-use subjects from dummyData
  Subject,
} from '../data/dummyData';
import { useAuth } from '../services/AuthContext';

const LessonPlansScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state for new lesson plan
  const [title, setTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [objectives, setObjectives] = useState<string[]>(['']); // Start with one empty objective
  const [activities, setActivities] = useState<string[]>(['']); // Start with one empty activity
  const [assessment, setAssessment] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      setLessonPlans(getLessonPlansForUser(user.id));
    }
  }, [user]);

  const showModal = () => setModalVisible(true);
  const hideModal = () => {
    setModalVisible(false);
    // Reset form
    setTitle('');
    setSelectedSubjectId('');
    setDate(new Date().toISOString().split('T')[0]);
    setObjectives(['']);
    setActivities(['']);
    setAssessment('');
    setNotes('');
    setFormError('');
  };

  // Helper for dynamic text input lists (objectives, activities)
  const handleListItemChange = (text: string, index: number, listType: 'objectives' | 'activities') => {
    if (listType === 'objectives') {
      const updated = [...objectives];
      updated[index] = text;
      setObjectives(updated);
    } else {
      const updated = [...activities];
      updated[index] = text;
      setActivities(updated);
    }
  };

  const addListItem = (listType: 'objectives' | 'activities') => {
    if (listType === 'objectives') {
      if (objectives.length < 5) setObjectives([...objectives, '']); // Limit to 5 for example
    } else {
      if (activities.length < 5) setActivities([...activities, '']); // Limit to 5
    }
  };

  const removeListItem = (index: number, listType: 'objectives' | 'activities') => {
    if (listType === 'objectives') {
      if (objectives.length > 1) setObjectives(objectives.filter((_, i) => i !== index));
    } else {
      if (activities.length > 1) setActivities(activities.filter((_, i) => i !== index));
    }
  };


  const handleAddLessonPlan = () => {
    if (!title.trim() || !selectedSubjectId || !date) {
      setFormError('Title, Subject, and Date are required.');
      return;
    }
    if (objectives.some(obj => !obj.trim()) || activities.some(act => !act.trim()) || !assessment.trim()) {
        setFormError('Objectives, Activities, and Assessment cannot be empty.');
        return;
    }
    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }
    setFormError('');

    const newPlan: Omit<LessonPlan, 'id' | 'subjectName'> = {
      userId: user.id,
      title: title.trim(),
      subjectId: selectedSubjectId,
      date,
      objectives: objectives.map(o => o.trim()).filter(o => o), // Clean and filter empty
      activities: activities.map(a => a.trim()).filter(a => a), // Clean and filter empty
      assessment: assessment.trim(),
      notes: notes.trim(),
    };

    const added = addLessonPlan(newPlan);
    setLessonPlans(prev => [added, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    hideModal();
    Alert.alert('Success', 'Lesson plan added successfully.');
  };

  const renderLessonPlanItem = ({ item }: { item: LessonPlan }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={`${item.subjectName} - ${new Date(item.date).toLocaleDateString()}`}
        titleStyle={{ color: theme.colors.primary }}
        subtitleStyle={{color: theme.colors.onSurfaceVariant}}
      />
      <Card.Content>
        <List.Section>
          <List.Subheader style={{color: theme.colors.secondary}}>Objectives</List.Subheader>
          {item.objectives.map((obj, i) => <List.Item key={`obj-${i}`} title={obj} titleNumberOfLines={3} left={() => <List.Icon icon="check-circle-outline" color={theme.colors.secondary}/>} style={styles.listItem} titleStyle={styles.listItemText}/>)}

          <List.Subheader style={{color: theme.colors.secondary, marginTop: 8}}>Activities</List.Subheader>
          {item.activities.map((act, i) => <List.Item key={`act-${i}`} title={act} titleNumberOfLines={3} left={() => <List.Icon icon="run" color={theme.colors.secondary}/>} style={styles.listItem} titleStyle={styles.listItemText}/>)}

          <List.Subheader style={{color: theme.colors.secondary, marginTop: 8}}>Assessment</List.Subheader>
          <Paragraph style={[styles.paragraphContent, {color: theme.colors.onSurfaceVariant}]}>{item.assessment}</Paragraph>

          {item.notes && (
            <>
              <List.Subheader style={{color: theme.colors.secondary, marginTop: 8}}>Notes</List.Subheader>
              <Paragraph style={[styles.paragraphContent, {color: theme.colors.onSurfaceVariant}]}>{item.notes}</Paragraph>
            </>
          )}
        </List.Section>
      </Card.Content>
    </Card>
  );

  const renderDynamicInputList = (
    items: string[],
    setter: (items: string[]) => void,
    listType: 'objectives' | 'activities',
    label: string
  ) => (
    <View style={styles.dynamicListContainer}>
      <Text variant="titleMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.dynamicListItem}>
          <TextInput
            dense
            style={styles.dynamicInput}
            value={item}
            onChangeText={(text) => handleListItemChange(text, index, listType)}
            placeholder={`${listType.slice(0, -1)} ${index + 1}`}
            mode="outlined"
            outlineStyle={{borderRadius: theme.roundness}}
          />
          {items.length > 1 && (
            <IconButton icon="minus-circle-outline" iconColor={theme.colors.error} size={20} onPress={() => removeListItem(index, listType)} />
          )}
        </View>
      ))}
      {items.length < 5 && ( // Limit to 5 items
        <Button icon="plus" mode="text" onPress={() => addListItem(listType)} style={{alignSelf: 'flex-start'}}>
          Add {listType.slice(0, -1)}
        </Button>
      )}
    </View>
  );


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
        Lesson Plans
      </Text>
      <Button icon="plus-circle" mode="contained" onPress={showModal} style={styles.addButton}>
        Create New Lesson Plan
      </Button>
      <FlatList
        data={lessonPlans}
        renderItem={renderLessonPlanItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No lesson plans found. Create one!</Text>}
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={[styles.modalContentContainer, { backgroundColor: theme.colors.elevation.level3 }]}>
          <Card style={styles.modalCard}>
            <Card.Title
              title="Create Lesson Plan"
              titleVariant="headlineSmall"
              titleStyle={{color: theme.colors.primary, textAlign: 'center'}}
              right={(props) => <IconButton {...props} icon="close-circle-outline" onPress={hideModal} />}
            />
            <Card.Content>
              <ScrollView keyboardShouldPersistTaps="handled">
                {formError ? <Text style={[styles.errorText, {color: theme.colors.error}]}>{formError}</Text> : null}

                <TextInput label="Lesson Plan Title" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} outlineStyle={{borderRadius: theme.roundness}} />

                <View style={styles.formSection}>
                  <Text variant="titleMedium" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>Subject</Text>
                  <RadioButton.Group onValueChange={newValue => setSelectedSubjectId(newValue)} value={selectedSubjectId}>
                    <View style={styles.radioGroupContainerModal}>
                    {allSubjects.map((subject: Subject) => (
                       <View key={subject.id} style={styles.radioButtonItemContainerModal}>
                        <RadioButton.Item label={subject.name} value={subject.id} style={styles.radioButtonItemModal} labelStyle={{fontSize: 14}} position="leading"/>
                       </View>
                    ))}
                    </View>
                  </RadioButton.Group>
                </View>

                <TextInput label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} mode="outlined" style={styles.input} keyboardType="numeric" outlineStyle={{borderRadius: theme.roundness}} />

                {renderDynamicInputList(objectives, setObjectives, 'objectives', 'Learning Objectives')}
                {renderDynamicInputList(activities, setActivities, 'activities', 'Class Activities')}

                <TextInput label="Assessment Method" value={assessment} onChangeText={setAssessment} mode="outlined" multiline numberOfLines={3} style={styles.input} outlineStyle={{borderRadius: theme.roundness}} />
                <TextInput label="Additional Notes (Optional)" value={notes} onChangeText={setNotes} mode="outlined" multiline numberOfLines={2} style={styles.input} outlineStyle={{borderRadius: theme.roundness}} />

              </ScrollView>
            </Card.Content>
            <Card.Actions style={styles.modalActions}>
              <Button mode="outlined" onPress={hideModal} style={styles.button} textColor={theme.colors.primary}>Cancel</Button>
              <Button mode="contained" onPress={handleAddLessonPlan} style={styles.button} buttonColor={theme.colors.primary}>Save Plan</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { textAlign: 'center', marginBottom: 16 },
  addButton: { marginBottom: 16, paddingVertical: 6, borderRadius: 20 },
  list: { paddingBottom: 16 },
  card: { marginBottom: 16, borderRadius: 12, elevation: 2 },
  listItem: { paddingVertical: 2, paddingLeft: 0 },
  listItemText: { fontSize: 14 },
  paragraphContent: { marginLeft: 16, fontSize: 14 }, // Color applied inline now
  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 16 }, // Color applied inline now
  // Modal Styles
  modalContentContainer: { justifyContent: 'center', alignItems: 'center', padding: 10 }, // Reduced padding for modal itself
  modalCard: { width: '100%', maxWidth: 600, borderRadius: 16, elevation: 5, maxHeight: '95%' }, // Max height for scroll
  modalActions: { justifyContent: 'flex-end', paddingTop:8, paddingBottom: 16, paddingRight: 8 },
  input: { marginBottom: 12 },
  button: { marginHorizontal: 8, minWidth: 100 },
  errorText: { marginBottom: 15, textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
  label: { marginBottom: 8, },
  formSection: { marginBottom: 16 },
  radioGroupContainerModal: { flexDirection: 'row', flexWrap: 'wrap' },
  radioButtonItemContainerModal: { width: '50%' },
  radioButtonItemModal: { paddingVertical: 2, paddingHorizontal: 0 },
  // Dynamic Input List Styles
  dynamicListContainer: { marginBottom: 16 },
  dynamicListItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dynamicInput: { flex: 1, marginRight: 4 },
});

export default LessonPlansScreen;
