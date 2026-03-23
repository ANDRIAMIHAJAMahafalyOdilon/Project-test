import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from '../error-message';

describe('ErrorMessage', () => {
  it('affiche le titre et le message', () => {
    render(<ErrorMessage message="Échec du chargement" />);
    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Échec du chargement')).toBeInTheDocument();
  });

  it('affiche un titre personnalisé', () => {
    render(
      <ErrorMessage title="Problème réseau" message="Réessayez plus tard" />
    );
    expect(screen.getByText('Problème réseau')).toBeInTheDocument();
  });

  it('appelle onRetry au clic sur Réessayer', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<ErrorMessage message="Erreur" onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: /réessayer/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('n’affiche pas le bouton sans onRetry', () => {
    render(<ErrorMessage message="Sans retry" />);
    expect(screen.queryByRole('button', { name: /réessayer/i })).not.toBeInTheDocument();
  });
});
