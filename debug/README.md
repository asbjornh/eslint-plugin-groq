# Debug

The plugin can be debugged locally with files inside this folder. `eslint-plugin-local` exposes the plugin to `eslint` under the `local`-name, which is enabled in `./.eslintr.json`. `eslint-plugin-local` does this by requiring `../.eslintplugin`.

This is necessary because `eslint` only accepts npm package names when importing plugins.
