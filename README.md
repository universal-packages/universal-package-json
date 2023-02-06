# Package Json

[![npm version](https://badge.fury.io/js/@universal-packages%2Fpackage-json.svg)](https://www.npmjs.com/package/@universal-packages/package-json)
[![Testing](https://github.com/universal-packages/universal-package-json/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-package-json/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-package-json/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-package-json)

`package.json` utils.

## Install

```shell
npm install @universal-packages/package-json
```

## Global methods

#### **`readPackageJson([name: string])`**

Reads the `package.json` file as a JSON of the current working directory or if a package name is passed and its installed under `node_modules` the `package.json` is read from that package.

```js
import { readPackageJson } from '@universal-packages/package-json'

const json = readPackageJson('jest')

console.log(json)

// > { name: 'jest', ...}
```

## PackageJson

`PackageJson` for a more in deep mapping of the `package.json` file.

```js
import { PackageJson } from '@universal-packages/package-json'

const packageJson = new PackageJson()

packageJson.read()
```

### Instance methods

#### **`read()`**

Reads the root `package.json` file and all its dependencies recursively generating a new `PackageJson` object for ech dependency.

### Properties

#### **`name:string`**

Name of the package being mapped.

#### **`version:string`**

Version of the package being mapped.

#### **`json: Object`**

The `package.json` object of the package being mapped.

#### **`flatDependencies: Object<PackageJson>`**

All the uniq dependencies read while reading recursively.

#### **`dependencies: Object<PackageJson>`**

Collection of all dependencies read as PackageJson objects.

#### **`devDependencies: Object<PackageJson>`**

Collection of all devDependencies read as PackageJson objects.

#### **`peerDependencies: Object<PackageJson>`**

Collection of all peerDependencies read as PackageJson objects.

#### **`peerDependenciesMeta: Object<PackageJson>`**

Collection of all peerDependenciesMeta read as PackageJson objects.

#### **`bundleDependencies: Object<PackageJson>`**

Collection of all bundleDependencies read as PackageJson objects.

#### **`optionalDependencies: Object<PackageJson>`**

Collection of all optionalDependencies read as PackageJson objects.

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
