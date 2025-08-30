# shadcn-ng

A CLI for adding components to your project.

## Usage

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures `tailwind`, and CSS variables for the project.

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
npx shadcn-ng add button
```

You can also run the command without any arguments to view a list of all available components:

```bash
npx shadcn-ng add
```

## Documentation

Visit https://ui.adrianub.dev/docs/cli to view the documentation.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/adrian-ub/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/adrian-ub/static/sponsors.svg'/>
  </a>
</p>

## License

Licensed under the [MIT license](https://github.com/adrian-ub/shadcn-ng/blob/main/LICENSE.md).
