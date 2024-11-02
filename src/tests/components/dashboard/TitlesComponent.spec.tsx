import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { useAuth } from '%/context/AuthContext'
import TitlesComponent from '%/components/dashboard/TitlesComponent'

vi.mock('axios')
vi.mock('%/context/AuthContext')
vi.mock('./CreateTitleForm', () => ({
    CreateTitleForm: ({ onSuccess }: { onSuccess: () => void }) => (
        <div data-testid='create-title-form'>
            <button onClick={onSuccess}>Create Title</button>
        </div>
    ),
}))

const mockTitles = [
    {
        uuid: '1',
        title: 'Test Title 1',
        subject: 'Test Subject 1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
        uuid: '2',
        title: 'Test Title 2',
        subject: 'Test Subject 2',
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
    },
]

describe('TitlesComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(axios.get).mockResolvedValue({ data: mockTitles })
        vi.mocked(useAuth).mockReturnValue({ walletConnect: true } as AuthContextProps)
        vi.spyOn(window, 'confirm').mockImplementation(() => true)
    })

    it('renders titles list correctly', async () => {
        render(<TitlesComponent />)

        await waitFor(() => {
            expect(screen.getByText('title | Test Title 1')).toBeInTheDocument()
            expect(screen.getByText('title | Test Title 2')).toBeInTheDocument()
        })

        expect(screen.getByText('subject | Test Subject 1')).toBeInTheDocument()
        expect(screen.getByText('subject | Test Subject 2')).toBeInTheDocument()

        expect(
            screen.getByText('created | January 1, 2024'),
        ).toBeInTheDocument()
    })

    it('handles title deletion', async () => {
        vi.mocked(axios.delete).mockResolvedValueOnce({})

        render(<TitlesComponent />)
        await waitFor(() => {
            expect(screen.getByText('title | Test Title 1')).toBeInTheDocument()
        })

        const deleteButtons = await screen.findAllByText('Delete title')
        fireEvent.click(deleteButtons[0])

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith('/api/dashboard/1')
        })

        expect(axios.get).toHaveBeenCalledTimes(2)
    })

    it('disables delete button when wallet is not connected', async () => {
        vi.mocked(useAuth).mockReturnValue({ walletConnect: false } as AuthContextProps)

        render(<TitlesComponent />)

        await waitFor(() => {
            const deleteButtons = screen.getAllByText('Delete title')
            deleteButtons.forEach((button) => {
                expect(button).toBeDisabled()
                expect(button).toHaveClass('bg-red-100')
            })
        })
    })

    it('handles modal open/close', async () => {
        render(<TitlesComponent />)
        expect(screen.queryByText('Create New Title')).not.toBeInTheDocument()

        const addButton = screen.getByText('Add title')
        fireEvent.click(addButton)

        expect(screen.getByText('Create New Title')).toBeInTheDocument()

        const closeButton = screen.getByText('✕')
        fireEvent.click(closeButton)

        expect(screen.queryByText('Create New Title')).not.toBeInTheDocument()
    })

    it('disables add button when wallet is not connected', () => {
        vi.mocked(useAuth).mockReturnValue({ walletConnect: false } as AuthContextProps)

        render(<TitlesComponent />)

        const addButton = screen.getByText('Add title')
        expect(addButton).toBeDisabled()
        expect(addButton).toHaveClass('bg-gray-400')
    })

    it('handles failed title deletion', async () => {
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

        vi.mocked(axios.delete).mockRejectedValueOnce(
            new Error('Delete failed'),
        )

        render(<TitlesComponent />)

        await waitFor(() => {
            expect(screen.getByText('title | Test Title 1')).toBeInTheDocument()
        })

        const deleteButtons = await screen.findAllByText('Delete title')
        fireEvent.click(deleteButtons[0])

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Error deleting title')
            expect(consoleSpy).toHaveBeenCalled()
        })

        consoleSpy.mockRestore()
        alertSpy.mockRestore()
    })

    it('handles successful title creation', async () => {
        render(<TitlesComponent />)

        fireEvent.click(screen.getByText('Add title'))

        fireEvent.click(screen.getByText('Create Title'))

        await waitFor(() => {
            expect(
                screen.queryByText('Create New Title'),
            ).not.toBeInTheDocument()
            expect(axios.get).toHaveBeenCalledTimes(2)
        })
    })
})
