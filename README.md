# Package Json

[![npm version](https://badge.fury.io/js/@universal-packages%2Fpackage-json.svg)](https://www.npmjs.com/package/@universal-packages/package-json)
[![Testing](https://github.com/universal-packages/universal-package-json/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-package-json/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-package-json/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-package-json)

`package.json` utils for reading and mapping package dependencies.

# Getting Started

```shell
npm install @universal-packages/package-json
```

# Usage

## PackageJson <small><small>`class`</small></small>

The `PackageJson` class provides a comprehensive way to read and map `package.json` files and their dependencies recursively.

```ts
import { PackageJson } from '@universal-packages/package-json'

const packageJson = new PackageJson()
packageJson.read()

console.log(packageJson.name)
console.log(packageJson.version)
console.log(packageJson.dependencies)
```

### Constructor <small><small>`constructor`</small></small>

```ts
new PackageJson(name?: string)
```

Creates a new PackageJson instance.

#### Parameters

- **`name`** `String` `optional`
  The name of a specific package to read from `node_modules`. If not provided, reads the root `package.json`.

```ts
// Read root package.json
const rootPackage = new PackageJson()

// Read a specific package from node_modules
const jestPackage = new PackageJson('jest')
```

### Properties

#### **`name`** `String`

Name of the package being mapped.

```ts
const packageJson = new PackageJson()
packageJson.read()

console.log(packageJson.name) // > "my-project"
```

#### **`version`** `String`

Version of the package being mapped.

```ts
console.log(packageJson.version) // > "1.0.0"
```

#### **`json`** `Object`

The complete `package.json` object of the package being mapped.

```ts
console.log(packageJson.json)
// > { name: 'my-project', version: '1.0.0', dependencies: {...}, ... }
```

#### **`flatDependencies`** `Object<PackageJson>`

All unique dependencies read while reading recursively, flattened into a single object.

```ts
console.log(packageJson.flatDependencies)
// > { 'lodash': PackageJson, 'express': PackageJson, ... }
```

#### **`dependencies`** `Object<PackageJson>`

Collection of all dependencies read as PackageJson objects.

```ts
console.log(packageJson.dependencies)
// > { 'lodash': PackageJson, 'express': PackageJson }
```

#### **`devDependencies`** `Object<PackageJson>`

Collection of all devDependencies read as PackageJson objects.

```ts
console.log(packageJson.devDependencies)
// > { 'jest': PackageJson, 'typescript': PackageJson }
```

#### **`peerDependencies`** `Object<PackageJson>`

Collection of all peerDependencies read as PackageJson objects.

```ts
console.log(packageJson.peerDependencies)
// > { 'react': PackageJson }
```

#### **`peerDependenciesMeta`** `Object<PackageJson>`

Collection of all peerDependenciesMeta read as PackageJson objects.

#### **`bundleDependencies`** `Object<PackageJson>`

Collection of all bundleDependencies read as PackageJson objects.

#### **`optionalDependencies`** `Object<PackageJson>`

Collection of all optionalDependencies read as PackageJson objects.

### Instance Methods

#### **`read()`**

```ts
packageJson.read(): void
```

Reads the `package.json` file and all its dependencies recursively, generating a new `PackageJson` object for each dependency. For root packages, it reads all dependency types. For sub-packages, it only reads the `dependencies` field.

```ts
const packageJson = new PackageJson()
packageJson.read()

// Now all properties are populated
console.log(packageJson.name)
console.log(packageJson.dependencies)
console.log(packageJson.flatDependencies)
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
