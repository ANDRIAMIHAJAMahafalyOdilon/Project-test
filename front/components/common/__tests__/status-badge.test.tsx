import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../status-badge';

describe('StatusBadge', () => {
  it.each([
    ['pending', 'En attente'],
    ['approved', 'Approuvé'],
    ['rejected', 'Rejeté'],
    ['draft', 'Brouillon'],
    ['sent', 'Envoyé'],
    ['delivered', 'Livré'],
    ['completed', 'Terminé'],
    ['declined', 'Refusé'],
  ] as const)('affiche le libellé pour le statut %s', (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('applique className supplémentaire', () => {
    const { container } = render(
      <StatusBadge status="pending" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
