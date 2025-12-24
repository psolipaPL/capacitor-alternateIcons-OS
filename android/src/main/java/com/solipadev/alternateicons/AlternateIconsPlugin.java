package com.solipadev.alternateicons;

import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "AlternateIcons")
public class AlternateIconsPlugin extends Plugin {

    @PluginMethod
    public void changeIcon(PluginCall call) {
        String targetAlias = call.getString("alias");
        JSArray aliasesArray = call.getArray("aliases");
        String defaultAlias = call.getString("defaultAlias");
        String cloneDefaultAlias = call.getString("cloneDefaultAlias");

        if (targetAlias == null || targetAlias.isEmpty()) {
            call.reject("Parameter 'alias' is required");
            return;
        }
        if (aliasesArray == null || aliasesArray.length() == 0) {
            call.reject("Parameter 'aliases' is required");
            return;
        }
        if (defaultAlias == null || defaultAlias.isEmpty()) {
            call.reject("Parameter 'defaultAlias' is required");
            return;
        }
        if (cloneDefaultAlias == null || cloneDefaultAlias.isEmpty()) {
            call.reject("Parameter 'cloneDefaultAlias' is required");
            return;
        }

        Context context = getContext();
        PackageManager pm = context.getPackageManager();

        try {
            List<String> aliases = toList(aliasesArray);
            String currentAlias = findCurrentAlias(context, pm, aliases);
            if (currentAlias == null) {
                currentAlias = defaultAlias;
            }

            if (targetAlias.equals(currentAlias)) {
                call.resolve();
                return;
            }

            if (currentAlias.equals(defaultAlias)) {
                setAliasState(context, pm, targetAlias, PackageManager.COMPONENT_ENABLED_STATE_ENABLED);
                setAliasState(context, pm, currentAlias, PackageManager.COMPONENT_ENABLED_STATE_DISABLED);
            } else {
                setAliasState(context, pm, currentAlias, PackageManager.COMPONENT_ENABLED_STATE_DEFAULT);
                setAliasState(context, pm, targetAlias, PackageManager.COMPONENT_ENABLED_STATE_ENABLED);
            }

            call.resolve();
        } catch (Exception e) {
            call.reject("Error changing icon", e);
        }
    }

    @PluginMethod
    public void resetIcon(PluginCall call) {
        JSArray aliasesArray = call.getArray("aliases");
        String defaultAlias = call.getString("defaultAlias");
        String cloneDefaultAlias = call.getString("cloneDefaultAlias");

        if (aliasesArray == null || aliasesArray.length() == 0) {
            call.reject("Parameter 'aliases' is required");
            return;
        }
        if (defaultAlias == null || defaultAlias.isEmpty()) {
            call.reject("Parameter 'defaultAlias' is required");
            return;
        }
        if (cloneDefaultAlias == null || cloneDefaultAlias.isEmpty()) {
            call.reject("Parameter 'cloneDefaultAlias' is required");
            return;
        }

        Context context = getContext();
        PackageManager pm = context.getPackageManager();

        try {
            List<String> aliases = toList(aliasesArray);
            String currentAlias = findCurrentAlias(context, pm, aliases);
            if (currentAlias == null) {
                currentAlias = defaultAlias;
            }

            if (!currentAlias.equals(cloneDefaultAlias)) {
                setAliasState(context, pm, currentAlias, PackageManager.COMPONENT_ENABLED_STATE_DEFAULT);
            }
            setAliasState(context, pm, cloneDefaultAlias, PackageManager.COMPONENT_ENABLED_STATE_ENABLED);

            call.resolve();
        } catch (Exception e) {
            call.reject("Error resetting icon", e);
        }
    }

    private List<String> toList(JSArray array) throws JSONException {
        List<String> list = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            list.add(array.getString(i));
        }
        return list;
    }

    private String findCurrentAlias(Context context, PackageManager pm, List<String> aliases) {
        String pkg = context.getPackageName();
        for (String alias : aliases) {
            String fullName = toFullName(pkg, alias);
            ComponentName cn = new ComponentName(pkg, fullName);
            int state = pm.getComponentEnabledSetting(cn);
            if (state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED) {
                return alias;
            }
        }
        return null;
    }

    private void setAliasState(Context context, PackageManager pm, String alias, int state) {
        String pkg = context.getPackageName();
        String fullName = toFullName(pkg, alias);
        ComponentName cn = new ComponentName(pkg, fullName);
        pm.setComponentEnabledSetting(
            cn,
            state,
            PackageManager.DONT_KILL_APP
        );
    }

    private String toFullName(String pkg, String alias) {
        if (alias.startsWith(".")) {
            return pkg + alias;
        } else if (!alias.contains(".")) {
            return pkg + "." + alias;
        } else {
            return alias;
        }
    }
}
