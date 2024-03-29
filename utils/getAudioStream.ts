let mediaRecorder: MediaRecorder | null = null;
let isRecording = false;
let chunks: Blob[] = [];

/**
 * Initializes the MediaRecorder object
 * should be called before starting to record
 * @returns {Promise<void>}
 */
export const initRecorder = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    mediaRecorder = new MediaRecorder(stream);
    console.log('MediaRecorder initialized');
  } else {
    console.error('getUserMedia not supported on your browser!');
  }
};

export const onRecordingFinish = () => {
  if (!chunks.length) {
    return;
  }

  const mp3 = new Blob(chunks, { type: 'audio/mp3' });
  chunks = [];
  // transcribe audio like
  // const response = await openai.audio.transcriptions.create({
  //   file: new File([mp3], 'audio.mp3'),
  //   model: 'whisper-1'
  // });
};

/**
 * Starts recording audio
 * Is currently being called by a button click
 * @returns {void}
 */
export const startRecording = () => {
  if (!mediaRecorder) {
    throw new Error('MediaRecorder not initialized');
  }

  if (isRecording) {
    throw new Error('MediaRecorder is already recording');
  }

  isRecording = true;
  mediaRecorder.start();

  mediaRecorder.ondataavailable = async (e) => {
    chunks.push(e.data);
  };
  mediaRecorder.onstop = onRecordingFinish;
};

/**
 * Stops recording audio
 * Is currently being called by a button click (if recording is in progress)
 */
export const stopRecording = () => {
  if (!mediaRecorder) {
    throw new Error('MediaRecorder not initialized');
  }

  if (!isRecording) {
    throw new Error('MediaRecorder is not recording');
  }

  isRecording = false;
  mediaRecorder.stop();
};
