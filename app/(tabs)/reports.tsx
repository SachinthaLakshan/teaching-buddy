import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, useTheme, Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import { getRecordsForUser, TeachingRecord } from '../data/dummyData'; // Corrected path
import { useAuth } from '../services/AuthContext'; // Corrected path

interface GroupedRecord {
  subjectId: string;
  subjectName: string;
  records: TeachingRecord[];
}

const MonthlyReportScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecord[]>([]);

  useEffect(() => {
    if (user) {
      const records = getRecordsForUser(user.id);
      const grouped = records.reduce<GroupedRecord[]>((acc, record) => {
        const subjectGroup = acc.find(s => s.subjectId === record.subjectId);
        if (subjectGroup) {
          subjectGroup.records.push(record);
        } else {
          acc.push({
            subjectId: record.subjectId,
            subjectName: record.subjectName,
            records: [record],
          });
        }
        return acc;
      }, []);

      // Sort records within each group by date and period
      grouped.forEach(group => {
        group.records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.period - a.period);
      });

      setGroupedRecords(grouped);
    }
  }, [user]);

  const handleDownloadPdf = (subjectName: string) => {
    Alert.alert(
      'Download PDF',
      `Simulating PDF download for ${subjectName}'s monthly report.`,
      [{ text: 'OK' }]
    );
  };

  const renderSubjectReportItem = ({ item: subjectGroup }: { item: GroupedRecord }) => (
    <Card style={[styles.card, { borderColor: theme.colors.primary }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={{ color: theme.colors.primary }}>{subjectGroup.subjectName}</Title>
          <Button
            icon="file-pdf-box"
            mode="outlined"
            onPress={() => handleDownloadPdf(subjectGroup.subjectName)}
            textColor={theme.colors.primary}
            style={{ borderColor: theme.colors.primary }}
          >
            Download PDF
          </Button>
        </View>
        <Divider style={styles.divider} />
        {subjectGroup.records.length > 0 ? (
          subjectGroup.records.map(record => (
            <View key={record.id} style={styles.recordItemContainer}>
              <Paragraph style={[styles.recordDate, {color: theme.colors.secondary}]}>
                {new Date(record.date).toLocaleDateString()} - Period {record.period}
              </Paragraph>
              <Paragraph>{record.description}</Paragraph>
            </View>
          ))
        ) : (
          <Paragraph>No records for this subject.</Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
        Monthly Reports
      </Text>
      {groupedRecords.length > 0 ? (
        <FlatList
          data={groupedRecords}
          renderItem={renderSubjectReportItem}
          keyExtractor={item => item.subjectId}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>No records found for {user?.name || 'current user'} to generate reports.</Text>
      )}
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
    elevation: 2, // Slightly less elevation than home screen cards perhaps
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
  recordItemContainer: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.secondary, // Use theme color
  },
  recordDate: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: theme.colors.onSurfaceDisabled, // Use theme color
  },
});

export default MonthlyReportScreen;
