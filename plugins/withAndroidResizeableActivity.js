const { withAndroidManifest } = require('expo/config-plugins');

// Play Store large-screen policy (Android 16): flags apps whose main activity
// isn't resizeable. Expo has no app.json field for this, so patch the
// generated AndroidManifest.xml directly (see Issue #278).
const withAndroidResizeableActivity = (config) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application?.[0];
    const mainActivity = mainApplication?.activity?.find(
      (activity) => activity.$['android:name'] === '.MainActivity'
    );

    if (mainActivity) {
      mainActivity.$['android:resizeableActivity'] = 'true';
    }

    return config;
  });
};

module.exports = withAndroidResizeableActivity;
