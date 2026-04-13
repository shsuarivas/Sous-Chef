import { useState } from 'react';
import styles from './SettingsPage.module.scss';

const API_URL = import.meta.env.VITE_API_URL;

function getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

function saveUser(updated) {
    localStorage.setItem('user', JSON.stringify(updated));
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

// Inline editable field for username / email
function EditableField({ label, fieldKey, value, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [input, setInput] = useState(value);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/user/${fieldKey}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ [fieldKey]: input })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Update failed.');
                return;
            }
            saveUser(data.user);
            onSaved(data.user);
            setEditing(false);
        } catch {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        setInput(value);
        setError('');
        setEditing(false);
    }

    return (
        <div className={styles.fields_entry}>
            <div className={styles.field_left}>
                <div className={styles.field_title}>{label}</div>
                {editing ? (
                    <input
                        className={styles.edit_input}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <div className={styles.field_value}>{value}</div>
                )}
                {error && <div className={styles.field_error}>{error}</div>}
            </div>
            <div className={styles.field_right}>
                {editing ? (
                    <div className={styles.action_buttons}>
                        <button className={styles.edit_button} onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button className={styles.cancel_button} onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button className={styles.edit_button} onClick={() => setEditing(true)}>
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}

// Password reset section
function PasswordField() {
    const [open, setOpen] = useState(false);
    const [fields, setFields] = useState({ current_password: '', new_password: '', confirm: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFields({ ...fields, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        setError('');
        setSuccess('');

        if (fields.new_password !== fields.confirm) {
            setError('New passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/user/password`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({
                    current_password: fields.current_password,
                    new_password: fields.new_password
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Update failed.');
                return;
            }
            setSuccess('Password updated.');
            setFields({ current_password: '', new_password: '', confirm: '' });
            setOpen(false);
        } catch {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        setFields({ current_password: '', new_password: '', confirm: '' });
        setError('');
        setOpen(false);
    }

    return (
        <div className={styles.fields_entry}>
            <div className={styles.field_left}>
                <div className={styles.field_title}>Password</div>
                {open ? (
                    <div className={styles.password_fields}>
                        <input
                            className={styles.edit_input}
                            type="password"
                            name="current_password"
                            placeholder="Current password"
                            value={fields.current_password}
                            onChange={handleChange}
                            autoFocus
                        />
                        <input
                            className={styles.edit_input}
                            type="password"
                            name="new_password"
                            placeholder="New password (min. 8 characters)"
                            value={fields.new_password}
                            onChange={handleChange}
                        />
                        <input
                            className={styles.edit_input}
                            type="password"
                            name="confirm"
                            placeholder="Confirm new password"
                            value={fields.confirm}
                            onChange={handleChange}
                        />
                        {error && <div className={styles.field_error}>{error}</div>}
                    </div>
                ) : (
                    <div className={styles.field_value}>
                        ••••••••
                        {success && <span className={styles.field_success}> — {success}</span>}
                    </div>
                )}
            </div>
            <div className={styles.field_right}>
                {open ? (
                    <div className={styles.action_buttons}>
                        <button className={styles.edit_button} onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button className={styles.cancel_button} onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button className={styles.edit_button} onClick={() => setOpen(true)}>
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [user, setUser] = useState(getUser());

    return (
        <div className={styles.outer_div}>
            <div className={styles.inner_div}>
                <div className={styles.title}>Edit Profile</div>

                <div className={styles.pfp_line_div}>
                    <div className={styles.pfp_box}></div>
                    <button className={styles.edit_button}>Change Photo</button>
                </div>

                <div className={styles.fields_div}>
                    <EditableField
                        label="Username"
                        fieldKey="username"
                        value={user.username}
                        onSaved={setUser}
                    />
                    <EditableField
                        label="Email"
                        fieldKey="email"
                        value={user.email}
                        onSaved={setUser}
                    />
                    <PasswordField />
                </div>
            </div>
        </div>
    );
};
