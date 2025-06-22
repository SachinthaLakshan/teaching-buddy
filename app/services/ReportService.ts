import RNHTMLtoPDF from 'react-native-html-to-pdf';

export interface ReportDataRecord {
  date: string;
  period: number;
  description: string;
  grade: string | number;
}

export interface ReportData {
  teacherName: string;
  subjectName: string;
  records: ReportDataRecord[];
}

const generateHtmlContent = (data: ReportData): string => {
  const formattedRecords = data.records.map((record, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${new Date(record.date).toLocaleDateString()}</td>
      <td>${record.period}</td>
      <td>${record.description}</td>
      <td>${record.grade}</td>
    </tr>
  `).join('');

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px; /* Reduced padding for potentially smaller PDF page sizes */
            background-color: #f4f4f4;
            color: #333; /* Default text color */
          }
          .header {
            margin-bottom: 20px;
            text-align: center; /* Centered header */
          }
          .header h1 {
            margin: 0;
            font-size: 22px; /* Adjusted font size */
            color: #2c3e50;
          }
          .header h3 {
            margin: 5px 0;
            font-size: 18px; /* Adjusted font size */
            color: #2c3e50;
          }
          .header p {
            margin: 5px 0;
            font-size: 16px; /* Adjusted font size */
            color: #555;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
          }
          th, td {
            padding: 10px; /* Adjusted padding */
            border: 1px solid #ddd;
            text-align: left;
            font-size: 12px; /* Smaller font for table content */
          }
          th {
            background-color: #2c3e50;
            color: white;
            font-size: 14px; /* Slightly larger font for table headers */
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Teacher: ${data.teacherName}</h1>
          <h3>Subject Report</h3>
          <p>Subject: ${data.subjectName}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Period</th>
              <th>Description</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${formattedRecords}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

export const generateReportPdf = async (data: ReportData): Promise<string> => {
  const htmlContent = generateHtmlContent(data);
  const options = {
    html: htmlContent,
    fileName: `SubjectReport-${data.subjectName.replace(/\s+/g, '_')}`, // Sanitize filename
    directory: 'Documents', // Standard directory, RNHTMLtoPDF might handle this differently per platform
  };

  try {
    const file = await RNHTMLtoPDF.convert(options);
    if (!file.filePath) {
      throw new Error('PDF generation failed, filePath is missing.');
    }
    console.log('PDF generated at:', file.filePath);
    return file.filePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
