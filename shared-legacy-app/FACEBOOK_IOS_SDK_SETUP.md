# Facebook iOS SDK setup

This guide describes how a companion iOS client can connect to the BookCatalog
API and add Meta (Facebook) authentication or sharing. The legacy ASP.NET
application does not include an iOS client, so these steps are integration
guidance rather than application changes.

## Prerequisites

- Xcode and an iOS app target
- A Meta for Developers app with the iOS platform enabled
- The app's bundle identifier and a development device or simulator
- A BookCatalog API instance reachable from the iOS app

## Add the SDK with Swift Package Manager

1. In Xcode, select **File > Add Package Dependencies**.
2. Enter `https://github.com/facebook/facebook-ios-sdk.git`.
3. Select the products required by the client, such as `FacebookCore`,
   `FacebookLogin`, or `FacebookShare`.
4. Add the package to the app target and wait for Xcode to resolve
   dependencies.

Prefer a specific released package version for reproducible builds. Review the
SDK changelog before upgrading because the project is actively modernizing
Swift interfaces.

## Configure the Meta app

In the Meta for Developers dashboard:

1. Create or select the app used by the iOS client.
2. Add the **iOS** platform.
3. Enter the exact bundle identifier from Xcode.
4. Copy the App ID and configure the iOS client with that value.
5. Add the bundle identifier and URL scheme to the app's URL scheme settings.

Do not commit access tokens, client secrets, or other credentials. Keep
environment-specific values in an untracked local configuration or a protected
CI secret store.

## Configure `Info.plist`

Add the App ID and display name to the app target's `Info.plist`:

```xml
<key>FacebookAppID</key>
<string>YOUR_META_APP_ID</string>
<key>FacebookClientToken</key>
<string>YOUR_CLIENT_TOKEN</string>
<key>FacebookDisplayName</key>
<string>BookCatalog</string>
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>fbapi</string>
    <string>fb-messenger-share-api</string>
    <string>fbauth2</string>
    <string>fbshareextension</string>
</array>
```

Replace placeholders with values from the Meta developer dashboard. Add the
`fbYOUR_META_APP_ID` URL scheme under **URL Types** in the target settings (or
as `CFBundleURLSchemes` in `Info.plist`) when using Facebook Login or sharing.

## Initialize the SDK

Initialize the SDK during application startup using the current API documented
for the SDK version selected by the project. For a UIKit app, this is commonly
done in the application delegate:

```swift
import FBSDKCoreKit

func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [
        UIApplication.LaunchOptionsKey: Any
    ]?
) -> Bool {
    ApplicationDelegate.shared.application(
        application,
        didFinishLaunchingWithOptions: launchOptions
    )
    return true
}
```

If the app uses SwiftUI, initialize the SDK from the app lifecycle while
preserving the same one-time startup behavior. Follow the SDK's current
getting-started documentation if the API changes between releases.

## Connect to BookCatalog

Keep the Facebook integration separate from the BookCatalog API client:

- Use the SDK only for Meta authentication, sharing, or app events.
- Send the resulting identity or access-token data to a server endpoint only
  when the server contract explicitly supports it.
- Use HTTPS for all non-local API traffic.
- Never treat a client-provided Facebook user ID as proof of identity without
  validating the token server-side.

For local development, expose the API through a device-reachable HTTPS
endpoint or configure the simulator to use the development host. Do not embed
production URLs in debug builds.

## Privacy and App Store requirements

Before shipping:

- Review the data collected by the selected SDK products.
- Complete the App Store Connect privacy disclosures accurately.
- Update the app privacy policy and obtain any consent required by the
  jurisdictions where the app is distributed.
- Test login, logout, cancellation, denied permissions, and interrupted
  network requests.

## References

- [Meta iOS SDK documentation](https://developers.facebook.com/docs/ios)
- [Facebook iOS SDK repository](https://github.com/facebook/facebook-ios-sdk)
- [Apple App privacy details](https://developer.apple.com/app-store/app-privacy-details/)
