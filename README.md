<div id="user-content-toc">
  <ul>
    <summary><h1 id="ts-af" style="display: inline-block;">ts-af</h1></summary>
  </ul>
</div>

## Tables of Contents
- [Description](#description)
- [Getting Started](#getting-started)
- [Troubleshooting](#troubleshooting)
- [Prototype Screenshots](#prototype-screenshots)
- [Final Module Screenshots](#final-module-screenshots)
- [Other Links](#other-links)
   - Sample files
   - Final tcc-af module in TCC-Jadeite
   - Azure prototype

## Description
[[Back to top]](#ts-af)

Prototype of tcc-af-module for tcc-jadeite. Using TFJS library to use TFJS graph model to run in (TypeScript) React Native environment. ECG measurements are classified as either:
- Atrial Fibrillation
- Other Arrhytmias
- Normal Sinus Rhythm
- Too Noisy

## Getting Started
[[Back to top]](#ts-af)

1. in root directory, run `yarn install`
2. go to `/ios`, then run `pod install`
3. run and build app using:
   - iOS: `yarn run ios`
   - Android: `yarn run android` (currently not available due to expo compatibility issues)

## Troubleshooting
[[Back to top]](#ts-af)

If `model.json` or `weights.bin` are missing, please download using the links below:

- [`model.json`](https://1drv.ms/u/s!AhwQNlQ3dXFkiu1spg20zRAjasW2fA?e=fVb1ZT)
- [`weights.bin`](https://1drv.ms/u/s!AhwQNlQ3dXFkiu1tsGK-W9kAmr51jg?e=PrGFXN)

Afterwards, browse to `src/assets/af/graph-model` and put both files in it.

- If `/af` or `/graph-model` folder(s) does not exist, please create one on said directory.

## Prototype Screenshots
[[Back to top]](#ts-af)

<img src="./pictures/home.png" width="300" /> <img src="./pictures/af.png" width="300" /> <img src="./pictures/af_sample.png" width="300" /> <img src="./pictures/caf.png" width="300" /> <img src="./pictures/tfjs_caf_inactive.png" width="290" /> <img src="./pictures/tfjs_caf_active.png" width="290" />

## Other Links
[[Back to top]](#ts-af)

- [List of sample files](https://github.com/TCC-AF/Samples)
- [AF module in TCC-Jadeite](https://github.com/ItsLame/tcc-af/)
- [Prototype (Azure only)](https://github.com/TCC-AF/azure-af/)

# Extra
[[Back to top]](#ts-af)

Repo for AF module in TCC-Jadeite is privated for confidential reasons, therefore the source code can't be shared. However below are screenshots of the module.
## Final Module Screenshots 
[[Back to top]](#ts-af)

Screenshots of AF Module in TCC-Jadeite\
<img src="./pictures/tcc-jadeite/home_af_card.png" width="300" /> <img src="./pictures/tcc-jadeite/detector_idle.png" width="300" /> <img src="./pictures/tcc-jadeite/detector_active.png" width="300" /> <img src="./pictures/tcc-jadeite/records_populated.png" width="300" /> <img src="./pictures/tcc-jadeite/records_af.png" width="290" /> <img src="./pictures/tcc-jadeite/records_oa.png" width="290" /> <img src="./pictures/tcc-jadeite/notification.png" width="300" />
