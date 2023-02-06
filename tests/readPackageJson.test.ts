import { readPackageJson } from '../src'

describe('package-json', (): void => {
  describe('readPackageJson', (): void => {
    it('Reads the current package json', async (): Promise<void> => {
      const info = readPackageJson()

      expect(info.name).toEqual('@universal-packages/package-json')
    })
  })
})
