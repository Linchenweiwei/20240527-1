/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

let video, bodypose, pose, keypoint, detector;
let poses = [];
let gifImg, elbowImg; // For loading images
const studentId = "412730268"; // Replace with your student ID
const studentName = "林宸瑋"; // Replace with your name

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();

  // Load the GIF and elbow images
  gifImg = loadImage('1.gif'); // Use the actual path to your uploaded GIF
  elbowImg = loadImage('1.gif'); // Use the actual path to your elbow image

  stroke(255);
  strokeWeight(5);
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  // flip horizontal
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];
    drawKeypoints(pose);
    drawConnections(pose);
  }
}

function drawKeypoints(pose) {
  for (let j = 0; j < pose.keypoints.length; j++) {
    const keypoint = pose.keypoints[j];
    if (keypoint.score > 0.1) {
      if (j === 1 || j === 2) { // Left eye or right eye
        image(gifImg, keypoint.x - 10, keypoint.y - 10, 20, 20); // Adjust the size and position as needed
      } else if (j === 7 || j === 8) { // Left elbow or right elbow
        image(elbowImg, keypoint.x - 10, keypoint.y - 10, 20, 20); // Adjust the size and position as needed
      }
    }
  }
}

function drawConnections(pose) {
  // shoulder to wrist
  for (j = 5; j < 9; j++) {
    if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
      partA = pose.keypoints[j];
      partB = pose.keypoints[j + 2];
      line(partA.x, partA.y, partB.x, partB.y);
    }
  }
  // shoulder to shoulder
  partA = pose.keypoints[5];
  partB = pose.keypoints[6];
  if (partA.score > 0.1 && partB.score > 0.1) {
    line(partA.x, partA.y, partB.x, partB.y);
  }
  // hip to hip
  partA = pose.keypoints[11];
  partB = pose.keypoints[12];
  if (partA.score > 0.1 && partB.score > 0.1) {
    line(partA.x, partA.y, partB.x, partB.y);
  }
  // shoulders to hips
  partA = pose.keypoints[5];
  partB = pose.keypoints[11];
  if (partA.score > 0.1 && partB.score > 0.1) {
    line(partA.x, partA.y, partB.x, partB.y);
  }
  partA = pose.keypoints[6];
  partB = pose.keypoints[12];
  if (partA.score > 0.1 && partB.score > 0.1) {
    line(partA.x, partA.y, partB.x, partB.y);
  }
  // hip to foot
  for (j = 11; j < 15; j++) {
    if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
      partA = pose.keypoints[j];
      partB = pose.keypoints[j + 2];
      line(partA.x, partA.y, partB.x, partB.y);
    }
  }
  // Display student ID and name above the head
  if (pose.keypoints[0].score > 0.1) {
    let nose = pose.keypoints[0];
    fill(255);
    textSize(16);
    text(`${studentId} ${studentName}`, nose.x - 50, nose.y - 20); // Adjust the position as needed
  }
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left kneee
  14 right knee
  15 left foot
  16 right foot
*/
