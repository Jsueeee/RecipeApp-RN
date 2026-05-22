# Release checklist

## 1. Production environment

Local production commands use `.env.prod` through `scripts/with-env.js`.

```sh
npm run prod
npm run android:release
npm run ios:release
```

For cloud builds, `eas.json` sets the same public production variables on the `prod` and `production` build profiles. Values prefixed with `EXPO_PUBLIC_` are bundled into the app and must not be treated as private secrets.

## 2. Build

Local store builds do not require EAS.

For Android:

```sh
cd android
node ../scripts/with-env.js ../.env.prod ./gradlew bundleRelease
```

The AAB is written to `android/app/build/outputs/bundle/release/app-release.aab`.

For iOS, open `ios/app.xcworkspace` in Xcode and run Product > Archive with the `app` scheme. The Xcode build phase sources `ios/.xcode.env`, which loads `.env.prod` automatically for Release/Profile builds.

EAS is optional if you prefer cloud build and submit automation.

```sh
npx eas-cli build --platform android --profile prod
npx eas-cli build --platform ios --profile prod
```

Android defaults to an AAB for Play Console. iOS produces an archive suitable for App Store Connect/TestFlight.

## 3. Submit

```sh
npx eas-cli submit --platform android --latest
npx eas-cli submit --platform ios --latest
```

Before the first Android production build, let EAS generate/manage the upload keystore or provide a local `credentials.json`. Do not commit keystores.

## 4. Preflight

```sh
npm run typecheck
npm run doctor
npx expo config --type public
```

Confirm that the public config has `version: 2.0.0`, Android `versionCode`, iOS `buildNumber`, and no duplicate Google Mobile Ads plugin warnings.
