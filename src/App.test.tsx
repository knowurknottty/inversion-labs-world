import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('Inversion Labs experience', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    localStorage.clear()
  })

  it('leads with the local-first thesis and a live instrument CTA', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Every context window you feed an AI is stored/i,
    )
    expect(
      screen.getAllByRole('link', { name: /Open SynSync Pro/i }).some(
        (link) => link.getAttribute('href') === 'https://synsyncpro.netlify.app',
      ),
    ).toBe(true)
    expect(screen.getAllByText(/the customer is never the product/i).length).toBeGreaterThan(0)
  })

  it('renders the memory ownership inversion with a working toggle', () => {
    render(<App />)

    const section = screen.getByRole('region', { name: /What changes when you own the memory object/i })
    expect(within(section).getByRole('heading', { name: /What changes when you own the memory object/i })).toBeInTheDocument()

    const youOwn = within(section).getByRole('button', { name: /You own it/i })
    fireEvent.click(youOwn)
    expect(within(section).getByRole('img', { name: /MEM\/0137 has moved outside the application boundary/i })).toBeInTheDocument()
  })

  it('renders the governed ecosystem with all 13 systems and opens a detail drawer', () => {
    render(<App />)

    const atlas = screen.getByRole('region', { name: /13 governed systems/i })
    expect(within(atlas).getByRole('heading', { name: /13 governed systems/i })).toBeInTheDocument()

    const synsyncCard = within(atlas).getByRole('button', { name: /SynSync/i })
    fireEvent.click(synsyncCard)
    expect(screen.getByRole('dialog', { name: /SynSync/i })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('filters the ecosystem by maturity stage', () => {
    render(<App />)

    const atlas = screen.getByRole('region', { name: /13 governed systems/i })
    fireEvent.click(within(atlas).getByRole('button', { name: 'Live' }))
    expect(within(atlas).getByRole('button', { name: /SynSync/i })).toBeInTheDocument()
  })

  it('presents operating principles with architecture consequences', () => {
    render(<App />)

    const principles = screen.getByRole('region', { name: /How decisions get made/i })
    expect(within(principles).getByText(/Evidence before aesthetics/i)).toBeInTheDocument()
    expect(within(principles).getByText(/Local execution by default/i)).toBeInTheDocument()
  })

  it('offers ranked next steps ending with a build stamp', () => {
    render(<App />)

    const cta = screen.getByRole('region', { name: /Where to go from here/i })
    expect(within(cta).getByRole('link', { name: /Open SynSync Pro/i })).toBeInTheDocument()
    expect(within(cta).getByRole('link', { name: /Inspect registry\.json/i })).toBeInTheDocument()
    expect(within(cta).getByText(/Last built:/i)).toBeInTheDocument()
  })
})
