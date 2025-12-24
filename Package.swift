// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AlternateIcons",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "AlternateIcons",
            targets: ["AlternateIconsPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "AlternateIconsPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/AlternateIconsPlugin"),
        .testTarget(
            name: "AlternateIconsPluginTests",
            dependencies: ["AlternateIconsPlugin"],
            path: "ios/Tests/AlternateIconsPluginTests")
    ]
)