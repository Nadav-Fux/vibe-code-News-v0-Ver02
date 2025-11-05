import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { SearchBar } from "@/components/search/search-bar"
import jest from "jest"

// Mock fetch
global.fetch = jest.fn()

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders search input", () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText(/חיפוש מאמרים/i)).toBeInTheDocument()
  })

  it("opens dialog when clicking search button", () => {
    render(<SearchBar />)
    const button = screen.getByRole("button")
    fireEvent.click(button)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("searches when typing in input", async () => {
    const mockResults = [
      {
        id: "1",
        title: "Test Article",
        slug: "test-article",
        excerpt: "Test excerpt",
        author: { full_name: "Test Author" },
        category: { name: "Test Category" },
      },
    ]
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResults,
    })

    render(<SearchBar />)
    const button = screen.getByRole("button")
    fireEvent.click(button)

    const input = screen.getByPlaceholderText(/חיפוש/i)
    fireEvent.change(input, { target: { value: "test" } })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/search?q=test"))
    })
  })
})
