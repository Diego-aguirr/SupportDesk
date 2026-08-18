export function UsageInstructions() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Usage Instructions</h3>

      <div className="space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        {/* Login */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text)]">Login</h4>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Click the <strong>Admin</strong> or <strong>Agent</strong> chip to autofill credentials, then
            click <strong>Sign in</strong>. You can also type the email and password manually.
          </p>
        </div>

        {/* Tickets */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text)]">Tickets</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-[var(--color-muted)]">
            <li><strong>Filter</strong> by status or priority using the toggle buttons.</li>
            <li><strong>Search</strong> by typing in the search bar — results update as you type.</li>
            <li><strong>Sort</strong> by clicking any column header (click again to reverse).</li>
            <li><strong>Open</strong> a ticket by clicking any row to see full details.</li>
          </ul>
        </div>

        {/* Ticket Detail */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text)]">Ticket Detail</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-[var(--color-muted)]">
            <li><strong>Change status/priority</strong> by clicking the dropdown in the ticket info section.</li>
            <li><strong>Add a comment</strong> by typing in the comment box and clicking <strong>Post comment</strong>.</li>
            <li><strong>View history</strong> in the Activity Log panel on the right side.</li>
          </ul>
        </div>

        {/* Dashboard */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text)]">Dashboard</h4>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            View ticket statistics: total open, resolved, and average resolution time.
            Charts show distribution by status, priority, and trend over time.
          </p>
        </div>

        {/* Settings */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text)]">Settings</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-[var(--color-muted)]">
            <li><strong>Theme</strong> — Switch between Light, Dark, or System (follows your OS preference).</li>
            <li><strong>Keyboard Shortcuts</strong> — Toggle shortcuts on/off. Click <strong>Reset to defaults</strong> to restore.</li>
          </ul>
        </div>

        {/* Logout */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text)]">Logout</h4>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Click the <strong>Log out</strong> button in the top-right corner of any page to end your session.
          </p>
        </div>
      </div>
    </div>
  );
}
