import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Text, useTheme, Card, Title, Paragraph, Button, List, Divider } from 'react-native-paper';
import { teachingRecords, subjects as allSubjects, getRecordsForUser } from '../../data/dummyData';
// For a real app, user context would be used to get current user ID
const MOCK_USER_ID = '1'; // Assuming user '1' is logged in for now

const MonthlyReportScreen = () => {
  const theme = useTheme();
  const [userRecords, setUserRecords] = useState([]);
  const [groupedRecords, setGroupedRecords] = useState([]);

  useEffect(() => {
    const records = getRecordsForUser(MOCK_USER_ID);
    setUserRecords(records);

    // Group records by subject for the current month (or all time for simplicity here)
    // In a real app, you'd filter by month.
    const grouped = records.reduce((acc, record) => {
      const subject = acc.find(s => s.subjectId === record.subjectId);
      if (subject) {
        subject.records.push(record);
      } else {
        acc.push({
          subjectId: record.subjectId,
          subjectName: record.subjectName,
          records: [record],
        });
      }
      return acc;
    }, []);
    setGroupedRecords(grouped);
  }, []);

  const handleDownloadPdf = (subjectName) => {
    Alert.alert(
      'Download PDF',
      `Simulating PDF download for ${subjectName}'s monthly report.`,
      [{ text: 'OK' }]
    );
    // In a real app, you would trigger PDF generation and download here.
  };

  const renderSubjectReportItem = ({ item: subjectGroup }) => (
    <Card style={[styles.card, {borderColor: theme.colors.primary}]}>
      <Card.Content>
        <View style={styles.cardHeader}>
            <Title style={{ color: theme.colors.primary }}>{subjectGroup.subjectName}</Title>
            <Button
                icon="file-pdf-box"
                mode="outlined"
                onPress={() => handleDownloadPdf(subjectGroup.subjectName)}
                textColor={theme.colors.primary}
                style={{borderColor: theme.colors.primary}}
            >
                Download PDF
            </Button>
        </View>
        <Divider style={styles.divider} />
        {subjectGroup.records.sort((a,b) => new Date(b.date) - new Date(a.date) || b.period - a.period).map(record => (
          <View key={record.id} style={styles.recordItem}>
            <Paragraph style={styles.recordDate}>
              {new Date(record.date).toLocaleDateString()} - Period {record.period}
            </Paragraph>
            <Paragraph>{record.description}</Paragraph>
          </View>
        ))}
        {subjectGroup.records.length === 0 && <Paragraph>No records for this subject this month.</Paragraph>}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
        Monthly Reports
      </Text>
      <FlatList
        data={groupedRecords}
        renderItem={renderSubjectReportItem}
        keyExtractor={item => item.subjectId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No records found to generate reports.</Text>}
      />
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
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  recordItem: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#03DAC6', // Accent color for record items
  },
  recordDate: {
    fontWeight: 'bold',
    fontSize: 13,
    color: 'grey',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'grey',
  },
});

export default MonthlyReportScreen;
