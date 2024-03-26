// audio-processor.js

class MusicGeneratorProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const output = outputs[0];
  
      // Process the audio data (you can customize this part)
      for (let channel = 0; channel < input.length; ++channel) {
        const inputData = input[channel];
        const outputData = output[channel];
  
        for (let i = 0; i < inputData.length; ++i) {
          // Apply your custom audio processing logic here
          // Example: Output the input data directly (no processing)
          outputData[i] = inputData[i];
        }
      }
  
      // Continue processing (return true) or stop processing (return false)
      return true;
    }
  }
  
  registerProcessor('audioProcessor', MusicGeneratorProcessor);
  