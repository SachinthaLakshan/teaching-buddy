declare module 'react-native-html-to-pdf' {
  export interface Options {
    html: string;
    fileName?: string;
    directory?: string;
    width?: number;
    height?: number;
    padding?: number;
    base64?: boolean;
    fonts?: string[];
  }

  export interface File {
    filePath?: string;
    base64?: string;
    numberOfPages?: number;
  }

  const RNHTMLtoPDF: {
    convert(options: Options): Promise<File>;
  };

  export default RNHTMLtoPDF;
}
