import fs from 'fs'
import path from 'path'
import { PackageJson } from 'type-fest'

export function readPackageJson(name?: string): PackageJson {
  let finalLocation = './package.json'
  let finalInfo: PackageJson = {}

  if (name) {
    finalLocation = path.join('./node_modules', name, 'package.json')
  }

  if (fs.existsSync(finalLocation)) {
    const contents = fs.readFileSync(finalLocation)

    finalInfo = JSON.parse(contents.toString())
  }

  return finalInfo
}
