import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('Inversion Labs experience', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('leads with evidence and labels the demonstration data', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Intelligence should answer to you')
    expect(screen.getByRole('heading', { name: /Start with what can be opened/i })).toBeInTheDocument()
    expect(screen.getByText('verified public experiences')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'SynSync Pro' }).length).toBeGreaterThan(0)
    expect(screen.queryByText(/Demonstration data · not live telemetry/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Open the manual explorer' }))
    expect(screen.getByText(/Demonstration data · not live telemetry/i)).toBeInTheDocument()
  })

  it('navigates meaningful depth and opens a governance object', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open the manual explorer' }))
    fireEvent.click(screen.getByRole('button', { name: /4 Governance/ }))
    expect(screen.getByText('Use remains permissioned')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Access rule, Permission/ }))
    expect(screen.getByRole('heading', { name: 'Access rule' })).toBeInTheDocument()
    expect(window.location.search).toContain('node=permission')
  })

  it('opens and exits the guided observation with Escape', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Take the guided tour' }))
    expect(screen.getByRole('dialog', { name: 'Begin at the boundary' })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('applies and restores a governance action within the demo session', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open the manual explorer' }))
    fireEvent.click(screen.getByRole('button', { name: /4 Governance/ }))
    fireEvent.click(screen.getByRole('button', { name: /Access rule, Permission/ }))
    fireEvent.click(screen.getByRole('tab', { name: 'governance' }))
    fireEvent.click(screen.getByRole('button', { name: 'Revoke access' }))
    expect(screen.getByText(/Demo state: revoked/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restore demo object' }))
    expect(screen.getByText(/Demo state: active/i)).toBeInTheDocument()
  })

  it('presents SynSync as an Inversion Labs product with a truthful boundary', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'A public product you can use now.' })).toBeInTheDocument()
    expect(screen.getAllByText('The customer is never the product.').length).toBeGreaterThan(0)
    expect(screen.getByText(/does not imply institutional affiliation/i)).toBeInTheDocument()
    expect(screen.getByText(/supportive, not medical treatment/i)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Open SynSync Pro/ }).some(
      (link) => link.getAttribute('href') === 'https://synsyncpro.netlify.app',
    )).toBe(true)
  })

  it('renders the governed ecosystem and exposes maturity, proof, and limitations', () => {
    render(<App />)

    const atlas = screen.getByRole('region', { name: /Thirteen records/i })
    expect(within(atlas).getByRole('heading', { name: 'CAPT' })).toBeInTheDocument()
    expect(within(atlas).getByRole('heading', { name: 'Inversion Excursion' })).toBeInTheDocument()
    expect(within(atlas).getAllByText('Curated claim').length).toBeGreaterThan(0)

    const captCard = within(atlas).getByRole('heading', { name: 'CAPT' }).closest('article')
    expect(captCard).not.toBeNull()
    fireEvent.click(within(captCard!).getByRole('button', { name: /Inspect record/ }))
    expect(within(atlas).getAllByRole('heading', { name: 'CAPT' })).toHaveLength(2)
    expect(within(atlas).getByText(/specific CAPT repository to be confirmed/i)).toBeInTheDocument()
    expect(within(atlas).getByText(/project-specific public link is not confirmed/i)).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(document.querySelector('#system-detail')).not.toBeInTheDocument()
  })

  it('filters systems without hiding the maturity context', () => {
    render(<App />)

    const atlas = screen.getByRole('region', { name: /Thirteen records/i })
    fireEvent.change(within(atlas).getByLabelText('Category'), { target: { value: 'Product' } })
    expect(within(atlas).getByText('Showing 1 of 1 matches')).toBeInTheDocument()
    expect(within(atlas).getByRole('heading', { name: 'SynSync' })).toBeInTheDocument()
    expect(within(atlas).queryByRole('heading', { name: 'CAPT' })).not.toBeInTheDocument()
  })
})
