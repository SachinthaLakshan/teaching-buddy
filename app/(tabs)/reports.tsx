import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Button, Card, Divider, Paragraph, Text, Title, useTheme } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../services/AuthContext';
import { generateReportPdf, ReportData, ReportDataRecord } from '../services/ReportService'; // Import the service

const BASE_URL = 'https://teach-buddy-be.vercel.app';

interface GroupedRecord {
  subjectId: string;
  subjectName: string;
  records: any[];
}

const MonthlyReportScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecord[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null); // To track loading state for specific subject

  useEffect(() => {
    if (user) {
      fetch(`${BASE_URL}/api/teaching-records/user/${user.id}`)
        .then(res => res.json())
        .then(setRecords)
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const grouped = records.reduce<GroupedRecord[]>((acc: GroupedRecord[], record: any) => {
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
  }, [user, records]);

  const handleDownloadPdf = async (subjectId: string) => {
    if (!user) {
      Alert.alert('Error', 'User not found.');
      return;
    }

    const subjectGroup = groupedRecords.find(g => g.subjectId === subjectId);
    if (!subjectGroup) {
      Alert.alert('Error', 'Subject data not found.');
      return;
    }

    setIsGeneratingPdf(subjectId); // Set loading state for this specific subject

    try {
      // Assuming 'grade' comes from the record. If not, it needs to be handled.
      // For now, let's assume 'grade' is part of 'record.details' or similar, or use a placeholder.
      // The provided HTML expects a 'grade' property.
      // The 'TeachingRecord' interface in dummyData.ts does not have 'grade'.
      // Let's proceed with the assumption that API records *do* have 'grade'.
      // If not, we'll add a placeholder or log a warning.
      const reportRecords: ReportDataRecord[] = subjectGroup.records.map((record: any) => ({
        date: record.date,
        period: record.period,
        description: record.description,
        // IMPORTANT: Assuming 'grade' exists on the record.
        // If 'record.grade' is undefined, this will pass 'undefined' to the template.
        // The template should handle this gracefully or we should provide a default.
        // For the purpose of this task, I will use a placeholder if grade is missing.
        grade: record.grade !== undefined ? record.grade : 'N/A',
      }));

      const reportData: ReportData = {
        teacherName: user.name || 'N/A', // Assuming user.name is the teacher's name
        subjectName: subjectGroup.subjectName,
        records: reportRecords,
      };

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device.');
        setIsGeneratingPdf(null);
        return;
      }

      const filePath = await generateReportPdf(reportData);

      if (filePath) { // Only proceed if filePath is not null
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/pdf',
          dialogTitle: `Share ${subjectGroup.subjectName} Report`,
          UTI: 'com.adobe.pdf',
        });
      }
      // If filePath is null, an Alert has already been shown by generateReportPdf,
      // or by the platform/module availability checks.

    } catch (error) {
      // This catch block might now be less likely to be hit for PDF generation errors
      // as they are caught inside generateReportPdf, but good to keep for other unexpected errors
      // or issues with Sharing.isAvailableAsync() itself.
      console.error('Unhandled error in handleDownloadPdf:', error);
      Alert.alert('Operation Failed', `An unexpected error occurred. ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingPdf(null); // Clear loading state
    }
  };

  const renderSubjectReportItem = ({ item: subjectGroup }: { item: GroupedRecord }) => (
    <Card style={[styles.card, { borderColor: theme.colors.primary }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={{ color: theme.colors.primary }}>{subjectGroup.subjectName}</Title>
          {isGeneratingPdf === subjectGroup.subjectId ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={styles.buttonSpinner} />
          ) : (
            <Button
              icon="file-pdf-box"
              mode="outlined"
              onPress={() => handleDownloadPdf(subjectGroup.subjectId)}
              textColor={theme.colors.primary}
              style={{ borderColor: theme.colors.primary }}
              disabled={isGeneratingPdf !== null} // Disable other buttons while one is loading
            >
              Download PDF
            </Button>
          )}
        </View>
        <Divider style={styles.divider} />
        {subjectGroup.records.length > 0 ? (
          subjectGroup.records.map((record, index) => (
            <View key={index}  style={[styles.recordItem, { borderLeftColor: theme.colors.secondary }]}>
              <Text style={styles.recordDate}>{new Date(record.date).toLocaleDateString()}</Text>
              <Text style={styles.recordDetail}>Grade: {record.grade} / Period: {record.period}</Text>
              <Paragraph style={styles.recordDescription}>{record.description}</Paragraph>
              {index < subjectGroup.records.length - 1 && <Divider style={styles.divider} />}
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
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceDisabled }]}>No records found for {user?.name || 'current user'} to generate reports.</Text>
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
    elevation: 2,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonSpinner: {
    marginLeft: 10, // Or adjust as needed for positioning next to/replacing button
  },
  divider: {
    marginVertical: 8,
  },
  recordItem: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeftWidth: 3,
    // borderLeftColor will be applied inline
  },
  recordDate: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  recordDetail: {
    fontSize: 12,
    marginBottom: 2,
  },
  recordDescription: {
    marginBottom: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    // color will be applied inline
  },
});

export default MonthlyReportScreen;
