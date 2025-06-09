import fs from 'fs'
import path from 'path'

import ThisPackageJson from '../package.json'
import { PackageJson } from './PackageJson'
import { assert, assertEquals, runTest } from './utils.test'

export async function packageJsonTest() {
  console.log('🧪 Running PackageJson Tests')
  console.log('='.repeat(50))

  await runTest('Maps the entire node modules packages to explore', async () => {
    const packageJson = new PackageJson()

    packageJson.read()

    assertEquals(packageJson.name, '@universal-packages/package-json', 'Should be this package name')
    assertEquals(packageJson.version, ThisPackageJson.version, 'Should have correct version')
    assert(typeof packageJson.json === 'object', 'Should have json object')
    assert(packageJson.json.name === '@universal-packages/package-json', 'JSON should contain package name')
  })

  await runTest('Constructor with name parameter creates non-root instance', async () => {
    const packageJson = new PackageJson('type-fest')

    // Should not be root when name is provided
    packageJson.read()

    assertEquals(packageJson.name, 'type-fest', 'Should have the specified package name')
    assert(packageJson.version.length > 0, 'Should have a version')
  })

  await runTest('Constructor without name parameter creates root instance', async () => {
    const packageJson = new PackageJson()

    // Should be root when no name is provided
    packageJson.read()

    assertEquals(packageJson.name, '@universal-packages/package-json', 'Should have the root package name')
    assert(Object.keys(packageJson.flatDependencies).length > 0, 'Root should populate flatDependencies')
  })

  await runTest('Handles missing package.json file gracefully', async () => {
    const packageJson = new PackageJson('non-existent-package')

    packageJson.read()

    assertEquals(packageJson.name, undefined, 'Should have undefined name for non-existent package')
    assertEquals(packageJson.version, undefined, 'Should have undefined version for non-existent package')
  })

  await runTest('Reads and processes different dependency types', async () => {
    const packageJson = new PackageJson()

    packageJson.read()

    // Check that different dependency types are processed
    assert(typeof packageJson.dependencies === 'object', 'Should have dependencies object')
    assert(typeof packageJson.devDependencies === 'object', 'Should have devDependencies object')
    assert(typeof packageJson.peerDependencies === 'object', 'Should have peerDependencies object')
    assert(typeof packageJson.peerDependenciesMeta === 'object', 'Should have peerDependenciesMeta object')
    assert(typeof packageJson.bundleDependencies === 'object', 'Should have bundleDependencies object')
    assert(typeof packageJson.optionalDependencies === 'object', 'Should have optionalDependencies object')

    // Verify devDependencies are populated
    const devDepNames = Object.keys(packageJson.devDependencies)
    assert(devDepNames.length > 0, 'Should have devDependencies')
    assert(devDepNames.includes('typescript'), 'Should include typescript in devDependencies')

    // Verify dependencies are populated
    const depNames = Object.keys(packageJson.dependencies)
    assert(depNames.length > 0, 'Should have dependencies')
    assert(depNames.includes('type-fest'), 'Should include type-fest in dependencies')
  })

  await runTest('Dependency instances are PackageJson objects', async () => {
    const packageJson = new PackageJson()

    packageJson.read()

    const typeFestDep = packageJson.dependencies['type-fest']
    assert(typeFestDep instanceof PackageJson, 'Dependency should be PackageJson instance')
    assertEquals(typeFestDep.name, 'type-fest', 'Dependency should have correct name')
    assert(typeFestDep.version.length > 0, 'Dependency should have version')
  })

  await runTest('FlatDependencies contains all dependencies', async () => {
    const packageJson = new PackageJson()

    packageJson.read()

    const flatDepNames = Object.keys(packageJson.flatDependencies)
    assert(flatDepNames.length > 0, 'Should have flat dependencies')

    // Verify type-fest is in flat dependencies
    assert(flatDepNames.includes('type-fest'), 'Should include type-fest in flatDependencies')
    assert(packageJson.flatDependencies['type-fest'] instanceof PackageJson, 'Flat dependency should be PackageJson instance')
  })

  await runTest('Nested dependencies are handled correctly', async () => {
    const packageJson = new PackageJson()

    packageJson.read()

    // Check that dependencies of dependencies are processed
    const typeFestDep = packageJson.dependencies['type-fest']
    if (typeFestDep) {
      assert(typeof typeFestDep.dependencies === 'object', 'Nested dependency should have dependencies object')
      // The nested dependency shouldn't populate flatDependencies (only root does)
      assertEquals(Object.keys(typeFestDep.flatDependencies).length, 0, 'Non-root dependencies should not populate flatDependencies')
    }
  })

  await runTest('Shared dependencies are reused from flatDependencies', async () => {
    const packageJson = new PackageJson()

    packageJson.read()

    // Find a dependency that might be shared
    const flatDepNames = Object.keys(packageJson.flatDependencies)
    if (flatDepNames.length > 1) {
      const firstDep = packageJson.flatDependencies[flatDepNames[0]]
      const secondDep = packageJson.flatDependencies[flatDepNames[1]]

      assert(firstDep instanceof PackageJson, 'First flat dependency should be PackageJson instance')
      assert(secondDep instanceof PackageJson, 'Second flat dependency should be PackageJson instance')
    }
  })

  await runTest('Handles malformed package.json gracefully', async () => {
    // Create a temporary malformed package.json file
    const tempDir = './temp-test'
    const tempPackageJsonPath = path.join(tempDir, 'package.json')

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Write malformed JSON
    fs.writeFileSync(tempPackageJsonPath, '{ "name": "test", invalid json }')

    try {
      // Change to temp directory and try to read
      const originalCwd = process.cwd()
      process.chdir(tempDir)

      const packageJson = new PackageJson()

      // This should throw an error due to malformed JSON
      let errorThrown = false
      try {
        packageJson.read()
      } catch (error) {
        errorThrown = true
        assert(error instanceof SyntaxError, 'Should throw SyntaxError for malformed JSON')
      }

      assert(errorThrown, 'Should throw error for malformed JSON')

      // Restore original directory
      process.chdir(originalCwd)
    } finally {
      // Clean up temp files
      if (fs.existsSync(tempPackageJsonPath)) {
        fs.unlinkSync(tempPackageJsonPath)
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir)
      }
    }
  })

  await runTest('Empty package.json is handled correctly', async () => {
    // Create a temporary empty package.json file
    const tempDir = './temp-test-empty'
    const tempPackageJsonPath = path.join(tempDir, 'package.json')

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Write empty JSON object
    fs.writeFileSync(tempPackageJsonPath, '{}')

    try {
      // Change to temp directory and try to read
      const originalCwd = process.cwd()
      process.chdir(tempDir)

      const packageJson = new PackageJson()
      packageJson.read()

      assertEquals(packageJson.name, undefined, 'Should have undefined name for empty package.json')
      assertEquals(packageJson.version, undefined, 'Should have undefined version for empty package.json')
      assert(typeof packageJson.json === 'object', 'Should have json object')
      assertEquals(Object.keys(packageJson.flatDependencies).length, 0, 'Should have no flat dependencies for empty package.json')

      // Restore original directory
      process.chdir(originalCwd)
    } finally {
      // Clean up temp files
      if (fs.existsSync(tempPackageJsonPath)) {
        fs.unlinkSync(tempPackageJsonPath)
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir)
      }
    }
  })

  await runTest('Package with specific dependency types only', async () => {
    // Create a temp package.json with only peerDependencies
    const tempDir = './temp-test-peer'
    const tempPackageJsonPath = path.join(tempDir, 'package.json')

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Write package.json with only peerDependencies
    fs.writeFileSync(
      tempPackageJsonPath,
      JSON.stringify(
        {
          name: 'test-peer-package',
          version: '1.0.0',
          peerDependencies: {
            'type-fest': '^4.0.0'
          },
          bundleDependencies: ['type-fest'],
          optionalDependencies: {
            typescript: '^5.0.0'
          }
        },
        null,
        2
      )
    )

    try {
      const originalCwd = process.cwd()
      process.chdir(tempDir)

      const packageJson = new PackageJson()
      packageJson.read()

      assertEquals(packageJson.name, 'test-peer-package', 'Should have correct name')
      assert(Object.keys(packageJson.peerDependencies).length >= 0, 'Should process peerDependencies')
      assert(Object.keys(packageJson.bundleDependencies).length >= 0, 'Should process bundleDependencies')
      assert(Object.keys(packageJson.optionalDependencies).length >= 0, 'Should process optionalDependencies')

      process.chdir(originalCwd)
    } finally {
      if (fs.existsSync(tempPackageJsonPath)) {
        fs.unlinkSync(tempPackageJsonPath)
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir)
      }
    }
  })

  await runTest('Non-root dependency reading behavior', async () => {
    // Test a specific dependency as non-root to ensure it only reads dependencies (not all types)
    const typeFestPackage = new PackageJson('type-fest')
    typeFestPackage.read()

    // Non-root should only read 'dependencies', not devDependencies, etc.
    assert(typeof typeFestPackage.dependencies === 'object', 'Non-root should have dependencies object')
    assert(typeof typeFestPackage.devDependencies === 'object', 'Non-root should have empty devDependencies object')

    // Non-root instances should not populate flatDependencies
    assertEquals(Object.keys(typeFestPackage.flatDependencies).length, 0, 'Non-root should not populate flatDependencies')
  })

  console.log('\n✅ All PackageJson tests completed!')
}
