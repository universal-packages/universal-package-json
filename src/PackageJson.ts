import fs from 'fs'
import path from 'path'
import { PackageJson as PJType } from 'type-fest'

import { DependencyType } from './PackageJson.types'

export class PackageJson {
  public name: string = ''
  public version: string = ''

  public json: PJType = {}

  public flatDependencies: Record<string, PackageJson> = {}

  public dependencies: Record<string, PackageJson> = {}
  public devDependencies: Record<string, PackageJson> = {}
  public peerDependencies: Record<string, PackageJson> = {}
  public peerDependenciesMeta: Record<string, PackageJson> = {}
  public bundleDependencies: Record<string, PackageJson> = {}
  public optionalDependencies: Record<string, PackageJson> = {}

  private fixedName?: string
  private isRoot = true

  public constructor(name?: string) {
    this.fixedName = name

    if (name) this.isRoot = false
  }

  public read(): void {
    let finalLocation = './package.json'
    let finalInfo: PJType = {}

    if (this.fixedName) {
      finalLocation = path.join('./node_modules', this.fixedName, 'package.json')
    }

    if (fs.existsSync(finalLocation)) {
      const contents = fs.readFileSync(finalLocation)

      finalInfo = JSON.parse(contents.toString())
    }

    this.name = finalInfo.name!
    this.version = finalInfo.version!
    this.json = finalInfo

    if (this.isRoot) {
      this.readDependencies(this.flatDependencies)
    }
  }

  private readDependencies(packages: Record<string, PackageJson>) {
    if (this.isRoot) {
      const dependencyTypes: DependencyType[] = ['dependencies', 'devDependencies', 'peerDependencies', 'peerDependenciesMeta', 'bundleDependencies', 'optionalDependencies']

      for (let i = 0; i < dependencyTypes.length; i++) {
        const currentDependencyType = dependencyTypes[i]

        this.readDependencyBlock(currentDependencyType, packages)
      }
    } else {
      this.readDependencyBlock('dependencies', packages)
    }
  }

  private readDependencyBlock(dependencyType: DependencyType, packages: Record<string, PackageJson>) {
    if (this.json[dependencyType]) {
      const dependencyNames = Object.keys(this.json[dependencyType])

      for (let i = 0; i < dependencyNames.length; i++) {
        const currentDependencyName = dependencyNames[i]

        if (packages[currentDependencyName]) {
          this[dependencyType][currentDependencyName] = packages[currentDependencyName]
        } else {
          const dependency = new PackageJson(currentDependencyName)

          packages[currentDependencyName] = dependency
          this[dependencyType][currentDependencyName] = dependency
          this[dependencyType][currentDependencyName].read()
          this[dependencyType][currentDependencyName].readDependencies(packages)
        }
      }
    }
  }
}
