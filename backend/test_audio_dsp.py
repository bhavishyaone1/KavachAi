import os
import sys

# Append root folder to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.audio_detector import detector as audio_detector

def run_audio_dsp_verification():
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
    human_wav = os.path.join(data_dir, "human_voice_sim.wav")
    cloned_wav = os.path.join(data_dir, "cloned_voice_sim.wav")
    
    print("==================================================================")
    print("KAVACH AI FORENSICS - RUNNING AUDIO DSP PIPELINE VERIFICATION")
    print("==================================================================\n")
    
    # 1. Analyze simulated human audio
    print(f"Loading and analyzing: {os.path.basename(human_wav)}")
    res_human = audio_detector.analyze(human_wav, "human_voice_sim.wav")
    print(f"  Result Verdict: {res_human['label']}")
    print(f"  AI Spoof Score: {res_human['score'] * 100}%")
    print(f"  Zero Crossing Rate: {res_human['metrics']['zero_crossing_rate']}")
    print(f"  Spectral Centroid: {res_human['metrics']['spectral_centroid_hz']} Hz")
    print(f"  Spectral Roll-Off: {res_human['metrics']['spectral_rolloff_hz']} Hz")
    print(f"  speaking Pitch Variance: {res_human['metrics']['pitch_variance']}")
    print(f"  Explanation: {res_human['explanation']}")
    print("-" * 66 + "\n")
    
    # 2. Analyze simulated cloned audio
    print(f"Loading and analyzing: {os.path.basename(cloned_wav)}")
    res_cloned = audio_detector.analyze(cloned_wav, "cloned_voice_sim.wav")
    print(f"  Result Verdict: {res_cloned['label']}")
    print(f"  AI Spoof Score: {res_cloned['score'] * 100}%")
    print(f"  Zero Crossing Rate: {res_cloned['metrics']['zero_crossing_rate']}")
    print(f"  Spectral Centroid: {res_cloned['metrics']['spectral_centroid_hz']} Hz")
    print(f"  Spectral Roll-Off: {res_cloned['metrics']['spectral_rolloff_hz']} Hz")
    print(f"  speaking Pitch Variance: {res_cloned['metrics']['pitch_variance']}")
    print(f"  Explanation: {res_cloned['explanation']}")
    print("==================================================================")

if __name__ == "__main__":
    run_audio_dsp_verification()
