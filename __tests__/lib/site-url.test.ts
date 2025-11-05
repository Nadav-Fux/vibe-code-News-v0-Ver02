import { getSiteUrl } from "@/lib/utils/site-url"
import jest from "jest" // Declaring the jest variable

describe("getSiteUrl", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it("returns VERCEL_URL when available", () => {
    process.env.VERCEL_URL = "example.vercel.app"
    expect(getSiteUrl()).toBe("https://example.vercel.app")
  })

  it("returns localhost in development", () => {
    delete process.env.VERCEL_URL
    expect(getSiteUrl()).toBe("http://localhost:3000")
  })
})
