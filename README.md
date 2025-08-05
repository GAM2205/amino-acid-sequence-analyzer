# Amino Acid Sequence Analyzer

A modern web application built with Next.js and TypeScript that analyzes amino acid sequences and provides detailed metabolic classification information.

## Features

### 🧬 Sequence Analysis
- **Count Analysis**: Counts the total number of amino acids and frequency of each type
- **Percentage Calculation**: Shows the percentage distribution of each amino acid
- **Metabolic Classification**: Categorizes amino acids as Glucogenic, Amphibolic, or Ketogenic
- **Dominant Group Detection**: Identifies which metabolic pathway is most prevalent

### 📊 Data Visualization
- **Interactive Bar Chart**: Visual representation of amino acid frequencies with tooltips
- **Detailed Table**: Complete breakdown showing codes, names, counts, percentages, and classifications
- **Summary Cards**: Quick overview of total counts and group distributions

### 🛡️ Input Validation
- **Real-time Validation**: Checks for invalid amino acid codes
- **Error Handling**: Clear error messages for invalid inputs
- **User-friendly Interface**: Intuitive design with helpful placeholder text

## Amino Acid Classifications

### Glucogenic Amino Acids (13 total)
Can be converted to glucose through gluconeogenesis:
- **A** - Alanine
- **R** - Arginine  
- **N** - Asparagine
- **D** - Aspartic acid
- **C** - Cysteine
- **E** - Glutamic acid
- **Q** - Glutamine
- **G** - Glycine
- **H** - Histidine
- **M** - Methionine
- **P** - Proline
- **S** - Serine
- **V** - Valine

### Amphibolic Amino Acids (5 total)
Can be converted to both glucose and ketone bodies:
- **F** - Phenylalanine
- **I** - Isoleucine
- **T** - Threonine
- **W** - Tryptophan
- **Y** - Tyrosine

### Ketogenic Amino Acids (2 total)
Can only be converted to ketone bodies:
- **L** - Leucine
- **K** - Lysine

## Usage

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amino-acid-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8000`

### Using the Analyzer

1. **Enter Sequence**: Type or paste an amino acid sequence using single-letter codes
2. **Analyze**: Click the "Analyze Sequence" button
3. **View Results**: Review the comprehensive analysis including:
   - Summary statistics
   - Interactive frequency chart
   - Detailed breakdown table
   - Classification information

### Example Sequences

- **All 20 amino acids**: `ARNDCEQGHILKMFPSTWYV`
- **Protein-rich sequence**: `AAAARRRRNNNNDDDD`
- **Mixed sequence**: `ACDEFGHIKLMNPQRSTVWY`

## Technical Details

### Built With
- **Next.js 15.3.2** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **shadcn/ui** - UI components

### Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── amino/
│   │   └── AminoAcidAnalyzer.tsx  # Main analyzer component
│   └── ui/                 # Reusable UI components
└── lib/
    └── amino.ts            # Analysis logic and data
```

### Key Components

#### `analyzeSequence(sequence: string)`
Core analysis function that:
- Validates input sequence
- Counts amino acid frequencies
- Calculates percentages
- Determines metabolic classifications
- Identifies dominant group

#### `AminoAcidAnalyzer`
Main React component featuring:
- Input validation and error handling
- Real-time analysis
- Interactive data visualization
- Responsive design

## Error Handling

The application includes comprehensive error handling:
- **Invalid Characters**: Identifies and lists any non-amino acid characters
- **Empty Input**: Prompts user to enter a valid sequence
- **Graceful Degradation**: Maintains functionality even with partial errors

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on the GitHub repository.

---

**Note**: This application is designed for educational and research purposes. For clinical or diagnostic use, please consult with qualified professionals.
