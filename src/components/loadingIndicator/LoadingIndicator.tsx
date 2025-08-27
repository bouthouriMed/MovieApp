import "./LoadingIndicator.scss";

export default function Loading() {
  return (
    <div className="loading-indicator" data-testid="loading">
      <div className="spinner"></div>
    </div>
  );
}
