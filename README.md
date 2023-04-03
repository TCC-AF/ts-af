<div id="user-content-toc">
  <ul>
    <summary><h1 id="ts-af" style="display: inline-block;">Atrial Fibrillation Module</h1></summary>
  </ul>
</div>

## Important Declarations
- This is a **prototype**, for final module implemented into TeleClinical Care please visit https://github.com/ItsLame/tcc-af/
- Final module is **not accessible** as it is currently **privated** due to **confidential** reasons, however [screenshots are available below](#screenshots)

## Tables of Contents
- [Description](#description)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Troubleshooting](#troubleshooting)
- [Other Links](#other-links)
   - Sample files
   - Azure prototype

## Description
<sup>[[Back to top]](#ts-af)</sup>

Prototype of tcc-af module for tcc-jadeite. Using TFJS library to use TFJS graph model to run in (TypeScript) React Native environment. ECG measurements are classified as either:
- Atrial Fibrillation
- Other Arrhytmias
- Normal Sinus Rhythm
- Too Noisy

## Screenshots
<sup>[[Back to top]](#ts-af)</sup>

<details>
  <summary>Prototype Screenshots</summary>
  <img src="./pictures/home.png" width="300" /> <img src="./pictures/af.png" width="300" /> <img src="./pictures/af_sample.png" width="300" /> <img src="./pictures/caf.png" width="300" /> <img src="./pictures/tfjs_caf_inactive.png" width="290" /> <img src="./pictures/tfjs_caf_active.png" width="290" />
</details>

<details>
  <summary>Final AF Module in TCC-Jadeite Screenshots</summary>
  <img src="./pictures/tcc-jadeite/home_af_card.png" width="300" /> <img src="./pictures/tcc-jadeite/detector_idle.png" width="300" /> <img src="./pictures/tcc-jadeite/detector_active.png" width="300" /> <img src="./pictures/tcc-jadeite/records_populated.png" width="300" /> <img src="./pictures/tcc-jadeite/records_af.png" width="290" /> <img src="./pictures/tcc-jadeite/records_oa.png" width="290" /> <img src="./pictures/tcc-jadeite/notification.png" width="300" />
</details>

## Getting Started
<sup>[[Back to top]](#ts-af)</sup>

1. in root directory, run `yarn install`
2. go to `/ios`, then run `pod install`
3. run and build app using:
   - iOS: `yarn run ios`
   - Android: `yarn run android` (currently not available due to expo compatibility issues)

## Troubleshooting
<sup>[[Back to top]](#ts-af)</sup>

If `model.json` or `weights.bin` are missing, please download using the links below:

- [`model.json`](https://1drv.ms/u/s!AhwQNlQ3dXFkiu1spg20zRAjasW2fA?e=fVb1ZT)
- [`weights.bin`](https://1drv.ms/u/s!AhwQNlQ3dXFkiu1tsGK-W9kAmr51jg?e=PrGFXN)

Afterwards, browse to `src/assets/af/graph-model` and put both files in it.

- If `/af` or `/graph-model` folder(s) does not exist, please create one on said directory.

## Other Links
<sup>[[Back to top]](#ts-af)</sup>

- [ECG sample files](https://github.com/TCC-AF/Samples)
- [Prototype using Azure](https://github.com/TCC-AF/azure-af/)
