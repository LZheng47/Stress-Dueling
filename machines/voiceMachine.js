// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const Voice = {};

const URL = "https://teachablemachine.withgoogle.com/models/n91sG1cDD/";

async function createModel() {
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

async function init1() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    const labelContainer = document.getElementById("label-container1");
    for (let i = 0; i < classLabels.length; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    
    recognizer.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class

        //Voice Commands
        let VoiceCommands = [];
        let VoiceCommands_Score = [];
  
        for (let i = 0; i < classLabels.length; i++) {
            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
            VoiceCommands.push(classLabels[i]);
            VoiceCommands_Score.push(result.scores[i].toFixed(2));
        }

      for(let i = 0; i < VoiceCommands.length; i++){
        Voice[VoiceCommands[i]] = VoiceCommands_Score[i];
      }
      // console.log(Voice);
      
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);
  
}