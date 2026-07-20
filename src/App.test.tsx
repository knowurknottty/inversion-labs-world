import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('Inversion Labs experience', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('explains the product premise and labels the demonstration data', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your AI remembers')
    expect(screen.getAllByText(/portable, inspectable memory infrastructure/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Demonstration data · not live telemetry/i)).toBeInTheDocument()
  })

  it('gives the inversion lens a concrete two-state behavior', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Platform view' }))
    expect(screen.getByRole('heading', { name: /Context enters/i })).toBeInTheDocument()
    expect(screen.getByText('Opaque lineage')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Inverted view' }))
    expect(screen.getByRole('heading', { name: /Memory remains an object/i })).toBeInTheDocument()
    expect(screen.getByText('Visible lineage')).toBeInTheDocument()
  })

  it('navigates meaningful depth and opens a governance object', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /4 Governance/ }))
    expect(screen.getByText('Use remains permissioned')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Access rule, Permission/ }))
    expect(screen.getByRole('heading', { name: 'Access rule' })).toBeInTheDocument()
    expect(window.location.search).toContain('node=permission')
  })

  it('opens and exits the guided observation with Escape', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Guide me' }))
    expect(screen.getByRole('dialog', { name: 'Begin at the boundary' })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('applies and restores a governance action within the demo session', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /4 Governance/ }))
    fireEvent.click(screen.getByRole('button', { name: /Access rule, Permission/ }))
    fireEvent.click(screen.getByRole('tab', { name: 'governance' }))
    fireEvent.click(screen.getByRole('button', { name: 'Revoke access' }))
    expect(screen.getByText(/Demo state: revoked/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restore demo object' }))
    expect(screen.getByText(/Demo state: active/i)).toBeInTheDocument()
  })
})
