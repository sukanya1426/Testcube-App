# 🧪 TestCube – AI-Powered Automated App Testing

**TestCube** is a smart testing tool that simplifies mobile app testing by automating test case generation using AI. It allows users to upload APK files, explore app UI structure, assign inputs intelligently, and generate detailed test reports – all from a user-friendly dashboard.

---

## 🚀 Features

- 🔍 **APK Inspection**: Unpacks APKs to extract package info, activities, and intents
- 🌐 **UI Tree Generation**: Builds a tree of reachable UI pages from the app
- 🤖 **AI-Based Input Assignment**: Detects input fields and generates valid/invalid test cases
- 📝 **Test Report Generation**: Produces detailed test reports for each app version
- 📊 **Version Tracking**: Compares different versions of the same app for regression analysis
- 🔐 **Authentication System**: Secure login to manage user apps and reports
- 🖥️ **Dashboard View**: Upload, monitor, and manage multiple APKs easily


---


## 🧰 Getting Started

### 🔧 Prerequisites

- Node.js & npm
- Python 3.10+
- MongoDB
- Java (JDK 11+ recommended)  
- Android SDK + ADB  
- [DroidBot](https://github.com/honeynet/droidbot)  
- Gemini API Key (for AI input assignment) 

### 📦 Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/testcube.git
cd testcube
```
## How to use

1. Make sure you have:

    + `.apk` file path of the app you want to analyze.
    + A device or an emulator connected to your host machine via `adb`.

2. Start DroidBot:

    ```
    droidbot -a <path_to_apk> -o output_dir
    ```
    That's it! You will find much useful information, including the UTG, generated in the output dir.

    + If you are using multiple devices, you may need to use `-d <device_serial>` to specify the target device. The easiest way to determine a device's serial number is calling `adb devices`.
    + On some devices, you may need to manually turn on accessibility service for DroidBot (required by DroidBot to get current view hierarchy).
    + If you want to test a large scale of apps, you may want to add `-keep_env` option to avoid re-installing the test environment every time.
    + You can also use a json-format script to customize input for certain states. Here are some [script samples](script_samples/). Simply use `-script <path_to_script.json>` to use DroidBot with a script.
    + If your apps do not support getting views through Accessibility (e.g., most games based on Cocos2d, Unity3d), you may find `-cv` option helpful.
    + You can use `-humanoid` option to let DroidBot communicate with [Humanoid](https://github.com/yzygitzh/Humanoid) in order to generate human-like test inputs.
    + You may find other useful features in `droidbot -h`.
  

3. Run Backend:

Create a .env file in the backend directory with necessary environment variables like:
 ```
 MONGO_URI=mongodb://localhost:27017/testcube
 GEMINI_API_KEY=your-api-key-here
 ```
 Then, install dependencies and start the backend server:

  ```
  npm install
  npm run start
  ```

4. To Setup Server Socket:

  ```
  cd ../socket-server
  cp .env.example .env  # or manually create the .env file
  npm install
  npm run start
 ```

5. To setup Frontend
```
cd ../frontend
cp .env.example .env  # include API endpoints and keys
npm install
npm run dev
```


   
