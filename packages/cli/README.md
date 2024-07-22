# shadcn-ng

A CLI for adding components to your project.

## Usage

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures `tailwind.config.ts`, and CSS variables for the project.

```bash
npx shadcn-ng init
```

## add

Use the `add` command to add components to your project.

The `add` command adds a component to your project and installs all required dependencies.

```bash
npx shadcn-ng add [component]
```

### Example

```bash
npx shadcn-ng add alert-dialog
```

You can also run the command without any arguments to view a list of all available components:

```bash
npx shadcn-ng add
```

## Documentation

Visit https://ui.adrianub.dev/docs/cli to view the documentation.

## License

Licensed under the [MIT license](https://github.com/adrian-ub/shadcn-ng/blob/main/LICENSE.md).
