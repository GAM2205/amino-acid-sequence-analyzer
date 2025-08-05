// Amino acid mapping from single letter code to full name
export const AMINO_ACID_NAMES: Record<string, string> = {
  A: 'Alanine',
  R: 'Arginine',
  N: 'Asparagine',
  D: 'Aspartic acid',
  C: 'Cysteine',
  E: 'Glutamic acid',
  Q: 'Glutamine',
  G: 'Glycine',
  H: 'Histidine',
  I: 'Isoleucine',
  L: 'Leucine',
  K: 'Lysine',
  M: 'Methionine',
  F: 'Phenylalanine',
  P: 'Proline',
  S: 'Serine',
  T: 'Threonine',
  W: 'Tryptophan',
  Y: 'Tyrosine',
  V: 'Valine'
};

// Classification arrays
export const GLUCOGENIC = ['A', 'R', 'N', 'D', 'C', 'E', 'Q', 'G', 'H', 'M', 'P', 'S', 'V'];
export const AMPHIBOLIC = ['F', 'I', 'T', 'W', 'Y']; // Both glucogenic and ketogenic
export const KETOGENIC = ['L', 'K']; // Only ketogenic

export interface AminoAcidResult {
  code: string;
  name: string;
  count: number;
  percentage: number;
  classification: 'Glucogenic' | 'Amphibolic' | 'Ketogenic';
}

export interface AnalysisResult {
  totalCount: number;
  aminoAcids: AminoAcidResult[];
  groupCounts: {
    glucogenic: number;
    amphibolic: number;
    ketogenic: number;
  };
  dominantGroup: 'Glucogenic' | 'Amphibolic' | 'Ketogenic';
  isValid: boolean;
  error?: string;
}

export function analyzeSequence(sequence: string): AnalysisResult {
  // Normalize input
  const normalizedSequence = sequence.trim().toUpperCase().replace(/\s/g, '');
  
  if (!normalizedSequence) {
    return {
      totalCount: 0,
      aminoAcids: [],
      groupCounts: { glucogenic: 0, amphibolic: 0, ketogenic: 0 },
      dominantGroup: 'Glucogenic',
      isValid: false,
      error: 'Please enter a valid amino acid sequence'
    };
  }

  // Validate sequence
  const invalidChars = normalizedSequence.split('').filter(char => !AMINO_ACID_NAMES[char]);
  if (invalidChars.length > 0) {
    return {
      totalCount: 0,
      aminoAcids: [],
      groupCounts: { glucogenic: 0, amphibolic: 0, ketogenic: 0 },
      dominantGroup: 'Glucogenic',
      isValid: false,
      error: `Invalid amino acid codes found: ${[...new Set(invalidChars)].join(', ')}`
    };
  }

  // Count amino acids
  const counts: Record<string, number> = {};
  for (const char of normalizedSequence) {
    counts[char] = (counts[char] || 0) + 1;
  }

  const totalCount = normalizedSequence.length;

  // Create results array
  const aminoAcids: AminoAcidResult[] = Object.entries(counts).map(([code, count]) => {
    let classification: 'Glucogenic' | 'Amphibolic' | 'Ketogenic';
    
    if (AMPHIBOLIC.includes(code)) {
      classification = 'Amphibolic';
    } else if (KETOGENIC.includes(code)) {
      classification = 'Ketogenic';
    } else {
      classification = 'Glucogenic';
    }

    return {
      code,
      name: AMINO_ACID_NAMES[code],
      count,
      percentage: (count / totalCount) * 100,
      classification
    };
  }).sort((a, b) => b.count - a.count); // Sort by count descending

  // Calculate group counts
  const groupCounts = {
    glucogenic: 0,
    amphibolic: 0,
    ketogenic: 0
  };

  for (const char of normalizedSequence) {
    if (AMPHIBOLIC.includes(char)) {
      groupCounts.amphibolic++;
    } else if (KETOGENIC.includes(char)) {
      groupCounts.ketogenic++;
    } else {
      groupCounts.glucogenic++;
    }
  }

  // Determine dominant group
  let dominantGroup: 'Glucogenic' | 'Amphibolic' | 'Ketogenic' = 'Glucogenic';
  if (groupCounts.amphibolic > groupCounts.glucogenic && groupCounts.amphibolic > groupCounts.ketogenic) {
    dominantGroup = 'Amphibolic';
  } else if (groupCounts.ketogenic > groupCounts.glucogenic && groupCounts.ketogenic > groupCounts.amphibolic) {
    dominantGroup = 'Ketogenic';
  }

  return {
    totalCount,
    aminoAcids,
    groupCounts,
    dominantGroup,
    isValid: true
  };
}
