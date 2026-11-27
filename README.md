# NekoUI

NekoUI is the React component library behind the admin screens of the [Meow Apps](https://meowapps.com) WordPress plugins. It is compiled into each plugin's `app/vendor.js` bundle, and this repository holds its readable source.

## Building a plugin with it

The plugins expect NekoUI in a folder named `neko-ui`, next to the plugin's own folder:

```
plugins/
  neko-ui/          (this repository)
  social-engine/    (or any other Meow Apps plugin)
```

Then install the dependencies in both folders and build the plugin:

```
cd neko-ui && pnpm install
cd ../social-engine && pnpm install && pnpm build
```

## License

GPL-2.0-or-later, like the plugins it ships with. See [LICENSE](LICENSE).

"Meow Apps" and the names and logos of its plugins are not covered by this license: please don't use them for your own products.
