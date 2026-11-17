#!/bin/sh
# Synthetisiert alle Sound-Effekte (assets/sfx/*.wav) neu. Keine Fremdquellen.
cd "$(dirname "$0")/../assets/sfx" || exit 1
S=44100
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='sin(2*PI*(520+2600*t)*t)*exp(-t*26)*0.9':d=0.18:s=$S" pop.wav
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='sin(2*PI*2100*t)*exp(-t*110)*0.8':d=0.07:s=$S" tick.wav
ffmpeg -loglevel error -y -f lavfi -i "anoisesrc=d=0.75:c=white:a=0.5:r=$S" -af "tremolo=f=26:d=0.95,highpass=f=900,lowpass=f=5200,afade=t=in:d=0.03,afade=t=out:st=0.55:d=0.2" receipt.wav
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='(sin(2*PI*(110-70*t)*t)*exp(-t*10)*1.1)+(0.5*(random(0)-0.5)*exp(-t*55))':d=0.6:s=$S" -f lavfi -i "aevalsrc='sin(2*PI*880*t)*exp(-t*12)*0.35*gt(t,0.09)':d=0.6:s=$S" -filter_complex "[0][1]amix=inputs=2:normalize=0,alimiter=limit=0.95" stamp.wav
ffmpeg -loglevel error -y -f lavfi -i "anoisesrc=d=0.4:c=pink:a=0.6:r=$S" -af "highpass=f=400,lowpass=f=3800,afade=t=in:d=0.12,afade=t=out:st=0.2:d=0.2" whoosh.wav
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='(sin(2*PI*1568*t)+sin(2*PI*2093*t)*0.8)*exp(-t*13)*0.5':d=0.45:s=$S" cash.wav
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='(sin(2*PI*1320*t)+0.4*sin(2*PI*2640*t))*exp(-t*7)*0.5':d=0.7:s=$S" ding.wav
