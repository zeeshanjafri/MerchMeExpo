import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

/**
 * Simulates generating a design by copying the input image
 */
export const generateDesign = async (
  userImageUri: string,
  prompt: string
): Promise<string> => {
  try {
    console.log('Generating design...');
    console.log(`User image: ${userImageUri}`);
    console.log(`Prompt: ${prompt}`);
    
    // Create a temporary file URI for the processed image
    const outputUri = `${FileSystem.documentDirectory}generated_${Date.now()}.jpg`;
    
    // Simply copy the user image
    await FileSystem.copyAsync({
      from: userImageUri,
      to: outputUri
    });
    
    console.log(`Image copied to: ${outputUri}`);
    return outputUri;
  } catch (error: any) {
    console.error('Error generating design:', error);
    Alert.alert('Error', `Failed to generate: ${error.message}`);
    throw error;
  }
}; 