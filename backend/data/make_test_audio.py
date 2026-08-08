import os
import numpy as np
from scipy.io import wavfile

def generate_test_audios():
    """
    Generates simulated human and cloned PCM WAV files to test the DSP pipeline.
    Ensures that the spectral centroid and roll-off fall into realistic speech bands.
    """
    sr = 16000  # 16 kHz sample rate
    duration = 3.0  # 3 seconds
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    
    output_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Generate Human Voice Simulator
    # Fundamental frequency at 120Hz with natural speaking vibrato
    f0 = 120.0 + 20.0 * np.sin(2 * np.pi * 4.5 * t)
    phase = 2 * np.pi * np.cumsum(f0) / sr
    
    # Human speech formant harmonics at 850Hz and 1400Hz
    signal_human = (
        0.3 * np.sin(phase) + 
        0.5 * np.sin(2 * np.pi * 850 * t) + 
        0.2 * np.sin(2 * np.pi * 1400 * t)
    )
    
    # Scale and convert to 16-bit PCM WAV
    signal_human /= np.max(np.abs(signal_human))
    signal_human_int = (signal_human * 32767).astype(np.int16)
    
    human_path = os.path.join(output_dir, "human_voice_sim.wav")
    wavfile.write(human_path, sr, signal_human_int)
    print(f"Generated simulated human audio at: {human_path}")

    # 2. Generate Cloned Voice Simulator
    # Flat speaking fundamental pitch (0 variance) with vocoder carrier frequencies at 2600Hz and 3400Hz
    f0_cloned = 120.0
    phase_cloned = 2 * np.pi * f0_cloned * t
    
    signal_cloned = (
        0.2 * np.sin(phase_cloned) + 
        0.6 * np.sin(2 * np.pi * 2650 * t) + 
        0.2 * np.sin(2 * np.pi * 3400 * t)
    )
    
    signal_cloned /= np.max(np.abs(signal_cloned))
    signal_cloned_int = (signal_cloned * 32767).astype(np.int16)
    
    cloned_path = os.path.join(output_dir, "cloned_voice_sim.wav")
    wavfile.write(cloned_path, sr, signal_cloned_int)
    print(f"Generated simulated cloned audio at: {cloned_path}")

if __name__ == "__main__":
    generate_test_audios()
