import Foundation
import Capacitor
import UIKit

@objc(AlternateIconsPlugin)
public class AlternateIconsPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "AlternateIconsPlugin"
    public let jsName = "AlternateIcons"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "changeIcon", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resetIcon", returnType: CAPPluginReturnPromise),
    ]

    @objc func changeIcon(_ call: CAPPluginCall) {
        guard UIApplication.shared.supportsAlternateIcons else {
            call.reject("Alternate icons are not supported on this device")
            return
        }

        let aliasRaw = call.getString("alias") ?? ""
        let alias = aliasRaw.trimmingCharacters(in: .whitespacesAndNewlines)

        if alias.isEmpty {
            call.reject("Missing 'alias' parameter")
            return
        }

        guard let iconName = normalizeIconName(alias) else {
            call.reject("Invalid icon alias")
            return
        }

        setIcon(name: iconName, call: call)
    }

    @objc func resetIcon(_ call: CAPPluginCall) {
        guard UIApplication.shared.supportsAlternateIcons else {
            call.reject("Alternate icons are not supported on this device")
            return
        }

        setIcon(name: nil, call: call)
    }

    private func setIcon(name: String?, call: CAPPluginCall) {
        DispatchQueue.main.async {
            UIApplication.shared.setAlternateIconName(name) { error in
                if let error = error as NSError? {
                    let message = "Error changing icon (\(error.domain) \(error.code)): \(error.localizedDescription)"
                    call.reject(message)
                } else {
                    call.resolve()
                }
            }
        }
    }

    private func normalizeIconName(_ alias: String) -> String? {
        let trimmed = alias.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return nil }

        if trimmed.hasPrefix(".") {
            let idx = trimmed.index(after: trimmed.startIndex)
            if idx < trimmed.endIndex {
                return String(trimmed[idx...]) 
            } else {
                return nil
            }
        }

        return trimmed
    }
}
