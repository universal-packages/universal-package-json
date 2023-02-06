import { PackageJson } from '../src'

describe('package-json', (): void => {
  describe('PackageJson', (): void => {
    it('Maps the entire node modules packages to explore', async (): Promise<void> => {
      const packageJson = new PackageJson()

      packageJson.read()

      expect(packageJson.name).toEqual('@universal-packages/package-json')
    })
  })
})
